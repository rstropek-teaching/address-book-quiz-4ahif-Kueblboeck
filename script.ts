import { CREATED, OK } from 'http-status-codes';
import { createServer, Next, plugins, Request, Response } from 'restify';
import { BadRequestError, UnauthorizedError, NotFoundError } from 'restify-errors';

var server = createServer();
server.use(plugins.bodyParser());

interface IPerson {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
}

let contactList: IPerson[] = [];

server.get('/contacts', (req, res, next) => {
    if (contactList.length === 0) {
        next(new BadRequestError('ContactList is still empty!'));
    } else {
        res.send(contactList);
        next();
    }
});

server.post('/contacts', (req, res, next) => {
    if (!req.body.firstName || !req.body.lastName || !req.body.id || !req.body.email) {
        next(new BadRequestError('Invalid input (e.g. required field missing or empty)'));
    } else {
        const newContactId = parseInt(req.body.id);
        if (!newContactId) {
            next(new BadRequestError('ID has to be numeric value'));
        } else {
            const newContact: IPerson = {
                id: newContactId, firstName: req.body.firstName, lastName: req.body.lastName, email: req.body.email
            };
            contactList.push(newContact);
            res.send(CREATED, newContact, { Location: `${req.path()}/${req.body.id}` });
        }
    }
});


server.del('/contacts/:id', (req, res, next) => {
    const id = parseInt(req.params.id);
    if (id) {
        const contactIndex = contactList.findIndex(element => element.id === id);
        if(contactIndex !== (-1)){
            contactList.splice(contactIndex, 1);
            res.send(OK);
            next();
        }else{
            next(new NotFoundError());
        }
    }else{
        next(new BadRequestError('Parameter id must be a number'));
    }
});

server.listen(8080, () => console.log('API is listening'));



