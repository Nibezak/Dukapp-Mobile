import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';
import * as Sentry from 'sentry-expo';

class Database {
  constructor() {
    this.databaseName = 'dukApp001.db';
    this.db = this.openDatabase();
  }
  /**
   * Open database
   *
   * @returns
   */
  openDatabase() {
    if (Platform.OS === 'web') {
      return {
        transaction: () => {
          return {
            executeSql: () => {},
          };
        },
      };
    }
    return SQLite.openDatabase(this.getDatabaseName());
  }

  /**
   * The name of the database
   *
   * @returns string
   */
  getDatabaseName() {
    return this.databaseName;
  }

  /**
   * Run the query
   *
   * @param {function} resultsContainer
   */
  async execute(
    queryString,
    queryParameters = [],
    resultsContainer = (resultsContainer) => resultsContainer
  ) {
    return this.statement(queryString, queryParameters).then(({ rows }) => {
      try {
        let results = [];
        if (rows == undefined) {
          resultsContainer(results);
          return results;
        }

        results = rows._array;

        resultsContainer(results);
        return results;
      } catch (error) {
        console.log(queryString);
        console.log(queryParameters);
        console.log(error);
      }
    });
  }

  /**
   * Execute database statement
   *
   * @param {string} queryString
   * @param {array} queryParameters
   * @returns
   */
  async statement(queryString, queryParameters) {
    return new Promise((resolve, _reject) => {
      this.db.transaction((tx) => {
        tx.executeSql(
          queryString,
          queryParameters,
          (t, success) => {
            resolve(success);
          },
          (t, error) => {
            Sentry.Native.captureException(error);
            resolve(error);
          }
        );
      });
    });
  }
}

export default new Database();
