import BaseModel from './Model';

class Item extends BaseModel {
  constructor() {
    super();
    this.tableName = 'items';
  }

  /**
   * Retrieves and existing item by ID
   *
   * @param {integer} itemId
   * @returns object
   */
  async find(itemId) {
    return this.refresh()
      .where('id', itemId)
      .get()
      .then((result) => result[0]);
  }
  /**
   * Increase stock for an order
   *
   * @param {numeric} quantityToIncrease
   * @returns
   */
  async increaseQuantity(quantity = 1) {
    return this.adjustStock(quantity);
  }

  /**
   * Reduce stock quantity
   *
   * @param {numeric} quantityToReduce
   * @returns
   */
  async reduceQuantity(quantity = 1) {
    return this.adjustStock(quantity * -1);
  }

  /**
   * Modify quantity of an item
   * @param {numeric} quantity
   * @returns
   */
  async adjustStock(quantity) {
    // Set quantity to update
    this.queryParameters = [quantity];

    // Formulate the query
    this.queryString =
      `UPDATE ` +
      this.getTableName() +
      ` SET quantity = quantity + ?, updated_at= CURRENT_TIMESTAMP WHERE ` +
      this.getConditions() +
      `;`;

    return this.save();
  }

  /**
   *
   * @param {object} item
   * @returns int
   */
  async updateOrCreate(item) {
    return await this.refresh()
      .where('name', item.name)
      .get()
      .then((items) => {
        // If we have items this item exists
        // Update increase quantity instead
        if (items.length > 0) {
          this.refresh().update({
            quantity: parseInt(items[0].quantity) + parseInt(item.quantity),
          });
          return items[0].id;
        }

        // If we reach here, this item is new, let's create it
        // and return the results
        return this.refresh()
          .create(item)
          .then((resp) => {
            return resp.insertId;
          });
      });
  }

  /**
   * Creation of the Items table
   */
  async createTable() {
    this.db.statement(
      `CREATE TABLE IF NOT EXISTS ` +
        this.getTableName() +
        `(
              id INTEGER PRIMARY KEY AUTOINCREMENT,
              name TEXT UNIQUE,
              description TEXT NULL,
              category TEXT NULL,
              reorder_level INTEGER DEFAULT 1,
              quantity INTEGER NOT NULL,
              cost_price INTEGER NOT NULL,
              sale_price INTEGER NOT NULL,
              is_service INTEGER DEFAULT '0',
              note TEXT DEFAULT 'No note yet',
              meta_data TEXT DEFAULT '[]',
              created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
              deleted_at TIMESTAMP DEFAULT NULL
          );`
    );
  }
}

export default new Item();
