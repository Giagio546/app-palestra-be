const express = require("express");
const errorHandler = require("./middleware/errorHandler");
const connectDb = require("./config/dbConnection")
const dotenv = require("dotenv").config();
const cors = require("cors");
const app = express();
connectDb();
const corsOptions = {
    origin: 'http://localhost:4200',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204,
  };
  
  app.use(cors(corsOptions));
const port = process.env.PORT || 5000;
app.use(express.json());
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/prenotazioni", require("./routes/prenotazioniRoutes"));
app.use(errorHandler);
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
})