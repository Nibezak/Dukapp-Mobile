import Model from './Model';

class ItemInventory extends Model {
  constructor() {
    super();
    this.tableName = 'item_inventories';
  }

  /**
   * Track inventory
   *
   * @param {ingeter} item_id
   * @param {float} quantity
   * @param {string} comment
   * @returns
   */
  async trackInventory(item_id, quantity, amount, comment) {
    const attributes = {
      item_id: item_id,
      quantity: quantity,
      amount: amount,
      comment: comment,
    };
    return this.refresh().create(attributes);
  }

  /**
   * Create item inventory table
   */
  async createTable() {
    this.db.statement(
      `CREATE TABLE IF NOT EXISTS ` +
      this.getTableName() +
      `(
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            item_id int(11) NOT NULL,
            comment text NOT NULL,
            quantity decimal(15,3) NOT NULL DEFAULT '0.000',
            amount decimal(15,3) NOT NULL DEFAULT '0.000',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            deleted_at TIMESTAMP DEFAULT NULL
        );`
    );
  }
}

export default new ItemInventory();
