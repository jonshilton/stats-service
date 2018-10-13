'use strict';

jasmine.getEnv().addReporter(require(process.cwd() + '/spec/support/reporter'));

let proxyquire = require('proxyquire');
process.env.CORS_URL = '*';

class mockDatastoreSuccess {
  constructor() {}

  readOne() {
    return Promise.resolve(false);
  }
  validateData() {
    return Promise.resolve(true);
  }
  write() {
    return Promise.resolve(true);
  }
}

class mockDatastoreExistingSuccess {
  constructor() {}

  readOne() {
    return Promise.resolve({
      courseId: '9d1a46dd-b4ab-43a8-9a3f-451ecbd91939',
      userId: '123',
      totalModulesStudied: 100,
      averageScore: 50,
      timeStudied: 100,
      sessions: [{
        sessionId: 'aa81508c-c42d-481d-9c97-1a3c6c8e29b7',
	      totalModulesStudied: 40,
	      averageScore: 120,
	      timeStudied: 123456789
      }]
    });
  }
  validateData() {
    return Promise.resolve(true);
  }
  write() {
    return Promise.resolve(true);
  }
}

class mockDatastoreExistingSessionSuccess {
  constructor() {}

  readOne() {
    return Promise.resolve({
      courseId: '9d1a46dd-b4ab-43a8-9a3f-451ecbd91939',
      userId: '123',
      totalModulesStudied: 100,
      averageScore: 50,
      timeStudied: 100,
      sessions: [
        {
          sessionId: 'aa81508c-c42d-481d-9c97-1a3c6c8e29b7',
	        totalModulesStudied: 40,
	        averageScore: 120,
	        timeStudied: 123456789
        },
        {
          sessionId: 'ab81508c-c42d-481d-9c97-1a3c6c8e29b7',
	        totalModulesStudied: 10,
	        averageScore: 10,
	        timeStudied: 123456789
        }
      ]
    });
  }
  validateData() {
    return Promise.resolve(true);
  }
  write() {
    return Promise.resolve(true);
  }
}

describe('writeCourseStats', () => {

  it('report an error when the user ID is missing', done => {

    const handler = proxyquire('../../../handlers/writeCourseStats', {
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

    const handler = proxyquire('../../../handlers/writeCourseStats', {
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

  it('report an error when the body is missing', done => {

    const handler = proxyquire('../../../handlers/writeCourseStats', {
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
        error: `Event's 'data' property is missing.`
      })
    };
    let callback = (err, res) => {
      expect(res).toEqual(response);
      done();
    }
    handler(event, {}, callback);
  });

  it('handle writing of a new course stat', done => {

    const handler = proxyquire('../../../handlers/writeCourseStats', {
      '../libs/Datastore': mockDatastoreSuccess,
      '../libs/Responses': {}
    });

    let event = {
      headers: {
        "X-User-Id": '123'
      },
      pathParameters: {
        courseId: '123'
      },
      body: JSON.stringify({
        sessionId: 'cc81508c-c42d-481d-9c97-1a3c6c8e29b7',
	      totalModulesStudied: 40,
	      averageScore: 120,
	      timeStudied: 123456789
      })
    };
    let response = {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': "*"
      },
      body: JSON.stringify('Stats saved')
    };
    let callback = (err, res) => {
      expect(res).toEqual(response);
      done();
    }
    handler(event, {}, callback);
  });

  it('handle updating of an existing course stat', done => {

    const handler = proxyquire('../../../handlers/writeCourseStats', {
      '../libs/Datastore': mockDatastoreExistingSuccess,
      '../libs/Responses': {}
    });

    let event = {
      headers: {
        "X-User-Id": '123'
      },
      pathParameters: {
        courseId: '123'
      },
      body: JSON.stringify({
        sessionId: 'cc81508c-c42d-481d-9c97-1a3c6c8e29b7',
	      totalModulesStudied: 40,
	      averageScore: 120,
	      timeStudied: 123456789
      })
    };
    let response = {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': "*"
      },
      body: JSON.stringify('Stats saved')
    };
    let callback = (err, res) => {
      expect(res).toEqual(response);
      done();
    }
    handler(event, {}, callback);
  });

  it('handle updating of an existing session stat', done => {

    const handler = proxyquire('../../../handlers/writeCourseStats', {
      '../libs/Datastore': mockDatastoreExistingSessionSuccess,
      '../libs/Responses': {}
    });

    let event = {
      headers: {
        "X-User-Id": '123'
      },
      pathParameters: {
        courseId: '123'
      },
      body: JSON.stringify({
        sessionId: 'ab81508c-c42d-481d-9c97-1a3c6c8e29b7',
	      totalModulesStudied: 40,
	      averageScore: 120,
	      timeStudied: 123456789
      })
    };
    let response = {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': "*"
      },
      body: JSON.stringify('Stats saved')
    };
    let callback = (err, res) => {
      expect(res).toEqual(response);
      done();
    }
    handler(event, {}, callback);
  });

});