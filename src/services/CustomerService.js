import Customer from "../models/Customer";

class CustomerService {
  /**
   * Fetch customers from DB
   */
  async getCustomers() {
    return Customer.refresh().desc().get();
  }

  /**
   * Get one Customer
   */
  async find(customerId) {
    return Customer.find(customerId);
  }

  /**
   * Create a new customer into customers
   * database table
   */
  async save(customer) {
    // Customer exists, update the customer instead of
    // Creating new customer
    if (customer.id > 0) {
      return Customer.refresh().where("id", customer.id).update(customer);
    }

    // Customer is New, Create new customer
    return Customer.refresh().create(customer);
  }

  /**
   * Destroy Customer
   */
  async destroy(customer) {
    return Customer.destroy(customer.id);
  }
}

export default new CustomerService();
