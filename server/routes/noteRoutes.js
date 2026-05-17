const express = require('express');

const User = require('../models/User');

const auth = require('../middleware/auth');

const router = express.Router();

router.get('/me', auth, async(req,res)=>{

    const user = await User.findById(req.user.id);

    if(!user){

        return res.json({
            deleted:true
        });

    }

    res.json(user);

});

router.get('/all-users', auth, async(req,res)=>{

    if(req.user.role !== 'admin'){

        return res.status(403).json({
            msg:'Access denied'
        });

    }

    const users = await User.find();

    res.json(users);

});

router.delete('/delete-user/:id', auth, async(req,res)=>{

    if(req.user.role !== 'admin'){

        return res.status(403).json({
            msg:'Access denied'
        });

    }

    await User.findByIdAndDelete(req.params.id);

    res.json({
        msg:'User deleted'
    });

});

router.post('/ban/:id', auth, async(req,res)=>{

    if(req.user.role !== 'admin'){

        return res.status(403).json({
            msg:'Access denied'
        });

    }

    const user =
    await User.findById(req.params.id);

    user.banned = true;

    await user.save();

    res.json({
        msg:'User banned'
    });

});

router.post('/unban/:id', auth, async(req,res)=>{

    if(req.user.role !== 'admin'){

        return res.status(403).json({
            msg:'Access denied'
        });

    }

    const user =
    await User.findById(req.params.id);

    user.banned = false;

    await user.save();

    res.json({
        msg:'User unbanned'
    });

});

router.post('/reset-life/:id', auth, async(req,res)=>{

    if(req.user.role !== 'admin'){

        return res.status(403).json({
            msg:'Access denied'
        });

    }

    const user =
    await User.findById(req.params.id);

    user.lifeDays = 70 * 365;

    await user.save();

    res.json({
        msg:'Life reset'
    });

});

router.post('/add-life/:id', auth, async(req,res)=>{

    if(req.user.role !== 'admin'){

        return res.status(403).json({
            msg:'Access denied'
        });

    }

    const user =
    await User.findById(req.params.id);

    user.lifeDays += 365;

    await user.save();

    res.json({
        msg:'1 year added'
    });

});

router.post('/write', auth, async(req,res)=>{

    const user =
    await User.findById(req.user.id);

    if(!user){

        return res.json({
            deleted:true
        });

    }

    if(user.banned){

        return res.json({
            banned:true
        });

    }

    const note = {

        victimName:req.body.victimName,

        reason:req.body.reason,

        details:req.body.details

    };

    user.notes.unshift(note);

    await user.save();

    setTimeout(async()=>{

        const updated =
        await User.findById(req.user.id);

        if(updated && updated.notes[0]){

            updated.notes[0].status = 'DEAD';

            await updated.save();

        }

    },40000);

    res.json(user);

});

router.post('/eyes', auth, async(req,res)=>{

    const user =
    await User.findById(req.user.id);

    if(!user){

        return res.json({
            deleted:true
        });

    }

    if(user.banned){

        return res.json({
            banned:true
        });

    }

    user.lifeDays =
    Math.floor(user.lifeDays / 2);

    user.eyesActive = true;

    await user.save();

    res.json(user);

});

router.post('/giveup', auth, async(req,res)=>{

    const user =
    await User.findById(req.user.id);

    if(!user){

        return res.json({
            deleted:true
        });

    }

    user.hasNotebook = false;

    await user.save();

    res.json(user);

});

router.post('/reclaim', auth, async(req,res)=>{

    const user =
    await User.findById(req.user.id);

    if(!user){

        return res.json({
            deleted:true
        });

    }

    user.hasNotebook = true;

    await user.save();

    res.json(user);

});

module.exports = router;
