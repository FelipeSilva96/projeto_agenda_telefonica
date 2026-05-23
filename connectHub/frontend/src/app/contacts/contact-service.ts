import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Contact } from './contact';
@Injectable({
  providedIn: 'root',
})
export class ContactService {
  // Name da chave usada para persistir no localStorage
  private readonly storageKey = 'connecthub_contacts_v1';

  private readonly initialContacts: Contact[] = [
    {
      id: 1,
      name: 'Ana Silva',
      company: 'Tech Solutions',
      phone: '(11) 98765-4321',
      initials: 'AS',
      isFavorite: true,
    },
    {
      id: 2,
      name: 'Carlos Santos',
      company: 'Digital Corp',
      phone: '(21) 97654-3210',
      initials: 'CS',
      isFavorite: false,
    },
    {
      id: 3,
      name: 'Maria Oliveira',
      company: 'Innovation Labs',
      phone: '(31) 96543-2109',
      initials: 'MO',
      isFavorite: true,
    },
  ];

  private readonly contactsSubject = new BehaviorSubject<Contact[]>(this.loadInitial());

  // Retorna o Observable para o componente escutar as mudanças
  getContacts(): Observable<Contact[]> {
    return this.contactsSubject.asObservable();
  }

  // Adiciona um novo contato (gera id e initials)
  addContact(payload: Omit<Contact, 'id' | 'initials'>): Contact {
    const id = Date.now();
    const initials = this.computeInitials(payload.name);
    const newContact: Contact = { ...payload, id, initials };
    const updated = [...this.contactsSubject.value, newContact];
    this.contactsSubject.next(updated);
    this.save(updated);
    return newContact;
  }

  // Atualiza um contato existente
  updateContact(updatedContact: Contact): void {
    const updated = this.contactsSubject.value.map((c) =>
      c.id === updatedContact.id
        ? { ...updatedContact, initials: this.computeInitials(updatedContact.name) }
        : c,
    );
    this.contactsSubject.next(updated);
    this.save(updated);
  }

  // Remove contato por id
  deleteContact(id: number): void {
    const updated = this.contactsSubject.value.filter((c) => c.id !== id);
    this.contactsSubject.next(updated);
    this.save(updated);
  }

  // Alterna o status de favorito de um contato
  toggleFavorite(id: number): void {
    const updatedContacts = this.contactsSubject.value.map((contact) => {
      if (contact.id === id) {
        return { ...contact, isFavorite: !contact.isFavorite };
      }
      return contact;
    });
    this.contactsSubject.next(updatedContacts);
    this.save(updatedContacts);
  }

  // Busca um contato por id (sincrono)
  getContactById(id: number): Contact | undefined {
    return this.contactsSubject.value.find((c) => c.id === id);
  }

  // ---------- Helpers (persistência + utilitários) ----------
  private loadInitial(): Contact[] {
    try {
      const raw = localStorage.getItem(this.storageKey);
      if (raw) {
        const parsed = JSON.parse(raw) as Contact[];
        // ensure initials exist for older entries
        return parsed.map((p) => ({ ...p, initials: p.initials ?? this.computeInitials(p.name) }));
      }
    } catch (e) {
      console.warn('Failed to load contacts from storage, falling back to defaults', e);
    }
    return this.initialContacts.slice();
  }

  private save(contacts: Contact[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(contacts));
    } catch (e) {
      console.warn('Failed to save contacts to storage', e);
    }
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
}
