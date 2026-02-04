// Common function for sending a response
const respond = (request, response, status, object, type) => {
    console.log(object);

    response.writeHead(status, {
        'Content-Type': type,
        'Content-Length': Buffer.byteLength(object, 'utf8'),
    });

    response.write(object);
    response.end();
}

const success = (request, response) => {
    if (request.acceptedTypes[0] === 'text/xml') {
        let successXML = buildXML('This is a successful response');

        // return response passing out string and content type
        return respond(request, response, 200, successXML, 'text/xml');
    }

    const successJSON = {
        message: 'This is a successful response',
    };

    const successString = JSON.stringify(successJSON);
    respond(request, response, 200, successString, 'application/json');
}

const badRequest = (request, response) => {

    if (request.acceptedTypes[0] === 'text/xml') {
        let code = 200;
        let badRequestXML;

        // Set invalid message and ID
        if (!request.query.valid || request.query.valid !== 'true') {
            code = 400; // Update error code

            badRequestXML = buildXML('Missing valid query parameter set to true', 'badRequest');
        }
        // Valid message
        else {
            badRequestXML = buildXML('This request has the required parameters');
        }

        return respond(request, response, code, badRequestXML, 'text/xml');
    }



    const requestJSON = {
        message: 'This request has the required parameters',
    }

    // Verify request is valid
    if (!request.query.valid || request.query.valid !== 'true') {
        requestJSON.message = 'Missing valid query parameter set to true';
        requestJSON.id = 'badRequest';

        const requestString = JSON.stringify(requestJSON);
        return respond(request, response, 400, requestString, 'application/json');
    }

    // Request is valid
    const requestString = JSON.stringify(requestJSON);
    return respond(request, response, 200, requestString, 'application/json');
}

const unauthorized = (request, response) => {
    if (request.acceptedTypes[0] === 'text/xml') {
        let code = 200;
        let unauthorizedXML;

        // Set invalid message and ID
        if (!request.query.loggedIn || request.query.loggedIn !== 'yes') {
            code = 401; // Update error code

            unauthorizedXML = buildXML('Missing loggedIn query parameter set to yes', 'unauthorized');
        }
        // Valid message
        else {
            unauthorizedXML = buildXML('This request has the required paraemters');
        }

        return respond(request, response, code, unauthorizedXML, 'text/xml');
    }


    const unauthorizedJSON = {
        message: 'This request has the required parameters',
    }

    // Verify request is valid
    if (!request.query.loggedIn || request.query.loggedIn !== 'yes') {
        unauthorizedJSON.message = 'Missing loggedIn query parameter set to yes';
        unauthorizedJSON.id = 'unauthorized';

        const unauthorizedString = JSON.stringify(unauthorizedJSON);
        return respond(request, response, 401, unauthorizedString, 'application/json');
    }

    // Request is valid
    const unauthorizedString = JSON.stringify(unauthorizedJSON);
    return respond(request, response, 200, unauthorizedString, 'application/json');
}

const forbidden = (request, response) => {
    if (request.acceptedTypes[0] === 'text/xml') {
        let forbiddenXML = buildXML('You do not have access to this content', 'forbidden');

        return respond(request, response, 403, forbiddenXML, 'text/xml');
    }

    const forbiddenJSON = {
        message: 'You do not have access to this content',
        id: 'forbidden',
    };

    const forbiddenString = JSON.stringify(forbiddenJSON);
    respond(request, response, 403, forbiddenString, 'application/json');
}

const internal = (request, response) => {
    if (request.acceptedTypes[0] === 'text/xml') {
        let internalXML = buildXML('Internal Server Error. Something went wrong.', 'internalError');

        return respond(request, response, 500, internalXML, 'text/xml');
    }

    const internalJSON = {
        message: 'Internal Server Error. Something went wrong.',
        id: 'internalError',
    };

    const internalString = JSON.stringify(internalJSON);
    respond(request, response, 500, internalString, 'application/json');
}

const notImplemented = (request, response) => {
    if (request.acceptedTypes[0] === 'text/xml') {
        let notImplementedXML = buildXML('A get request for this page has not been implemented yet. Check again later for updated content.', 'notImplemented');

        return respond(request, response, 501, notImplementedXML, 'text/xml');
    }
    const notImplementedJSON = {
        message: 'A get request for this page has not been implemented yet. Check again later for updated content.',
        id: 'notImplemented',
    };

    const notImplementedString = JSON.stringify(notImplementedJSON)
    respond(request, response, 501, notImplementedString, 'application/json');
}

const notFound = (request, response) => {
    if (request.acceptedTypes[0] === 'text/xml') {
        let notFoundXML = buildXML('The page you are looking for was not found.', 'notFound');

        return respond(request, response, 404, notFoundXML, 'text/xml');
    }

    const notFoundJSON = {
        message: 'The page you are looking for was not found.',
        id: 'notFound',
    };

    const notFoundString = JSON.stringify(notFoundJSON);
    respond(request, response, 404, notFoundString, 'application/json');
}

// Builds an XML string with a message and an id if supplied
const buildXML = (message, id='') => {
    let responseXML = '<response>';
    responseXML = `${responseXML} <message>${message}</message>`;
    if (id != '') responseXML = `${responseXML} <id>${id}</id>`
    responseXML = `${responseXML} </response>`;

    return responseXML;
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