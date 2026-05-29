import {
  Component,
  OnInit,
  Renderer2,
  signal,
  effect,
  OnDestroy,
  NgZone,
  ChangeDetectorRef,
  HostBinding,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { ContactService } from '../contact-service';
import { Contact } from '../contact';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-contact-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule, MatButtonModule, MatTooltipModule, MatIconModule],
  templateUrl: './contact-dashboard.html',
  styleUrls: ['./contact-dashboard.css'],
})
export class ContactDashboardComponent implements OnInit, OnDestroy {
  searchQuery: string = '';
  activeTab: 'todos' | 'favoritos' = 'todos';
  mode = signal('light');
  @HostBinding('class.dark-theme') get isDark() {
    return this.mode() === 'dark';
  }
  static storageKey = 'docs-theme-storage-current-name';
  contacts: Contact[] = [];
  selectedContact: Contact | null = null;

  showModal: boolean = false;
  editingContact: Contact | null = null;

  qrCode: string = 'https://wa.me/55';

  formData = {
    name: '',
    phone: '',
    company: '',
  };

  private subscription: Subscription = new Subscription();

  constructor(
    private readonly contactService: ContactService,
    private cdr: ChangeDetectorRef,
    private zone: NgZone,
    private route: ActivatedRoute,
    private router: Router,
    private renderer: Renderer2,
  ) {
    effect(() => {
      if (this.mode() == 'dark') {
        this.renderer.setStyle(document.documentElement, 'color-scheme', 'dark');
        try {
          document.documentElement.setAttribute('data-theme', 'dark');
        } catch {}
      } else {
        this.renderer.setStyle(document.documentElement, 'color-scheme', 'light');
        try {
          document.documentElement.removeAttribute('data-theme');
        } catch {}
      }
    });
  }

  ngOnInit(): void {
    const subRoute = this.route.paramMap.subscribe((params) => {
      const filtro = params.get('filtro');

      if (filtro === 'favoritos') {
        this.activeTab = 'favoritos';
      } else {
        this.activeTab = 'todos';
      }
      const currentTheme =
        this.getStoredThemeName() ??
        (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
      if (currentTheme) {
        this.mode.set(currentTheme);
      }
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
        const newColorScheme = event.matches ? 'dark' : 'light';
        if (event.matches) {
          this.mode.set('dark');
        } else {
          this.mode.set('light');
        }
      });

      this.loadContacts();
    });

