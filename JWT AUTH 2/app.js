require("dotenv").config(); // Import and configure dotenv

const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { connectdb } = require("./models/user");
const User = require("./models/schema");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Set the view engine to EJS
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Serve static files
app.use(express.static(path.join(__dirname, "public")));

// Database Connection
connectdb()
    .then(() => {
        console.log("Connected to the database successfully");
    })
    .catch((error) => {
        console.log("Error connecting to the database:", error);
    });

// Render an EJS template
app.get("/", (req, res) => {
    res.render("index");
});

app.get("/login", (req, res) => {
    res.render("login");
});

// POST route for creating a new user
app.post("/create", async (req, res) => {
    const { username, email, password, age } = req.body;

    try {
        // Hash the password using bcrypt
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create a new user with the hashed password
        const createUser = await User.create({
            username,
            email,
            password: hashedPassword,
            age,
        });

        // Generate JWT token using the secret key from environment variable
        const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: "1h" });
        res.cookie("token", token); // Set the token in cookies

        res.status(201).send(createUser);
    } catch (error) {
        res.status(400).send({ error: "Error creating user", message: error.message });
    }
});

// POST route for user login
app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    try {
        // Find user by email
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).send("User not found");
        }

        // Compare provided password with hashed password in database
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (isPasswordValid) {
            // Generate JWT token using the secret key from environment variable
            const token = jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
            res.cookie("token", token); // Set the token in cookies
            return res.send("You can login");
        } else {
            return res.status(401).send("Incorrect password");
        }
    } catch (error) {
        res.status(500).send("An error occurred during login");
    }
});

// POST route for user logout
app.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.redirect("/");
});

// Start the server
app.listen(2000, () => {
    console.log("Server started ");
});
