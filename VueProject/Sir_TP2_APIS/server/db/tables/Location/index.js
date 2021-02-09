const pool = require('../../dbconnection');

let db = {};

//Returns all locations available
db.allLocations = () => {
    return new Promise((resolve, reject) => {
       pool.query('Select * from location', (err, results) => {
           if(err){
               return reject(err);
           }
        
           return resolve(results);
       }) 
    })
};

db.singleLocation = (location) => {
    return new Promise((resolve, reject) => {
       pool.query('Select * from location WHERE location.building = ?', [location], (err, results) => {
           if(err){
               return reject(err);
           }
        
           return resolve(results);
       }) 
    })
};

module.exports = db;