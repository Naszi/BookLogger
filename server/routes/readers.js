/** Ebböl a modulból csak az összes olvasó működik
 *  a weboldalon nem lett megvalósítva
 * a kód valószinüleg jó, hiszen a könyveknél jól működik
 */

var express = require('express');
var fs = require('fs');
var datafile = 'server/data/readers.json';
var router = express.Router();

/**  GET - visszaadja az összes olvasót,
    POST - velveszi egy új olvasót */
router.route('/')
    .get(function(req, res) {
        var data = getReaderData();
        res.send(data);
    })

    .post(function(req, res) {

        var data = getReaderData(); // Meghívom a getReaderData() függvényt, ami visszatér a 'readers.json' tartalmával
        var nextID = getNextAvailableID(data); // Ezzel a függvény hívással megkapom a következő 'id'-t

        var newReader = {
            reader_id: nextID,
            name: req.body.name,
            weeklyReadingGoal: req.body.weeklyReadingGoal,
            totalMinutesRead: req.body.totalMinutesRead
        };

        data.push(newReader);

        saveReaderData(data); // Meghívom a saveReaderData() függvényt, ami hozzá adja az új olvasót a 'readers.json' tartalmához

        res.status(201).send(newReader);
    });


/**  GET - a paraméterben megadot 'id' alapján keresi az olvasót
    PUT - az 'id' alapján megtalált olvasót updeteli
    DELETE - az 'id' alapján megtalált olvasót törli */
router.route('/:id')

    .get(function(req, res) {

        var data = getReaderData();

        var matchingReaders = data.filter(function(item) {
            return item.reader_id == req.params.id;
        });

        if(matchingReaders.length === 0) {
            res.sendStatus(404);
        } else {
            res.send(matchingReaders[0]);
        }
    })

    .delete(function(req, res) {

        var data = getReaderData();

        var pos = data.map(function(e) {
            return e.reader_id;
        }).indexOf(parseInt(req.params.id, 10));

        if (pos > -1) {
            data.splice(pos, 1);
        } else {
            res.sendStatus(404);
        }

        saveReaderData(data);
        res.sendStatus(204);

    })

    .put(function(req, res) {

        var data = getReaderData();

        var matchingReaders = data.filter(function(item) {
            return item.reader_id == req.params.id;
        });

        if(matchingReaders.length === 0) {
            res.sendStatus(404);
        } else {

            var readerToUpdate = matchingReaders[0];
            readerToUpdate.name = req.body.name;
            readerToUpdate.weeklyReadingGoal = req.body.weeklyReadingGoal;
            readerToUpdate.totalMinutesRead = req.body.totalMinutesRead;

            saveReaderData(data);
            res.sendStatus(204);

        }
    });

/**  Ezzel a függvénnyel a következő
    elérhető 'id'-t kapom meg */
function getNextAvailableID(allReaders) {

    var maxID = 0;

    allReaders.forEach(function(element, index, array) {

        if(element.reader_id > maxID) {
            maxID = element.reader_id;
        }

    });

    return ++maxID;

}

/**  Ennek a függvénynek a segítségével visszakapom a 'readers.json' tartalmát */
function getReaderData() {
    var data = fs.readFileSync(datafile, 'utf8');
    return JSON.parse(data);
}

/**  Ennek a függvénynek a segítségével elmentem a 'readers.json' tartalmát */
function saveReaderData(data) {
    fs.writeFile(datafile, JSON.stringify(data, null, 4), function (err) {
        if (err) {
            console.log(err);
        }
    });
}

module.exports = router;
