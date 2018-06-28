import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';
import * as funcs from './functions';

export default ({ config, db }) => {
	let api = Router();

	// mount the facets resource
	api.use('/facets', facets({ config, db }));

	// perhaps expose some API metadata at the root
	api.get('/', (req, res) => {
		res.json({ version });
	});

	api.post('/libraryBot', (req, res) => {
		
		funcs.addUser(db, req, res);
		
		switch(req.body.queryResult.action){
			case 'libraryBooks':
				return funcs.libraryBooks(db, req, res);
			case 'searchBookTitle':
				return funcs.searchBookTitle(db, req, res);
			case 'searchAuthorBook':
				return funcs.searchAuthorBook(db, req, res);
			case 'searchCategory':
				return funcs.searchCategory(db, req, res);
			case 'borrowBook':
				return funcs.borrowBook(db, req, res);
			case 'returnBook':
				return funcs.returnBook(db, req, res);
		}		
	});

	return api;
}

// ssh -R meg:80:localhost:8080 serveo.net
