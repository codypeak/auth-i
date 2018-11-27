const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const db = require('./database/dbConfig.js');

const server = express();
server.use(express.json());
server.use(cors());

server.post('/api/register', (req, res) => {
    const creds = req.body;
    const hash = bcrypt.hashSync(creds.password, 4);
    creds.password = hash;
    db('users')
        .insert(creds)
        .then(ids => {
            res.status(201).json(ids);
        })
        .catch(err => json(err));
});

server.post('api/login', (req, res) => {
    const creds = req.body;
    db('users')
        .where({ username: creds.username })
        .first()
        .then(user => {
            if(user && bcrypt.compareSync(creds.password, user.password)) {
                res.status(200).json({ message: 'Logged in'})
            } else {
                res.status(401).json({ message: 'You shall not pass!' })
            }
        })
        .catch(err => json(err));
});

server.get('/api/users', (req, res) =>{
    if (req.session && req.session.username) {
        db('users')
            .select('id', 'username', 'password')
            .then(users => {
                res.json('users')
            })
            .catch(err => json(err));
    } else {
        res.status(401).json({ message: 'You shall not pass!' })
    }
})

server.listen(8000, () => console.log('Running on port 8000'));