import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PaymentsService {
  private apiUrl = 'http://localhost:5000/api/payments';  // API base URL

  constructor() {}

  // Get all payments
  getPayments(): Promise<any[]> {
    return fetch(this.apiUrl)
      .then(response => response.json())
      .catch(error => {
        console.error('Error fetching payments:', error);
        throw error;
      });
  }

  // Create a new payment
  createPayment(paymentData: any): Promise<any> {
    return fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(paymentData)
    })
      .then(response => response.json())
      .catch(error => {
        console.error('Error creating payment:', error);
        throw error;
      });
  }

  // Update payment (now uses paymentId for update)
  updatePayment(updatedPayment: any): Promise<any> {
    return fetch(this.apiUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedPayment)  // Sending paymentId, amount, status, paymentMethod
    })
      .then(response => response.json())
      .catch(error => {
        console.error('Error updating payment:', error);
        throw error;
      });
  }

  // Delete payment (now uses paymentId for deletion)
  deletePayment(paymentId: string): Promise<any> {
    return fetch(this.apiUrl, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ paymentId })  // Deleting by paymentId
    })
      .then(response => response.json())
      .catch(error => {
        console.error('Error deleting payment:', error);
        throw error;
      });
  }
}
