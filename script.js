"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const http_status_codes_1 = require("http-status-codes");
const restify_1 = require("restify");
const restify_errors_1 = require("restify-errors");
var server = restify_1.createServer();
server.use(restify_1.plugins.bodyParser());
let contactList = [];
server.get('/contacts', (req, res, next) => {
    if (contactList.length === 0) {
        next(new restify_errors_1.BadRequestError('ContactList is still empty!'));
    }
    else {
        res.send(contactList);
        next();
    }
});
server.post('/contacts', (req, res, next) => {
    if (!req.body.firstName || !req.body.lastName || !req.body.id || !req.body.email) {
        next(new restify_errors_1.BadRequestError('Invalid input (e.g. required field missing or empty)'));
    }
    else {
        const newContactId = parseInt(req.body.id);
        if (!newContactId) {
            next(new restify_errors_1.BadRequestError('ID has to be numeric value'));
        }
        else {
            const newContact = {
                id: newContactId, firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email
            };
            contactList.push(newContact);
            res.send(http_status_codes_1.CREATED, newContact, { Location: `${req.path()}/${req.body.id}` });
        }
    }
});
server.del('/contacts/:id', (req, res, next) => {
    const id = parseInt(req.params.id);
    if (id) {
        const contactIndex = contactList.findIndex(element => element.id === id);
        if (contactIndex !== (-1)) {
            contactList.splice(contactIndex, 1);
            res.send(http_status_codes_1.OK);
            next();
        }
        else {
            next(new restify_errors_1.NotFoundError());
        }
    }
    else {
        next(new restify_errors_1.BadRequestError('Parameter id must be a number'));
    }
});
server.listen(8080, () => console.log('API is listening'));
