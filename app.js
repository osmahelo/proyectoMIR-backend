require('dotenv').config();
require("express-async-errors");
const express = require('express');
const connectDb = require('./db/db')

//Middleware
const app = express();
app.use(express.json());
const port = process.env.port || 3001;
//Routes
const userRoutes = require('./routes/users')
app.use('/', userRoutes);
//Error Handling
const notFoundMiddleware = require("./middleware/notfound");
const errorHandlerMiddleware = require("./middleware/errorhandler");
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
//Initialize 
const start = async () => {
  try {
    await connectDb('mongodb+srv://LauraCanon:Makeitreal@cluster0.vrmch.mongodb.net/users?retryWrites=true&w=majority');
    console.log('Conected to DB')
    app.listen(port, () => console.log(`Listening on port ${port}`))
  } catch (error) {
    console.log(error)
  }
}

start();

