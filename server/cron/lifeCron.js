const cron = require('node-cron');

const User = require('../models/User');

cron.schedule('0 0 * * *', async()=>{

    const users = await User.find();

    for(const user of users){

        if(!user.dead){

            user.lifeDays -= 1;

            if(user.lifeDays <= 0){
                user.dead = true;
            }

            await user.save();
        }

    }

    console.log('Life Updated');

});