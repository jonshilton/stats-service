'use strict';

jasmine.getEnv().addReporter(require(process.cwd() + '/spec/support/reporter'));

const handler = require(process.cwd() + '/handler');

describe('Handler', () => {

  it ('writeCourseStats handler is defined', () => {
    expect(handler.writeCourseStats).toBeDefined();
  });

  it ('readCourseStats is defined', () => {
    expect(handler.readCourseStats).toBeDefined();
  });

  it ('readSessionStats is defined', () => {
    expect(handler.readSessionStats).toBeDefined();
  });
});