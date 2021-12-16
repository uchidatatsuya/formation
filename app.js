const express = require('express');
const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('edit-new.ejs');
});

app.get('/test', (req, res) => {
    res.render('test.ejs');
});

app.get('/json', (req, res) => {
    res.render('testJson.ejs');
});

app.listen(3000);