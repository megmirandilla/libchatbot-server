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