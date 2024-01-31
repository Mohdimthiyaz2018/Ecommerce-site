const express = require('express');
const app = express();
const products = require('./Routes/productRoutes');
const users = require('./Routes/userRoutes');
const order = require('./Routes/orderRoutes');
const error = require('./MiddleWares/error');
const cookies = require('cookie-parser');

app.use(express.json());
app.use(cookies());

app.use('/api/v1',products);
app.use('/api/v1',users);
app.use('/api/v1',order);
app.use(error);

module.exports = app;