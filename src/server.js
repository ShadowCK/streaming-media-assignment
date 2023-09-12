const http = require('http');
const htmlHandler = require('./htmlResponses.js');
const mediaHandler = require('./mediaResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const onRequest = (request, response) => {
  console.log(request.url);

  // Do nothing for now as we don't have a favicon
  if (request.url === '/favicon.ico') {
    return;
  }

  // Try to get a page with the url
  if (htmlHandler.getPage(request, response)) {
    return;
  }

  // Try to get a media stream with the url
  if (mediaHandler.getMedia(request, response)) {
    return;
  }

  // Present the homepage if the url is something else
  console.log('  => is heading nowhere! Changing it to the index.');
  request.url = '/';
  htmlHandler.getPage(request, response);
};

http.createServer(onRequest).listen(port, () => {
  console.log(`Listening on 127.0.0.1:${port}`);
});
