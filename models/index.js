const mongoose = require('mongoose');

//mongo connection
mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
})

// Mongoose connection object
const db = mongoose.connection;

// Set up an event listener that will fire once the connection opens for db
// Log to the terminal what host and portwe are on
db.once('open', () => {
    console.log(`connected to mongodb at ${db.host}:${db.port}`);
});

db.on('error', (error)=> {
    console.log(`Database error \n ${error}`)
})

module.exports.User = require('./User')