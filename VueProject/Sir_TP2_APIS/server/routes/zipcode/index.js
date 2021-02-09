const express = require('express');
const db = require('../../db/tables/ZipCode');

const router = express.Router();

router.get('/zipcode', async (rq, res, next) =>{
    try{
        let results = await db.allZipCodes();
        res.json(results);
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

module.exports = router;