const { MongoClient } = require('mongodb');

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);
const dbname = 'loginDetails';

async function connect(userid, password) {
    try {
        await client.connect();
        const db = client.db(dbname);
        const collection = db.collection('id_pw');
        const findResult = await collection.find({username: userid, pw: password}).toArray();
        if(findResult.length == 0) return "not found";
        else return findResult;
    }
    catch(e) {
        return "error";
    }
}

async function checkUserExistsElseAddToDatabase(userid, password) {
    try {
        await client.connect();
        const db = client.db(dbname);
        const collection = db.collection('id_pw');
        const findResult = await collection.find({username: userid}).toArray();
        if(findResult.length == 1) return "found";
        else {
            const document = {username: userid, pw: password};
            await collection.insertOne(document);
            return "Inserted";
        }
    }
    catch(e) {
        return "error";
    }
}

module.exports = {connect, checkUserExistsElseAddToDatabase};