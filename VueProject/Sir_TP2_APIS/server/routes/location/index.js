const express = require('express');
const db = require('../../db/tables/Location');

const router = express.Router();

//Endpoint that returns all locations
router.get('/locations', async (rq, res, next) =>{
    try{
        let results = await db.allLocations();
        res.json(results);
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});
router.get('/location/:location', async (rq, res, next) =>{
    try{
        let results = await db.singleLocation(rq.params.location);
        res.json(results);
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = router;