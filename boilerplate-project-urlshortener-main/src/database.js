const mongoose = require('mongoose');

class Database {
    constructor() {
        this._connect();
    }

    _connect() {
        mongoose.connect(process.env.MONGO_URI,
                        {useNewUrlParser: true, useUnifiedTopology: true}
                        )
                        .then(() => console.log('Database connected.'))
                        .catch(err => console.error(err));
    }
}

module.exports = new Database();