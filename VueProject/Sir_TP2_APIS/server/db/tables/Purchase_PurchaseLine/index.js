/**Requires database connection - Connects to defined database
 * and returns functionalities like querying
 */
const pool = require('../../dbconnection')

let db = {}

/**This file is to write methods that perform queries to on the Purchase, PurchaseLine and Temp_PurchaseLin table on the selected database */

//Selects a single purchase matching the given id
db.purchase = id => {
  return new Promise((resolve, reject) => {
    pool.query(
      'SELECT * FROM purchase WHERE purchase.idUser = ? ',
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

db.purchaseLines = id => {
  return new Promise((resolve, reject) => {
    pool.query(
      'SELECT * FROM purchase, purchaseline, shows, showtype, rating, dates WHERE purchaseline.idPurchase = ? AND purchaseline.idPurchase = purchase.idPurchase AND purchaseline.idShow = shows.idShow AND purchaseline.idDate = dates.idDate AND shows.idRating = rating.idRating AND shows.idShowType = showtype.idShowType',
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


/**Creates a new temporary purchase line
 * If a temporary purchase line with certain show, date and user id already
 * exists it updates that table.
 * Otherwise it creates a new one. This table is to old temporarily data about
 * the user's shopping cart. When the shopping cart is confirmed the data on this
 * table is placed into purchaseline table
 */
db.newTempPurchaseLine = lineData => {
  console.log(lineData)
  return new Promise((resolve, reject) => {
    pool.query(
      'SELECT * FROM temp_purchaseline WHERE temp_purchaseline.idShow = ? AND temp_purchaseline.idDate = ? AND temp_purchaseline.idUser = ?',
      [lineData.idShow, lineData.idDate, lineData.idUser],
      (err, results) => {
        if (err) {
          return reject(err)
        }
        if (results.length > 0) {
          console.log('here')
          pool.query(
            'UPDATE temp_purchaseline SET temp_purchaseline.quantity = temp_purchaseline.quantity + ?, temp_purchaseline.subtotal = temp_purchaseline.subtotal + ? WHERE temp_purchaseline.idShow = ? AND temp_purchaseline.idDate = ? AND temp_purchaseline.idUser = ?',
            [
              lineData.quantity,
              lineData.subtotal,
              lineData.idShow,
              lineData.idDate,
              lineData.idUser
            ],
            (err, results) => {
              if (err) {
                return reject(err)
              }

              return resolve('Ticket added to the shopping cart successfully')
            }
          )
        } else {
          pool.query(
            'INSERT INTO temp_purchaseline(idShow, idUser, quantity, subtotal, idDate) VALUES(?,?,?,?,?)',
            [
              lineData.idShow,
              lineData.idUser,
              lineData.quantity,
              lineData.subtotal,
              lineData.idDate
            ],
            (err, results) => {
              if (err) {
                return reject(err)
              }
              return resolve('Ticket added to the shopping cart successfully')
            }
          )
        }
      }
    )
  })
}

//Selects a certain temporary purchase line

db.getTempPurchase = idUser => {
  return new Promise((resolve, reject) => {
    pool.query(
      'SELECT * FROM shows, dates, temp_purchaseline WHERE temp_purchaseline.idUser = ? AND temp_purchaseline.idShow=shows.idShow AND temp_purchaseline.idDate=dates.idDate',
      [idUser],
      (err, results) => {
        if (err) {
          return reject(err)
        }

        return resolve(results)
      }
    )
  })
}

//Deletes a single line from temporary table
db.deleteTempLine = id => {
  return new Promise((resolve, reject) => {
    pool.query(
      'DELETE FROM temp_purchaseline WHERE temp_purchaseline.idShow=? AND temp_purchaseline.idUser=? AND temp_purchaseline.idDate = ? ',
      [id.idShow, id.idUser, id.idDate],
      (err, results) => {
        if (err) {
          return reject(err)
        }
        return resolve(results)
      }
    )
  })
}

//Deletes all lines from temporary table
db.deleteAllLines = id => {
  return new Promise((resolve, reject) => {
    pool.query(
      'DELETE FROM temp_purchaseline WHERE temp_purchaseline.idUser = ?',
      [id.idUser],
      (err, results) => {
        if (err) {
          return reject(err)
        }
        return resolve(results)
      }
    )
  })
}

db.newPurchase = purchaseData => {
  return new Promise((resolve, reject) => {
    pool.query(
      'SELECT * FROM purchase WHERE purchase.idUser = ? AND purchase.purchaseState = 1',
      [purchaseData.idUser],
      (err, results) => {
        if (err) {
          return reject(err)
        }
        if (results.length === 0) {
          pool.query(
            'INSERT INTO purchase(purchaseDate, purchaseState, Payed, idUser) VALUES(CURTIME(),1,0,?)',
            [purchaseData.idUser],
            (err, results) => {
              if (err) {
                return reject(err)
              }
              pool.query(
                'SELECT * FROM purchase WHERE purchase.idUser = ? AND purchase.purchaseState = 1',
                [purchaseData.idUser],
                (err, results) => {
                  if (err) {
                    return reject(err)
                  }
                  return resolve(results)
                }
              )
            }
          )
        }
        return resolve(results)
      }
    )
  })
}


db.updatePurchaseTempline = lineData => {
  return new Promise((resolve, reject) => {
    pool.query(
            'UPDATE temp_purchaseline SET quantity = ?, subTotal = ? * ? WHERE temp_purchaseline.idShow=? AND temp_purchaseline.idUser = ? AND temp_purchaseline.idDate = ?',
            [
              lineData.quantity,
              lineData.price,
              lineData.quantity,
              lineData.idShow,
              lineData.idUser,
              lineData.idDate,
            ],
            (err, results) => {
              if (err) {
                return reject(err)
              }
              return resolve(results)
            }
          )
        } )
      };
/**Creates a new purchase for the user
 * Is created when the user confirms the purchase
 * on the shopping cart
 */

db.newPurchaseLine = lineData => {
  return new Promise((resolve, reject) => {
    //check if line with selected product already exists.
    pool.query(
      'SELECT * FROM purchaseline WHERE shows.idShow = purchaseline.idShow AND purchaseline.idShow = ? AND shows.purchaseState = 1',
      [lineData.idShow],
      (err, results) => {
        if (err) {
          return reject(err)
        }
        if (results.length > 0) {
          pool.query(
            'UPDATE purchaseline SET quantity += ? AND subTotal += ? * ? WHERE shows.idShow = purchaseline.idShow AND purchaseline.idShow = ? AND shows.purchaseState = 1',
            [
              lineData.quantity,
              lineData.quantity,
              lineData.subTotal,
              lineData.idShow
            ],
            (err, results) => {
              if (err) {
                return reject(err)
              }
              return resolve(results)
            }
          )
        } else {
          pool.query(
            'INSERT INTO purchaseline(idShow, idPurchase, quantity, subTotal, idDate) VALUES(?, ?, ?, ?,?)',
            [
              lineData.idShow,
              lineData.idPurchase,
              lineData.quantity,
              lineData.quantity * lineData.subTotal,
              lineData.idDate
            ],
            (err, results) => {
              if (err) {
                return reject(err)
              }
              return resolve(results)
            }
          )
        }
      }
    )
  })
}

//Deletes all temporary purchase lines when the user finalizes the purchase
db.deleteLine = id => {
  return new Promise((resolve, reject) => {
    pool.query(
      'DELETE FROM purchaseline WHERE shows.idShow = purchaseline.idShow AND purchaseline.idShow = ? AND shows.purchaseState = 1 ',
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

db.newPurchaseAll = purchaseData => {
  return new Promise((resolve, reject) => {
    pool.query(
      'INSERT INTO purchase(purchaseDate, purchaseState, totalPayed, idUser) VALUES( NOW(),1,0,?)',
      [purchaseData.idUser],
      (err, results) => {
        if (err) {
          return reject(err)
        }
        return resolve(results)
      }
    )
  })
}
/**Creates a number of purchase lines equals to the one existing on the temporary table */
db.newPurchaseLineAll = (lineData) => {
  return new Promise((resolve, reject) => {
    pool.query(
      'SELECT * FROM purchase WHERE purchase.idUser = ? and purchase.purchaseState = 1',
      [lineData.idUser],
      (err, results) => {
        if (err) {
          return reject(err)
        } else {
            lineData.shops.map((item) => {
                pool.query('INSERT INTO purchaseline(idShow, idPurchase, quantity, subTotal, idDate) VALUES(?, ?, ?, ?, ?)',
                [item.idShow, results[0].idPurchase, item.quantity, item.quantity * item.price, item.idDate],
                (err, results) => {
                    if (err) {
                        return reject(err)
                    }
                    pool.query(
                      'UPDATE shows SET availableTickets=? where idShow=?',
                      [
                          item.availableTickets - item.quantity,
                          item.idShow
                      ],
                      (err, results) => {
                        if (err) {
                          return reject(err)
                        }
                      }
                    )

                })
            });
            
            pool.query(
                'UPDATE purchase SET purchaseState=0, totalPayed=?, idPaymentMethod=? where idPurchase=?',
                [
                    lineData.total,
                    lineData.idPaymentMethod,
                    results[0].idPurchase
                ],
                (err, results) => {
                  if (err) {
                    return reject(err)
                  }
                  return resolve(results)
                }
              )
        }
      }
    )
  })
}

/** From this point foward all methods return data for charts-------------------------------- */
db.countByYear = (year) => {
  //Gets sales by year
  return new Promise((resolve, reject) => {
      
     pool.query('SELECT COUNT(*) as count, month(str_to_date(purchaseDate, "%Y-%m-%d")) as date from sir_tp2.purchase where year(str_to_date(purchaseDate, "%Y-%m-%d")) = ? group by date ;  ',
     [year], 
      (err, results) => {
         if(err){
             return reject(err);
         }
         return resolve(results);
     }) 
  })
};

db.countByYearMonth = (year, month) => {
  //Get sales by month from a certain year
  return new Promise((resolve, reject) => {
      
     pool.query('SELECT COUNT(*) as count, day(str_to_date(purchaseDate, "%Y-%m-%d")) as date from sir_tp2.purchase where year(str_to_date(purchaseDate, "%Y-%m-%d")) = ? AND month(str_to_date(purchaseDate, "%Y-%m-%d")) = ? group by date ; ',
     [year, month], 
      (err, results) => {
         if(err){
             return reject(err);
         }
         return resolve(results);
     }) 
  })
};
db.countBetweenMonths = (year1, year2) => {
  //Gets sales between months of certain years
  return new Promise((resolve, reject) => {
     pool.query('SELECT COUNT(*) as count, year(str_to_date(purchaseDate, "%Y-%m-%d")) as year, month(str_to_date(purchaseDate, "%Y-%m-%d")) as month from sir_tp2.purchase where year(str_to_date(purchaseDate, "%Y-%m-%d")) BETWEEN ? AND ? group by year,month;',
     [year1, year2], 
      (err, results) => {
         if(err){
             return reject(err);
         }
         return resolve(results);
     }) 
  })
};

db.countByTypeYear = (year) => {
  //Gets sales by type for a year
  return new Promise((resolve, reject) => {
      
     pool.query('SELECT showtype.type, SUM(purchaseLine.quantity) as count FROM sir_tp2.purchase, purchaseLine, shows, showtype WHERE purchase.idPurchase = purchaseLine.idPurchase AND purchaseLine.idShow = shows.idShow AND shows.idShowType = showtype.idShowType AND year(str_to_date(purchase.purchaseDate, "%Y-%m-%d")) = ? group by showtype.type; ',
     [year], 
      (err, results) => {
         if(err){
             return reject(err);
         }
         return resolve(results);
     }) 
  })
};
db.countByTypeCompare = (year1, year2) => {
  //Compares sales from types between two years
  return new Promise((resolve, reject) => {
      
     pool.query('SELECT showtype.type, year(str_to_date(purchase.purchaseDate, "%Y-%m-%d")) as year,SUM(purchaseLine.quantity) as count FROM sir_tp2.purchase, purchaseLine, shows, showtype WHERE purchase.idPurchase = purchaseLine.idPurchase AND purchaseLine.idShow = shows.idShow AND shows.idShowType = showtype.idShowType AND year(str_to_date(purchase.purchaseDate, "%Y-%m-%d")) BETWEEN ? AND ? group by showtype.type, year;',
     [year1, year2], 
      (err, results) => {
         if(err){
             return reject(err);
         }
         return resolve(results);
     }) 
  })
};
db.countEarnsYearly = (year1, year2) => {
  //Compares sales from types between two years
  return new Promise((resolve, reject) => {
      
     pool.query('SELECT SUM(purchase.totalPayed) as total, year(str_to_date(purchaseDate, "%Y-%m-%d")) as year, month(str_to_date(purchaseDate, "%Y-%m-%d")) as month from sir_tp2.purchase where year(str_to_date(purchaseDate, "%Y-%m-%d")) BETWEEN ? AND ? group by year,month;',
     [year1, year2], 
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
module.exports = db
