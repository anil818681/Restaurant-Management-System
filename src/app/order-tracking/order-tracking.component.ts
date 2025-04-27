import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-tracking',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './order-tracking.component.html',
  styleUrls: ['./order-tracking.component.css'],
})
export class OrderTrackingComponent {
  orders: any[] = [];
  newOrder = { customerName: '', items: '', status: 'New' };

  apiUrl = 'http://localhost:5000/api/orders'; // Replace with your backend API URL

  constructor() {
    this.loadOrders();
  }

  // Fetch all orders from the backend
  async loadOrders() {
    try {
      const response = await fetch(this.apiUrl);
      this.orders = await response.json();
    } catch (error) {
      console.error('Error loading orders:', error);
    }
  }

  // Create a new order
  async createOrder() {
    if (this.newOrder.customerName && this.newOrder.items.trim()) {
      const order = {
        customerName: this.newOrder.customerName,
        items: this.newOrder.items.split(',').map((item) => item.trim()),
        status: 'New',
      };

      try {
        const response = await fetch(this.apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(order),
        });

        if (response.ok) {
          this.loadOrders();
          this.resetForm();
        } else {
          console.error('Failed to create order:', await response.text());
        }
      } catch (error) {
        console.error('Error creating order:', error);
      }
    }
  }

  // Update an order's status
  async updateOrder(order: any) {
    const updatedStatus =
      order.status === 'New'
        ? 'In Preparation'
        : order.status === 'In Preparation'
        ? 'Out for Delivery'
        : 'Delivered';

    try {
      const response = await fetch(`${this.apiUrl}/${order._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...order, status: updatedStatus }),
      });

      if (response.ok) {
        this.loadOrders();
      } else {
        console.error('Failed to update order:', await response.text());
      }
    } catch (error) {
      console.error('Error updating order:', error);
    }
  }

  async deleteOrder(customerName: string): Promise<boolean> {
    try {
      const response = await fetch(this.apiUrl, { // apiUrl is 'http://localhost:5000/api/orders'
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ customerName }), // Sends the customerName in the body
      });
  
      if (response.ok) {
        console.log('Order deleted');
        return true;
      } else {
        const errorText = await response.text();
        console.error('Failed to delete order:', errorText);
        return false;
      }
    } catch (error) {
      console.error('Error deleting order:', error);
      return false;
    }
  }
  
  resetForm() {
    this.newOrder = { customerName: '', items: '', status: 'New' };
  }
}
