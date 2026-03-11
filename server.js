require('dotenv').config();const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
/*
app.use(cors());
origin: "+" 
// Will get back to this 
*/
app.use(cors({
    origin: "http://localhost:5174"
}));
app.use(express.json());

app.use('/api/auth', require('./routes/auth.route'));
app.use('/api/universities', require('./routes/universities'));
app.use('/api/applications', require('./routes/applications'));

const MONGODB_URI = process.env.MONGODB_URI;

mongoose.connect("mongodb://localhost:27017/ScholarLink")
    .then(() => console.log(" ScholarLink Database Connected..."))
    .catch(err => {
        console.error("MongoDB connection error:");
        console.error(err);
    });

app.get('/', (req, res) => {
    res.status(200).send("ScholarLink API is live and running! ");
})

app.get("/test", (req, res) => {

    res.send("all good! reaching the route")
})

/*
app.post("/api/universities/:universityName", async (req, res, next) => {
    try {

        const response = await Song
        .findByID(req.params.songId)
        .populate({
            path: "universities",
            select: {name: 1, country: 1},
            path: "university",
            model: "universities"
        }
        })

        .populate("universities")

        res.json(response) 
    } catch (error) {
        next(error)
    }
})
    //Too much errors
    */

app.use((req, res) => {
    res.status(404).json({errorMessage: "Route not foound!"})
})

app.use((error, req, res, next) => {
    console.log(error)
    res.status(500).json({errorMessage: "Server broke down! Sorry, we will try to fix it"})
})

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => {
    console.log(` Server is purring on port ${PORT}`);
    console.log(` Test the connection here: http://localhost:${PORT}`);
});