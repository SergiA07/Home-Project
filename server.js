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
const authorRouter = require('./routes/authors');
const bookRouter = require('./routes/books');





//motor de plantilla
app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.set('layout', 'layouts/layout');

app.use(expressLayouts);
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.urlencoded( {limit: '10mb', extended: false}));
app.use(methodOverride('_method'))

app.use('/', indexRouter);
app.use('/authors', authorRouter);
app.use('/books', bookRouter);

/////MongoDB
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection
db.on('error', error => console.log(error));
db.once('open', () => console.log('Connected to Mongoose'));

//routes

/* app.use((req, res, next) => {
    res.status(404).render('404', {
        titulo: '404',
        descripcion: 'Titulo del sitio'
    })
}); */
////////


app.listen(process.env.PORT || 4000);