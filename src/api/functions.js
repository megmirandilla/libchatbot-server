import fetch from "node-fetch";

export function helpReply(db, req, res) {

	return res.json({
		"fulfillmentText": "You can do the following:\n1. show all books\n2. search book title (can also include author and category)\n3. show books by author\n4. books about category\n5. borrow book\n6. return book",
	    "fulfillmentMessages": [
	      {
	        "quickReplies": {
	          "title": "You can do the following:",
	          "quickReplies": [
	            "show all books",
	            "search book titled",
	            "show books by",
	            "books about",
	            "borrow book",
	            "return book"
	          ]
	        },
	        "platform": "FACEBOOK"
	      },
	      {
	        "text": {
	          "text": [
	            "You can do the following:\n1. show all books\n2. search book title (can also include author and category)\n3. show books by author\n4. books about category\n5. borrow book\n6. return book"
	          ]
	        }
	      }
	    ]
	});
}

export function addUser(db, req, res) {
	// console.log(req.body);
	var queryString = 'SELECT userid FROM user WHERE userid = ?';
	const src = req.body.originalDetectIntentRequest.source;
	var userid;

	if(src === 'facebook') {
		userid = req.body.originalDetectIntentRequest.payload.data.sender.id;
	} else {
		userid = req.body.session;
	}

	db.query(queryString, userid, (err, rows) => {
		if(err){
			console.log(err);
		} else {
			if(!rows.length){
				console.log("New user detected. " + rows.length);
				queryString = 'INSERT INTO user VALUES (?)';

				db.query(queryString, userid, (err, rows) => {
					if(err) {
						console.log(err);
					}

				});
			} else {
				console.log("User exists already");
			}
		}

	});
}

export function pushNotif(db, req, res) {
	var body = { 
		"messaging_type": "update",
		"recipient": {
		"id": req.body.originalDetectIntentRequest.payload.data.sender.id
		},
		"message": {
		"text": "Do you wish to borrow this book? Try \'borrow book title\'"
		}
	 };
	fetch('"https://graph.facebook.com/v2.6/me/messages?access_token="https://graph.facebook.com/v2.6/me/messages?access_token=EAAdZAxldZCpbkBAFQoJUsrhZAPwVpw2qYxf4b6ffTByZAfQNNVNtRaZCQhg7RuETKKHkdvWsqasZAsew4EruMfSEaYZBaZAvBUpSXqvjKXY0N4psTZCQFd3AaYZAvvnzwy483zhFCRLG2NC0TZAeD2gVuIvVr0KkaXsyeV0FcEWjffvBgZDZD', { 
		method: 'POST',
		body:    JSON.stringify(body),
		headers: { 'Content-Type': 'application/json' },
	})
		.then(res => res.json())
			.then(json => console.log(json));
}

export function returnThreadControl(db, req, res) {
	var body = { 
		"recipient":{"id":req.body.originalDetectIntentRequest.payload.data.sender.id},
		"target_app_id":2073974752921975,
		"metadata":"String to pass to secondary receiver app"
	 };
	fetch('https://graph.facebook.com/v2.6/me/pass_thread_control?access_token=EAAdZAxldZCpbkBAFQoJUsrhZAPwVpw2qYxf4b6ffTByZAfQNNVNtRaZCQhg7RuETKKHkdvWsqasZAsew4EruMfSEaYZBaZAvBUpSXqvjKXY0N4psTZCQFd3AaYZAvvnzwy483zhFCRLG2NC0TZAeD2gVuIvVr0KkaXsyeV0FcEWjffvBgZDZD', { 
		method: 'POST',
		body:    JSON.stringify(body),
		headers: { 'Content-Type': 'application/json' },
	})
		.then(res => res.json())
			.then(json => console.log(json));
}

