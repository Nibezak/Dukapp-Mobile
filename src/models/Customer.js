import { getSetting } from "./AsyncStorage";
import BaseModel from "./Model";

class Customer extends BaseModel {
  constructor() {
    super();
    this.tableName = "customers";
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
              shop_msisdn TEXT DEFAULT '${getSetting('contact_phone')}',
              names TEXT,
              phone TEXT NULL,
              email TEXT NULL,
              address TEXT NULL,
              note TEXT DEFAULT 'No note yet',
              meta_data TEXT DEFAULT '[]',
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              deleted_at TIMESTAMP DEFAULT NULL
          );`
    );
  }
}

export default new Customer();
