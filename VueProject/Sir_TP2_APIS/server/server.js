const express = require('express');
const cors = require('cors');

/**Imports of all routes (endpoints) created to access the database via query */
/**----------------------------------------------------------- */

const userRoutes = require('./routes/users')
const showRoutes = require('./routes/shows')
const zipcodeRoutes = require('./routes/zipcode')
const purchaseRoutes = require('./routes/purchase')
const showTypesRoutes = require('./routes/showtype')
const locationRoutes = require('./routes/location')
const ratingRoutes = require('./routes/rating')
const commentsRoutes = require('./routes/comment')

/**----------------------------------------------------------- */
//const proxy = require('http-proxy-middleware');

const app = express();

app.use(cors())
app.use(express.json());

//app.use('/api/**', proxy({ target: "http://localhost:8080" }));
/**Make the server know about those endpoints (use them) */
/**----------------------------------------------------- */

app.use('/api/tp2', userRoutes);
app.use('/api/tp2', showRoutes);
app.use('/api/tp2', zipcodeRoutes);
app.use('/api/tp2', purchaseRoutes);
app.use('/api/tp2', showTypesRoutes);
app.use('/api/tp2', locationRoutes);
app.use('/api/tp2', ratingRoutes);
app.use('/api/tp2', commentsRoutes);

/**----------------------------------------------------- */

//Server port -> can be changed
app.listen(process.env.PORT || '3000', () => {
    console.log(`Server is running on port: ${process.env.PORT || 3000}`)
})