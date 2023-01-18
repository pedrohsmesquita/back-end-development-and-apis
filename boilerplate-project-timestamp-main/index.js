// index.js
// where your node app starts

// init project
var express = require('express');
var app = express();

// enable CORS (https://en.wikipedia.org/wiki/Cross-origin_resource_sharing)
// so that your API is remotely testable by FCC 
var cors = require('cors');
app.use(cors({optionsSuccessStatus: 200}));  // some legacy browsers choke on 204

// http://expressjs.com/en/starter/static-files.html
app.use(express.static('public'));

// http://expressjs.com/en/starter/basic-routing.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + '/views/index.html');
});


// your first API endpoint... 
app.get("/api/hello", function (req, res) {
  res.json({greeting: 'hello API'});
});

app.get("/api/:date?", (req, res) => {
  const isUnixDate = /^\d+$/.test(req.params.date);
  const isValid = new Date(req.params.date).toString();
  let dateObj, unixDate;

  if (!req.params.date) {
    dateObj = new Date();
    unixDate = Math.floor(dateObj.getTime());
    res.json({unix: unixDate, utc: dateObj.toUTCString()});
  } else if (!isUnixDate && isValid === "Invalid Date") {
    res.json({ error : isValid });
  } else if (isUnixDate) {
    unixDate = parseInt(req.params.date);
    dateObj = new Date(unixDate);
    res.json({unix: unixDate, utc: dateObj.toUTCString()});
  } else {
    dateObj = new Date(req.params.date);
    unixDate = Math.floor(dateObj.getTime());
    res.json({unix: unixDate, utc: dateObj.toUTCString()});
  }
});



// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
