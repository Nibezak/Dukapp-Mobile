import Item from '../models/Item';
import Order from '../models/Order';
import OrderItem from '../models/OrderItem';
import {
  unixTimeStamp,
  unixHourStamp,
  unixMinuteStamp,
  unixSecondsStamp,
  unixYearStamp,
} from '../helpers/Dates';
import Database from '../database/Database';
import { getSetting } from '../models/AsyncStorage';
/**
 * Class to handle order management
 *
 */
class OrderService {
  /**
   * Get orders from Database
   */
  async getOrders(setOrders) {
    Order.refresh().limit(20).desc().get().then(setOrders);
  }

  /**
   * Find order by ID
   */
  async findOrder(orderId) {
    return Order.refresh()
      .find(orderId)
      .then((orderResults) => {
        // Clean Order Payments
        orderResults.payments = JSON.parse(orderResults.payments);
        return orderResults;
      })
      .catch((error) => {
        throw error;
      });
  }

  /**
   * Get orders and their items as stored
   * in the database
   */
  async ordersWithItems(setOrders, orderType = 'sale', orderId = null, limit = 100) {
    let orders = [];

    // Get orders first
    switch (orderId) {
      case null:
        orders = await Order.refresh().where('order_type', orderType).desc().limit(limit).get();
        break;
      default:
        orders = await Order.refresh().where('order_type', orderType).where('id', orderId).get();
        break;
    }

    // 2. Add items to each order

    for (var order of orders) {
      // 3. Get Line Items per order
      order.line_items = [];

      // Get Items per order
      await OrderItem.refresh()
        .where('order_id', order.id)
        .get()
        .then((retrieved_line_items) => {
          // 4. Add line items
          order.line_items = retrieved_line_items;

          // 5. Compute Order total based on line items
          order.total = retrieved_line_items.reduce((sum, current) => {
            return sum + current.total;
          }, 0);

          // 6. Parse payments as well
          order.payments = JSON.parse(order.payments);
        })
        .catch((error) => {
          throw error;
        });
    }

    // We need a collection of orders
    if (orderId === null) {
      setOrders(orders);
      return orders;
    }

    // We need a single order based on
    // on the passed order id
    setOrders(orders[0]);
    return orders[0];
  }

  /**
   * Get order Items
   */
  async getOrderItems(orderId, setOrderItems) {
    OrderItem.refresh().where('order_id', orderId).get().then(setOrderItems);
  }

  /**
   *
   */
  async complete(orderDetails, items) {
    // 1. Ensure order is created
    return Order.create(orderDetails).then((result) => {
      // Extract Order ID
      const orderId = result.insertId;

      // Order Created let's us register order items
      // in the database as well
      // 1. start by adding order it to each item
      items.forEach(async (item) => {
        // 2. Create item in the database table
        const orderItemAttributes = { ...item, order_id: orderId };
        this.addItemToOrder(orderItemAttributes, orderDetails.order_type);
      });

      return {
        order_id: result.insertId,
        rows_affected: result.rowsAffected,
      };
    });
  }

  /**
   * Add one item to order
   */
  async addItemToOrder(itemAttributes, orderType) {
    // 1. Add Item to the order
    return OrderItem.create(itemAttributes)
      .then((result) => {
        // 2. Adjust item stock
        this.adjustStock(itemAttributes.item_id, itemAttributes.quantity, orderType);

        return {
          order_item_id: result.insertId,
          rows_affected: result.rowsAffected,
        };
      })
      .catch(function (error) {
        console.log('There has been a problem with your fetch operation: ' + error.message);
        // ADD THIS THROW error
        throw error;
      });
  }

  /**
   * get Order by Id
   */
  async getOrderById(orderId) {
    return Order.refresh().where('id', orderId).get();
  }

  /**
   * Add a customer to an existing order
   */
  async addCustomerToOrder(orderId, customerOrSupplierId) {
    return Order.refresh().where('id', orderId).update({
      customer_supplier_id: customerOrSupplierId,
    });
  }

  async addComplete(orderId) {
    return Order.refresh().where('id', orderId).update({
      status: 'completed'
    })
  }
  /**
   * Add Payment to an order
   */
  async addPaymentToOrder(orderId, payments = []) {
    return Order.refresh()
      .where('id', orderId)
      .update({ payments: JSON.stringify(payments) });
  }

