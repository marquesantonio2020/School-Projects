//All these API endpoints start with /api/tp2
const express = require('express');
const db = require('../../db/tables/Users');

const bodyParser = require('body-parser');

//Router allows to perform different types of request to the database
const router = express.Router();

const urlencondedParser = bodyParser.urlencoded({extended:false});

//Endpoint that performs login by returning an user
router.get('/user/login/:username,:password', async (rq, res, next) =>{
    try{
        let results = await db.login(rq.params.username, rq.params.password);
        res.json(results);
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

//Endpoint that sends data to register a new user
router.post('/user/registration', urlencondedParser,async (rq, res, next) =>{
    try{
        let results = await db.register(rq.body);
        res.json(results);
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

//Endpoint that sends data to write a comment on a show
router.post('/user/writeComment', urlencondedParser,async (rq, res, next) =>{
    try{
        let results = await db.writeComment(rq.body);
        res.json(results);
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

//Endpoint that updates (increases) the like count of a comment
router.put('/user/likeComment/:id', urlencondedParser,async (rq, res, next) =>{
    try{
        let results = await db.likeComment(rq.params.id);
        res.json(results);
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

//Endpoint that updates (decreases) the like count of a comment
router.put('/user/unlikeComment/:id', urlencondedParser,async (rq, res, next) =>{
    try{
        let results = await db.unlikeComment(rq.params.id);
        res.json(results);
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

/** From this point foward all endpoints are to obtain data for charts-------------------------------- */
router.get('/user/type/count', async (rq, res, next) =>{
    try{
        let results = await db.typeCountData();
        res.json(results);
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});


/** -------------------------------------------------------------------------------------------------- */

//Export all the routes(endpoints) available
module.exports = router;