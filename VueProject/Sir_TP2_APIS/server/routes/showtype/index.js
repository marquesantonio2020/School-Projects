//All these API endpoints start with /api/tp2
const express = require('express');
const db = require('../../db/tables/ShowType');

//Router allows to perform different types of request to the database
const router = express.Router();

//Endpoint that return all show types of database
router.get('/types', async (rq, res, next) =>{
    try{
        let results = await db.allTypes();
        res.json(results);
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});
router.get('/type/:type', async (rq, res, next) =>{
    try{
        let results = await db.singleType(rq.params.type);
        res.json(results);
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

//Export all the routes(endpoints) available
module.exports = router;