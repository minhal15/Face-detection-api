const handleRegister = (db, bcrypt) => (req, res) => {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
        return res.status(400).json('Incorrect form submission');
    }
    const hash = bcrypt.hashSync(password);

    // Try a simple insert without transactions
    db.insert({
        hash: hash,
        email: email
    })
    .into('login')
    .returning('email')
    .then(loginEmail => {
        // Insert into 'users' table (without transactions for testing)
        db('users')
            .returning('*')
            .insert({
                email: loginEmail[0].email,
                name: name,
                joined: new Date()
            })
            .then(user => {
                console.log('User inserted successfully:', user);
                res.json(user[0]);
            })
            .catch(err => {
                console.error('Error inserting into users table:', err);
                res.status(500).json('unable to register to users table');
            });
    })
    .catch(err => {
        console.error('Error inserting into login table:', err);
        res.status(500).json('unable to register to login table');
    });
};

module.exports = {
    handleRegister: handleRegister
};
