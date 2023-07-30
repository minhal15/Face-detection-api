const handleRegister = (db, bcrypt) => (req, res) => {
    const { email, name, password } = req.body;
  
    if (!email || !name || !password) {
      return res.status(400).json('Incorrect form submission');
    }
  
    const hash = bcrypt.hashSync(password);
  
    db.transaction((trx) => {
      trx
        .insert({
          hash: hash,
          email: email,
        })
        .into('login')
        .returning('email')
        .then((loginEmail) => {
          return trx('users')
            .returning('*')
            .insert({
              email: loginEmail[0],
              name: name,
              joined: new Date(),
            })
            .then((user) => {
              res.json(user[0]);
            })
            .catch((error) => {
              res.status(400).json('Unable to insert user into users table');
              console.error('Error inserting user into users table:', error);
            });
        })
        .then(trx.commit)
        .catch((error) => {
          trx.rollback();
          res.status(400).json('Unable to register');
          console.error('Error registering user:', error);
        });
    });
  };
  
  module.exports = {
    handleRegister: handleRegister,
  };
  