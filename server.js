if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override')

const indexRouter = require('./routes/index');
const foodRouter = require('./routes/foods');
const dishRouter = require('./routes/dishes');

//motor de plantilla
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');

app.use(expressLayouts);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded( {limit: '10mb', extended: false}));
app.use(methodOverride('_method'))

//Middlewares
app.use('/', indexRouter);
app.use('/foods', foodRouter);
app.use('/dishes', dishRouter);

/////MongoDB
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false });
const db1 = mongoose.connection
db1.on('error', error => console.log(error));
db1.once('open', () => console.log('Connected to Mongoose'));

////
app.listen(process.env.PORT || 4000);