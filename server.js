const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
require('dotenv').config();
const { Pool } = require('pg');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: process.env.RENDER_DATABASE_URL,
});
// const db = new Pool({
//   user: 'smart_brain_hqap_user',
//   password: 'vaGqhqNdahzuOUoZqrojVp1ILDnLgZoF',
//   host: 'dpg-cj2r83tiuie55pi4nml0-a.oregon-postgres.render.com',
//   database: 'smart_brain_hqap',
//   port: 5432,
//   ssl: {
//     rejectUnauthorized: false,
//   },
// });

// db.connect((err, client, done) => {
//   if (err) {
//     console.error('Database connection error:', err);
//   } else {
//     console.log('Connected to the database!');
//   }
// });

// db.select('*').from('users').then(data => { console.log(data) })

const app = express(); 
app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res)=> { res.send('success for 2nd deploy'); })

app.post('/signin', signin.handleSignIn(db, bcrypt) )

app.post('/register', register.handleRegister(db, bcrypt) )

app.get('/profile/:id', profile.handleProfile(db) )

app.put('/image', (req, res) => { image.handleImage(req, res, db) } ) // You can add req, res here too but above is advanced functions

app.listen(process.env.PORT, () => { console.log(`app is running on ${process.env.PORT}`) })