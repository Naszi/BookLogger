var express = require('express');
var fs = require('fs');
var datafile = 'server/data/books.json';
var router = express.Router();

/*  GET - visszaadja az összes könyvet,
    POST - felveszi az új könyveket */
router.route('/')
    .get(function(req, res) {
        var data = getBookData();
        res.send(data);
    })

    .post(function(req, res) {

        var data = getBookData(); // Meghívom a getBookData() függvényt, ami visszatér a 'books.json' tartalmával
        var nextID = getNextAvailableID(data); // Ezzel a függvény hívással megkapom a következő 'id'-t 

        var newBook = {
            book_id: nextID,
            title: req.body.title,
            author: req.body.author,
            year_published: req.body.year_published
        };

        data.push(newBook);

        saveBookData(data); // Meghívom a saveBookData() függvényt, ami hozzá adja az új könyvet a 'books.json' tartalmához

        res.status(201).send(newBook);
    });


/*  GET - a paraméterben megadot 'id' alapján keresi a könyvet
    PUT - az 'id' alapján megtalált könyvet updeteli
    DELETE - az 'id' alapján megtalált könyvet törli */
router.route('/:id')

    .get(function(req, res) {

        var data = getBookData();

        var matchingBooks = data.filter(function(item) {
            return item.book_id == req.params.id;
        });

        if(matchingBooks.length === 0) {
            res.sendStatus(404);
        } else {
            res.send(matchingBooks[0]);
        }
    })

    .delete(function(req, res) {

        var data = getBookData();

        var pos = data.map(function(e) {
            return e.book_id;
        }).indexOf(parseInt(req.params.id, 10));

        if (pos > -1) {
            data.splice(pos, 1);
        } else {
            res.sendStatus(404);
        }

        saveBookData(data);
        res.sendStatus(204);

    })

    .put(function(req, res) {

        var data = getBookData();

        var matchingBooks = data.filter(function(item) {
            return item.book_id == req.params.id;
        });

        if(matchingBooks.length === 0) {
            res.sendStatus(404);
        } else {

            var bookToUpdate = matchingBooks[0];
            bookToUpdate.title = req.body.title;
            bookToUpdate.author = req.body.author;
            bookToUpdate.year_published = req.body.year_published;

            saveBookData(data);
            res.sendStatus(204);

        }
    });

/*  Ezzel a függvénnyel a következő
    elérhető 'id'-t kapom meg */
function getNextAvailableID(allBooks) {

    var maxID = 0;

    allBooks.forEach(function(element, index, array) {

        if(element.book_id > maxID) {
            maxID = element.book_id;
        }

    });

    return ++maxID;

}

/*  Ennek a függvénynek a segítségével visszakapom a 'books.json' tartalmát */
function getBookData() {
    var data = fs.readFileSync(datafile, 'utf8');
    return JSON.parse(data);
}

/*  Ennek a függvénynek a segítségével elmentem a 'books.json' tartalmát */
function saveBookData(data) {
    fs.writeFile(datafile, JSON.stringify(data, null, 4), function (err) {
        if (err) {
            console.log(err);
        }
    });
}

module.exports = router;
