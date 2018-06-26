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

			var val;
			for(var i=0; i<rows.length; i++){
				val += '\n\nTitle: ' + rows[i].title + '\nAuthor: ' + rows[i].author + '\nCategory: ' + rows[i].category + '\nBorrower: ' + rows[i].borrower
			}

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
		for(var i=0; i<rows.length; i++){
			val += '\n\nTitle: ' + rows[i].title + '\nAuthor: ' + rows[i].author + '\nCategory: ' + rows[i].category + '\nBorrower: ' + rows[i].borrower
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
		for(var i=0; i<rows.length; i++){
			val += '\n\nTitle: ' + rows[i].title + '\nAuthor: ' + rows[i].author + '\nCategory: ' + rows[i].category + '\nBorrower: ' + rows[i].borrower
		}

		return res.json({ fulfillmentText: val });
	});
}

export function borrowBook(db, req, res) {
	const title = req.body.queryResult.parameters.title;
	const user = req.body.session;
	var queryString = 'SELECT borrower FROM books WHERE title like ?';

	db.query(queryString, '%'+title+'%', (err, rows) => {
		if(err){
			console.log(err);
			return res.json({ fulfillmentText: 'I didn\'t get that. Can you rephrase it?' });			
		}

		if(!rows.length) {
			return res.json({ fulfillmentText: 'There is no book matching that description. Please try again.'});	
		}

		if(rows[0].borrower){
			return res.json({ fulfillmentText: 'That book is not available at the moment. Try a different one.'});	
		}

		queryString = 'UPDATE books SET borrower = ? WHERE title like ? ORDER BY title LIMIT 1';
		const val = [usesr, title];

		db.query(queryString, val, (err, rows) => {
			if(err){
				console.log(err);
				return res.json({ fulfillmentText: 'I didn\'t get that. Can you rephrase it?' });
			}

			return res.json({ fulfillmentText: 'You have successfully borrowed the book.' });						
		});
	});
}

export function returnBook(db, req, res) {
	const title = req.body.queryResult.parameters.title;
	const user = req.body.session;
	var queryString = 'SELECT bookid, title FROM books WHERE title like ? AND borrower = ?';
	const values = ['%'+title+'%', user];

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
		for(var i=0; i<rows.length; i++){
			val += '\n\nTitle: ' + rows[i].title + '\nAuthor: ' + rows[i].author + '\nCategory: ' + rows[i].category + '\nBorrower: ' + rows[i].borrower
		}

		return res.json({ fulfillmentText: val });
	});
}

export function addUser(db, req, res) {
	return new Promise((resolve, reject) => {
		var userid = req.body.session;
		var queryString = 'SELECT userid FROM user WHERE userid = ?';

		db.query(queryString, userid, (err, rows) => {
			if(err) {
				console.log(err);
				return reject();
			} else {
				if(!rows.length) {
					queryString = 'INSERT INTO user VALUES (?)';

					db.query(queryString, userid, (err, rows) => {
						if(err){
							console.log(err);
							return reject();
						} else {
							return resolve();
						}
					});
				} else {
					return resolve();
				}
			}
		});
	});
}