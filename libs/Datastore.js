'use strict';

const Ajv = require('ajv');
const DynamoDB = require('aws-sdk/clients/dynamodb');

const ajv = new Ajv();

class Datastore {

  /**
   * Set properties.
   *
   * @param event
   * @param context
   * @param config
   */
  constructor(config) {
    if (!config || !config.region || !config.endpoint || !config.tableName || !config.tableKey) {
      throw new Error('One or more config items are missing');
    }
    this.config = config;
    this._DynamoDB = new DynamoDB.DocumentClient({
      region: this.config.region,
      endpoint: this.config.endpoint
    });

  }

  /**
   * Validate given data against the schema.
   *
   * @param {object} schema
   * @returns {*}
   */
  validateData(schema, data) {

    if (!data) {
      return Promise.reject('No data found.');
    }
    const validate = ajv.compile(schema);
    if (!validate(data)) {
      let response = {
        statusCode: 400,
        message: 'JSON Schema Validation error'
      };
      return Promise.reject(response);
    } else {
      return Promise.resolve(true);
    }
  }

  /**
   * Read one item.
   *
   * @param id
   * @returns {Promise<any>}
   */
  readOne(id) {

    if (!id) {
      return Promise.reject('No ID provided');
    }

    const params = {
      TableName: this.config.tableName,
      Key: {
        [this.config.tableKey]: id
      }
    };

    return this._DynamoDB
      .get(params)
      .promise()
      .then(data => {
        if (data.Item == null) {
          return Promise.resolve(false);
        } else {
          return Promise.resolve(data.Item);
        }

      })
      .catch(err => {
        return Promise.reject(err);
      });
  }

  /**
   * Write an item.
   *
   * @param data
   * @returns {Promise<any>}
   */
  write(data) {

    if (!data) {
      return Promise.reject('No data provided');
    }

    // AWS DynamoDB do not like null or empty strings.
    Object.keys(data).forEach(key => !data[key] && delete data[key]);

    const params = {
      TableName: this.config.tableName,
      Item: data
    };

    return this._DynamoDB
      .put(params)
      .promise();
  }

}

module.exports = Datastore;
