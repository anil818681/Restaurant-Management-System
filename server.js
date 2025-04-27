const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

const MONGO_URI = 'mongodb+srv://mthotapa:ZfMEPHl0MTAM3SD9@cluster0.bio0x.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    insertSampleData();
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
  });

// Menu Item Schema and Model
const menuItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true }
});
const MenuItem = mongoose.model('MenuItem', menuItemSchema);

// Order Schema and Model
const orderSchema = new mongoose.Schema({
  customerName: { type: String, required: true },
  items: { type: [String], required: true },
  status: { type: String, required: true, default: 'New' },
  createdAt: { type: Date, default: Date.now },
});
const Order = mongoose.model('Order', orderSchema);

// Payment Schema and Model
const paymentSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  status: { type: String, required: true }, 
  paymentMethod: { type: String, required: true }, 
  paymentDate: { type: Date, default: Date.now },
  cardHolder: { type: String, required: true } 
});
const Payment = mongoose.model('Payment', paymentSchema);

// Announcement Schema and Model
const announcementSchema = new mongoose.Schema({
  description: { type: String, required: true },
  date: { type: String, required: true }, // This could be a Date object, but you are using string for simplicity
});
const Announcement = mongoose.model('Announcement', announcementSchema);

// Sample Data Insertion
const insertSampleData = async () => {
  try {
    // Sample Menu Items
    const sampleItems = [
      { name: 'Pizza Margherita', description: 'Classic pizza with tomato, mozzarella, and basil', price: 12 },
      { name: 'Burger Deluxe', description: 'Juicy beef patty with lettuce, cheese, and tomato', price: 10 },
      { name: 'Pasta Carbonara', description: 'Creamy pasta with pancetta, eggs, and Parmesan cheese', price: 15 },
      { name: 'Caesar Salad', description: 'Fresh lettuce, croutons, Caesar dressing, and Parmesan', price: 8 },
      { name: 'Ice Cream Sundae', description: 'Vanilla ice cream topped with chocolate syrup and sprinkles', price: 5 }
    ];

    const existingItems = await MenuItem.countDocuments();
    console.log(`Existing menu items count: ${existingItems}`);
    if (existingItems === 0) {
      await MenuItem.insertMany(sampleItems);
      console.log('Sample menu items inserted');
    } else {
      console.log('Menu items already exist, skipping sample data insertion');
    }

    // Order Data 
    const sampleOrders = [
      { customerName: 'Ravi Kumar', items: ['Pizza Margherita', 'Caesar Salad'], status: 'New' },
      { customerName: 'Priya Sharma', items: ['Burger Deluxe', 'Ice Cream Sundae'], status: 'Completed' },
      { customerName: 'Amit Verma', items: ['Pasta Carbonara'], status: 'New' },
    ];

    const existingOrders = await Order.countDocuments();
    console.log(`Existing orders count: ${existingOrders}`);
    if (existingOrders === 0) {
      await Order.insertMany(sampleOrders);
      console.log('Sample orders inserted');
    } else {
      console.log('Orders already exist, skipping sample data insertion');
    }

    //  Payment Data 
    const samplePayments = [
      { amount: 27, status: 'Paid', paymentMethod: 'Credit Card', cardHolder: 'Ravi Kumar' },
      { amount: 15, status: 'Paid', paymentMethod: 'PayPal', cardHolder: 'Priya Sharma' },
      { amount: 15, status: 'Pending', paymentMethod: 'Debit Card', cardHolder: 'Amit Verma' },
    ];

    const existingPayments = await Payment.countDocuments();
    console.log(`Existing payments count: ${existingPayments}`);
    if (existingPayments === 0) {
      await Payment.insertMany(samplePayments);
      console.log('Sample payments inserted');
    } else {
      console.log('Payments already exist, skipping sample data insertion');
    }

    // Announcement Data
    const sampleAnnouncements = [
      { description: 'We are now offering 20% off on all pizzas!', date: '2024-11-25' },
      { description: 'New winter menu items have been added!', date: '2024-11-20' },
      { description: 'Holiday hours: We will be closed on Christmas Day.', date: '2024-12-25' },
    ];

    const existingAnnouncements = await Announcement.countDocuments();
    console.log(`Existing announcements count: ${existingAnnouncements}`);
    if (existingAnnouncements === 0) {
      await Announcement.insertMany(sampleAnnouncements);
      console.log('Sample announcements inserted');
    } else {
      console.log('Announcements already exist, skipping sample data insertion');
    }

  } catch (err) {
    console.error('Error inserting sample data:', err);
  }
};

