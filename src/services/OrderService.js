import Item from '../models/Item';
import Order from '../models/Order';
import OrderItem from '../models/OrderItem';
import {
  unixTimeStamp,
  unixHourStamp,
  unixMinuteStamp,
} from '../helpers/Dates';
import Database from '../database/Database';
import { getSetting } from '../models/AsyncStorage';
import ItemInventory from '../models/ItemInventory';

/**
 * Class to handle order management
 */
class OrderService {
  /**
   * Get orders from Database
   * @param {Function} setOrders - Function to set the orders
   */
  async getOrders(setOrders) {
    const orders = await Order.refresh().limit(20).desc().get();
    setOrders(orders);
  }

  /**
   * Find order by ID
   * @param {number} orderId - The ID of the order to find
   * @returns {Promise<Object>} - The order details
   */
  async findOrder(orderId) {
    try {
      const orderResults = await Order.refresh().find(orderId);
      // Clean Order Payments
      orderResults.payments = JSON.parse(orderResults.payments);
      return orderResults;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get orders and their items from the database
   * @param {Function} setOrders - Function to set the orders
   * @param {string} orderType - Type of order ('sale' by default)
   * @param {number|null} orderId - Optional order ID
   * @param {number} limit - Limit for orders to fetch
   * @returns {Promise<Array|Object>} - The orders with items
   */
  async ordersWithItems(setOrders, orderType = 'sale', orderId = null, limit = 100) {
    let orders;

    // Get orders based on orderId
    if (orderId) {
      orders = await Order.refresh().where('order_type', orderType).where('id', orderId).get();
    } else {
      orders = await Order.refresh().where('order_type', orderType).desc().limit(limit).get();
    }

    // Add items to each order
    for (const order of orders) {
      order.line_items = [];
      const retrieved_line_items = await OrderItem.refresh().where('order_id', order.id).get();
      order.line_items = retrieved_line_items;

      // Compute Order total based on line items
      order.total = retrieved_line_items.reduce((sum, current) => sum + current.total, 0);
      order.payments = JSON.parse(order.payments);
    }

    // Set orders or single order based on orderId
    setOrders(orderId ? orders[0] : orders);
    return orderId ? orders[0] : orders;
  }

  /**
   * Get order items for a specific order
   * @param {number} orderId - The ID of the order
   * @param {Function} setOrderItems - Function to set the order items
   */
  async getOrderItems(orderId, setOrderItems) {
    const orderItems = await OrderItem.refresh().where('order_id', orderId).get();
    setOrderItems(orderItems);
  }

  /**
   * Complete an order and its items
   * @param {Object} orderDetails - Details of the order
   * @param {Array} items - Items to be included in the order
   * @returns {Promise<Object>} - The result of the order creation
   */
  async complete(orderDetails, items) {
    const result = await Order.create(orderDetails);
    const orderId = result.insertId;

    // Add order items
    await Promise.all(items.map(async (item) => {
      const orderItemAttributes = { ...item, order_id: orderId };
      await this.addItemToOrder(orderItemAttributes, orderDetails.order_type);
    }));

    return {
      order_id: result.insertId,
      rows_affected: result.rowsAffected,
    };
  }

  /**
   * Add one item to an order
   * @param {Object} itemAttributes - Attributes of the item
   * @param {string} orderType - Type of order
   * @returns {Promise<Object>} - The result of the item addition
   */
  async addItemToOrder(itemAttributes, orderType) {
    try {
      const result = await OrderItem.create(itemAttributes);
      await this.adjustStock(itemAttributes.item_id, itemAttributes.quantity, orderType);
      return {
        order_item_id: result.insertId,
        rows_affected: result.rowsAffected,
      };
    } catch (error) {
      console.log('Error adding item to order:', error.message);
      throw error;
    }
  }

  /**
   * Get Order by Id
   * @param {number} orderId - The ID of the order
   * @returns {Promise<Object>} - The order details
   */
  async getOrderById(orderId) {
    return await Order.refresh().where('id', orderId).get();
  }

  /**
   * Add a customer to an existing order
   * @param {number} orderId - The ID of the order
   * @param {number} customerOrSupplierId - The ID of the customer or supplier
   * @returns {Promise<Object>} - The result of the update
   */
  async addCustomerToOrder(orderId, customerOrSupplierId) {
    return await Order.refresh().where('id', orderId).update({
      customer_supplier_id: customerOrSupplierId,
    });
  }

  /**
   * Add payment to an order
   * @param {number} orderId - The ID of the order
   * @param {Array} payments - Array of payment details
   * @returns {Promise<Object>} - The result of the update
   */
  async addPaymentToOrder(orderId, payments = []) {
    return await Order.refresh().where('id', orderId).update({ payments: JSON.stringify(payments) });
  }

  /**
   * Mark an order as completed
   * @param {number} orderId - The ID of the order
   * @returns {Promise<Object>} - The result of the update
   */
  async addComplete(orderId) {
    return await Order.refresh().where('id', orderId).update({
      status: 'completed',
    });
  }

  /**
   * Perform a quick sale of an item
   * @param {Object} item - The item to sell
   * @param {string} orderType - The type of order
   * @returns {Promise<Object>} - The result of the sale
   */
  async quickSale(item, orderType) {
    const itemAttributes = [{
      item_id: item.id,
      name: item.name,
      description: item.description,
      quantity: 1,
      unit_cost_price: item.cost_price,
      unit_sales_price: item.sale_price,
      total: item.sale_price,
    }];

    const orderTotal = itemAttributes[0].total;
    const currency = await getSetting('app_default_currency');
    const defaultPaymentMethod = await getSetting('app_default_payment_method');

    const orderAttributes = {
      order_type: orderType.toLowerCase(),
      order_key: 'S' + unixTimeStamp(),
      created_via: 'android-mobile-app',
      version: '1.0.0',
      status: 'pending',
      discount_total: 0,
      discount_tax: 0,
      total: orderTotal,
      total_tax: 0,
      prices_include_tax: 0,
      customer_supplier_id: 0,
      customer_supplier_note: 0,
      payments: JSON.stringify([{
        method: defaultPaymentMethod,
        title: defaultPaymentMethod,
        transaction_id: 'P' + unixTimeStamp(),
        amount: orderTotal,
        currency: currency,
        date_paid: `${unixHourStamp()}:${unixMinuteStamp()}`,
      }]),
    };

    return await this.complete(orderAttributes, itemAttributes);
  }

  /**
   * Perform a quick purchase of an item
   * @param {Object} item - The item to purchase
   * @param {string} orderType - The type of order
   * @returns {Promise<Object>} - The result of the purchase
   */
  async quickSalePurchase(item, orderType) {
    const itemAttributes = [{
      item_id: item.id,
      name: item.name,
      description: item.description,
      quantity: 1,
      unit_cost_price: item.cost_price,
      unit_sales_price: item.sale_price,
      total: item.cost_price,
    }];

    const orderTotal = itemAttributes[0].total;
    const currency = await getSetting('app_default_currency');
    const defaultPaymentMethod = await getSetting('app_default_payment_method');

    const orderAttributes = {
      order_type: orderType.toLowerCase(),
      order_key: 'S' + unixTimeStamp(),
      created_via: 'android-mobile-app',
      version: '1.0.0',
      status: 'pending',
      discount_total: 0,
      discount_tax: 0,
      total: orderTotal,
      total_tax: 0,
      prices_include_tax: 0,
      customer_supplier_id: 0,
      customer_supplier_note: 0,
      payments: JSON.stringify([{
        method: defaultPaymentMethod,
        title: defaultPaymentMethod,
        transaction_id: 'P' + unixTimeStamp(),
        amount: orderTotal,
        currency: currency,
        date_paid: `${unixHourStamp()}:${unixMinuteStamp()}`,
      }]),
    };

    return await this.complete(orderAttributes, itemAttributes);
  }

  /**
   * Adjust stock of an item based on the order type
   * @param {number} itemId - The ID of the item
   * @param {number} quantity - The quantity to adjust
   * @param {string} orderType - The type of order
   */
  async adjustStock(itemId, quantity, orderType) {
    const itemInventory = await ItemInventory.refresh().where('item_id', itemId).get();
    if (itemInventory.length > 0) {
      const stockQuantity = itemInventory[0].quantity;
      const newQuantity = orderType === 'purchase' ? stockQuantity + quantity : stockQuantity - quantity;
      await ItemInventory.refresh().where('item_id', itemId).update({ quantity: newQuantity });
    } else {
      // Handle case where item inventory does not exist
      console.error(`Item with ID ${itemId} not found in inventory.`);
    }
  }
}

export default new OrderService();
