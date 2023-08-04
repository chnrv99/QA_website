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

router.post('/deleteQ', isAuthenticated, async function (req, res, next) {
    let questionNo1 = req.body.questionNo;
    questionNo1 = parseInt(questionNo1)
    // let answer1 = req.body.answer;
    let email = req.session.account?.username;

    var url = "mongodb://chnrv:1zuyHVKVqpv8JTuQjg6jEsUTWPJMZmYZR2HTqQs2sI3i6CU08dPYqHqJezjiO1ECAksTcMAWiQLUACDbSuDGOg==@chnrv.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@chnrv@"
    // Remember to replace below "YourAzureCosmosDBAccount" with the name of your Azure Cosmos DB 
    // account name and "YourAzureCosmosDBAccountKEY" with the Azure Cosmos DB account key.
    // define the connection using the MongoClient method ane the url above
    // define the connection using the MongoClient method ane the url above
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


    var query = { _id: email };

 
    
    try {
        
        
        const query = { _id: email };
        
        // Use the $pull operator to remove the nested entry from the "hobbies" array
        const update = { $pull: { questions: { sno: questionNo1 } } };
        
        // Update the document to delete the nested entry
        const result = await collection.updateOne(query, update);
        console.log(result)

        res.send('question deleted successfully')
        mongoClient.close();
        
        
    }
    catch(err){
        console.error(err)
    }


})




module.exports = router;