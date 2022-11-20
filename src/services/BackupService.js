import { today, yesterday } from "../helpers/Dates";
import Item from "../models/Item";
import Order from "../models/Order";
import Customer from "../models/Customer";
import Supplier from "../models/Supplier";
import OrderItem from "../models/OrderItem";
import { uploadData } from "../api/BackupStore";

class BackupService {
  constructor() {
    this.backupAfterDate = yesterday();
  }

  /**
   * Backup Entire App
   * @returns bool
   */
  async backupEntireApp() {
    try {
      this.backupItems();
      this.backupOrders();
      this.backupOrderItems();
      this.backupExpenses();
      this.backupSettings();
      this.backupSuppliers();
      this.backupCustomers();

      return true;
    } catch (error) {
      // console.log(error);
      return false;
    }
  }

  /**
   *
   * @returns promise
   */
  async backupItems() {
    return Item.refresh()
      .where("substr(updated_at, 0, 11)", this.backupAfterDate)
      .get()
      .then((items) => {
        console.log("===== ITEMS =====");
        // Upload Items to the server
        uploadData("items", items);

        console.log("===== END ITEMS =====");

        return items;
      });
  }

  /**
   * Orders
   * @returns promise
   */
  async backupOrders() {
    return Order.refresh()
      .where("substr(created_at, 0, 11)", this.backupAfterDate)
      .get()
      .then((orders) => {
        console.log("===== ORDERS =====");
        // Upload orders to the server
        uploadData("orders", orders);

        console.log("===== END ORDERS =====");

        return orders;
      });
  }
  /**
   * Orders Items
   * @returns promise
   */
  async backupOrderItems() {
    return OrderItem.refresh()
      .where("substr(created_at, 0, 11)", this.backupAfterDate)
      .get()
      .then((orderItems) => {
        console.log("===== ORDER ITEMS=====");

        // Upload orders to the server
        uploadData("order_items", orderItems);

        console.log("===== END ORDER ITEMS=====");

        return orderItems;
      });
  }

  /**
   * backup Customers
   *
   * @returns promise
   */
  async backupCustomers() {
    return Customer.refresh()
      .where("substr(created_at, 0, 11)", this.backupAfterDate)
      .get()
      .then((customers) => {
        console.log("===== CUSTOMERS=====");

        // Upload customers to the server
        uploadData("customers", customers);

        console.log("===== END CUSTOMERS=====");

        return customers;
      });
  }
  /**
   * SUPPLIER
   *
   * @returns PROMISE
   */
  async backupSuppliers() {
    return Supplier.refresh()
      .whereRaw("substr(created_at, 0, 11) >= '" + this.backupAfterDate + "'")
      .get()
      .then((suppliers) => {
        console.log("===== SUPPLIERS=====");

        // Upload suppliers to the server
        uploadData("suppliers", suppliers);
        console.log("===== END SUPPLIERS=====");
        return suppliers;
      });
  }

  async backupExpenses() {
    console.log("Expenses backup to be implemented");
  }

  async backupSettings() {
    console.log("Settings backed up TO BE IMPLEMENTED");
  }
}

export default new BackupService();
