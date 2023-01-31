import { realTimeBackup } from '../api/BackupStore';
import { camelToSnakeCase } from '../helpers/Strings';
import Database from './../database/Database';

export default class Model {
  constructor() {
    this.db = Database;
    this.conditions = 1;
    this.ordering = 'ORDER BY id';
    this.orderingMode = 'ASC';
    this.recordsLimit = 1000000;
    this.tableName = this.getTableName();
    this.queryString = '';
    this.columnsToSelect = '*';
    this.queryParameters = [];
    this.createTable();
    this.resultContainer = (rows) => { };
  }

  /**
   * Get Table name of this model
   *
   * @return tableName
   */
  getTableName() {
    if (this.tableName == null) {
      return camelToSnakeCase(this.constructor.name) + `s`; // To make it plural
    }

    return this.tableName;
  }

  /**
   * Set Table name
   *
   * @param {string} name
   * @returns this
   */
  setTableName(name) {
    this.tableName = name;
    return this;
  }

  /**
   * Set results into a variable
   *
   * @param {function} resultContainer
   */
  setResult(resultContainer) {
    this.resultContainer = resultContainer;
    return this;
  }

  /**
   * Build query conditions
   * @param {string} attribute
   * @param {string|number} value
   * @returns
   */
  whereNot(attribute, value) {
    // Convert value to string that is acceptable by
    // SQLite if it is not a number
    value = isNaN(value) ? `'` + value + `'` : value;

    if (this.conditions === null) {
      this.conditions = attribute + ' <> ' + value;
    } else {
      this.conditions = this.conditions + ' AND ' + attribute + ' <> ' + value;
    }

    return this;
  }
  /**
   * Build query conditions
   * @param {string} attribute
   * @param {string|number} value
   * @returns
   */
  where(attribute, value) {
    // Convert value to string that is acceptable by
    // SQLite if it is not a number
    value = isNaN(value) ? `'` + value + `'` : value;

    if (this.conditions === null) {
      this.conditions = attribute + ' = ' + value;
    } else {
      this.conditions = this.conditions + ' AND ' + attribute + ' = ' + value;
    }

    return this;
  }

  /**
   * Add Raw Condition to the query
   */
  whereRaw(rawCondition) {
    this.conditions = this.conditions + ' AND ' + rawCondition;
    return this;
  }
  /**
   * Search by term
   *
   * @param {string} keyword
   * @returns
   */
  async search(keyword) {
    const searchTerms = this.getSearchTerms();

    if (Array.isArray(searchTerms)) {
      searchTerms.forEach((term) => this.like(term, keyword));
      return this.get();
    }

    return this.like(searchTerms, keyword)
      .get()
      .then((results) => {
        return results;
      });
  }

  /**
   * Get search term for this model
   */
  getSearchTerms() {
    return ['name'];
  }

  /**
   * Like condition
   */
  like(attribute, value) {
    if (this.conditions === null) {
      this.conditions = attribute + ` LIKE '%` + value + `%'`;
    } else {
      this.conditions = this.conditions + ' AND ' + attribute + ` LIKE '%` + value + `%'`;
    }

    return this;
  }

  /**
   * Find Item by ID
   *
   * @param {integer} id
   * @returns
   */
  async find(recordId) {
    return this.refresh().where('id', recordId).get();
  }

  /**
   * Get conditions for SQL query
   *
   * @returns string
   */
  getConditions() {
    return this.conditions;
  }

  /**
   * Set ordering mode
   * @param {*} attribute
   * @returns
   */
  orderBy(attribute) {
    this.ordering = `ORDER BY ` + attribute;
    return this;
  }

  /**
   * Mention order by desc
   */
  desc() {
    this.orderingMode = 'DESC';
    return this;
  }

  /**
   * Change ordering to ASC
   */
  asc() {
    this.orderingMode = 'ASC';
    return this;
  }

  /**
   * Retrieve current ordering option
   *
   * @returns
   */
  getOrdering() {
    return this.ordering + ` ` + this.orderingMode;
  }

  /**
   * Set record limit
   *
   * @param {number} limitationNumber
   * @returns this
   */
  limit(limitationNumber) {
    this.recordsLimit = limitationNumber;
    return this;
  }

  /**
   * Get record limitation
   *
   * @returns string
   */
  getRecordLimit() {
    return 'LIMIT ' + this.recordsLimit;
  }

  /**
   * Add columns to select to the query
   *
   * @param {string or array} columns
   * @returns
   */
  select(columns) {
    let newColumns = columns;
    if (Array.isArray(columns)) {
      newColumns = columns.join(', ');
    }

    if (this.columnsToSelect !== '*') {
      this.columnsToSelect = this.columnsToSelect + `, ` + newColumns;
    } else {
      this.columnsToSelect = newColumns;
    }

    return this;
  }

  /**
   * Column to select
   *
   * @returns string
   */
  getColumnsToSelect() {
    return this.columnsToSelect;
  }

  /**
   * Build the query
   *
   * @returns this;
   */
  buildQuery() {
    this.queryString =
      `SELECT ` +
      // Select columns - @todo
      this.getColumnsToSelect() +
      ` FROM ` +
      this.getTableName() +
      // 3. Add conditions
      ` WHERE ` +
      this.getConditions() +
      // 4. Add ordering
      ` ` +
      this.getOrdering() +
      // 5. Add limitations
      ` ` +
      this.getRecordLimit() +
      `;`;

    return this;
  }

  /**
   * Get Query String
   *
   * @returns
   */
  getQueryString() {
    this.buildQuery();
    return this;
  }

