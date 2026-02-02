// Common function for sending a json response
const jsonRespond = (request, response, status, object) => {
    const content = JSON.stringify(object);

    console.log(content);

    response.writeHead(status, {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(content, 'utf8'),
    });

    response.write(content);
    response.end();
}

const success = (request, response) => {
    const successJSON = {
        message: 'This is a successful response',
    };

    jsonRespond(request, response, 200, successJSON);
}

const badRequest = (request, response) => {
    const requestJSON = {
        message: 'This request has the required paramters',
    }

    // Verify request is valid
    if (!request.query.valid || request.query.valid !== 'true') {
        requestJSON.message = 'Missing valid query parameter set to true';
        requestJSON.id = 'badRequest';
        return jsonRespond(request, response, 400, requestJSON);
    }

    // Request is valid
    return jsonRespond(request, response, 200, requestJSON);
}

const unauthorized = (request, response) => {
    const unauthorizedJSON = {
        message: 'This request has the required paramters',
    }

    // Verify request is valid
    if (!request.query.loggedIn || request.query.loggedIn !== 'yes') {
        unauthorizedJSON.message = 'Missing loggedIn query parameter set to yes';
        unauthorizedJSON.id = 'unauthorized';
        return jsonRespond(request, response, 401, unauthorizedJSON);
    }

    // Request is valid
    return jsonRespond(request, response, 200, unauthorizedJSON);
}

const forbidden = (request, response) => {
    const forbiddenJSON = {
        message: 'You do not have access to this content',
        id: 'forbidden',
    };

    jsonRespond(request, response, 403, forbiddenJSON);
}

const internal = (request, response) => {
    const internalJSON = {
        message: 'Internal Server Error. Something went wrong.',
        id: 'internalError',
    };

    jsonRespond(request, response, 500, internalJSON);
}

const notImplemented = (request, response) => {
    const notImplementedJSON = {
        message: 'A get request for this page has not been implemented yet. Check again later for updated content.',
        id: 'notImplemented',
    };

    jsonRespond(request, response, 501, notImplementedJSON);
}

const notFound = (request, response) => {
    const notFoundJSON = {
        message: 'The page you are looking for was not found.',
        id: 'notFound',
    };

    jsonRespond(request, response, 404, notFoundJSON);
}

module.exports = {
    success,
    badRequest,
    unauthorized,
    forbidden,
    internal,
    notImplemented,
    notFound
}