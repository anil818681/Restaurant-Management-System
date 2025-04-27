import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 

export interface SingleAnnouncement {
  id: number;
  description: string;
  date: string;
}

@Component({
  selector: 'app-announcement',
  standalone: true,
  imports: [CommonModule, FormsModule], // Add FormsModule to imports
  templateUrl: './announcement.component.html',
  styleUrls: ['./announcement.component.css']
})
export class AnnouncementComponent implements OnInit {
  // Announcements list
  SingleAnnouncements: SingleAnnouncement[] = [];
  
  // New item being created/edited
  newItem: SingleAnnouncement = { id: 0, description: '', date: '' };

  // Flag to determine if we are editing an existing announcement
  isEditing: boolean = false;

  ngOnInit(): void {
    this.loadAnnouncements(); // Load announcements on component initialization
  }

  // Load all announcements from the backend
  loadAnnouncements(): void {
    fetch('http://localhost:5000/api/announcements') // Change URL if necessary
      .then(response => response.json())
      .then((announcements) => {
        this.SingleAnnouncements = announcements;
      })
      .catch((error) => {
        console.error('Error fetching announcements:', error);
      });
  }

  // Method to submit the form (create/update)
  submitSingleAnnouncement(): void {
    if (this.isEditing) {
      // Update existing announcement
      this.updateSingleAnnouncement(this.newItem);
    } else {
      // Create new announcement
      this.createSingleAnnouncement(this.newItem);
    }
    this.resetForm(); // Reset form after submission
  }

  // Create a new announcement
  createSingleAnnouncement(item: SingleAnnouncement): void {
    fetch('http://localhost:5000/api/announcements', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    })
      .then((response) => response.json())
      .then((announcement) => {
        this.SingleAnnouncements.push(announcement); // Add to list after successful creation
      })
      .catch((error) => {
        console.error('Error creating announcement:', error);
      });
  }

  // Update an existing announcement
updateSingleAnnouncement(updatedItem: SingleAnnouncement): void {
  // Send the updated announcement without using the id in the URL
  fetch('http://localhost:5000/api/announcements', { // Changed to the base route
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(updatedItem), // Send the updated announcement data
  })
    .then((response) => response.json())
    .then((updatedAnnouncement) => {
      // Find and update the item in the list by description and date
      const index = this.SingleAnnouncements.findIndex(
        (item) => item.description === updatedItem.description && item.date === updatedItem.date
      );
      if (index !== -1) {
        this.SingleAnnouncements[index] = updatedAnnouncement; 
      }
    })
    .catch((error) => {
      console.error('Error updating announcement:', error);
    });
}

// Delete an announcement based on description and/or date
deleteSingleAnnouncement(description: string, date: string): void {
  fetch('http://localhost:5000/api/announcements', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json', 
    },
    body: JSON.stringify({ description, date }), // Send description and date in the body
  })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Error deleting announcement');
      }
      // Filter out the deleted announcement from the list
      this.SingleAnnouncements = this.SingleAnnouncements.filter(
        (item) => item.description !== description && item.date !== date
      );
    })
    .catch((error) => {
      console.error('Error deleting announcement:', error);
    });
}
  // Set the form to editing mode
  editSingleAnnouncement(item: SingleAnnouncement): void {
    this.newItem = { ...item }; // Populate form with existing item details
    this.isEditing = true; // Set flag to indicate we're editing
  }

  // Reset the form
  resetForm(): void {
    this.newItem = { id: 0, description: '', date: '' }; // Reset form values
    this.isEditing = false; // Reset editing flag
  }
}
