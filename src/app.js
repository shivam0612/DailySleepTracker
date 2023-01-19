require("dotenv").config();
const express = require("express");
require("./db/conn");
const auth = require("../src/middleware/auth");
const User = require("./models/schema")
const uData = require("./models/uschema")
const hbs = require("hbs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();
const path = require("path");

const port = process.env.PORT || 9000

//Setting Path path
const staticpath = path.join(__dirname, "../public");
const templates_path = path.join(__dirname, "../templates/views");
const partials_path = path.join(__dirname, "../templates/partials");

//middleware
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({
    extended: false
}));
app.use('/css', express.static(path.join(__dirname, "../node_modules/bootstrap/dist/css")));
app.use('/custom_css/', express.static(path.join(__dirname, "../public/css")));
app.use('/jss', express.static(path.join(__dirname, "../public/js")));
app.use('/js', express.static(path.join(__dirname, "../node_modules/bootstrap/dist/js")));
app.use('/jq', express.static(path.join(__dirname, "../node_modules/jquery/dist")));
app.use('/images', express.static(path.join(__dirname, "../public/images")));

// app.use(express.urlencoded({ extended: false }));
app.use(express.static(staticpath));
// app.use(express.urlencoded({ extended: true }));
app.set("view engine", "hbs");
app.set("views", templates_path);
hbs.registerPartials(partials_path);


//routing
//app.get(path, callback)
app.get("/", (req, res) => {
    res.render("index");
})
app.get("/about", (req, res) => {
    res.render("about");
})

app.get("/createaccount", (req, res) => {
    res.render("createaccount");
})



app.get("/temp", async (req, res) => {

    const user1 = await     
    // console.log(user1)
    res.render("temp", {
        'userlist': user1
    });

})

app.get("/login", (req, res) => {
    res.render("login");
})

//registration
app.post("/createaccount", async (req, res) => {
    try {
        // res.send(req.body);
        const userData = new User(req.body);

        const token = await userData.generateAuthToken();

        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 60000),
            httpOnly: true
        });

        await userData.save();
        res.status(201).render("login");
    } catch (e) {
        res.status(500).send(e);
    }
})



//login
app.post("/login", async (req, res) => {
    try {

        const email = req.body.email;
        const password = req.body.password;
        const user1 = await User.findOne({
            email: email
        });
        const token = await user1.generateAuthToken();
        res.cookie("jwt", token, {
            expires: new Date(Date.now() + 600000),
            httpOnly: true,
        });
        const name = namee(user1.firstname);

        if (user1.password === password) {
            res.status(201).render('home', {
                name: user1.firstname,

            });

        } else {
            res.send("Invalid");
        }
    } catch (e) {
        res.status(400).send(e);
    }
})
var namess;

function namee(firstname) {
    namess = firstname;
    return namess;
}

app.get("/home", auth, async (req, res) => {

    res.render('home', {});
})


app.post("/home", auth, async (req, res) => {
    try {

        const ttimehrs = req.body.wtimehrs - req.body.stimehrs;
        const ttimemin = req.body.wtimemin - req.body.stimemin;

        const userData = new uData({
            date: req.body.date,
            firstname: req.name,
            stimehrs: req.body.stimehrs,
            stimemin: req.body.stimemin,
            wtimehrs: req.body.wtimehrs,
            wtimemin: req.body.wtimemin,
            ttimehrs: ttimehrs,
            ttimemin: ttimemin
        });

        // console.log(userData);
        await userData.save();
        res.status(201).render('home', {
            name: namess,

        });
    } catch (e) {
        res.status(500).send(e);
    }
})


app.get("/logout", auth, async (req, res) => {
    try {

        res.clearCookie("jwt");

        await req.user.save();
        // console.log(req.name);
        res.render("index");
    } catch (e) {
        res.status(500).send(e);
    }
})



//generating token
const createToken = async () => {
    const token = await jwt.sign({
        _id: "5fb86aaf569ea945f8bcd2e1"
    }, process.env.SECRET_KEY);

    // console.log(token);
    const userVer = await jwt.verify(token, "yfu3pwbayfu3pwbayfu3pwbayfu3pwba");
    // console.log(userVer);

}

createToken();


//server create
app.listen(port, () => {
    console.log(`server is running at port number ${port}`);
})








// console.log(path.join(__dirname, "../public"))