const pool = require('../../dbconnection');

let db = {};

db.allRatings = () => {
    return new Promise((resolve, reject) => {
       pool.query('Select * from rating', (err, results) => {
           if(err){
               return reject(err);
           }
        
           return resolve(results);
       }) 
    })
};

db.singleRating = (rating) => {
    return new Promise((resolve, reject) => {
       pool.query('Select * from rating where rating.rating = ?',[rating], (err, results) => {
           if(err){
               return reject(err);
           }
        
           return resolve(results);
       }) 
    })
};

module.exports = db;