export function passThreadControl(db, req, res) {
	var body = { 
		"recipient":{"id":req.body.originalDetectIntentRequest.payload.data.sender.id},
		"target_app_id":2073974752921975,
		"metadata":"String to pass to secondary receiver app"
	 };
	fetch('https://graph.facebook.com/v2.6/me/pass_thread_control?access_token=EAAdZAxldZCpbkBAFQoJUsrhZAPwVpw2qYxf4b6ffTByZAfQNNVNtRaZCQhg7RuETKKHkdvWsqasZAsew4EruMfSEaYZBaZAvBUpSXqvjKXY0N4psTZCQFd3AaYZAvvnzwy483zhFCRLG2NC0TZAeD2gVuIvVr0KkaXsyeV0FcEWjffvBgZDZD', { 
		method: 'POST',
		body:    JSON.stringify(body),
		headers: { 'Content-Type': 'application/json' },
	})
		.then(res => res.json())
			.then(json => console.log(json));
}

export function searchBookTitle(db, req, res) {
	const params = req.body.queryResult.parameters;
	let title = params.title;
	let author = params.author;
	let category = params.category;
	var queryString;
	var values;

	if(author==="" && category==="") {
		queryString = 'SELECT title, author, category, borrower FROM books WHERE title like ?';
		values = ['%' + title + '%'];
	}else if(category==="") {
		queryString = 'SELECT title, author, category, borrower FROM books WHERE title like ? AND author like ?';
		values = ['%' + title + '%', '%' + author + '%'];
	}else if(author==="") {
		queryString = 'SELECT title, author, category, borrower FROM books WHERE title like ? AND category like ?';
		values = ['%' + title + '%', '%' + category + '%' ];
	}else {
		queryString = 'SELECT title, author, category, borrower FROM books WHERE title like ? AND author like ? AND category like ?';
		values = ['%' + title + '%', '%' + author + '%', '%' + category + '%' ];
	}

	if(queryString && values) {
		db.query(queryString, values, (err, rows) => {
			if(err) {
				console.log(err);
				return res.json({ fulfillmentText: 'I didn\'t get that. Can you rephrase it?' });
			}

			if(!rows.length) {
				return res.json({ fulfillmentText: 'There is no book matching that description. Please try again.'});
			}

			var val = 'Here are the books:\n';
			var brwr;
			for(var i=0; i<rows.length; i++){
				brwr = (!rows[i].borrower) ? "Available":"Taken";
				val += '\n\nTitle: ' + rows[i].title + '\nAuthor: ' + rows[i].author + '\nCategory: ' + rows[i].category + '\nStatus: ' + brwr;
			}

			// var FBMessenger = require('fb-messenger');
			// var messenger = new FBMessenger("EAAdZAxldZCpbkBAFQoJUsrhZAPwVpw2qYxf4b6ffTByZAfQNNVNtRaZCQhg7RuETKKHkdvWsqasZAsew4EruMfSEaYZBaZAvBUpSXqvjKXY0N4psTZCQFd3AaYZAvvnzwy483zhFCRLG2NC0TZAeD2gVuIvVr0KkaXsyeV0FcEWjffvBgZDZD");
			
			// var id = req.body.originalDetectIntentRequest.payload.data.sender.id;
			// messenger.sendTextMessage(id, 'Do you wish to borrow this book? Try \'borrow book title\'', function (err, body) {
			//   if(err) return console.error(err)
			// })
			pushNotif(db, req, res);
			return res.json({ fulfillmentText: val });
		});
	} else {
		return res.json({ fulfillmentText: 'I didn\'t get that. Can you rephrase it?' });
	}
}

export function searchAuthorBook(db, req, res) {
	const author = req.body.queryResult.parameters.author;
	const queryString = 'SELECT title, author, category, borrower FROM books WHERE author like ?';

	db.query(queryString, '%'+author+'%', (err, rows) => {
		if(err) {
			console.log(err);
			return res.json({ fulfillmentText: 'I didn\'t get that. Can you rephrase it?' });
		}

		if(!rows.length) {
			return res.json({ fulfillmentText: 'There is no book matching that description. Please try again.'});	
		}

		var val;
		var brwr;
		for(var i=0; i<rows.length; i++){
			brwr = (!rows[i].borrower) ? "Available":"Taken";
			val += '\n\nTitle: ' + rows[i].title + '\nAuthor: ' + rows[i].author + '\nCategory: ' + rows[i].category + '\nStatus: ' + brwr;
		}
		
		return res.json({ fulfillmentText: val });
	});
}

