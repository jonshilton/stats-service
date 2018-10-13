'use strict';

const Datastore = require('../libs/Datastore');
const Responses = require('../libs/Responses');

module.exports = async (event, context, callback) => {

  const config = {
    region: process.env.REGION,
    endpoint: process.env.ENDPOINT,
    tableName: process.env.TABLE_NAME,
    tableKey: process.env.TABLE_KEY
  };

  try {
    if (!event.headers['X-User-Id']) {
      throw new Error('A user ID is required');
    }
    if (!event.pathParameters.courseId) {
      throw new Error('A course ID is required');
    }
    if (!event.pathParameters.sessionId) {
      throw new Error('A session ID is required');
    }
    
    const id = event.pathParameters.courseId + '-' + event.headers['X-User-Id'];

    const ds = new Datastore(config);
    const stats = await ds.readOne(id);
    
    if (!stats) {
      return callback(null, Responses.notFound());
    }

    const session = stats.sessions.find(s => s.sessionId === event.pathParameters.sessionId);
    return callback(null, Responses.success(200, session));
  }
  catch (err) {
    return callback(null, Responses.error(err));
  }
};