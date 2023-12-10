const express = require("express");
const cors = require("cors");
const dotenv = require('dotenv');
const mongoose = require("mongoose");
const bcrypt = require('bcryptjs');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const typeRoute = require("./routes/Type.js");
const categorieRoute = require('./routes/Categorie.js');
const adminRoute = require("./routes/Admin.js");
const jobroute = require("./routes/Job.js");
const applicationrouter = require('./routes/Application.js');
const statusroute = require("./routes/Status.js");

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api/type", typeRoute);
app.use("/api/categorie",categorieRoute);
app.use("/admin",adminRoute);
app.use("/api/job",jobroute);
app.use('/application',applicationrouter);
app.use('/status',statusroute);
const port = process.env.PORT || 5002;


mongoose.connect(process.env.DATABASE, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => {
    console.log("Database connected");
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}).catch((err) => {
    console.error("Error connecting to database:", err);
});
