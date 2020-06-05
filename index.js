const express = require('express');
const app = express();
const mongoose = require('mongoose');
const dotenv = require('dotenv');
// import routes
const authRoutes = require('./routes/authRoutes');
const privateRoutes = require('./routes/privateRoutes');

//set env to process.env
dotenv.config();

//connect to db
mongoose.connect(process.env.DB_CONNECT, () => {
        console.log('connected to db');
     }
);

//Middlewares
app.use(express.json());


// route middleware
app.use('/api/user', authRoutes);
app.use('/api/private', privateRoutes);

app.listen(3000, () => console.log('server running'));