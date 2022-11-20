import Item from "../models/Item";
import Order from "../models/Order";
import OrderItem from "../models/OrderItem";
import { today } from "../helpers/Dates";
import Database from "../database/Database";

class HomeMetricService {
  async getTodayOrders() {
    return Order.refresh()
      .where("order_type", "sale")
      .where("substr(created_at, 0, 11)", today())
      .get();
  }
  /**
   * Get sum of today sales
   */
  async todayRevenue(setRevenue) {
    Database.execute(
      `SELECT
          SUM(order_items.total) sales
        FROM orders, order_items
        WHERE orders.id = order_items.order_id
        AND orders.order_type = ?
        AND substr(orders.created_at, 0, 11)= ?
        `,
      ["sale", today()],
      (result) => setRevenue(result[0].sales)
    );
  }

  /**
   * Get sum of today's profit
   */
  todayProfit(setProfit) {
    Database.execute(
      `SELECT
          SUM(order_items.total) - sum(order_items.quantity * order_items.unit_cost_price) profits
        FROM orders, order_items
        WHERE orders.id = order_items.order_id
        AND orders.order_type = ?
        AND substr(orders.created_at, 0, 11)= ?
        `,
      ["sale", today()],
      (result) => setProfit(result[0].profits)
    );
  }

  /**
   * Get the count of items in stock
   */
  inStockItems(setStockItems) {
    Database.execute(
      `SELECT
          count(1) in_stock
        FROM items
        WHERE quantity > reorder_level 
        `,
      [],
      (result) => setStockItems(result[0].in_stock)
    );
  }

  /**
   * Get Low Stock items count
   */
  lowStockItems(setLowStockItem) {
    Database.execute(
      `SELECT
          count(1) low_stock
        FROM items
        WHERE quantity <= reorder_level 
        `,
      [],
      (result) => setLowStockItem(result[0].low_stock)
    );
  }
}

export default new HomeMetricService();
