require('dotenv').config()
const { MongoClient } = require('mongodb');

const url = `mongodb+srv://shivang-negi:${process.env.password}@userdb.8xasm7v.mongodb.net/?retryWrites=true&w=majority`;
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
        console.log(e);
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
        console.log(e);
        return "error";
    }
}

module.exports = {connect, checkUserExistsElseAddToDatabase};