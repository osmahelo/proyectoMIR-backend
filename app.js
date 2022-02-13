require('dotenv').config();
require('express-async-errors');

const express = require('express');
const connectDb = require('./db/db');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;
const URI = process.env.MONGO_URI;

app.use(express.json());
app.use(cors());

//Routes
const userRoutes = require('./routes/users');
const servicesRoutes = require('./routes/services');
const paymentRoutes = require('./routes/payment');
app.use('/', userRoutes);
app.use('/', servicesRoutes);
app.use('/', paymentRoutes);

//Error Handling
const notFoundMiddleware = require('./middleware/notfound');
app.use(notFoundMiddleware);
//Initialize
const start = async () => {
  try {
    await connectDb(URI);
    console.log('Conected to DB');
    app.listen(PORT, () => console.log(`Listening on port`, +PORT));
  } catch (error) {
    console.log(error);
  }
};

start();
