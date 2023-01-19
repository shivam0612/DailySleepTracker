require("dotenv").config();
const mongoose = require("mongoose");

//creating a DB
mongoose.connect(process.env.DB, {
    useCreateIndex: true,
    useUnifiedTopology: true,
    useNewUrlParser: true
}).then(() => {
    console.log("Connection Successful");
}).catch((e) => {
    console.log(e);
})