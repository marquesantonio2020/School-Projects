//All these API endpoints start with /api/tp2
const bodyParser = require('body-parser');
const express = require('express');
const db = require('../../db/tables/Shows');

//Router allows to perform different types of request to the database
const router = express.Router();

//bodyParser -> allows to send a body of information typical of post requests
const urlencondedParser = bodyParser.urlencoded({extended:false});


//Endpoint that gets all shows created
router.get('/shows', async (rq, res, next) =>{
    try{
        
        let results = await db.all();
        res.json(results);
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});
//Endpoint that gets all shows created
router.get('/shows/no_group', async (rq, res, next) =>{
    try{
        
        let results = await db.allNoGroup();
        res.json(results);
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});


router.get('/shows/names', async (rq, res, next) =>{
    try{
        
        let results = await db.showNames();
        res.json(results);
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

//Endpoint that creates a new show
router.post('/show/new_show', urlencondedParser, async (rq, res, next) =>{
    try{
        let results = await db.newShow(rq.body);
        res.json(results);
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

//Endpoint that updates a show
router.post('/show/update_show', urlencondedParser, async (rq, res, next) =>{
    try{
        let results = await db.updateShow(rq.body);
        res.json(results);
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

//Endpoint that gets a particular show
router.get('/show/:id', async (rq, res, next) =>{
    try{
        let results = await db.one(rq.params.id);
        res.json(results);
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

//Endpoint that gets a show by its name
router.get('/show/name/:name', async (rq, res, next) =>{
    try{
        let results = await db.byName(rq.params.name);
        res.json(results);
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

//Endpoint that gets a show that should be a spotlight regardless of type
router.get('/shows_spotlight', async (rq, res, next) =>{
    try{
        let results = await db.bySpotlight(rq.params.type);
        res.json(results);
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

//Endpoint that gets a show by its type
router.get('/show_spotlight/type/:type', async (rq, res, next) =>{
    try{
        let results = await db.byType_Spotlighted(rq.params.type);
        res.json(results);
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

//Endpoint that gets a show by its type
router.get('/show/type/:type', async (rq, res, next) =>{
    try{
        let results = await db.byType(rq.params.type);
        res.json(results);
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

//Endpoint that gets a show by its name and type
router.get('/show/nameType/:name,:type', async (rq, res, next) =>{
    try{
        let results = await db.byNameType(rq.params.name, rq.params.type);
        res.json(results);
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

//Endpoint that gets a show by its rating
router.get('/show/rating/:rating', async (rq, res, next) =>{
    try{
        let results = await db.byRating(rq.params.rating);
        res.json(results);
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

//Endpoint that gets a show by its name and rating
router.get('/show/nameRating/:name,:rating', async (rq, res, next) =>{
    try{
        let results = await db.byNameRating(rq.params.name, rq.params.rating);
        res.json(results);
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

//Endpoint that gets a shows hour
router.get('/shows/time/:id', async (rq, res, next) =>{
    try{
        let results = await db.showHours(rq.params.id);
        res.json(results);
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});




//Export all the routes(endpoints) available
module.exports = router;