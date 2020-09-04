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
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

app.use(cookieParser());
app.use(setRoutes);


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})