require('dotenv').config();
const express = require('express');
const userRoutes = require('./routes/users')
const connectDb = require('./db/db')

const app = express();
const port = process.env.port || 3001;

//middleware
app.use(express.json());
// app.get('/', (req, res) => {
//   res.send('Hello')
// })
app.use('/', userRoutes);

const start = async () => {
  try {
<<<<<<< HEAD
    await connectDb(process.env.MONGO_URI);
=======
    await connectDb('mongodb+srv://LauraCanon:Makeitreal@cluster0.vrmch.mongodb.net/users?retryWrites=true&w=majority');
>>>>>>> Tested user register post/route
    console.log('Conected to DB')
    app.listen(port, () => console.log(`Listening on port ${port}`))
  } catch (error) {
    console.log(error)
  }
}

start();

