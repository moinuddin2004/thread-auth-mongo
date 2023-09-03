
import express from 'express';
import { nanoid } from 'nanoid'
import {client} from './../mongodb.mjs'
import { ObjectId } from 'mongodb';
let router = express.Router();
const dbName = "CRUD-DB";
const db = client.db(dbName);
const col = db.collection("posts");

// not recommended at all - server should be stateless
// let posts = [
//     {
//         id: nanoid(),
//         title: "express()",
//         text: "By Sir Inzamam Malik"
//     }
// ]

// POST    /api/v1/post
router.post('/post', async (req, res, next) => {
    console.log('This is create post request', new Date());

    if (
        (req.body.title.trim().length == 0) || (req.body.text.trim().length == 0)
    ) {
        res.status(403);
        res.send(`required parameters missing, 
        example request body:
        {
            title: "abc post title",
            text: "some post text"
        } `);
        return;
    }

    // posts.push({
    //     id: nanoid(),
    //     title: req.body.title,
    //     text: req.body.text,
    // })

    try{
                await client.connect();
                console.log("Connected to Atlas");
                let personDocument = {

                    id: nanoid(),
                    title: req.body.title,
                    text: req.body.text,

                };

                const p = await col.insertOne(personDocument);

                res.send('Post created');

                await client.close();
                console.log("Disconnected Atlas");


        }


        catch(err){

            console.log('Error in posting');
            res.send('Error Not Found: ' + err.message);
            
             }
})
// GET     /api/v1/posts
router.get('/posts', async(req, res, next) => {
    console.log('This is all posts request!', new Date());
    // res.send(posts);
    try {
            await client.connect();
            console.log("Connected to Atlas");
            const cursor = col.find({});
            let results = await cursor.toArray()
            console.log("results: ", results);
            res.send(results);
            await client.close();
            console.log("Disconnected Atlas");
    }
    catch{

        console.log('Error in getting posts');
        res.status(404).send("Error in getting post")
        
         }
})

// GET     /api/v1/post/:postId
router.get('/post/:postId', async(req, res, next) => {
    console.log('this is specific post request!', new Date());

    if (!req.params.postId) {
        res.status(403).send(`post id must be a valid number, no alphabet is allowed in post id`)
    }

    try{
        await client.connect();
        const filter = { _id: new ObjectId(req.params.postId) };
        const myDoc = await col.findOne(filter);
        res.send(myDoc);
        console.log("Found: ", myDoc, " with id: ", req.params.postId);
        await client.close();


    }
    catch(err){

        console.log('Error in getting posts');
        res.status(404).send("Error in getting post")
        await client.close();

    }

    
})

// PUT     /api/v1/post/:userId/:postId
router.put('/post/edit/:postId', async (req, res, next) => {
    console.log('This is edit! request', new Date());
    if (
        (req.body.title.trim().length == 0) || (req.body.text.trim().length == 0) ) {
        res.status(403);
        res.send(`required parameters missing, 
        example request body:
        {
            title: "abc post title",
            text: "some post text"
        } `);
        return;
    }
    // posts.forEach(post => {

    //     if(post.id === req.params.postId){
    //         post.title = req.body.title;
    //         post.text = req.body.text;
            
    //         return
    //     }

    // });

 try{
            await client.connect();
            console.log("Connected Atlas");
            const filter = { _id: new ObjectId(req.params.postId) };
            const updateDoc = {

                $set: {
        
                title: req.body.title,
                text: req.body.text
        
                },
        
            };
            const result = await col.updateOne(filter, updateDoc);

            res.send('Post Edited successfully');
            await client.close();
            console.log("Disconnected Atlas");
    }
    catch (err){

        console.log(err);
        res.send('Error Not Found: ' + err);


    }
})
// DELETE  /api/v1/post/:userId/:postId
router.delete('/post/delete/:postId', async (req, res, next) => {
    console.log('This is delete! request', new Date());

    // posts.forEach((post, index) => {

    //     if (post.id === req.params.postId) {

    //         posts.splice(index, 1);

    //         return

    //     }

    // })

    try{

        await client.connect();
        console.log("Connected Atlas");

        const query = { _id: new ObjectId(req.params.postId)};

        const result = await col.deleteOne(query);

        if (result.deletedCount === 1) {

            console.log("Successfully deleted one document.");
      
          } else {
      
            console.log("No documents matched the query. Deleted 0 documents.");
      
            }


        await client.close();
        console.log("Disconnected Atlas");

    res.send('Post deleted successfully');


    }


    catch (err) {

        res.send('Error Not Found: ' + err.message);
    }
    
    
})

router.post('/authenticate', async (req, res, next) => {

    res.status(200).send({success: true});

});

export default router