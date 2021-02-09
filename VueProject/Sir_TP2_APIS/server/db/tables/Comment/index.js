/**Requires database connection - Connects to defined database
 * and returns functionalities like querying
 */
const pool = require('../../dbconnection')

/**This file is to write methods that perform queries to on the Comment table on the selected database */

let db = {}

//Return all comments for a certain show
db.allComments = id => {
  return new Promise((resolve, reject) => {
    pool.query(
      'SELECT * FROM comment, user WHERE comment.idUser=user.idUser and comment.idShow = ? ORDER BY date DESC',
      [id],
      (err, results) => {
        if (err) {
          return reject(err)
        }
        return resolve(results)
      }
    )
  })
}

//Create a new comment for a show
db.newComment = (commentData) => {
  return new Promise((resolve, reject) => {
    pool.query(
      'Insert Into comment(commentText,rating,idUser,idShow,date,hour) VALUES(?, ?, ?, ?, CURDATE(), CURTIME())',
      [
        commentData.commentText,
        commentData.rating,
        commentData.idUser,
        commentData.idShow
      ],
      (err, results) => {
        if (err) {
          return reject(err)
        }
        pool.query(
          'SELECT avg(rating) as "media" FROM comment where idShow=?',
          [commentData.idShow],
          (err, results) => {
            if (err) {
              return reject(err)
            }
            pool.query('Update shows set valueRating=? where idShow=?',
                    [results[0].media, commentData.idShow],
                    (err, results) => {
                        if (err) {
                            return reject(err)
                        }
                        return resolve(results)
                    })
          }
        )


      }
    )
  })
}

//Exports database to give access to all the methods
module.exports = db
