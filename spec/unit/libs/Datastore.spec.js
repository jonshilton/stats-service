'use strict';

jasmine.getEnv().addReporter(require(process.cwd() + '/spec/support/reporter'));

const proxyquire = require('proxyquire');

class mockAjvValid {
  constructor() {}
  compile() {
    let validate = () => {
      return true;
    };
    return validate;
  }
};

class mockAjvInvalid {
  constructor() {}

  compile() {
    let validate = () => {
      return false;
    };
    return validate;
  }
};

class DocumentClientNotFound {
  constructor() {}
  get() {
    return {
      promise: () => {
        return new Promise((resolve, reject) => {
          resolve({Item: null});
        });
      }
    };
  }
};

const mockDynamoDBNotFound = {
  DocumentClient: DocumentClientNotFound
};

class DocumentClientError {
  constructor() {}
  get() {
    return {
      promise: () => {
        return new Promise((resolve, reject) => {
          reject("Error");
        });
      }
    };
  }
  put() {
    return {
      promise: () => {
        return new Promise((resolve, reject) => {
          reject("Error");
        });
      }
    }
  };
};

const mockDynamoDBError = {
  DocumentClient: DocumentClientError
};

class DocumentClientSuccess {
  constructor() {}
  get() {
    return {
      promise: () => {
        return new Promise((resolve, reject) => {
          resolve({Item: {}});
        });
      }
    };
  }
  put() {
    return {
      promise: () => {
        return new Promise((resolve, reject) => {
          resolve(true);
        });
      }
    }
  };
};

const mockDynamoDBSuccess = {
  DocumentClient: DocumentClientSuccess
};

const mockConfig = {
  region: 'some-region',
  endpoint: 'http://path/to',
  tableName: 'someTableName',
  tableKey: 'someId'
};

describe('Datastore', () => {

  describe('Instantiation', () => { 
    it('should fail to instantiate without config', done => {

      const Datastore = proxyquire('../../../libs/Datastore', {
        'aws-sdk/clients/dynamodb': {},
        'ajv': mockAjvValid
      });

      try {
        const ds = new Datastore();
      }
      catch(err) {
        expect(err instanceof Error).toBeTruthy();
        expect(err.message).toEqual('One or more config items are missing');
        done();
      }
    });
  });

  describe('validateData', () => {

    it('should reject if there is no data to validate', done => {

      const Datastore = proxyquire('../../../libs/Datastore', {
        'aws-sdk/clients/dynamodb': {},
        'ajv': mockAjvValid
      });

      const ds = new Datastore(mockConfig);
      ds.validateData({})
      .then(response => {})
      .catch(err => {
        expect(err).toEqual('No data found.');
        done();
      });

    });

    it('should reject if there are validation errors', done => {
      const Datastore = proxyquire('../../../libs/Datastore', {
        'aws-sdk/clients/dynamodb': {},
        'ajv': mockAjvInvalid
      });

      const ds = new Datastore(mockConfig);
      ds.validateData({}, {})
      .then(response => {
        expect(response).toBeNull();
      })
      .catch(err => {
        expect(err.statusCode).toBeDefined();
        expect(err.statusCode).toEqual(400);
        expect(err.message).toBeDefined();
        expect(err.message).toEqual('JSON Schema Validation error');
        done();
      })
    });

    it('should resolve true if there are no validation errors', done => {
      const Datastore = proxyquire('../../../libs/Datastore', {
        'aws-sdk/clients/dynamodb': {},
        'ajv': mockAjvValid
      });

      const ds = new Datastore(mockConfig);
      ds.validateData({}, {})
      .then(response => {
        expect(response).toEqual(true);
        done();
      })
      .catch(err => {
        expect(err).toBeNull();
        done();
      })
    });
  
  });

  describe('readOne', () => {

    it ('should reject without an id', done => {
      const Datastore = proxyquire('../../../libs/Datastore', {
        'aws-sdk/clients/dynamodb': {},
        'ajv': mockAjvValid
      });
      
      const ds = new Datastore(mockConfig);
      ds.readOne()
      .then(response => {
        expect(response).toBeNull();
      })
      .catch(err => {
        expect(err).toBeDefined();
        expect(err).toEqual('No ID provided');
        done();
      });

    });

    it ('should resolve false when item not found', done => {
      const Datastore = proxyquire('../../../libs/Datastore', {
        'aws-sdk/clients/dynamodb': mockDynamoDBNotFound,
        'ajv': mockAjvValid
      });
      
      const ds = new Datastore(mockConfig);
      ds.readOne('123')
      .then(response => {
        expect(response).toEqual(false);
        done();
      })
      .catch(err => {
        expect(err).toBeNull();
        done();
      });
    });

    it ('should reject when error has occurred', done => {
      const Datastore = proxyquire('../../../libs/Datastore', {
        'aws-sdk/clients/dynamodb': mockDynamoDBError,
        'ajv': mockAjvValid
      });
      
      const ds = new Datastore(mockConfig);
      ds.readOne('123')
      .then(response => {
        expect(response).toBeNull();
      })
      .catch(err => {
        expect(err).toBeDefined();
        done();
      });
    });

    it ('should resolve when item has been found', done => {
      const Datastore = proxyquire('../../../libs/Datastore', {
        'aws-sdk/clients/dynamodb': mockDynamoDBSuccess,
        'ajv': mockAjvValid
      });
      
      const ds = new Datastore(mockConfig);
      ds.readOne('123')
      .then(response => {
        expect(response).toBeDefined();
        done();
      })
      .catch(err => {
        expect(err).toBeNull();
        done();
      });
    });

  });

  describe('write', () => {

    it ('should reject without data', done => {
      const Datastore = proxyquire('../../../libs/Datastore', {
        'aws-sdk/clients/dynamodb': {},
        'ajv': mockAjvValid
      });
      
      const ds = new Datastore(mockConfig);
      ds.write()
      .then(response => {
        expect(response).toBeNull();
      })
      .catch(err => {
        expect(err).toBeDefined();
        expect(err).toEqual('No data provided');
        done();
      });

    });

    it ('should reject when error has occurred', done => {
      const Datastore = proxyquire('../../../libs/Datastore', {
        'aws-sdk/clients/dynamodb': mockDynamoDBError,
        'ajv': mockAjvValid
      });
      
      const ds = new Datastore(mockConfig);
      ds.write({})
      .then(response => {
        expect(response).toBeNull();
      })
      .catch(err => {
        expect(err).toBeDefined();
        done();
      });
    });

    it ('should resolve when item has been written', done => {
      const Datastore = proxyquire('../../../libs/Datastore', {
        'aws-sdk/clients/dynamodb': mockDynamoDBSuccess,
        'ajv': mockAjvValid
      });
      
      const ds = new Datastore(mockConfig);
      ds.write({
        sessionId: '123',
        someNullValue: null
      })
      .then(response => {
        expect(response).toBeDefined();
        done();
      })
      .catch(err => {
        expect(err).toBeNull();
        done();
      });
    });

  });

});