const express = require('express')
const app = express()
const port = 8080
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser');
const setRoutes = require('./routes/setRoutes')

// middleware
app.use(bodyParser.json())
app.use(
  bodyParser.urlencoded({
    extended: true,
  })
)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Headers', 'Content-Type, authorization');
  res.header('Access-Control-Allow-Credentials' ,'true')
  next();
});

app.use(express.static('public'));
app.use(cookieParser());

app.set('view engine', 'ejs');

//view
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', (req, res) => res.render('smoothies'));
app.use(setRoutes);


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})