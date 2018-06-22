import { version } from '../../package.json';
import { Router } from 'express';
import facets from './facets';

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
				title = req.body.queryResult.parameters.title;
				author = req.body.queryResult.parameters.author;
				category = req.body.queryResult.parameters.category;
				if(author==="" && category==="") val = `searching book titled ${title}`;
				else if(category==="") val = `searching book titled ${title} by ${author}`;
				else if(author==="") val = `searching book about ${category} titled ${title}`;
				else val = `searching book about ${category} titled ${title} by ${author}`;
				
				break;
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
