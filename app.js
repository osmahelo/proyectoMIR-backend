require('dotenv').config();
const express = require('express');
const userRoutes = require('./routes/users')
const connectDb = require('./db/db')

const app = express();
const port = process.env.port || 3001;

// app.get('/', (req, res) => {
//   res.send('Hello')
// })
app.use('/', userRoutes);

const start = async () => {
  try {
    await connectDb(process.env.MONGO_URI);
    console.log('Conected to DB')
    app.listen(port, () => console.log(`Listening on port ${port}`))
  } catch (error) {
    console.log(error)
  }
}

start();

