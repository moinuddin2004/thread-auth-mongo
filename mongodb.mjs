import {MongoClient} from 'mongodb'

const uri = "mongodb+srv://syedmoinuddin:moin1234@cluster0.iiql1rp.mongodb.net/?retryWrites=true&w=majority";

const client = new MongoClient(uri);

// async function run() {

//     try {

//         await client.connect();

//         console.log("Successfully connected to Atlas");

//     } catch (err) {

//         console.log(err.stack);

//     }

//     finally {

//         await client.close();
//         console.log("Successfully disconnected");

//     }

// }

// run().catch(console.dir);

export {client};