import { Injectable } from '@angular/core';

export interface Order {
  id: number;
  items: string[]; // Array of item names
  customerName: string;
  status: string;
  createdAt: Date;
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private orders: Order[] = []; 

  // Retrieve all orders
  getOrders(): Order[] {
    return this.orders;
  }

  // Create a new order
  createOrder(order: Order) {
    this.orders.push(order);
  }

  // Update an existing order
  updateOrder(updatedOrder: Order) {
    const index = this.orders.findIndex(order => order.id === updatedOrder.id);
    if (index !== -1) {
      this.orders[index] = updatedOrder;
    }
  }

  // Delete an order
  deleteOrder(id: number) {
    this.orders = this.orders.filter(order => order.id !== id);
  }
}
