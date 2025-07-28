import Customer from '../models/Customer';
import Item from '../models/Item';
import Order from '../models/Order';
import OrderItem from '../models/OrderItem';
import Supplier from '../models/Supplier';
import ItemInventory from '../models/ItemInventory';

export async function migrateDatabase() {
  try {
    await ItemInventory.createTable();
    console.log('ItemInventory table created successfully.');

    await OrderItem.createTable();
    console.log('OrderItem table created successfully.');

    await Customer.createTable();
    console.log('Customer table created successfully.');

    await Supplier.createTable();
    console.log('Supplier table created successfully.');

    await Order.createTable();
    console.log('Order table created successfully.');

    await Item.createTable();
    console.log('Item table created successfully.');

    console.log('============= Database Migrated Successfully ===========');
  } catch (error) {
    console.error('Error migrating database:', error);
  }
}
