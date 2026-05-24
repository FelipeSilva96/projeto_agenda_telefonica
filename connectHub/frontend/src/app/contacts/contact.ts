export interface Contact {
  id: number;
  name: string;
  company: string;
  phone: string;
  initials: string;
  isFavorite: boolean;
  email?: string;
  address?: string;
}