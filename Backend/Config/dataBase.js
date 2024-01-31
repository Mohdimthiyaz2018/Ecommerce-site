const mongoose = require('mongoose');

const connectDatabase = () => {
    mongoose.connect(process.env.DB_URL,
        {
            useNewUrlParser : true,
            useUnifiedTopology : true
        }).then( (con)=> {
            console.log(`Database is connected to the host : ${con.connection.host}`);
        } ).catch( (err) => {
            console.log(err);
        } )
}

module.exports = connectDatabase;