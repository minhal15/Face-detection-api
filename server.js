const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt-nodejs');
const cors = require('cors');
const knex = require('knex');

const register = require('./controllers/register');
const signin = require('./controllers/signin');
const profile = require('./controllers/profile');
const image = require('./controllers/image');

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      user : 'postgres',
      password : '',
      database : 'smart-brain'
    }
  });

db.select('*').from('users').then(data => { console.log(data) })

const app = express(); 
app.use(bodyParser.json());
app.use(cors());


app.get('/', (req, res)=> { res.send('success for 2nd deploy'); })

app.post('/signin', signin.handleSignIn(db, bcrypt) )

app.post('/register', register.handleRegister(db, bcrypt) )

app.get('/profile/:id', profile.handleProfile(db) )

app.put('/image', (req, res) => { image.handleImage(req, res, db) } ) // You can add req, res here too but above is advanced functions

app.listen(process.env.PORT, () => { console.log(`app is running on ${process.env.PORT}`) })