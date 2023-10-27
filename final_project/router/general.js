const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
    if (username && password) {
      if (!isValid(username)) {
        users.push({"username":username,"password":password});
        return res.status(200).json({message: "User successfully registred. Now you can login"});
      } else {
        return res.status(404).json({message: "User already exists!"});
      }
    }
    return res.status(404).json({message: "Unable to register user."});
  });

// Get the book list available in the shop
public_users.get('/', async (req, res) => {
  res.send(books)
});
// Get book details based on ISBN
public_users.get('/isbn/:isbn', async (req, res) => {
    const isbn = req.params.isbn
    res.send(books[isbn])
 });
  
// Get book details based on author
public_users.get('/author/:author',async (req, res) => {
    let booksbyauthor = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if(books[isbn]["author"] === req.params.author) {
        booksbyauthor.push({"isbn":isbn,
                            "title":books[isbn]["title"],
                            "reviews":books[isbn]["reviews"],
                            "author":books[isbn]["author"]});
      }
    });
    res.send(JSON.stringify({booksbyauthor}, null, 4));
  });
// Get all books based on title
public_users.get('/title/:title',async (req, res) => {
    let booksbytitle = [];
    let isbns = Object.keys(books);
    isbns.forEach((isbn) => {
      if(books[isbn]["title"] === req.params.title) {
        booksbytitle.push({"isbn":isbn,
                            "title":books[isbn]["title"],
                            "reviews":books[isbn]["reviews"],
                            "author":books[isbn]["author"]});
      }
    });
    res.send(JSON.stringify({booksbytitle}, null, 4));
});

//  Get book review
public_users.get('/review/:isbn',async (req, res) => {
    const bookReviews = req.params.isbn
    const reviews = books[bookReviews]["reviews"]
    if (!reviews) {
        res.status(401).json({message:"This book has no reviews"})
    } else {
        res.status(202).json(reviews)
    }
});

module.exports.general = public_users;