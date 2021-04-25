import { Collection, Db, MongoClient } from 'mongodb';

const uri = process.env.MONGODB_ATLAS_URI;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
const dbName = process.env.MONGODB_NAME;
const connection = client.connect();

async function getDb(): Promise<Db> {
    return await connection.then(client => client.db(dbName))
        .catch(err => {
            console.log(err);
            return err;
        });
}

const buildingsCollection: Promise<Collection> = getDb().then(db => db.collection('buildings'));


export default { buildingsCollection };