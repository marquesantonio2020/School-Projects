//All these API endpoints start with /api/tp2
const express = require('express');
const db = require('../../db/tables/Purchase_PurchaseLine');

const bodyParser = require('body-parser');

//Router allows to perform different types of request to the database
const router = express.Router();

//bodyParser -> allows to send a body of information typical of post requests
const urlencondedParser = bodyParser.urlencoded({extended:false});

//Endpoint to get purchases from a certain user
router.get('/user/purchase/:id', async (rq, res, next) =>{
    try{
        let results = await db.purchase(rq.params.id);
        res.json(results);
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

router.get('/user/purchaselines/:id', async (rq, res, next) =>{
    try{
        let results = await db.purchaseLines(rq.params.id);
        res.json(results);
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

//Endpoint that sends data to create a new purchase
router.post('/user/purchase/new', urlencondedParser, async (rq, res, next) =>{
    try{
        let results = await db.newPurchase(rq.body);
        res.json(results);
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

//Endpoint that sends data to create a new purchase line
router.post('/user/purchase/newLine', urlencondedParser, async (rq, res, next) =>{
    try{
        let results = await db.newPurchaseLine(rq.body);
        res.json(results);
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

//Endpoint to get all temporary purchase lines from a certain user
router.get('/user/purchase/getTempLine/:id', async (rq, res, next) =>{
    try{
        let results = await db.getTempPurchase(rq.params.id);
        res.json(results);
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

//Endpoint that sends data to create a new temporary line
router.post('/user/purchase/newTempLine', urlencondedParser, async (rq, res, next) =>{
    try{
        let results = await db.newTempPurchaseLine(rq.body);
        res.json(results);
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

//Endpoint that deletes a single line from temporary table
router.post('/user/purchase/deleteTempLine', urlencondedParser, async (rq, res, next) =>{
    try{
        let results = await db.deleteTempLine(rq.body);
        res.json(results);
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

//Endpoint that deletes all lines from temporary table.
router.post('/user/purchase/deleteAllLines', urlencondedParser, async (rq, res, next) =>{
    try{
        let results = await db.deleteAllLines(rq.body);
        res.json(results);
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

//Endpoint that sends data to create a new purchase line
router.post('/user/purchase/newPurchaseLineAll', urlencondedParser, async (rq, res, next) =>{
    try{
        let results = await db.newPurchaseLineAll(rq.body);
        res.json(results);
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

//Endpoint that sends data to create a new purchase
router.post('/user/purchase/newPurchaseAll', urlencondedParser, async (rq, res, next) =>{
    try{
        let results = await db.newPurchaseAll(rq.body);
        res.json(results);
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

//Endpoint that sends data to create a new purchase
router.post('/user/purchase/update_purchase_templine', urlencondedParser, async (rq, res, next) =>{
    try{
        let results = await db.updatePurchaseTempline(rq.body);
        res.json(results);
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
});

/** From this point foward all endpoints are to obtain data for charts-------------------------------- */
router.get('/purchase/count/byYear/:year', async (rq, res, next) =>{
    try{
        console.log("here")
        let results = await db.countByYear(rq.params.year);
        res.json(results);
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
  });
router.get('/purchase/count/byYearMonth/:year,:month', async (rq, res, next) =>{
    try{
        
        let results = await db.countByYearMonth(rq.params.year, rq.params.month);
        res.json(results);
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
  });
router.get('/purchase/count/byBetweenMonths/:years1,:years2', async (rq, res, next) =>{
    try{
        let results = await db.countBetweenMonths(rq.params.years1, rq.params.years2);
        res.json(results);
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
  });

  router.get('/purchase/count/byTypeYear/:year', async (rq, res, next) =>{
    try{
        let results = await db.countByTypeYear(rq.params.year);
        res.json(results);
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
  });
  router.get('/purchase/count/byTypeCompare/:year1,:year2', async (rq, res, next) =>{
    try{
        let results = await db.countByTypeCompare(rq.params.year1, rq.params.year2);
        res.json(results);
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
  });
  router.get('/purchase/count/earns_yearly/:year1,:year2', async (rq, res, next) =>{
    try{
        let results = await db.countEarnsYearly(rq.params.year1, rq.params.year2);
        res.json(results);
    } catch(e){
        console.log(e);
        res.sendStatus(500);
    }
  });
  /** -------------------------------------------------------------------------------------------------- */




//Export all the routes(endpoints) available
module.exports = router;