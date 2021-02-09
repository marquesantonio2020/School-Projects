const express = require('express');
const db = require('../../db/tables/Rating');

const router = express.Router();

//Endpoint that returns all rating available
router.get('/ratings', async (rq, res, next) =>{
    try{
        let results = await db.allRatings();
        res.json(results);
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

router.get('/rating/:rating', async (rq, res, next) =>{
    try{
        let param = rq.params.rating.replace('%2F', '/')
        let results = await db.singleRating(param);
        res.json(results);
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = router;