  /**
   * Execute get Query
   */
  async get() {
    return this.buildQuery().execute();
  }

  /**
   * Sum based on a clumn
   */
  async sum(columnName) {
    this.queryString =
      `SELECT SUM(` +
      columnName +
      `) AS ` +
      columnName +
      ` FROM ` +
      this.getTableName() +
      // 3. Add conditions
      ` WHERE ` +
      this.getConditions() +
      // 4. Add ordering
      ` ` +
      this.getOrdering() +
      // 5. Add limitations
      ` ` +
      this.getRecordLimit() +
      `;`;

    return this;
  }

  /**
   * Get first record
   */
  async first() {
    return await this.get()[0];
  }

  /**
   * Update
   *
   * @param {Object} params
   * @returns
   */
  async update(params = {}) {
    this.buildUpdateQuery(params);

    // Save to database
    return this.save();
  }

  /**
   * Update or Create a new record
   *
   * @param {object} attributes
   * @param {object} condition
   * @returns
   */
  async updateOrCreate(attributes, condition) {
    const column = Object.keys(condition)[0];
    const value = Object.values(condition)[0];

    return await this.refresh()
      .where(column, value)
      .get()
      .then((rows) => {
        // If we have results this record exists
        // Update update it instead of creating it
        if (rows.length > 0) {
          this.refresh().where(column, value).update(attributes);
          return rows[0].id;
        }

        // If we reach here, this row is new, let's create it
        // and return the results
        return this.refresh()
          .create(attributes)
          .then((resp) => {
            return resp.insertId;
          });
      });
  }

  /**
   * Insert into database
   * @param {Object} params
   * @returns
   */
  async insert(params = {}) {
    this.buildInsertQuery(params);
    return this.save();
  }

  /**
   * Item to create
   *
   * @param {item to create} params
   * @returns
   */
  async create(params = {}) {
    return this.insert(params);
  }

  /**
   * Generate insert query
   *
   * @param {Objet} params
   * @returns
   */
  buildInsertQuery(params = {}) {
    this.queryParameters = Object.values(params);
    const attributes = Object.keys(params).join(', ');
    const placeholders =
      Object.keys(params)
        .map(() => [])
        .join('?, ') + `?`;

    // Add conditions if we have conditions
    this.queryString =
      `INSERT INTO ` + this.getTableName() + `(` + attributes + `) VALUES(` + placeholders + `);`;
    return this;
  }

  /**
   * Run update and insert query
   */
  async save() {
    // Run against db
    return this.db.statement(this.queryString, this.queryParameters).then((res) => {
      // Upon saving, update online server in realtime
      realTimeBackup(this.queryString, this.queryParameters);

      return res;
    });
  }

  /**
   * Delete  record from database
   */
  async delete() {
    this.queryString =
      'DELETE FROM ' + this.getTableName() + ' WHERE ' + this.getConditions() + `;`;

    // Run against db
    // return await this.db.statement(this.queryString, this.queryParameters);
    return this.save();

  }

  /**
   * Soft delete a Database record
   */
  async softDelete() {
    this.update({ deleted_at: new Date().getTime() });
    return this.save();
  }

  /**
   * Destroy a model
   * @param {INTEGER} id
   * @returns promise
   */
  async destroy(recordId) {
    await this.refresh().where('id', recordId).delete();
    return this.save();

  }

  /**
   * Drop a table
   *
   * @returns Drop this table
   */
  async dropTable() {
    return await this.db.statement(`DROP TABLE IF EXISTS ` + this.getTableName() + `;`);
  }

  /**
   * Build update query
   *
   * @param {object} params
   * @returns
   */
  buildUpdateQuery(params) {
    this.queryParameters = Object.values(params);

    const attributes = Object.keys(params).join('=?, ') + `=?`;

    // Add conditions if we have conditions
    if (this.conditions !== null) {
      this.queryString =
        `UPDATE ` +
        this.getTableName() +
        ` SET ` +
        attributes +
        ` WHERE ` +
        this.getConditions() +
        `;`;

      return this;
    }

    // If we don't have condition keep it this way
    this.queryString = `UPDATE ` + this.getTableName() + ` SET ` + attributes + `;`;

    return this;
  }

  /**
   * Fetch update query
   *
   * @returns string
   */
  getUpdateQueryString() {
    return this.queryString;
  }

  /**
   * Get Query parameters
   *
   * @returns string
   */
  getQueryParameters() {
    return this.queryParameters;
  }

  /**
   * Get Key value Pair
   *
   * @param {Object}} params
   * @returns
   */
  getKeyValuePair(params) {
    const values = Object.values(params);

    return Object.keys(params)
      .map((key, value) => {
        // Take care of strings and add '' to them
        values[value] = !isNaN(values[value]) ? values[value] : `'` + values[value] + `'`;

        return [key, values[value]].join('=');
      })
      .join(', ');
  }

  /**
   * Get new instance of this class
   *
   * @returns Object
   */
  refresh() {
    return new this.constructor();
  }

  /**
   * Create table for this model if not exists
   */
  createTable() {
    throw 'please implement createTable() method for model ' + this.constructor.name;
  }

  /**
   * Reset this model
   */
  async reset() {
    this.dropTable();
    this.createTable().then((result) => {
      console.log(this.getTableName());
      console.log(result);
    });
  }

  /**
   * Run query against database
   *
   * @param {string} queryString
   * @param {array} parameters
   * @returns
   */
  async execute() {
    return await this.db.execute(this.queryString, this.queryParameters, this.resultContainer);
  }
}
