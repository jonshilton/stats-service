# Stats Service

A service to track a user's stats for a particular course.

## Install

    npm install

## Testing and coverage

    npm test
    npm run cover

## Running locally

Run with serverless offline and dynamodb local:

    npm run dev

Check local tables using the following command:

    aws dynamodb list-tables --endpoint-url http://localhost:8000

## Deploying to a test environment on AWS

    npm run deploy

## Assumptions

- It is assumed that courseIds passed in as path parameters are references to actual courses. This saves having to look up the course by its ID in the writeCourseStats handler to improve the speed.
- The API is to be deployed to the Ireland (eu-west-1) region.
- Users should only be able to read their own session stats.
- A combined key of the courseId and userId has been used to avoid having to make expensive queries in DynamoDB.
