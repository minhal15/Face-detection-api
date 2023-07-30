const handleRegister = (db, bcrypt) => (req, res) => {
    const { email, name, password } = req.body;
    if (!email || !name || !password) {
        return res.status(400).json('Incorrect form submission');
    }
    const hash = bcrypt.hashSync(password);
    db.transaction(trx => {
        trx.insert({
            hash: hash,
            email: email
        })
        .into('login')
        .returning('email')
        .then(loginEmail => {
            return trx('users')
                .returning('*')
                .insert({
                    email: loginEmail[0].email,
                    name: name,
                    joined: new Date()
                })
                .then(user => {
                    trx.commit(); // Add this line to commit the transaction
                    console.log('Transaction committed successfully.');
                    res.json(user[0]);
                })
                .catch(err => {
                    trx.rollback(); // Add this line to rollback the transaction in case of an error
                    console.error('Error inserting into users table:', err);
                    res.status(500).json('unable to register to user table');
                });
        })
        .catch(err => {
            console.error('Error inserting into login table:', err);
            res.status(500).json('unable to register to login table');
        });
    })
    .catch(err => {
        console.error('Error starting transaction:', err);
        res.status(500).json('unable to start transaction');
    });
};

module.exports = {
    handleRegister: handleRegister
};
