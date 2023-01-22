import Customer from '../models/Customer';
import Item from '../models/Item';
import Order from '../models/Order';
import OrderItem from '../models/OrderItem';
import Supplier from '../models/Supplier';
import ItemInventory from '../models/ItemInventory';

export function migrateDatabase() {
  ItemInventory.createTable();
  OrderItem.createTable();
  Customer.createTable();
  Supplier.createTable();
  Order.createTable();
  Item.createTable();
}
