import { Injectable } from '@angular/core';

export interface Order {
  _id?: string; // MongoDB object ID (optional, as it may be auto-generated)
  customerName: string;
  items: string[];
  status: string;
  createdAt?: Date; // MongoDB creation date
}

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private apiUrl = 'http://localhost:5000/api/orders'; // API URL to your backend

  // Retrieve all orders from the backend
  async getOrders(): Promise<Order[]> {
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch orders');
      }
      return await response.json();
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  }

  // Create a new order via API
  async createOrder(order: Order): Promise<Order | null> {
    try {
      const response = await fetch(this.apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });

      if (!response.ok) {
        throw new Error('Failed to create order');
      }

      const newOrder = await response.json();
      return newOrder;
    } catch (error) {
      console.error('Error creating order:', error);
      return null;
    }
  }

  // Update an existing order via API
  async updateOrder(order: Order): Promise<Order | null> {
    if (!order._id) {
      console.error('Order ID is missing');
      return null;
    }

    try {
      const response = await fetch(`${this.apiUrl}/${order._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(order),
      });

      if (!response.ok) {
        throw new Error('Failed to update order');
      }

      const updatedOrder = await response.json();
      return updatedOrder;
    } catch (error) {
      console.error('Error updating order:', error);
      return null;
    }
  }

 // delete order method to accept a customerName or other identifier
async deleteOrder(customerName: string): Promise<boolean> {
  try {
    const response = await fetch(`${this.apiUrl}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ customerName }), // Send the customerName in the body
    });

    if (!response.ok) {
      throw new Error('Failed to delete order');
    }

    return true;
  } catch (error) {
    console.error('Error deleting order:', error);
    return false;
  }
}
}