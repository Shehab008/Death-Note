const express = require('express');

const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');

const User = require('../models/User');

const router = express.Router();

router.post('/register', async(req,res)=>{

    const {username,password,adminKey} = req.body;

    const exists = await User.findOne({username});

    if(exists){

        return res.json({
            msg:'User already exists'
        });

    }

    const hash = await bcrypt.hash(password,10);

    const randomYears =
    Math.floor(Math.random()*60)+20;

    let role = 'user';

    if(adminKey === 'DEATHNOTE_ADMIN_999'){

        role = 'admin';

    }

    const user = new User({

        username,

        password: hash,

        role,

        lifeDays: randomYears * 365

    });

    await user.save();

    res.json({
        msg:'Registered'
    });

});

router.post('/login', async(req,res)=>{

    const {username,password} = req.body;

    const user = await User.findOne({username});

    if(!user){

        return res.json({
            msg:'User not found'
        });

    }

    if(user.banned){

        return res.json({
            banned:true
        });

    }

    const match =
    await bcrypt.compare(password,user.password);

    if(!match){

        return res.json({
            msg:'Wrong password'
        });

    }

    const token = jwt.sign(

        {

            id:user._id,
            role:user.role

        },

        process.env.JWT_SECRET,

        {expiresIn:'7d'}

    );

    res.json({token});

});

module.exports = router;
