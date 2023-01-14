import Customer from '../models/Customer';
import Item from '../models/Item';
import Order from '../models/Order';
import OrderItem from '../models/OrderItem';
import Supplier from '../models/Supplier';

export function migrateDatabase() {
  OrderItem.createTable();
  Customer.createTable();
  Supplier.createTable();
  Order.createTable();
  Item.createTable();
}
