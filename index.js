const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const routes = require('./routers.js')

const PORT = 5000;
let users = []
let logedinUser

const checkUserExist = (username) => {
    let userswithsamename = users.filter((user) => {
        return user.username === username
    });
    if (userswithsamename.length > 0) {
        return true;
    } else {
        return false;
    }
}

const authenticatedUser = (username, password) => {
    let validusers = users.filter((user) => {
        return (user.username === username && user.password === password)
    });
    if (validusers.length > 0) {
        return true;
    } else {
        return false;
    }
}

const app = express();

app.use(session({ secret: "fingerpint" }, resave = true, saveUninitialized = true));

app.use(express.json());

app.use("/books", function auth(req, res, next) {
    if (req.session.authorization) {
        token = req.session.authorization['accessToken'];
        jwt.verify(token, "access", (err, user) => {
            if (!err) {
                req.username = req.session.authorization['username']
                req.user = user;
                next();
            }
            else {
                return res.status(403).end()

            }
        });
    } else {
        res.status(200)
        req.user = false;
        next();
    }
});

// POST: Task 7 : Login as a registered user
app.post("/login", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (!username || !password) {
        return res.status(404).json({ message: "Error logging in" });
    }

    if (authenticatedUser(username, password)) {
        let accessToken = jwt.sign({
            data: password
        }, 'access', { expiresIn: 60 * 60 });

        req.session.authorization = {
            accessToken, username
        }
        return res.status(200).send("User successfully logged in");
    } else {
        return res.status(208).json({ message: "Invalid Login. Check username and password" });
    }
});

// POST: Task 6 : Register a New User
app.post("/register", (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    if (username && password) {
        if (!checkUserExist(username)) {
            users.push({ "username": username, "password": password });
            return res.status(200).json({ message: "User successfully registred. Now you can login" });
        } else {
            return res.status(404).json({ message: "User already exists!" });
        }
    }
    return res.status(404).json({ message: "Unable to register user." });
});


app.use("/books", routes);
app.listen(PORT, () => console.log(`Server is running on Port : ${PORT}`));