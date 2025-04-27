import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
import { OrderTrackingComponent } from './order-tracking/order-tracking.component';
import { PaymentsComponent } from './payments/payments.component';  // Import PaymentComponent
import { announcementComponent } from './announcement/announcement.component';  // Import AnnouncementComponent

const routes: Routes = [
  { path: '', redirectTo: '/menu', pathMatch: 'full' },
  { path: 'menu', component: MenuComponent },
  { path: 'order-tracking', component: OrderTrackingComponent },
  { path: 'payments', component: PaymentsComponent },  // Add route for PaymentComponent
  { path: 'announcement', component: announcementComponent },  // Add route for AnnouncementComponent
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
