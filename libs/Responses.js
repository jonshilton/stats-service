'use strict';

module.exports = {
  success: (statusCode, data) => {
    return {
      statusCode: statusCode,
      headers: {
        'Access-Control-Allow-Origin': process.env.CORS_URL
      },
      body: JSON.stringify(data)
    };
  },
  error: (err, statusCode) => {
    return {
      statusCode: statusCode || 400,
      headers: {
        'Access-Control-Allow-Origin': process.env.CORS_URL
      },
      body: JSON.stringify({
        error: err.message
      })
    }
  },
  notFound: () => {
    return {
      statusCode: 404,
      headers: {
        'Access-Control-Allow-Origin': process.env.CORS_URL
      },
      body: "Record not found"
    }
  }
};