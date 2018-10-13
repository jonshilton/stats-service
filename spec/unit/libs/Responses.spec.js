'use strict';

jasmine.getEnv().addReporter(require(process.cwd() + '/spec/support/reporter'));

const Responses = require('../../../libs/Responses');

describe('Responses', () => {

  it('success is defined', () => {
    expect(Responses.success).toBeDefined();
  });

  it('success returns as expected', () => {
    const response = Responses.success(200, {});
    expect(response.statusCode).toEqual(200);
  });

  it('error is defined', () => {
    expect(Responses.error).toBeDefined();
  });

  it('error returns as expected', () => {
    const response = Responses.error({message: 'error'});
    expect(response.statusCode).toEqual(400);
  });

  it('notFound is defined', () => {
    expect(Responses.notFound).toBeDefined();
  });

  it('notFound returns as expected', () => {
    const response = Responses.notFound();
    expect(response.statusCode).toEqual(404);
  });

});