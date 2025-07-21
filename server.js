const handler = require('serve-handler');
const http = require('http');
const punycode = require('punycode/'); // Import punycode if necessary for your project

const server = http.createServer((request, response) => {
  // You can pass config options here
  const options = {
    public: 'public', // Serve files from a "public" directory
    rewrites: [
      { source: 'about', destination: '/about.html' },
    ],
    headers: [
      {
        source: '**/*.@(jpg|jpeg|png)',
        headers: [
          {
            key: 'Cache-Control',
            value: 'max-age=31536000',
          },
        ],
      },
    ],
  };

  return handler(request, response, options);
});

server.listen(3000, () => {
  console.log('Running at http://localhost:3000');
});
