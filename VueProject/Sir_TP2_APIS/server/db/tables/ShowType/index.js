/**Requires database connection - Connects to defined database
 * and returns functionalities like querying
*/
const pool = require('../../dbconnection');

/**This file is to write methods that perform queries to on the ShowType table on the selected database */

let db = {};

//Return show types
db.allTypes = () => {
    return new Promise((resolve, reject) => {
        pool.query("Select * from showtype",(err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
};

db.singleType = (type) => {
    return new Promise((resolve, reject) => {
        pool.query("Select * from showtype WHERE showtype.type = ?", [type],(err, results) => {
            if (err) {
                return reject(err);
            }
            return resolve(results);
        })
    })
};

//Exports database to give access to all the methods
module.exports = db;