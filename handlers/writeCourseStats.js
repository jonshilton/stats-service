'use strict';

const Datastore = require('../libs/Datastore');
const schema = require('../schemas/CourseAggregate');
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
      throw new Error('A course ID is required')
    }
    if (!event.body) {
      throw new Error(`Event's 'data' property is missing.`);
    }

    const data = JSON.parse(event.body);
    const ds = new Datastore(config);

    const id = event.pathParameters.courseId + '-' + event.headers['X-User-Id'];
    
    // Start by checking for existing course stats
    const existingAggs = await ds.readOne(id);

    let courseAggs;
    
    if (!existingAggs) {
      // No course stats exist, so prepare a new record
      courseAggs = {
        courseIduserId: id,
        courseId: event.pathParameters.courseId,
        userId: event.headers['X-User-Id'],
        totalModulesStudied: data.totalModulesStudied,
        averageScore: data.averageScore,
        timeStudied: data.timeStudied,
        sessions: [data]
      };
    } else {
      // Verify the session doesn't already exist
      if (!existingAggs.sessions.find(s => s.sessionId === data.sessionId)) {
        existingAggs.sessions.push(data);
      } else {
        // Update the session to reflect the change in stats
        existingAggs.sessions.map(s => {
          if (s.sessionId === data.sessionId) {
            s.totalModulesStudied = data.totalModulesStudied;
            s.timeStudied = data.timeStudied;
            s.averageScore = data.averageScore;
          }
        });
      }

      // Re-build data to store with recalculated values
      courseAggs = {
        courseIduserId: id,
        courseId: existingAggs.courseId,
        userId: existingAggs.userId,
        totalModulesStudied: existingAggs.sessions.map(item => item.totalModulesStudied).reduce((prev, next) => prev + next),
        timeStudied: existingAggs.sessions.map(item => item.timeStudied).reduce((prev, next) => prev + next),
        averageScore: existingAggs.sessions.map(item => item.averageScore).reduce((prev, next) => prev + next) / existingAggs.sessions.length,
        sessions: existingAggs.sessions
      };
    }
    
    await ds.validateData(schema, courseAggs);
    await ds.write(courseAggs);
    callback(null, Responses.success(201, 'Stats saved'));
  }
  catch (err) {
    callback(null, Responses.error(err));
  }
};