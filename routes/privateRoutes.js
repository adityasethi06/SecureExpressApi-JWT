const router = require('express').Router();
const verify  = require('./validateToken');

router.get('/', verify, (req, res) =>{
    console.log(req.user);
    
    res.send('confidential data');
})

module.exports = router;