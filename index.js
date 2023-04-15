const express = require('express');
const mysql = require('mysql2/promise');
const multer = require('multer');
const uuid = require('uuid');
const AWS = require('aws-sdk');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

const app = express();

const s3 = new AWS.S3({
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

// Set up multer storage and file filtering
const storage = multer.memoryStorage();
const upload = multer({
    storage: storage,
    fileFilter: function (req, file, cb) {
        //console.log(file.filename);
        if (file.mimetype !== 'image/jpg' && file.mimetype !== 'image/png') {
            return cb(new Error('Only JPEG and PNG files are allowed'));
        }
        cb(null, true);
    }
});

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401);
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
};


// MySQL configuration
const dbConfig = {
    host: process.env.AWS_DB_ENDPOINT,
    port: '3306',
    user: process.env.AWS_DB_USERNAME,
    password: process.env.AWS_DB_PASSWORD,
    database: 'mydatabase'
};

app.use(express.json());

app.post('/test', (req, res) => {
    res.json({ message: "Testing was successful" })
});

// Start the server
app.listen(3000, () => {
    console.log('Server listening on port 3000');
});