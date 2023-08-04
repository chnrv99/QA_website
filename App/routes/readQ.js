const { MongoClient } = require("mongodb");
var express = require('express');
var router = express.Router();

var fetch = require('../fetch');

var { GRAPH_ME_ENDPOINT } = require('../authConfig');

// custom middleware to check auth state
function isAuthenticated(req, res, next) {
    if (!req.session.isAuthenticated) {
        return res.redirect('/auth/signin'); // redirect to sign-in route
    }

    next();
};

router.post('/readQ', isAuthenticated, async function (req, res, next) {
    let lim1 = req.body.lim1
    let lim2 = req.body.lim2
    lim1 = parseInt(lim1)
    lim2 = parseInt(lim2)

    let email = req.session.account?.username;

    var url = "mongodb://chnrv:1zuyHVKVqpv8JTuQjg6jEsUTWPJMZmYZR2HTqQs2sI3i6CU08dPYqHqJezjiO1ECAksTcMAWiQLUACDbSuDGOg==@chnrv.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@chnrv@"

    var mongoClient = new MongoClient(url, function (err, client) {
        if (err) {
            console.log("error connecting")
        }
    }
    );

    await mongoClient.connect();

    // connect to the database "products"
    var ProductDatabase = mongoClient.db("products");

    // create a collection "documents" and add one document for "bread"
    var collection = ProductDatabase.collection('documents');






    try {

        // var userDocument = await collection.findOne(query);
        var newDocument = {}
        var newArray = []

        for (i = lim1; i <= lim2; i++) {
            let query = { "_id": email, "questions.sno":i }
            console.log(query)
            var result = await collection.findOne(query)
            var resultq = result.questions[i].question;
            var resulta = result.questions[i].answer;
            newDocument = {
                "sno": i,
                "question": resultq,
                "answer": resulta,
            }
            newArray.push(newDocument)
        }
        console.log('Nested array with limits', newArray)

        res.send(newArray)


        mongoClient.close();



    }
    catch (err) {
        console.error(err)
    }


})




module.exports = router;