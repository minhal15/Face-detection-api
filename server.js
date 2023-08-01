const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');
require('dotenv').config();
// const { Pool } = require('pg');
const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
  client: 'pg',
  connection: {
    connectionString: process.env.DATATBASE_URL,
    ssl: { rejectUnauthorized: false },
    host: process.env.DATABASE_HOST,
    port: 5432,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PW,
    database: process.env.DATABASE_DB
  }
});

const app = express(); 
app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res)=> { res.send('success for 2nd deploy'); })

app.post('/signin', signin.handleSignIn(db, bcrypt) )

app.post('/register', register.handleRegister(db, bcrypt) )

app.get('/profile/:id', profile.handleProfile(db) )

app.put('/image', (req, res) => { image.handleImage(req, res, db) } ) // You can add req, res here too but above is advanced functions

app.listen(process.env.PORT, () => { console.log(`app is running on ${process.env.PORT}`) })