import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { OrderTrackingComponent } from './order-tracking/order-tracking.component';
import { PaymentsComponent } from './payments/payments.component';
import { AnnouncementComponent } from './announcement/announcement.component';  // Corrected import
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet, 
    MenuComponent, 
    OrderTrackingComponent, 
    PaymentsComponent, 
    AnnouncementComponent,  // Now correctly imported as a component
    CommonModule, 
    ReactiveFormsModule
  ],  // Corrected imports
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'restaurant-management-system';
}
