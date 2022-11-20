import Supplier from "../models/Supplier";

class SupplierService {
  /**
   * Fetch customers from DB
   */
  async getSuppliers() {
    return Supplier.refresh().desc().get();
  }

  /**
   * Get Supplier ID
   * @param {intenger} supplierId
   * @returns
   */
  async find(supplierId) {
    return Supplier.refresh().find(supplierId);
  }

  /**
   * Create or update a Supplier
   * database table
   */
  async save(supplier) {
    // Wait for supplier creation to finish
    let lastSupplierId = null;

    if (supplier.id > 0) {
      return Supplier.refresh().where("id", supplier.id).update(supplier);
    }

    return Supplier.refresh().create(supplier);
  }

  /**
   * Destroy Supplier
   */
  async destroy(supplier) {
    return Supplier.destroy(supplier.id);
  }
}

export default new SupplierService();