// Menu Routes

app.get('/api/menu', async (req, res) => {
  try {
    const menuItems = await MenuItem.find();
    res.json(menuItems);
  } catch (err) {
    console.error('Error fetching menu items:', err);
    res.status(500).json({ message: 'Error fetching menu items' });
  }
});

app.post('/api/menu', async (req, res) => {
  try {
    const { name, description, price } = req.body;
    if (!name || !description || !price) {
      return res.status(400).json({ message: 'All fields are required (name, description, price)' });
    }
    const newItem = new MenuItem({ name, description, price });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (err) {
    console.error('Error adding menu item:', err);
    if (err.name === 'ValidationError') {
      return res.status(400).json({ message: 'Validation error', details: err.errors });
    }
    res.status(500).json({ message: 'Error adding menu item', error: err.message });
  }
});

app.put('/api/menu/:id', async (req, res) => {
  try {
    const updatedItem = await MenuItem.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.json(updatedItem);
  } catch (err) {
    console.error('Error updating menu item:', err);
    res.status(500).json({ message: 'Error updating menu item' });
  }
});

app.delete('/api/menu/:id', async (req, res) => {
  try {
    const deletedItem = await MenuItem.findByIdAndDelete(req.params.id);
    if (!deletedItem) {
      return res.status(404).json({ message: 'Menu item not found' });
    }
    res.status(200).json({ message: 'Menu item deleted', deletedItem });
  } catch (err) {
    console.error('Error deleting menu item:', err);
    res.status(500).json({ message: 'Error deleting menu item' });
  }
});

// Payment Routes

app.post('/api/payments', async (req, res) => {
  try {
    const { amount, status, paymentMethod, cardHolder } = req.body;
    console.log('Creating new payment...');
    console.log(`Amount: ${amount}, Status: ${status}, Method: ${paymentMethod}, Card Holder: ${cardHolder}`);

    // Ensure that all fields are present, including cardHolder
    if (!amount || !status || !paymentMethod || !cardHolder) {
      return res.status(400).json({ message: 'All fields are required (amount, status, paymentMethod, cardHolder)' });
    }

    const newPayment = new Payment({ amount, status, paymentMethod, cardHolder });
    await newPayment.save();
    console.log('Payment created:', newPayment);
    res.status(201).json(newPayment);
  } catch (err) {
    console.error('Error creating payment:', err);
    res.status(500).json({ message: 'Error creating payment', error: err.message });
  }
});

// Get all payments (Transaction history)
app.get('/api/payments', async (req, res) => {
  try {
    console.log('Fetching all payments...');
    const payments = await Payment.find();
    console.log(`Fetched ${payments.length} payments`);
    if (payments.length === 0) {
      console.log('No payments found');
    }
    res.json(payments);
  } catch (err) {
    console.error('Error fetching payments:', err);
    res.status(500).json({ message: 'Error fetching payments' });
  }
});

app.put('/api/payments', async (req, res) => {
  try {
    const { paymentId, amount, status, paymentMethod, cardHolder } = req.body;
    console.log(`Updating payment with ID: ${paymentId}`);

    // Ensure all necessary fields are provided
    if (!paymentId || !amount || !status || !paymentMethod || !cardHolder) {
      return res.status(400).json({ message: 'All fields are required (paymentId, amount, status, paymentMethod, cardHolder)' });
    }

    // Find and update the payment using paymentId
    const updatedPayment = await Payment.findByIdAndUpdate(
      paymentId, // Use paymentId for updating
      { amount, status, paymentMethod, cardHolder }, 
      { new: true } // Return the updated document
    );

    if (!updatedPayment) {
      return res.status(404).json({ message: 'Payment not found' });
    }
    
    console.log('Payment updated:', updatedPayment);
    res.json(updatedPayment); // Return the updated payment
  } catch (err) {
    console.error('Error updating payment:', err);
    res.status(500).json({ message: 'Error updating payment' });
  }
});


// Delete a payment 
app.delete('/api/payments', async (req, res) => {
  try {
    const { paymentId } = req.body;
    console.log(`Deleting payment with ID: ${paymentId}`);
    if (!paymentId) {
      return res.status(400).json({ message: 'paymentId is required' });
    }

    const deletedPayment = await Payment.findByIdAndDelete(paymentId);

    if (!deletedPayment) {
      return res.status(404).json({ message: 'Payment not found' });
    }

    console.log('Payment deleted:', deletedPayment);
    res.status(200).json({ message: 'Payment deleted', deletedPayment });
  } catch (err) {
    console.error('Error deleting payment:', err);
    res.status(500).json({ message: 'Error deleting payment' });
  }
});


// Aouncement routes
// Create a new announcement
app.post('/api/announcements', async (req, res) => {
  try {
    const { description, date } = req.body;
    if (!description || !date) {
      return res.status(400).json({ message: 'Description and date are required' });
    }

    const newAnnouncement = new Announcement({ description, date });
    await newAnnouncement.save();
    res.status(201).json(newAnnouncement);
  } catch (err) {
    console.error('Error creating announcement:', err);
    res.status(500).json({ message: 'Error creating announcement', error: err.message });
  }
});

// Get all announcements
app.get('/api/announcements', async (req, res) => {
  try {
    const announcements = await Announcement.find();
    res.json(announcements);
  } catch (err) {
    console.error('Error fetching announcements:', err);
    res.status(500).json({ message: 'Error fetching announcements' });
  }
});

// Update an announcement by description and date
app.put('/api/announcements', async (req, res) => {
  try {
    const { description, date } = req.body;

    // Ensure both description and date are provided
    if (!description || !date) {
      return res.status(400).json({ message: 'Description and date are required' });
    }

    // Find and update the announcement based on description and date
    const updatedAnnouncement = await Announcement.findOneAndUpdate(
      { description, date }, // Search criteria: description and date
      { description, date },  // Updated data
      { new: true }           // Return the updated document
    );

    // If no announcement is found with the given description and date
    if (!updatedAnnouncement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.json(updatedAnnouncement);
  } catch (err) {
    console.error('Error updating announcement:', err);
    res.status(500).json({ message: 'Error updating announcement' });
  }
});

// Delete an announcement by description or date
app.delete('/api/announcements', async (req, res) => {
  try {
    const { description, date } = req.body;

    if (!description && !date) {
      return res.status(400).json({ message: 'Description or date is required' });
    }

    // Build query object dynamically
    const query = {};
    if (description) query.description = description;
    if (date) query.date = date;

    // Try to find and delete the announcement by description or date
    const deletedAnnouncement = await Announcement.findOneAndDelete(query);

    if (!deletedAnnouncement) {
      return res.status(404).json({ message: 'Announcement not found' });
    }

    res.json({ message: 'Announcement deleted', deletedAnnouncement });
  } catch (err) {
    console.error('Error deleting announcement:', err);
    res.status(500).json({ message: 'Error deleting announcement' });
  }
});

// Get all orders
app.get('/api/orders', async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (err) {
    console.error('Error fetching orders:', err);
    res.status(500).json({ message: 'Error fetching orders' });
  }
});

// Create a new order
app.post('/api/orders', async (req, res) => {
  try {
    const { customerName, items, status } = req.body;
    if (!customerName || !items) {
      return res.status(400).json({ message: 'Customer name and items are required' });
    }

    const newOrder = new Order({ customerName, items, status });
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ message: 'Error creating order' });
  }
});

// Update an order
app.put('/api/orders/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updatedOrder = await Order.findByIdAndUpdate(id, req.body, { new: true });
    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.json(updatedOrder);
  } catch (err) {
    console.error('Error updating order:', err);
    res.status(500).json({ message: 'Error updating order' });
  }
});
// Delete an order by customerName (or another unique field)
app.delete('/api/orders', async (req, res) => {
  try {
    const { customerName } = req.body; // Extract customerName from the body of the request

    if (!customerName) {
      return res.status(400).json({ message: 'Customer name is required' });
    }

    // Find and delete the order by customerName
    const deletedOrder = await Order.findOneAndDelete({ customerName });

    if (!deletedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.status(200).json({ message: 'Order deleted', deletedOrder });
  } catch (err) {
    console.error('Error deleting order:', err);
    res.status(500).json({ message: 'Error deleting order' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
