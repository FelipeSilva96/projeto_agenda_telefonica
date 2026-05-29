import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactDashboard } from './contact-dashboard';

describe('ContactDashboard', () => {
  let component: ContactDashboard;
  let fixture: ComponentFixture<ContactDashboard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactDashboard],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactDashboard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
