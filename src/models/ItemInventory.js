import BaseModel from './Model';

class ItemInventory extends BaseModel {
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
  async trackInventory(item_id, quantity, comment) {
    const attributes = [
      {
        item_id: item_id,
        trans_inventory: quantity,
        transaction_comment: comment,
      },
    ];

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
            item_id int(11) NOT NULL AUTO_INCREMENT,
            transaction_comment text NOT NULL,
            item_inventory decimal(15,3) NOT NULL DEFAULT '0.000'
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            deleted_at TIMESTAMP DEFAULT NULL
        );`
    );
  }
}

export default new ItemInventory();
