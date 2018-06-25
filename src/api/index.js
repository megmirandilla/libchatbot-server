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
		let val = ""
		let title = "";
		let author = "";
		let category = "";
		
		switch(req.body.queryResult.action){
			case 'searchBookTitle':
				return funcs.searchBookTitle(db, req, res);
			case 'searchAuthorBook':
				author = req.body.queryResult.parameters.author;
				category = req.body.queryResult.parameters.category;
				if(category==="") val = `Searching book by ${author}`;
				else val = `Searching book by ${author} about ${category}`;
				break;
			case 'searchCategory':
				category = req.body.queryResult.parameters.category;
				val = `Searching books about ${category}`;
				break;
			case 'borrowBook':
				title = req.body.queryResult.parameters.title;
				val = `You want to borrow the book ${title}`;
				break;
		}
		console.log(val);
		return res.json({ "fulfillmentText":val });			
	});

	return api;
}

// ssh -R meg:80:localhost:8080 serveo.net
