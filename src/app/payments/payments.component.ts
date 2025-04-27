import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaymentsService } from './services/payments.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-payments',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './payments.component.html',
  styleUrls: ['./payments.component.css']
})
export class PaymentsComponent implements OnInit {
  paymentForm: FormGroup;
  payments: any[] = [];
  successMessage: string = '';

  constructor(private fb: FormBuilder, private paymentsService: PaymentsService) {
    // Define the form with card details and additional fields for status and paymentMethod
    this.paymentForm = this.fb.group({
      cardNumber: ['', [Validators.required, Validators.minLength(16), Validators.maxLength(16)]],
      cardHolder: ['', Validators.required],
      expiryDate: ['', Validators.required],
      cvv: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(4)]],
      amount: ['', Validators.required],
      status: ['Pending'],  // Default status
      paymentMethod: ['Credit Card']  // Default payment method
    });
  }

  ngOnInit(): void {
    // Load the existing payments when the component initializes
    this.loadPayments();
  }

  loadPayments(): void {
    this.paymentsService.getPayments().then((data) => {
      console.log('Fetched payments:', data); // Debugging the response
      this.payments = data;
    }).catch(error => {
      console.error('Error loading payments:', error);
    });
  }

  onSubmit(): void {
    if (this.paymentForm.valid) {
      const paymentData = this.paymentForm.value;
      console.log('Payment Data:', paymentData);  // Log payment data to verify the fields are correct

      // Create a new payment and reload the list of payments after submission
      this.paymentsService.createPayment(paymentData).then(() => {
        this.successMessage = 'Payment Successful!';
        this.paymentForm.reset();
        this.loadPayments();  // Reload payments list after creating
      }).catch(error => {
        console.error('Error creating payment:', error);
        this.successMessage = 'Payment failed. Please try again.';
      });
    } else {
      this.successMessage = 'Please fill out the form correctly.';
    }
  }
  updatePaymentStatus(paymentId: string, status: string): void {
    const updatedPayment = this.payments.find(payment => payment._id === paymentId);
  
    // Ensure we send the complete data, even if we are only updating the status
    const paymentData = {
      paymentId: updatedPayment._id,
      amount: updatedPayment.amount,        // Use the current amount
      status: status,                       // The new status ("Paid" or "Refunded")
      paymentMethod: updatedPayment.paymentMethod, // Use the current payment method
      cardHolder: updatedPayment.cardHolder  // Use the current card holder name
    };
  
    this.paymentsService.updatePayment(paymentData).then(() => {
      this.loadPayments();  // Reload payments list after updating
    }).catch(error => {
      console.error('Error updating payment:', error);
    });
  }
  

  // Delete payment based on paymentId
  deletePayment(paymentId: string): void {
    this.paymentsService.deletePayment(paymentId).then(() => {
      this.loadPayments();  // Reload payments list after deleting
    }).catch(error => {
      console.error('Error deleting payment:', error);
    });
  }
}
