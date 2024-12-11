const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser"); // Import cookie-parser

const app = express();

app.use(cookieParser()); // Use cookie-parser middleware

const saltRounds = 10;

// Route to generate a hash for a password
app.get('/hash', (req, res) => {
    bcrypt.genSalt(saltRounds, function(err, salt) {
        if (err) {
            console.error("Error generating salt:", err);
            return res.status(500).send("Internal Server Error");
        }
        bcrypt.hash("bdjsbjbjsbja", salt, function(err, hash) {
            if (err) {
                console.error("Error hashing password:", err);
                return res.status(500).send("Internal Server Error");
            }
            console.log("Generated Hash:", hash);
            res.send(`Generated Hash: ${hash}`);
        });
    });
});

// Route to generate and store JWT in a cookie
app.get("/jwt", (req, res) => {
    let token = jwt.sign({ 'email': 'daxini.manan@gmail.com' }, "secret");
    res.cookie("token", token);
    console.log(token);
    res.send('JWT token stored in cookie');
});

// Route to verify JWT from cookie
app.get("/check", (req, res) => {
    try {
        let data = jwt.verify(req.cookies.token, "secret"); // Use the correct secret key
        console.log(data);
        res.send("Token verified successfully!");
    } catch (err) {
        console.error("Error verifying token:", err);
        res.status(401).send("Invalid token");
    }
});

// Route to compare a password with a stored hash
app.get('/compare', (req, res) => {
    const storedHash = "$2b$10$jt/wKlA4FG7y4959HE7wMeJSfDymtDnY3y/IZttWigm82XHhH0pLS"; // Example hash
    const userInputPassword = "bdjsbjbjsbja"; // Example user input

    bcrypt.compare(userInputPassword, storedHash, function(err, result) {
        if (err) {
            console.error("Error comparing password:", err);
            return res.status(500).send("Internal Server Error");
        }

        if (result) {
            console.log("Passwords match!");
            res.send("Passwords match!");
        } else {
            console.log("Passwords do not match!");
            res.send("Passwords do not match!");
        }
    });
});

app.get('/cookie',(req,res)=>{
    res.cookie("name","manan")
    res.send('done')
})

app.get('/cookieread',(req,res)=>{
    console.log(req.cookies)
    res.send("read page")
})

app.listen(3000, () => {
    console.log('Server started on http://localhost:3000');
});
