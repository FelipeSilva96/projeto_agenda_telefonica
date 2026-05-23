import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ContactService } from '../contact-service'; 
import { Contact } from '../contact'; 

@Component({
  selector: 'app-contact-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contact-dashboard.html',
  styleUrls: ['./contact-dashboard.css'],
})
export class ContactDashboardComponent implements OnInit, OnDestroy {
  searchQuery: string = '';
  activeTab: 'todos' | 'favoritos' = 'todos';
  contacts: Contact[] = [];
  selectedContact: Contact | null = null;
  showModal: boolean = false;
  editingContact: Contact | null = null;
  qrCode: string = 'https://wa.me/55';
  formData = {
    name: '',
    phone: '',
    company: ''
  };
  private subscription!: Subscription;

  constructor(private readonly contactService: ContactService) {}

  ngOnInit(): void {
    // Se inscreve para receber atualizações do service
    this.subscription = this.contactService.getContacts().subscribe(data => {
      this.contacts = data;
    });
  }

  // Lógica reativa para filtrar a lista na tela
  get filteredContacts(): Contact[] {
    return this.contacts.filter(contact => {
      const matchesTab = this.activeTab === 'todos' || contact.isFavorite;
      const matchesSearch = 
        contact.name.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        contact.company.toLowerCase().includes(this.searchQuery.toLowerCase()) ||
        contact.phone.includes(this.searchQuery);
        
      return matchesTab && matchesSearch;
    });
  }

  // Contadores dinâmicos usados na seção de resumo
  get totalCount(): number {
    return this.contacts.length;
  }

  get favoritesCount(): number {
    return this.contacts.filter(c => !!c.isFavorite).length;
  }

  // Contatos com telefone válido (assume que qualquer sequência de dígitos conta)
  get whatsappCount(): number {
    return this.contacts.filter(c => this.formatWhatsApp(c.phone).length > 0).length;
  }

  // Número de contatos que possuem campo 'company' preenchido
  get empresasCount(): number {
    return this.contacts.filter(c => !!c.company && c.company.trim().length > 0).length;
  }

  onToggleFavorite(contact: Contact): void {
    this.contactService.toggleFavorite(contact.id);
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  // Formata número para o esquema wa.me (apenas dígitos)
  formatWhatsApp(phone: string): string {
    return phone.replace(/\D/g, '');
  }

  // Retorna URL completa para abrir o WhatsApp
  getWhatsAppUrl(contact: Contact | null): string {
    if (!contact) return 'https://wa.me';
    return `https://wa.me/55${this.formatWhatsApp(contact.phone)}`;
  }

  // Abre o link wa.me em nova aba
  openWhatsApp(contact: Contact): void {
    const url = this.getWhatsAppUrl(contact);
    globalThis.open(url, '_blank');
  }

  // Gera URL de imagem QR pública para o link wa.me
  getQrImageUrl(contact: Contact | null): string {
    if (!contact) return '';
    const url = encodeURIComponent(this.getWhatsAppUrl(contact));
    return `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${url}`;
  }

  // Abre prompts simples para editar o contato e salva via ContactService
  // Open modal to edit contact
  editContact(contact: Contact): void {
    this.editingContact = contact;
    this.formData = {
      name: contact.name || '',
      phone: contact.phone || '',
      company: contact.company || ''
    };
    this.showModal = true;
  }

  openNewContact(): void {
    console.log('openNewContact called');
    this.editingContact = null;
    this.formData = { name: '', phone: '', company: '' };
    this.showModal = true;
  }

  saveFromModal(): void {
    const name = this.formData.name.trim();
    const phone = this.formData.phone.trim();
    const company = this.formData.company.trim();

    if (!name || !phone) {
      globalThis.alert('Preencha os campos obrigatórios: Name e Phone.');
      return;
    }

    const digits = this.formatWhatsApp(phone).length;
    if (!(digits === 10 || digits === 11)) {
      globalThis.alert('Phone inválido. Informe DDD + número (10 ou 11 dígitos).');
      return;
    }

    if (this.editingContact) {
      const updated: Contact = {
        ...this.editingContact,
        name,
        phone,
        company,
        initials: this.computeInitials(name)
      };
      this.contactService.updateContact(updated);
      if (this.selectedContact?.id === updated.id) this.selectedContact = updated;
    } else {
      this.contactService.addContact({ name, company, phone, isFavorite: false } as any);
    }

    this.closeModal();
  }

  closeModal(): void {
    this.showModal = false;
    this.editingContact = null;
    this.formData = { name: '', phone: '', company: '' };
  }


  // Exclui o contato após confirmação
  deleteContact(contact: Contact): void {
    const ok = globalThis.confirm(`Excluir contato ${contact.name}?`);
    if (!ok) return;
    this.contactService.deleteContact(contact.id);
    if (this.selectedContact?.id === contact.id) this.selectedContact = null;
  }

  // Helper para recalcular iniciais (mesmo do service)
  private computeInitials(name: string): string {
    return name.split(/\s+/).filter(Boolean).map(n => n[0]).join('').toUpperCase().slice(0,2);
  }
}