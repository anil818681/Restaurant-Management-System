import { Component, OnInit } from '@angular/core';
import { MenuService, MenuItem } from '../menu.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [FormsModule, CommonModule], 
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css'], 
})
export class MenuComponent implements OnInit {
  menuItems: MenuItem[] = []; // Array to hold menu items
  newItem: MenuItem = { _id: '', name: '', description: '', price: 0 }; // _id should be a string, not 'id'
  isEditing: boolean = false; // Flag for edit mode

  constructor(private menuService: MenuService) {}

  ngOnInit(): void {
    this.loadMenuItems();
  }

  // Load menu items from the service
  async loadMenuItems() {
    this.menuItems = await this.menuService.getMenuItems();
  }

  // Add or update a menu item
  async submitMenuItem() {
    if (this.newItem.name && this.newItem.price > 0) {
      if (this.isEditing) {
        await this.menuService.updateMenuItem(this.newItem); 
      } else {
        this.newItem._id = ''; // Let MongoDB handle generating the _id
        await this.menuService.addMenuItem(this.newItem); // Add new item
      }
      this.loadMenuItems(); // Refresh the list
      this.resetForm(); // Reset the form
    }
  }

  // Set the form for editing an existing menu item
  editMenuItem(item: MenuItem) {
    this.newItem = { ...item }; // Populate the form with the selected item
    this.isEditing = true; 
  }

  // Delete a menu item by _id
  async deleteMenuItem(_id: string) {
    await this.menuService.deleteMenuItem(_id);
    this.loadMenuItems(); // Refresh the list
  }

  // Reset the form
  resetForm() {
    this.newItem = { _id: '', name: '', description: '', price: 0 }; 
    this.isEditing = false; 
  }
}
