'use strict';

jasmine.getEnv().addReporter(require(process.cwd() + '/spec/support/reporter'));

let proxyquire = require('proxyquire');
process.env.CORS_URL = '*';

class mockDatastoreNotFound {
  constructor() {}
  readOne() {
    return Promise.resolve(false);
  }
}

class mockDatastoreSuccess {
  constructor() {}
  readOne() {
    return Promise.resolve({
      userId: '123',
      courseId: '123',
      totalModulesStudied: 10,
      averageScore: 100,
      timeStudied: 900,
      sessions: [
        {
          sessionId: '123',
          totalModulesStudied: 10,
          averageScore: 100,
          timeStudied: 900,
        }
      ]
    });
  }
}

describe('readSessionStats', () => {

  it('report an error when the user ID is missing', done => {

    const handler = proxyquire('../../../handlers/readSessionStats', {
      '../libs/Datastore': {},
      '../libs/Responses': {}
    });

    let event = {
      headers: {},
      pathParameters: {}
    };
    let response = {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': "*"
      },
      body: JSON.stringify({
        error: 'A user ID is required'
      })
    };
    let callback = (err, res) => {
      expect(res).toEqual(response);
      done();
    }
    handler(event, {}, callback);
  });

  it('report an error when the course ID is missing', done => {

    const handler = proxyquire('../../../handlers/readSessionStats', {
      '../libs/Datastore': {},
      '../libs/Responses': {}
    });

    let event = {
      headers: {
        "X-User-Id": '123'
      },
      pathParameters: {}
    };
    let response = {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': "*"
      },
      body: JSON.stringify({
        error: 'A course ID is required'
      })
    };
    let callback = (err, res) => {
      expect(res).toEqual(response);
      done();
    }
    handler(event, {}, callback);
  });

  it('report an error when the session ID is missing', done => {

    const handler = proxyquire('../../../handlers/readSessionStats', {
      '../libs/Datastore': {},
      '../libs/Responses': {}
    });

    let event = {
      headers: {
        "X-User-Id": '123'
      },
      pathParameters: {
        courseId: '123'
      }
    };
    let response = {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': "*"
      },
      body: JSON.stringify({
        error: 'A session ID is required'
      })
    };
    let callback = (err, res) => {
      expect(res).toEqual(response);
      done();
    }
    handler(event, {}, callback);
  });

  it('return 404 when not found', done => {

    const handler = proxyquire('../../../handlers/readSessionStats', {
      '../libs/Datastore': mockDatastoreNotFound,
      '../libs/Responses': {}
    });

    let event = {
      headers: {
        "X-User-Id": '123'
      },
      pathParameters: {
        courseId: '123',
        sessionId: '123'
      }
    };
    let response = {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': process.env.CORS_URL
      },
      body: "Record not found"
    };
    let callback = (err, res) => {
      expect(res).toEqual(response);
      done();
    }
    handler(event, {}, callback);
  });

  it('return stats when found', done => {

    const handler = proxyquire('../../../handlers/readSessionStats', {
      '../libs/Datastore': mockDatastoreSuccess,
      '../libs/Responses': {}
    });

    let event = {
      headers: {
        "X-User-Id": '123'
      },
      pathParameters: {
        courseId: '123',
        sessionId: '123'
      }
    };
    let response = {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': process.env.CORS_URL
      },
      body: JSON.stringify({
        sessionId: '123',
        totalModulesStudied: 10,
        averageScore: 100,
        timeStudied: 900
      })
    };
    let callback = (err, res) => {
      expect(res).toEqual(response);
      done();
    }
    handler(event, {}, callback);
  });

});