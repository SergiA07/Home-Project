if(process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express = require('express');
const app = express();
const expressLayouts = require('express-ejs-layouts');
const mongoose = require('mongoose');
const cors = require('cors')
const bodyParser = require('body-parser');
const methodOverride = require('method-override')
const cookieParser = require('cookie-parser')


const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth');
const userRouter = require('./routes/users');
const foodRouter = require('./routes/foods');
const dishRouter = require('./routes/dishes');
const menuRouter = require('./routes/menus');

//motor de plantilla
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');

app.use(expressLayouts);
app.use(express.static(__dirname + '/public'));
app.use(express.json())
app.use(cors())
app.use(allowCrossDomain);
app.use(bodyParser.urlencoded( {limit: '10mb', extended: false}));
app.use(methodOverride('_method'))
app.use(cookieParser())

//Middlewares
app.use('/', indexRouter);
app.use('/auth', authRouter);
app.use('/users', userRouter);
app.use('/foods', foodRouter);
app.use('/dishes', dishRouter);
app.use('/menus', menuRouter);

/////MongoDB
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true, useFindAndModify: false });
const db1 = mongoose.connection
db1.on('error', error => console.log(error));
db1.once('open', () => console.log('Connected to Mongoose'));

////

function allowCrossDomain(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,POST');
    res.header('Access-Control-Expose-Headers', 'authToken')
    next(); 
}


app.listen(process.env.PORT || 4000);