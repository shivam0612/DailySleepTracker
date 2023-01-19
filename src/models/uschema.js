const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const uschema = mongoose.Schema({

    date: {
        type: Date,
        require: true,
        minLength: 8,
        validate(value) {
            if (!validator.isDate(value)) {
                throw new Error("Invalid")
            }
        }
    },
    firstname: {
        type: String,
        require: true
    },
    stimehrs: {
        type: Number,
        require: true,
        max: 24,
    },
    stimemin: {
        type: Number,
        require: true,
        max: 60,
    },
    wtimehrs: {
        type: Number,
        require: true,
        max: 24,
    },
    wtimemin: {
        type: Number,
        require: true,
        max: 60,
    },
    ttimehrs: {
        type: Number,
        require: true,
        max: 24,
    },
    ttimemin: {
        type: Number,
        require: true,
        max: 60,
    },
    tokens: [{
        token: {
            type: String,
            require: true
        }
    }]
})

//generating token
uschema.methods.generateAuthToken = async function() {
    try {
        const token = jwt.sign({ _id: this._id.toString() }, process.env.SECRET_KEY);
        this.tokens = this.tokens.concat({ token: token });
        await this.save();

        return token;
    } catch (e) {
        res.send("the error part" + e);
    }
}

//create collection
const uData = mongoose.model("uData", uschema);
module.exports = uData;