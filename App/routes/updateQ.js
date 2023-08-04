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

router.post('/updateQ', isAuthenticated, async function (req, res, next) {
    let sno = req.body.sno
    // let question1 = req.body.question;
    sno = parseInt(sno)
    let answer1 = req.body.answer;
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

    try{
        let query = { _id: email, "questions.sno": sno };
        let update = { $set: { "questions.$[elem].answer": answer1}}
        const arrayFilters = [{ "elem.sno": sno }];
        const result = await collection.updateOne(query, update, { arrayFilters });
        console.log(result);

        res.send('Question updated successfully')
        mongoClient.close();

    }
    catch(err){
        console.error(err)
    }


    


})

// async function main() {

//     // We will discuss connection string in more detail in the next unit of this module.
//     var url = "mongodb://chnrv:1zuyHVKVqpv8JTuQjg6jEsUTWPJMZmYZR2HTqQs2sI3i6CU08dPYqHqJezjiO1ECAksTcMAWiQLUACDbSuDGOg==@chnrv.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@chnrv@"
//     // Remember to replace below "YourAzureCosmosDBAccount" with the name of your Azure Cosmos DB 
//     // account name and "YourAzureCosmosDBAccountKEY" with the Azure Cosmos DB account key.
//     // define the connection using the MongoClient method ane the url above
//     // define the connection using the MongoClient method ane the url above
//     var mongoClient = new MongoClient(url, function (err, client) {
//         if (err) {
//             console.log("error connecting")
//         }
//     }
//     );

//     // open the connection
//     await mongoClient.connect();

//     // connect to the database "products"
//     var ProductDatabase = mongoClient.db("products");

//     // create a collection "documents" and add one document for "bread"
//     var collection = ProductDatabase.collection('documents');
//     var insertResult = await collection.insertOne({ ProductId: 1, name: "bread" });

//     // return data where ProductId = 1
//     const findProduct = await collection.find({ ProductId: 1 });
//     await findProduct.forEach(console.log);

//     // close the connection
//     mongoClient.close();
// }

// main();

module.exports = router;