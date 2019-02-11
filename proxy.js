const serializeError = require('serialize-error');
const path = require('path');

function handler(event, context, callback) {

  const [targetHandlerFile, targetHandlerFunction] = event.targetHandler.split(".");

  // this path won't resolve for projects built with Angular
  // const target = require(path.resolve(__dirname, '../..', targetHandlerFile));

  // Need to reference the build folder for Angular
  const target = require(path.resolve(__dirname, '../..', '.build', targetHandlerFile));

  target[targetHandlerFunction](event.body, context, (error, response) => {

    if (error) {
        // Return Serverless error to AWS sdk
        callback(null, {
            StatusCode: 500,
            FunctionError: 'Handled',
            Payload: serializeError(error)
        })
    } else {
        // Return lambda function response to AWS SDK & pass through args from serverless.
        callback(null, response)
    }
  });


}

module.exports.handler = handler;
