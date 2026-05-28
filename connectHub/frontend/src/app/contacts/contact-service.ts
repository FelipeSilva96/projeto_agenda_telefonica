import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Contact } from './contact';



@Injectable({
  providedIn: 'root',
})
export class ContactService {
  private readonly apiUrl = 'http://localhost:5054/api/contatos';
  constructor(private http: HttpClient) { }

  getContacts(): Observable<Contact[]> {
    return this.http.get<Contact[]>(this.apiUrl);
  }

  getContactById(id: number): Observable<Contact> {
    return this.http.get<Contact>(`${this.apiUrl}/${id}`);
  }

  addContact(payload: Omit<Contact, 'id' | 'initials'>): Observable<Contact> {
  
    return this.http.post<Contact>(this.apiUrl, payload);
  }

  updateContact(updatedContact: Contact): Observable<Contact> {
    return this.http.put<Contact>(`${this.apiUrl}/${updatedContact.id}`, updatedContact);
  }

  deleteContact(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
