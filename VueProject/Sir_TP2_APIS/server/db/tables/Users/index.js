/**Requires database connection - Connects to defined database
 * and returns functionalities like querying
*/
const pool = require('../../dbconnection');

/**This file is to write methods that perform queries to on the User table on the selected database */

let db = {};

//Returns an user by its login credentials
db.login = (username,password) => {
    return new Promise((resolve, reject) => {
        console.log(username, password)
       pool.query('Select * from user, zipcode, usertype where user.idZipCode = zipcode.idZipCode AND user.idUserType = usertype.idUserType AND user.username = ? AND user.password = ?', [username,password], (err, results) => {
           if(err){
               return reject(err);
           }

           if(results.length === 0){
            return resolve("Username or password incorrect")
        }
        
           return resolve(results);
       }) 
    })
};

/**Creates a new user on the database. Before it checks if
 * it exists any user with the same username or email inserted
 * if so the user is warned, otherwise the new user is created
 */
db.register = (userData) => {
    return new Promise((resolve, reject) => {
        console.log(userData)
        pool.query('Select * from user where user.email = ? OR user.username = ?',
        [userData.email, userData.username],(err, results) => {
            if(err){
                return reject(err)
            }
            if(results.length > 0){
                return resolve("Username or email already exists")
            }
            pool.query('INSERT INTO user(username,password,name,nif,email,idZipCode,idUserType, image) VALUES(?, ?, ?, ?, ?, ?, ?,?)', 
            [userData.username, userData.password, userData.name, userData.nif, userData.email, userData.idZipCode, userData.idUserType, userData.image], (err, results) => {
           if(err){
               return reject(err);
           }
           return resolve(results);
       })
        })
    })
};

/**Inserts a comment to a given show */
db.writeComment = (commentData) => {
    return new Promise((resolve, reject) => {
        
       pool.query('INSERT INTO comment(comentText, idUser, idReply, idShow) VALUES(?,?,?,?)', 
       [commentData.comentText, commentData.idUser, commentData.idReply, commentData.idShow], (err, results) => {
           if(err){
               return reject(err);
           }
           return resolve(results);
       }) 
    })
};

//Increases like number of comment
db.likeComment = (id) => {
    return new Promise((resolve, reject) => {
        
       pool.query('UPDATE comment SET numberLikes += 1 WHERE idComment = ?', 
       [id], (err, results) => {
           if(err){
               return reject(err);
           }
           return resolve(results);
       }) 
    })
};

//Decreases like number of comment
db.unlikeComment = (id) => {
    return new Promise((resolve, reject) => {
        
       pool.query('UPDATE comment SET numberLikes -= 1 WHERE idComment = ?', 
       [id], (err, results) => {
           if(err){
               return reject(err);
           }
           return resolve(results);
       }) 
    })
};

/** From this point foward all methods return data for charts-------------------------------- */
db.typeCountData = () => {
    return new Promise((resolve, reject) => {
        
       pool.query('SELECT idUserType, COUNT(*) as count FROM sir_tp2.user group by idUserType;', 
        (err, results) => {
           if(err){
               return reject(err);
           }
           return resolve(results);
       }) 
    })
};


/** ------------------------------------------------------------------------------------------ */

//Exports database to give access to all the methods
module.exports = db;