const express = require('express')
const app = express()
const database = require('./src/database.js');
const bodyparser = require('body-parser');
const userModel = require('./src/models/userSchema.js');
const exerciseModel = require('./src/models/exerciseSchema.js');
const mongoose = require('mongoose');
const cors = require('cors')
require('dotenv').config()

app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());
app.use(cors())
app.use(express.static('public'))

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html')
});

app.post('/api/users', async (req, res) => {
    const user = new userModel({username: req.body.username});
    try {
        const data = await user.save();
        res.json({username: data.username, _id: data._id});
    } catch (err) {
        return console.error(err);
    }
});

app.get('/api/users', async (req, res) => {
    try {
        const data = await userModel.find({exercises: false}).exec();
        res.json(data);
    } catch (err) {
        return console.error(err);
    }
});

app.post('/api/users/:_id/exercises', async (req, res) => {
    let date = req.body.date;
    if (!date)
        date = new Date().toISOString().split('T')[0];
    const exercise = new exerciseModel({
        description: req.body.description,
        duration: req.body.duration,
        date: date,
        user_id: req.params._id
    });
    try {
        const exerciseObj = await exercise.save();
        const userObj = await userModel.findById({_id: mongoose.Types.ObjectId(req.params._id)}).exec();
        const dateParts = exerciseObj.date.split('-');
        res.json({
            username: userObj.username,
            description: exerciseObj.description,
            duration: exerciseObj.duration,
            date: new Date(dateParts[0], dateParts[1] - 1, dateParts[2]).toDateString(),
            _id: userObj._id
        });
    } catch (err) {
        return console.error(err);
    }
});

app.get('/api/users/:_id/logs', (req, res, next) => {
    const yearMonthDay = /^\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01])$/;
    const yearMonth = /^\d{4}\-(0?[1-9]|1[012])((?!\w).)?$/;
    const year = /^\d{4}((?!\w).)?$/;
    if (yearMonth.test(req.query.from) || year.test(req.query.from))
        req.query.from = req.query.from.replace(/[^\d]$/, '');
    else if (!yearMonthDay.test(req.query.from)) {
        req.query.from = '1969-12-31';
        req.query.fromCheck = true;
    }
    if (yearMonth.test(req.query.to) || year.test(req.query.to))
        req.query.to = req.query.from.replace(/[^\d]$/, '');
    else if (!yearMonthDay.test(req.query.to)) {
        const dateTemp = new Date();
        req.query.to = formatDate(dateTemp);
        const toSplit = req.query.to.split('-');
        req.query.to = toSplit[0] + '-' + toSplit[1] + '-' + (parseInt(toSplit[2]) + 1);
        req.query.toCheck = true;
    }
    req.query.limit = !/^[\d]*$/.test(req.query.limit) ? 0 : req.query.limit;
    next();
},async (req, res) => {
    try {
        const user = await userModel.findById({_id: mongoose.Types.ObjectId(req.params._id)}).exec();
        const exercises = await exerciseModel.find({user_id: req.params._id})
                                            .gt('date', req.query.from)
                                            .lt('date', req.query.to)
                                            .limit(req.query.limit)
                                            .select({__v: false, user_id: false, _id: false})
                                            .exec();
        const userJson = {_id: user._id, username: user.username};
        if (!req.query.fromCheck) {
            const dateParts = req.query.from.split('-');
            userJson.from = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]).toDateString();
        }
        else delete req.query.fromCheck;
        if (!req.query.toCheck) {
            const dateParts = req.query.from.split('-');
            userJson.to = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]).toDateString();
        }
        else delete req.query.toCheck;
        for (const exercise of exercises) {
            const dateParts = exercise.date.split('-');
            exercise.date = new Date(dateParts[0], dateParts[1] - 1, dateParts[2]).toDateString();
        }
        userJson.count = exercises.length;
        userJson.log = exercises;
        res.json(userJson);
    } catch (err) {
        return console.error(err);
    }
});

const formatDate = function(date) {
    return date.toLocaleString("default", { year: "numeric" }) + "-" +
        date.toLocaleString("default", { month: "2-digit" }) + "-" +
        date.toLocaleString("default", { day: "2-digit" });
};

const listener = app.listen(process.env.PORT || 3000, () => {
    console.log('Your app is listening on port ' + listener.address().port)
})
