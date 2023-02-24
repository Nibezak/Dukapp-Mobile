import { unixTimeStamp } from '../helpers/Dates';
import Model from './Model';

class Order extends Model {
  constructor() {
    super();
    this.tableName = 'orders';
  }

  /**
   * Get default object for this
   * model
   */
  defaults() {
    return {
      order_type: 'sale',
      order_key: 'S' + new Date(),
      created_via: 'android-mobile-app',
      version: '1.0.0',
      status: 'pending',
      discount_total: 0,
      discount_tax: 0,
      total: 0,
      total_tax: 0,
      prices_include_tax: 0,
      customer_supplier_id: 0,
      customer_supplier_note: 0,
      payments: [
        {
          method: 'cash',
          title: 'Cash',
          transaction_id: 'P' + unixTimeStamp(),
          amount: 0,
          currency: 'RWF',
          date_paid: new Date(),
        },
      ],
    };
  }

  /**
   * Create order table
   *  @params
   *  1. payments = {method, title, transaction_id, amount, currency, date_paid}
   *  2. status = processing, completed, cancelled, suspended
   */
  async createTable() {
    return this.db.statement(
      `CREATE TABLE IF NOT EXISTS ` +
      this.getTableName() +
      `(
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              order_type TEXT, 
              order_key TEXT,
              created_via TEXT NULL,
              version TEXT NULL,
              status TEXT DEFAULT 'pending',
              discount_total REAL DEFAULT '0',
              discount_tax REAL DEFAULT '0',
              total REAL,
              total_tax REAL DEFAULT '0',
              prices_include_tax INTEGER DEFAULT '0',
              customer_supplier_id INTEGER DEFAFULT '0',
              customer_supplier_note TEXT DEFAULT NULL,
              payments TEXT DEFAULT '[]',
              tax_lines TEXT DEFAULT '[]',
              coupon_lines TEXT DEFAULT '[]',
              fee_lines TEXT DEFAULT '[]',
              refunds TEXT DEFAULT '[]',
              note TEXT DEFAULT 'No note yet',
              meta_data TEXT DEFAULT '[]',
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              deleted_at TIMESTAMP DEFAULT NULL
          );`
    );
  }

  /**
   * Create order table
   */
  async createTableOld() {
    return this.db.statement(
      `CREATE TABLE IF NOT EXISTS ` +
      this.getTableName() +
      `(
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              order_type TEXT,
              item_id TEXT NULL,
              item_name TEXT NULL,
              item_description TEXT NULL,
              customer_or_supplier_id INTEGER  NULL,
              quantity INTEGER NOT NULL,
              cost_price INTEGER NOT NULL,
              sale_price INTEGER NOT NULL,
              payment_mode TEXT NULL,
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              deleted_at TIMESTAMP DEFAULT NULL
          );`
    );
  }
}

export default new Order();
