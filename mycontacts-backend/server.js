
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv').config();
const errorHandler = require('./middleware/errorHandleer'); 
const connectDB = require('./config/dbConnection');

connectDB();

const app = express();
const port = process.env.PORT || 5001;

// Request timeout middleware
app.use((req, res, next) => {
  req.setTimeout(30000); // 30 seconds
  res.setTimeout(30000);
  next();
});

// CORS configuration - commented out, using proxy instead
// app.use(cors({
//   origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3003', 'http://192.168.0.189:3000'],
//   credentials: true,
//   methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
//   allowedHeaders: ['Content-Type', 'Authorization']
// }));

app.use(express.json());


app.use("/api/contacts", require("./routes/contactRoutes"));
app.use("/api/users", require("./routes/userRoutes"));

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
