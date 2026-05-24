import { Component, signal } from '@angular/core';
import { ContactDashboardComponent } from './contacts/contact-dashboard/contact-dashboard';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ContactDashboardComponent],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App {
  protected readonly title = signal('frontend');
}
