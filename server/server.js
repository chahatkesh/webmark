const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const mongoose = require('mongoose');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const authenticate = require('./middleware/auth');
require('dotenv').config();
import cors from 'cors'

const app = express();
const port = 4000;

mongoose.connect('mongodb://localhost:27017/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

app.use(bodyParser.json());
app.use(cookieParser()); // Use cookie-parser
app.use(express.json())
app.use(cors())

app.use('/auth', authRoutes);
app.use('/users', userRoutes);

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
