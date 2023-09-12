const fs = require('fs'); // pull in the file system module

const index = fs.readFileSync(`${__dirname}/../client/client.html`);
const reference = {
  '/': index,
  '/index': index,
  '/page2': fs.readFileSync(`${__dirname}/../client/client2.html`),
  '/page3': fs.readFileSync(`${__dirname}/../client/client3.html`),
};

const getPage = (request, response) => {
  const page = reference[request.url];
  if (page) {
    response.writeHead(200, { 'Content-Type': 'text/html' });
    response.write(page);
    response.end();
  }

  return !!page; // Return a boolean indicating if the function worked
};

module.exports = {
  getPage,
};