    this.subscription.add(subRoute);
  }
  changeMode() {
    if (this.mode() == 'dark') this.mode.set('light');
    else this.mode.set('dark');
    this.storeTheme(this.mode());
  }

  storeTheme(theme: string) {
    try {
      window.localStorage[ContactDashboardComponent.storageKey] = theme;
    } catch {}
  }

  getStoredThemeName(): string | null {
    try {
      return window.localStorage[ContactDashboardComponent.storageKey] || null;
    } catch {
      return null;
    }
  }

  clearStorage() {
    try {
      window.localStorage.removeItem(ContactDashboardComponent.storageKey);
    } catch {}
  }

  private loadContacts(): void {
    const sub = this.contactService.getContacts().subscribe({
      next: (data: any[]) => {
        this.contacts = data.map((c) => ({
          ...c,
          isFavorite: c.isFavorite === true || c.IsFavorite === true,
        }));
        this.cdr.detectChanges();
      },
      error: (error) => {
        console.error('Erro ao carregar contatos:', error);
        globalThis.alert('Erro ao carregar contatos.');
      },
    });

    this.subscription.add(sub);
  }

  get filteredContacts(): Contact[] {
    return this.contacts
      .filter((contact) => {
        const matchesTab = this.activeTab === 'todos' || contact.isFavorite;
        const search = this.searchQuery.toLowerCase();

        const matchesSearch =
          (contact.name?.toLowerCase() || '').includes(search) ||
          (contact.company?.toLowerCase() || '').includes(search) ||
          (contact.phone || '').includes(this.searchQuery);

        return matchesTab && matchesSearch;
      })
      .sort((a, b) => {
        const nameA = a.name || '';
        const nameB = b.name || '';
        return nameA.localeCompare(nameB);
      });
  }

  get totalCount(): number {
    return this.contacts.length;
  }

  get favoritesCount(): number {
    return this.contacts.filter((c) => !!c.isFavorite).length;
  }

  get whatsappCount(): number {
    return this.contacts.filter((c) => this.formatWhatsApp(c.phone).length > 0).length;
  }

  get empresasCount(): number {
    return this.contacts.filter((c) => !!c.company && c.company.trim().length > 0).length;
  }

  setActiveTab(tab: 'todos' | 'favoritos'): void {
    this.activeTab = tab;
    this.cdr.detectChanges();
  }

  onToggleFavorite(contact: Contact): void {
    const updated: Contact = {
      ...contact,
      isFavorite: !contact.isFavorite,
    };

    const sub = this.contactService.updateContact(updated).subscribe({
      next: (savedContact) => {
        this.loadContacts();

        if (this.selectedContact?.id === savedContact.id) {
          this.selectedContact = savedContact;
        }
      },
      error: (error) => {
        console.error('Erro ao atualizar favorito:', error);
        globalThis.alert('Erro ao atualizar favorito.');
      },
    });

    this.subscription.add(sub);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  formatWhatsApp(phone: string): string {
    if (!phone) return '';
    return phone.replace(/\D/g, '');
  }

  getWhatsAppUrl(contact: Contact | null): string {
    if (!contact) return 'https://wa.me';
    return `https://wa.me/55${this.formatWhatsApp(contact.phone)}`;
  }

  openWhatsApp(contact: Contact): void {
    const url = this.getWhatsAppUrl(contact);
    globalThis.open(url, '_blank');
  }

  getQrImageUrl(contact: Contact | null): string {
    if (!contact) return '';
    const url = encodeURIComponent(this.getWhatsAppUrl(contact));
    return `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${url}`;
  }

  editContact(contact: Contact): void {
    this.editingContact = { ...contact };
    this.formData = {
      name: contact.name ?? '',
      phone: contact.phone ?? '',
      company: contact.company ?? '',
    };
    this.showModal = true;
  }

  openNewContact(): void {
    this.editingContact = null;
    this.formData = {
      name: '',
      phone: '',
      company: '',
    };
    this.showModal = true;
  }

  saveFromModal(): void {
    const name = this.formData.name?.trim();
    const phone = this.formData.phone?.trim();
    const company = this.formData.company?.trim();

    if (!name || !phone) {
      globalThis.alert('Preencha os campos obrigatórios: Nome e Telefone.');
      return;
    }

    const digits = this.formatWhatsApp(phone).length;

    if (!(digits === 10 || digits === 11)) {
      globalThis.alert('Telefone inválido. Informe DDD + número com 10 ou 11 dígitos.');
      return;
    }

    if (this.editingContact) {
      const updated: Contact = {
        ...this.editingContact,
        name,
        phone,
        company,
        initials: this.computeInitials(name),
      };

      const sub = this.contactService.updateContact(updated).subscribe({
        next: (savedContact) => {
          this.zone.run(() => {
            this.replaceContactInList(savedContact);
            if (this.selectedContact?.id === savedContact.id) {
              this.selectedContact = savedContact;
            }
            this.closeModal();
            this.cdr.detectChanges();
          });
        },
        error: (error) => {
          console.error('Erro ao atualizar contato:', error);
          globalThis.alert('Erro ao atualizar contato.');
        },
      });
      this.subscription.add(sub);
    } else {
      const payload = {
        name,
        company,
        phone,
        isFavorite: false,
      };

      const sub = this.contactService.addContact(payload).subscribe({
        next: (createdContact) => {
          this.contacts = [...this.contacts, createdContact];
          this.closeModal();
          this.cdr.detectChanges();
        },
        error: (error) => {
          console.error('Erro ao adicionar contato:', error);
          globalThis.alert('Erro ao adicionar contato.');
        },
      });

      this.subscription.add(sub);
    }
  }

  closeModal(): void {
    this.showModal = false;
    this.editingContact = null;

    this.formData = {
      name: '',
      phone: '',
      company: '',
    };
  }

  deleteContact(contact: Contact): void {
    const ok = globalThis.confirm(`Excluir contato ${contact.name}?`);

    if (!ok) return;

    const sub = this.contactService.deleteContact(contact.id).subscribe({
      next: () => {
        this.zone.run(() => {
          this.contacts = this.contacts.filter((c) => c.id !== contact.id);

          if (this.selectedContact?.id === contact.id) {
            this.selectedContact = null;
          }
          this.cdr.detectChanges();
        });
      },
      error: (error) => {
        console.error('Erro ao excluir contato:', error);
        globalThis.alert('Erro ao excluir contato.');
      },
    });

    this.subscription.add(sub);
  }

  private computeInitials(name: string): string {
    return name
      .split(/\s+/)
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  }

  private replaceContactInList(updated: Contact): void {
    this.contacts = this.contacts.map((contact) => (contact.id === updated.id ? updated : contact));
  }
}
