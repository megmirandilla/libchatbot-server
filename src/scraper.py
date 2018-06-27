import csv

inserts = open('seed.sql', 'w', encoding='Latin-1')
file = open('dbdata.csv', 'r', encoding='Latin-1')
readCSV = csv.reader(file)

inserts.write('USE librarybot;\n')
for row in readCSV:
	inserts.write('INSERT INTO books(title,author,category) values (' + '"' + row[3].replace('"', '\\"') + '","' + row[4].replace('"', '\\"') + '","' + row[6].replace('"', '\\"') + '");\n')