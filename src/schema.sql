DROP DATABASE IF EXISTS librarybot;
CREATE DATABASE librarybot;

USE librarybot;

CREATE TABLE user (
	userid VARCHAR(256) NOT NULL PRIMARY KEY
);

CREATE TABLE books (
	bookid VARCHAR(256) NOT NULL,
	author VARCHAR(256) NOT NULL,
	title VARCHAR(256) NOT NULL,
	category VARCHAR(256) NOT NULL,
	borrower VARCHAR(256)
);

-- PROCEDURES

DROP PROCEDURE IF EXISTS addUser;
DELIMITER $$
CREATE PROCEDURE addUser(
	IN userid VARCHAR(256)
)
BEGIN
	INSERT INTO user
	VALUES (
		userid
	);
END;
$$
DELIMITER ;

DROP PROCEDURE IF EXISTS addBook;
DELIMITER $$
CREATE PROCEDURE addBook(
	IN bookid VARCHAR(256),
	IN author VARCHAR(256),
	IN title VARCHAR(256),
	IN category VARCHAR(256),
	IN borrower VARCHAR(256)
)
BEGIN
	INSERT INTO books
	VALUES (
		bookid,
		author,
		title,
		category,
		borrower
	);
END;
$$
DELIMITER ;

