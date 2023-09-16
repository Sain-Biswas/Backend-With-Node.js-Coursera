const express = require('express');

const router = express.Router();

let books_list = [
    { "isbn": 9783442178582, "name": "Atomic Habits", "authorName": "James Clear", "price": 169, "review": {} },
    { "isbn": 9780446568814, "name": "Rich Dad Poor Dad", "authorName": "Robert T. Kiyosaki", "price": 195, "review": {} },
    { "isbn": 9781786330895, "name": "Ikigai", "authorName": "Hector Garcia", "price": 340, "review": {} },
    { "isbn": 9781982149819, "name": "Think Like a Monk", "authorName": "Jay Shetty", "price": 400, "review": {} },
    { "isbn": 9783988283351, "name": "Gitanjali", "authorName": "Rabindra Nath Tagore", "price": 100, "review": {} },
];


// GET request: Task 1: Get the book list available in the shop
router.get("/", (req, res) => {
    res.header("Content-Type", "application/json");
    res.end(JSON.stringify(books_list));
});

// GET by specific ID request: Task 2, 3, 4 : Get Books based on ISBN, Author, Title 
router.get('/search', function (req, res) {
    res.header("Content-Type", "application/json");
    const parameter = req.body.parameter;
    let result_arr = books_list.filter((ele) => {
        return (ele["name"] == parameter || ele["authorName"] == parameter || ele["isbn"] == parameter)
    })
    if (result_arr.length > 0) {
        res.send(result_arr)
    }
    else {
        res.status(404).send("No Entry Available :( ")
    }
});

// GET by specific ID request: Task 5 : Get book Review
router.get('/review/:isbn', function (req, res) {
    res.header("Content-Type", "application/json");
    const isbn = Number.parseInt(req.params.isbn);
    let result_arr = []
    books_list.map((ele) => {
        if (ele["isbn"] == isbn) {
            result_arr.push(ele)
        }
    })
    if (result_arr.length > 0) {
        console.log(result_arr["review"])
        res.json(result_arr["review"])
    }
    else {
        res.status(404).send("No Entry Available :( ")
    }
});


// PUT request: Task 8 : Add/Modify a book review
router.put("/review/:isbn", function (req, res) {
    if (req.username) {
        for (let i = 0; i < books_list.length; i++) {
            if (books_list[i]["isbn"] == req.params.isbn) {
                books_list[i]["review"][req.username] = req.body.userreview
            }
        }
        res.end(`Review has been added/updated for ISBN : ${req.params.isbn}`)
    }
    else {
        return res.status(403).send("Login First to access this Feature !")
    }
});


// DELETE request: Task 9: Delete book review added by that particular user
router.delete("/review/:isbn", (req, res) => {
    if (req.username) {
        for (let i = 0; i < books_list.length; i++) {
            if (books_list[i]["isbn"] == req.params.isbn) {
                delete books_list[i]["review"][req.username]
            }
        }
        res.end(`Review has been deleted for ISBN : ${req.params.isbn}`)
    }
    else {
        return res.status(403).send("Login First to access this Feature !")
    }
});

module.exports = router;