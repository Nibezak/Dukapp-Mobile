import Database from '../database/Database';
import { lastXDaysDate, lastXDaysNames, lastXDaysNamesForChart, today } from '../helpers/Dates';

/**
 * Service to make reports
 */
class ReportService {
  async sales(setRevenue, startDate, endDate) {
    Database.execute(
      `SELECT
          SUM(order_items.total) sales
        FROM orders, order_items
        WHERE orders.id = order_items.order_id AND 
              orders.order_type = ? AND 
              (substr(orders.created_at, 0, 11) BETWEEN ? AND ?);
        `,
      ['sale', startDate, endDate],
      (result) => {
        setRevenue(result[0].sales);
      }
    );
  }

  /**
   * Get sum of today's profit
   */
  profit(setProfit, startDate, endDate) {
    Database.execute(
      `SELECT
          SUM(order_items.total) - sum(order_items.quantity * order_items.unit_cost_price) profits
        FROM orders, order_items
        WHERE orders.id = order_items.order_id AND 
              orders.order_type = ? AND 
              (substr(orders.created_at, 0, 11) BETWEEN ? AND ?);
        `,
      ['sale', startDate, endDate],
      (result) => {
        setProfit(result[0].profits);
      }
    );
  }

  /**
   *
   * @param {callback} setSales
   * @param {start date} startDate
   * @param {end date} endDate
   * @param {payment method} method
   */
  salesByPayment(setSales, startDate, endDate, method = 'credit') {
    /** If others is passed as method e */
    method = method == 'All' ? '' : method;

    Database.execute(
      `SELECT
          SUM(order_items.total) sales
        FROM orders, order_items
        WHERE orders.id = order_items.order_id AND 
              orders.order_type = ? AND 
              (substr(orders.created_at, 0, 11) BETWEEN ? AND ?) AND
              LOWER(orders.payments) LIKE '%` +
        method +
        `%';
        `,
      ['sale', startDate, endDate],
      (result) => setSales(result[0].sales)
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
      (result) => {
        setStockItems(result[0].in_stock);
      }
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

  /**
   *
   * @param {callback} setStock
   * @param {string} startDate
   * @param {string} endDate
   * @todo TO FIX FORMULAR LATER
   */
  fastMovingStock(setStock, startDate, endDate) {
    Database.execute(
      `SELECT
        name,
        sum(quantity) slow_moving_items   
      FROM order_items
      WHERE (substr(order_items.created_at, 0, 11) BETWEEN ? AND ?)
      GROUP BY name
      HAVING SUM(quantity) > 1;
      `,
      [startDate, endDate],
      (result) => {
        setStock(result[0].fast_moving_items);
      }
    );
  }

  /**
   * @param {callback} setStock
   * @param {string} startDate
   * @param {string} endDate
   * @todo TO FIX FORMULAR LATER
   */
  slowMovingStock(setStock, startDate, endDate) {
    Database.execute(
      `SELECT
          name,
          sum(quantity) slow_moving_items   
        FROM order_items
        WHERE (substr(order_items.created_at, 0, 11) BETWEEN ? AND ?)
        GROUP BY name
        HAVING SUM(quantity) <= 1;
      `,
      [startDate, endDate],
      (result) => {
        setStock(result.length);
      }
    );
  }

  /**
   * Get last 7 days profits
   * @param {callback} setProfit
   */
  lastSevenDaysProfit(setProfit, reportDays = 7, orderType = 'sale') {
    Database.execute(
      `SELECT
              SUBSTR(orders.created_at, 0, 11) day,
              SUM(order_items.total) - sum(order_items.quantity * order_items.unit_cost_price) profit
        FROM orders, order_items
        WHERE orders.id = order_items.order_id AND 
              orders.order_type = ? AND 
              SUBSTR(orders.created_at, 0, 11) >= ?
        
        GROUP BY 
              SUBSTR(orders.created_at, 0, 11)
        LIMIT 7
        `,
      [orderType, lastXDaysDate(reportDays)],
      (results) => {
        var days = lastXDaysNamesForChart(reportDays);

        var profits = Object.keys(days).map((val) => (val = 0));
        for (var i = 0; i < results.length; i++) {
          // Get short day name
          const shortDay = new Date(results[i].day)
            .toLocaleString('en-us', {
              weekday: 'long',
            })
            .substr(0, 3);

          // Updates if index if available
          const indexOfDay = days.indexOf(shortDay);
          if (indexOfDay !== -1) {
            profits[indexOfDay] = results[i].profit;
          }
        }

        setProfit({
          days: days,
          profits: profits,
        });
      }
    );
  }
}

export default new ReportService();
