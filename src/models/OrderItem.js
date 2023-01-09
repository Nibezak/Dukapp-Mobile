import Model from "./Model";

class OrderItem extends Model {
  constructor() {
    super();
    this.tableName = "order_items";
  }

  /**
   * Creation of the Items table
   */
  async createTable() {
    return this.db.statement(
      `CREATE TABLE IF NOT EXISTS ` +
      this.getTableName() +
      `(
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT,
              item_id INTEGER NOT NULL,
              order_id INTEGER NOT NULL,
              description TEXT NULL,
              variation_id INTEGER  DEFAULT 0,
              quantity INTEGER DEFAULT 0,
              unit_cost_price INTEGER NOT NULL,
              unit_sales_price INTEGER NOT NULL,
              total REAL,
              taxes TEXT DEFAULT '[]',              
              note TEXT DEFAULT 'No note yet',
              meta_data TEXT DEFAULT '[]',
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              deleted_at TIMESTAMP DEFAULT NULL
          );`
    );
  }
}

export default new OrderItem();
