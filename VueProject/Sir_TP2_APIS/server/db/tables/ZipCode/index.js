const pool = require('../../dbconnection');

let db = {};

db.allZipCodes = () => {
    return new Promise((resolve, reject) => {
       pool.query('Select * from zipcode', (err, results) => {
           if(err){
               return reject(err);
           }
        
           return resolve(results);
       }) 
    })
};

module.exports = db;