export function searchCategory(db, req, res) {
	const category = req.body.queryResult.parameters.category;
	const queryString = 'SELECT title, author, category, borrower FROM books WHERE category like ?';

	db.query(queryString, '%'+category+'%', (err, rows) => {
		if(err) {
			console.log(err);
			return res.json({ fulfillmentText: 'I didn\'t get that. Can you rephrase it?' });
		}

		if(!rows.length) {
			return res.json({ fulfillmentText: 'There is no book matching that description. Please try again.'});	
		}

		var val;
		var brwr;
		for(var i=0; i<rows.length; i++){
			brwr = (!rows[i].borrower) ? "Available":"Taken";
			val += '\n\nTitle: ' + rows[i].title + '\nAuthor: ' + rows[i].author + '\nCategory: ' + rows[i].category + '\nStatus: ' + brwr;
		}

		return res.json({ fulfillmentText: val });
	});
}

export function borrowBook(db, req, res) {
	const title = req.body.queryResult.parameters.title;
	const src = req.body.originalDetectIntentRequest.source;
	var userid;

	if(src === 'facebook') {
		userid = req.body.originalDetectIntentRequest.payload.data.sender.id;
	} else {
		userid = req.body.session;
	}

	var queryString = 'SELECT borrower FROM books WHERE title like ?';

	db.query(queryString, '%'+title+'%', (err, rows) => {
		if(err){
			console.log(err);
			return res.json({ fulfillmentText: 'I didn\'t get that. Can you rephrase it?' });			
		}

		if(!rows.length) {
			console.log(title);
			return res.json({ fulfillmentText: 'There is no book matching that description. Please try again.'});	
		}

		if(rows[0].borrower){
			return res.json({ fulfillmentText: 'That book is not available at the moment. Try a different one.'});	
		}

		queryString = 'UPDATE books SET borrower = ? WHERE title like ? ORDER BY title LIMIT 1';
		const val = [userid, '%'+title+'%'];

		db.query(queryString, val, (err, rows) => {
			if(err){
				console.log(err);
				return res.json({ fulfillmentText: 'I didn\'t get that. Can you rephrase it?' });
			}

			return res.json({ fulfillmentText: 'You have successfully borrowed the book'});
		});
	});
}

export function returnBook(db, req, res) {
	const title = req.body.queryResult.parameters.title;
	const src = req.body.originalDetectIntentRequest.source;
	var userid;

	if(src === 'facebook') {
		userid = req.body.originalDetectIntentRequest.payload.data.sender.id;
	} else {
		userid = req.body.session;
	}

	var queryString = 'SELECT bookid, title FROM books WHERE title like ? AND borrower = ?';
	const values = ['%'+title+'%', userid];

	db.query(queryString, values, (err, rows) => {
		if(err) {
			console.log(err);
			return res.json({ fulfillmentText: 'I didn\'t get that. Can you rephrase it?' });
		}

		if(!rows.length) {
			return res.json({ fulfillmentText: 'That is not listed in your borrowed books. Can you try again?' });			
		}

		queryString = 'UPDATE books SET borrower = null WHERE bookid = ? ORDER BY title LIMIT 1';

		db.query(queryString, rows[0].bookid, (err,row2) => {
			if(err){
				console.log(err);
				return res.json({ fulfillmentText: 'I didn\'t get that. Can you rephrase it?' });				
			}

			return res.json({ fulfillmentText: 'You have returned '+rows[0].title });
		});
	});
}

export function libraryBooks(db, req, res) {
	var queryString = 'SELECT title, author, category, borrower FROM books';

	db.query(queryString, (err, rows) => {
		if(err){
			console.log(err);
			return res.json({ fulfillmentText: 'I didn\'t get that. Can you rephrase it?' });
		}

		if(!rows.length) {
			return res.json({ fulfillmentText: 'There are no books yet in the library.'});	
		}

		var val;
		var brwr;
		for(var i=0; i<rows.length; i++){
			brwr = (!rows[i].borrower) ? "Available":"Taken";
			val += '\n\nTitle: ' + rows[i].title + '\nAuthor: ' + rows[i].author + '\nCategory: ' + rows[i].category + '\nStatus: ' + brwr;
		}
		return res.json({ fulfillmentText: val });
	});
}
