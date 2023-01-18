require('dotenv').config();
const bodyparser = require('body-parser');
const express = require('express');
const cors = require('cors');
const dns = require('dns');
const database = require('./src/database.js');
const urlShortener = require('./src/models/urlShortenerSchema.js');
const app = express();

// Basic Configuration
let shortId = 1;
const port = process.env.PORT || 3000;

app.use(bodyparser.urlencoded({ extended: false }))
app.use(bodyparser.json());

app.use(cors());

app.use('/public', express.static(`${process.cwd()}/public`));

app.get('/', function (req, res) {
    res.sendFile(process.cwd() + '/views/index.html');
});

// Your first API endpoint
app.get('/api/hello', function (req, res) {
    res.json({ greeting: 'hello API' });
});

app.post('/api/shorturl', (req, res, next) => {
    const url = req.body.url;
    let isValid;

    if (!/https?:\/\/(wwww\.)?/i.test(url))
        res.json({ error: 'Invalid URL' });
    else {
        const urlParsed = url.replace(/https?:\/\/(wwww\.)?/i, '').split('/')[0];
        isValid = dns.lookup(urlParsed, (err, address, family) => {
            if (err) res.json({ error: 'Invalid URL' });
        });
    }
    if (isValid) {
        urlShortener.findOne({ original_url: url }, (err, data) => {
            if (err) return console.error(err);
            if (data) res.json({ original_url: data.original_url, short_url: data.short_url })
            else next();
        })
    }
}, (req, res) => {
    const url = req.body.url;
    const shortUrl = new urlShortener({
        original_url: url,
        short_url: shortId++
    });

    shortUrl.save((err, data) => {
        if (err) return console.error(err);
        res.json({ original_url: data.original_url, short_url: data.short_url });
    });
});

app.get('/api/shorturl/:id', (req, res) => {
    if (!/^\d*$/.test(req.params.id)) {
        res.json({ error: "Wrong format" });
    } else {
        urlShortener.findOne({ short_url: parseInt(req.params.id) }, (err, data) => {
            if (err) return console.error(err);
            if (data) res.redirect(data.original_url);
            else res.json({ error: "No short URL found for the given input" });
        });
    }
});

app.listen(port, function () {
    console.log(`Listening on port ${port}`);
});
