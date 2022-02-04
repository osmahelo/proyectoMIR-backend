require("dotenv").config();
require("express-async-errors");

const express = require("express");
const connectDb = require("./db/db");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;
const URI = process.env.MONGO_URI;

app.use(express.json());
app.use(cors());

//Routes
const userRoutes = require("./routes/users");
const servicesRoutes = require("./routes/services");
app.use("/", userRoutes);
app.use("/", servicesRoutes);
//Error Handling
const notFoundMiddleware = require("./middleware/notfound");
const errorHandlerMiddleware = require("./middleware/errorhandler");
app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);
//Initialize
const start = async () => {
  try {
    await connectDb(URI);
    console.log("Conected to DB");
    app.listen(PORT, () => console.log(`Listening on port ${PORT}`));
  } catch (error) {
    console.log(error);
  }
};

start();
