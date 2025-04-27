import { Injectable } from '@angular/core';

export interface MenuItem {
  _id: string;  // Change 'id' to '_id' to match MongoDB's _id field
  name: string;
  description: string;
  price: number;
}

@Injectable({
  providedIn: 'root'
})
export class MenuService {
  private apiUrl = 'http://localhost:5000/api/menu';  // Backend API URL

  constructor() {}

  // Get all menu items
  async getMenuItems(): Promise<MenuItem[]> {
    try {
      const response = await fetch(this.apiUrl);
      if (!response.ok) {
        throw new Error('Failed to fetch menu items');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching menu items:', error);
      return [];
    }
  }

  // Add a new menu item
async addMenuItem(item: MenuItem): Promise<MenuItem> {
  try {
    console.log('Sending the following data to the backend:', item); // Log the item being sent
    
    const response = await fetch(this.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });

    // Log the response status and body
    console.log('Response status:', response.status);
    const data = await response.json();
    console.log('Response data:', data);
    
    if (!response.ok) {
      throw new Error('Failed to add menu item');
    }

    return data;
  } catch (error) {
    console.error('Error adding menu item:', error);
    return null!;
  }
}

  // Update an existing menu item
  async updateMenuItem(updatedItem: MenuItem): Promise<MenuItem> {
    try {
      const response = await fetch(`${this.apiUrl}/${updatedItem._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedItem),
      });
      if (!response.ok) {
        throw new Error('Failed to update menu item');
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error updating menu item:', error);
      return null!;
    }
  }

  // Delete a menu item
  async deleteMenuItem(id: string): Promise<void> {  // Accept _id as string
    try {
      const response = await fetch(`${this.apiUrl}/${id}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete menu item');
      }
    } catch (error) {
      console.error('Error deleting menu item:', error);
    }
  }
}
