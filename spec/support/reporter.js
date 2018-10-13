
'use strict';

const SpecReporter = require('jasmine-spec-reporter').SpecReporter;

jasmine.getEnv().clearReporters();
jasmine.getEnv().addReporter(new SpecReporter({
  spec: {
    displayErrorMessages: true,
    displayPending: true,
    displayStacktrace: 'all'
  }
}));
