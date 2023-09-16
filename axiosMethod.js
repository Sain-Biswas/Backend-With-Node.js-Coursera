const axios = require('axios');

const getAllBooks = () => {
    let options = {
        method: 'GET',
        url: 'http://localhost:5000/books',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    axios.request(options).then(function (response) {
        console.log(response.data);
    }).catch(function (error) {
        console.error(error);
    });
}

const getBooksSerach = (parameter) => {
    let options = {
        method: 'GET',
        url: 'http://localhost:5000/books/search',
        headers: {
            'Content-Type': 'application/json'
        },
        data: { parameter: `${parameter}` }
    };

    axios.request(options).then(function (response) {
        console.log(response.data);
    }).catch(function (error) {
        console.error(error);
    });
}

getAllBooks();

getBooksSerach(9781982149819);



