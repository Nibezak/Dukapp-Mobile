import { getSetting } from "./AsyncStorage";
import Model from "./Model";

class Supplier extends Model {
  constructor() {
    super();
    this.tableName = "suppliers";
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
              company_name TEXT,
              phone TEXT NULL,
              email TEXT NULL,
              tin TEXT NULL,
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

export default new Supplier();
