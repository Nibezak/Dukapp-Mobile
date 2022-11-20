import Item from "../models/Item";
import ItemSeeds from "../database/seeds/ItemSeeds";

class ItemService {
  /**
   * Fetch customers from DB
   */
  async getItems() {
    return Item.refresh().get();
  }

  /**
   * Find Item
   */
  async find(itemId) {
    return Item.refresh().where("id", itemId).get();
  }

  /**
   * Create or update a item
   * database table
   */
  async save(item) {
    // Update or Create the item in the DB
    if (item.id > 0) {
      return Item.refresh().where("id", item.id).update(item);
    }

    return Item.refresh().create(item);
  }

  /**
   * Seed DB
   *
   * @param {shop Type} shopType
   * @returns
   */
  async seedItems(shopType = "boutique") {
    // Seed items in the DB based on the shop Type
    const items = ItemSeeds[shopType];

    return items.forEach((item) => {
      Item.refresh()
        .create(item)
        .then((result) => {
          console.log(item.name + " seeded with id: " + result.insertId);
        })
        .catch((error) => {
          console.log(error);
        });
    });
  }

  /**
   * Destroy item
   */
  async destroy(item) {
    await Item.destroy(item.id);
    return item;
  }
}

export default new ItemService();
