const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', require('./routes/auth'));
app.use('/api/universities', require('./routes/universities'));
app.use('/api/applications', require('./routes/applications'));

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect(MONGODB_URI)
    .then(() => console.log(" ScholarLink Database Connected..."))
    .catch(err => {
        console.error(" MongoDB connection error:");
        console.error(err);
    });

app.get('/', (req, res) => {
    res.status(200).send("ScholarLink API is live and running! ");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(` Server is purring on port ${PORT}`);
    console.log(` Test the connection here: http://localhost:${PORT}`);
});