const router = require('express').Router();
const User = require('../model/User-model');
const validation = require('../validation');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


router.post('/register', async (req, res) => {
    
    const { name, email , password, date } = req.body;

    //validate data
    try{
        const returnedValue = await validation.registerValidation(req.body);
        if(returnedValue.error){
            res.status(400).send(returnedValue.error.details[0].message);
        }
    }catch(err){
        res.status(400).send(err);
    }

    //check if user in already in db
    const emailExsist = await User.findOne({email});
    if(emailExsist) return res.status(400).send('Email already exsists');

    //Hash pwd
    const salt = await bcrypt.genSalt(10);
    const hashPass = await bcrypt.hash(password, salt);


    //create new user
    const user = new User({
        name,
        email,
        password: hashPass,
        date
    });
    try {
        const savedUser = await user.save();
        console.log('done saving recd');
        res.send({user: savedUser.id});
    }catch (err){
        console.log(err);
        res.status(400).send(err);
    }
});

//Login
router.post('/login', async (req, res) => {

    const { email , password } = req.body;

    //validate data
    try{
        const returnedValue = await validation.loginValidation(req.body);
        if(returnedValue.error){
            res.status(400).send(returnedValue.error.details[0].message);
        }
    }catch(err){
        res.status(400).send(err);
    }

    //check if user is in db
    const user = await User.findOne({email});
    if(!user) return res.status(400).send('Email or Password does not exsist or it is wrong');

    //check if password is correct
    const validPass = await bcrypt.compare(password, user.password);
    if(!validPass) return res.status(400).send('Invalid pasword');


    //create JWT token
    const token = jwt.sign({id: user.id}, process.env.TOKEN_SECRET, { expiresIn: 60 * 10 });
    res.header('auth-token', token).send(token);

});

module.exports = router;