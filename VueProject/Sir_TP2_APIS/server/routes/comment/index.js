//All these API endpoints start with /api/tp2
const express = require('express');
const db = require('../../db/tables/Comment');

const bodyParser = require('body-parser');

//Router allows to perform different types of request to the database
const router = express.Router();

//bodyParser -> allows to send a body of information typical of post requests
const urlencondedParser = bodyParser.urlencoded({extended:false});

//Endpoint to get all comments of certain show
router.get('/shows/comments/:id', async (rq, res, next) =>{
    try{
        let results = await db.allComments(rq.params.id);
        res.json(results);
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

//Endpoint that creates a new comment for a show
router.post('/shows/comments/new_comment', urlencondedParser, async (rq, res, next) =>{
    try{
        let results = await db.newComment(rq.body);
        res.json(results);
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

//Export all the routes(endpoints) available
module.exports = router;