const http = require('http');
const htmlHandler = require('./htmlResponses.js');
const jsonHandler = require('./jsonResponses.js');

const port = process.env.PORT || process.env.NODE_PORT || 3000;

const urlStruct = {
    '/': htmlHandler.getIndex,
    '/style.css': htmlHandler.getStyle,
    '/success': jsonHandler.success,
    '/badRequest': jsonHandler.badRequest,
    '/unauthorized': jsonHandler.unauthorized,
    '/forbidden': jsonHandler.forbidden,
    '/internal': jsonHandler.internal,
    '/notImplemented': jsonHandler.notImplemented,
    notFound: jsonHandler.notFound,
};


const onRequest = (request, response) => {
    console.log(request.url);

    // URL parsing
    const protocol = request.connection.encrypted ? 'https' : 'http';
    const parsedUrl = new URL(request.url, `${protocol}://${request.headers.host}`);

    // store query parameters
    request.query = Object.fromEntries(parsedUrl.searchParams);

    if (urlStruct[parsedUrl.pathname]) {
        urlStruct[parsedUrl.pathname](request, response);
    } else {
        urlStruct.notFound(request, response);
    }
}

http.createServer(onRequest).listen(port, () => {
    console.log(`Listening on 127.0.0.1:${port}`);
});