  /**
   * Sale/ purchase an item based on what the
   * Application suggested the user
   */
  async quickSale(item, orderType) {
    // 1. Prepare the item
    const itemAttributes = [
      {
        item_id: item.id,
        name: item.name,
        description: item.description,
        quantity: 1,
        unit_cost_price: item.cost_price,
        unit_sales_price: item.sale_price,
        total: item.sale_price,
      },
    ];

    // Get order total
    let orderTotal = 0;
    itemAttributes.forEach((item) => {
      orderTotal = item.total;
    });

    const currency = await getSetting('app_default_currency');
    const defaultPaymentMethod = await getSetting('app_default_payment_method');

    // 2. Prepare the order
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
      payments: JSON.stringify([
        {
          method: defaultPaymentMethod,
          title: defaultPaymentMethod,
          transaction_id: 'P' + unixSecondsStamp() / 1000,
          amount: orderTotal,
          currency: currency,
          date_paid: ` ${unixHourStamp()}:${unixMinuteStamp()}`,
        },
      ]),
    };

    // 3. Now we have order and the item,
    //    let us record them
    return this.complete(orderAttributes, itemAttributes);
  }

  /**
   * Update order Item Total Manually
   */
  async setItemTotalManually(item, customItemTotal) {
    return OrderItem.refresh()
      .where('id', item.id)
      .update({ total: parseFloat(customItemTotal) })
      .then((results) => {
        // Recalculate order total
        return Database.statement(
          `UPDATE orders 
            SET total = (SELECT sum(total) from order_items WHERE order_id = ?) 
           WHERE orders.id = ?`,
          [item.order_id, item.order_id]
        );
      });
  }

  /**
   * Set Customer Quantity
   *
   * @param {Item Model} item
   * @param {Customer Quantity to set} customerItemQuantity
   * @returns
   */
  async setItemQuantityManually(item, customerItemQuantity) {
    return OrderItem.refresh()
      .where('id', item.id)
      .update({ total: parseFloat(customerItemQuantity) });
  }

  /**
   * Record Order in Database
   *
   */
  async recordOrder(item, orderType) {
    // Push new sales to the queue
    const newOrder = {
      order_type: orderType,
      item_id: item.id,
      item_name: item.name,
      item_description: item.description,
      customer_or_supplier_id: 0,
      quantity: 1,
      cost_price: item.cost_price,
      sale_price: item.sale_price,
      payment_mode: null,
    };

    return Order.create(newOrder).then((result) => {
      // 1. Reduce Stock for sale
      //    Increase stock for purchase
      this.adjustStock(item, newOrder.quantity, newOrder.order_type);

      return result;
    });
  }

  /**
   * Adjust stock as orders are being
   * Tracked
   */
  async adjustStock(itemId, quantity, orderType) {
    const stockItem = Item.refresh().where('id', itemId);

    switch (orderType.toLowerCase()) {
      case 'sale':
      case 'sale-more':
      case 'purchase-less':
        stockItem.reduceQuantity(quantity);
        break;
      case 'purchase':
      case 'purchase-more':
      case 'sale-less':
        stockItem.increaseQuantity(quantity);
        break;
    }
  }

  /**
   * Update order item
   *
   * @params
   *  orderItem to edit
   *  action: More for increase and less for decrease
   *  lineItemsLength: if it's the only one item, then delete it
   */
  async updateOrderItem(orderItem, actionType, quantity = 1) {
    // Calculate changes
    let orderLineItem = orderItem;

    // Update quantity based on the order change
    switch (actionType.toLowerCase()) {
      case 'sale-more':
      case 'purchase-more':
        orderLineItem.quantity = orderLineItem.quantity + 1;
        break;
      case 'sale-less':
      case 'purchase-less':
        orderLineItem.quantity = orderLineItem.quantity - 1;
        break;
    }

    // You cannot sell negative quantity, Remove order
    if (actionType.endsWith('less') && orderItem.quantity < 1) {
      OrderItem.refresh().where('id', orderLineItem.id).delete();
    } else {
      // Persist changes in DB
      orderLineItem.total = orderLineItem.unit_sales_price * orderLineItem.quantity;
      OrderItem.refresh().where('id', orderLineItem.id).update(orderLineItem);
    }

    // Update inventory items
    return this.adjustStock(orderLineItem.item_id, quantity, actionType);
  }

  /**
   * Destroy an existing Order
   */
  // async destroy(order) {
  //   return Order.destroy(order.id);
  // }
}

export default new OrderService();
