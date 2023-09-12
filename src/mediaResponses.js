const fs = require('fs'); // pull in the file system module
const path = require('path');

const reference = {
  '/party.mp4': {
    path: '../client/party.mp4',
    type: 'video/mp4',
  },
  '/bling.mp3': {
    path: '../client/bling.mp3',
    type: 'audio/mpeg',
  },
  '/bird.mp4': {
    path: '../client/bird.mp4',
    type: 'video/mp4',
  },
};

const loadFile = (request, response, relativePath, fileType) => {
  const file = path.resolve(__dirname, relativePath);

  fs.stat(file, (err, stats) => {
    if (err) {
      if (err.code === 'ENOENT') {
        response.writeHead(404);
      }
      return response.end(err);
    }

    let { range } = request.headers;

    if (!range) {
      range = 'bytes=0-';
    }

    const positions = range.replace(/bytes=/, '').split('-');

    let start = parseInt(positions[0], 10);

    const total = stats.size;
    const end = positions[1] ? parseInt(positions[1], 10) : total - 1;

    if (start > end) {
      start = end - 1;
    }

    const chunkSize = end - start + 1;

    response.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${total}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': fileType,
    });

    const stream = fs.createReadStream(file, { start, end });

    stream.on('open', () => {
      stream.pipe(response);
    });

    stream.on('error', (streamErr) => {
      response.end(streamErr);
    });

    return stream;
  });
};

const getMedia = (request, response) => {
  const file = reference[request.url];
  if (file) {
    loadFile(request, response, file.path, file.type);
  }

  return !!file;
};

module.exports = {
  getMedia,
};
