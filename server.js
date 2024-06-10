const express = require('express');
const path = require('path');
const jwt = require('jsonwebtoken');
const exjwt = require('express-jwt');

const app = express();
const bodyParser = require('body-parser');
app.use((req,res,next) => {
    res.setHeader('Access-Control-Allow-Origin','https://localhost:3000');
    res.setHeader('Access-Control-Allow-Headers','Content-type,Authorization');
    next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

const PORT = 3000;
const secretKey='My super secret key';
const jwtMW = exjwt({
    secret:secretKey,
    algorithms:['HS256']
});

let users = [
    {
        id: 1,
        username: 'siddhartha',
        password: '123'
    },
    {
        id: 2,
        username: 'komakula',
        password: '456'
    }
];

app.post('/api/login', (req, res) => {
    const {username, password} = req.body;
    for (let user of users) {
        if (username == user.username && password == user.password) {
            let token = jwt.sign({ id: user.id, username: user.username }, secretKey, { expiresIn: '3m' });
            res.json({
                success: true,
                err: null,
                token
            });
            userFound = true; 
            break;
        }
           
        else {
        res.status(401).json({
            success: false,
            token: null,
            err: 'Username or password is incorrect'
        });
    }
}

});

app.get('/api/dashboard', jwtMW, (req, res) => {
    res.json({
        success: true,
        myContent: 'Secret content that only logged-in people can see!!!'
    });
});

app.get('/api/settings', jwtMW, (req, res) => {
    res.json({
        success: true,
        myContent: 'This is settings page!!!'
    });
});

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.use(function(err,req,res,next)  {
    
    if(err.name==='UnauthorizedError') {
    res.status(401).json({
        success:false,
        officialError:err,
        err:'Username or password is incorrect!!'
    });

}  
else {
    next(err);
}

});

app.listen(PORT, () => {
    console.log(`Serving on port ${PORT}`);
});
