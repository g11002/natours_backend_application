const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config({ path: './config.env' });
const app = require('./app.js');

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.DATABASE_PASSWORD);
//const DB = 'mongodb+srv://Jeevan:jeevananil2001@cluster0.qzgwt.mongodb.net/natours?retryWrites=true&w=majority';

mongoose
    .connect(DB, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useFindAndModify: false
    })
    .then(con => {
        //console.log(con.connections);
        console.log('DB connection successful!!');
    })
    .catch(err=>{
        console.log(`db error ${err.message}`);
        process.exit(-1)
    });

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App running on port ${port} ...`);
});