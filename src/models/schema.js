const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const userschema = mongoose.Schema({

    firstname: {
        type: String,
        require: true,
        minLength: 3,
        validate(value) {
            if (!validator.isAlpha(value)) {
                throw new Error("Invalid")
            }
        }
    },
    lastname: {
        type: String,
        require: true,
        minLength: 3,
        validate(value) {
            if (!validator.isAlpha(value)) {
                throw new Error("Invalid")
            }
        }
    },
    contact: {
        type: Number,
        require: true,
        min: 10,

    },
    email: {
        type: String,
        require: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid")
            }
        }
    },
    password: {
        type: String,
        require: true,
        minLength: 8,
        validate(value) {
            if (!validator.isStrongPassword(value)) {
                throw new Error("Invalid")
            }
        }
    },
    tokens: [{
        token: {
            type: String,
            require: true
        }
    }]
})

//generating token
userschema.methods.generateAuthToken = async function() {
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
const User = mongoose.model("User", userschema);
module.exports = User;