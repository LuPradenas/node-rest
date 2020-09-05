require("dotenv").config();

const user = process.env.DB_USER;
const host = process.env.HOST;
const database = process.env.DB_NAME;
const password = process.env.DB_PASS;
const port = process.env.PORT;
const auth = require('./auth')

const { Pool } = require('pg');
const { response } = require("express");
const pool = new Pool({
  user: user,
  host: host,
  database: database,
  password: password,
  port: port,
})

pool.on('error', (err, client) => {
    console.error('Unexpected error on idle client', err)
    process.exit(-1)
  })

//routes
const getAllApps = (request, response) => {
  const category = request.params.category;
    pool.query("SELECT * FROM apps WHERE category = $1 ORDER BY name", [category], (error, results) => {
        if (error) {
            response.status(400).json(error);
          throw error;
        }
        if (results.rows.length == 0){
            response.status(404).json('could not found apps for that category')
        }else {
            response.status(200).json(results.rows);    
        }
      });
}


const getAppsByUser = (request, response) => {
    const id = parseInt(request.params.id);
    let query = 'SELECT apps.name, apps.category, apps.price, apps.img, apps.details' +
       ' FROM ownedapps' + 
           ' INNER JOIN users' + 
                ' ON users.user_id = ownedapps.user_id' +
            ' INNER JOIN apps using(apps_id)' +
            ' WHERE users.user_id = $1' +
            ' ORDER BY apps.name'

  pool.query(query, [id] ,(error, results) => {
    if (error) {
      response.status(400).json(error);
      throw error;
    }
    if (results.rows.length == 0) {
      response.status(404).json("you have no apps yet!")
    }
    response.status(200).json(results.rows);
  });
};

const createApp = (request, response) => {
    const { name, category, price, img, details } = request.body;
  
    pool.query(
      "INSERT INTO apps (name, category, price, img, details) VALUES ($1, $2, $3, $4, $5)",
      [name, category, price, img, details],
      (error, results) => {
        if (error) {
            response.status(400).json(error);
          throw error;
        }
        response.status(201).send(`app added succesfully`);
      }
    );
  };

  const updateApp = (request, response) => {
    const id = parseInt(request.params.id);
    const { name, category, price, img, details } = request.body;
  
    pool.query(
      "UPDATE apps SET name = $1, category = $2, price = $3, img = $4, details = $5 WHERE apps_id = $6",
      [name, category, price, img, details, apps_id],
      (error, results) => {
        if (error) {
            response.status(400).json(error);
          throw error;
        }
        response.status(200).send(`User modified with ID: ${id}`);
      }
    );
  };
  
  const deleteApp = (request, response) => {
    const id = parseInt(request.params.id);
  
    pool.query("DELETE FROM apps WHERE app_id = $1", [id], (error, results) => {
      if (error) {
        response.status(400).json(error);
        throw error;
      }
      response.status(200).send(`app deleted with ID: ${id}`);
    });
  }; 

const login = (request, response) => {
  const maxAge = 3 * 24 * 60 * 60;
    const {email, password} = request.body;

    const query = "SELECT * FROM users WHERE email = $1 AND password = $2"
    pool.query(query, [email, password], (error, results) => {
        if (error) {
          return  response.status(400).json(error);
        } else if (results.rows.length == 0){
          return  response.status(404).json("wrong user or password, try again or sign in a new account")
        }
        const token = auth.generateAccessToken({ username: request.body.username });
        response.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 100000})
        response.status(200).json(results.rows);
      });
}


const signIn = (request, response) => {
  const maxAge = 3 * 24 * 60 * 60;
  const { name, email, password, admin } = request.body;
  const query = "SELECT * FROM users WHERE email = $1"
  let alreadyInDB = [];
  pool.query(
    query, [email],
     (err, results) =>{
       if (err) {
         throw err
       }
       alreadyInDB = results.rows;
    }
  );

  if (alreadyInDB == []){

    response.status(400).json('already exits the user')
  } else {

    pool.query(
      "INSERT INTO users (name, email, password, admin) VALUES ($1, $2, $3, $4)",
      [name, email, password, admin],
      (error, results) => {
        if (error) {
          throw error;
        }
        const token = auth.generateAccessToken({ username: request.body.username });
        response.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 100000})
        response.status(201).json('user created sucessfully, redirected to login');
      }
    );
  }
};


const buy = (req, res) => {
    const {carrito, user} = req.body

    for (let i = 0; i < carrito.length; i++) {
        pool.query(
            "INSERT INTO ownedapps (apps_id, user_id) " +
            " VALUES ($1, $2)",
            [carrito[i], user],
            (error, results) => {
              if (error) {
                  res.status(400).send(error)
                throw error
              }
              res.status(201).send(`succesfuly buy the apps in the cart`);
            }
          );  
    }

}

module.exports = {
  login,
  getAppsByUser,
  getAllApps,
  createApp,
  signIn,
  updateApp,
  deleteApp,
  buy,
};
