const { User } = require('../models/user')

module.exports = {
    Query: {
        getUsers: () => {
            try{
                const users = await User.findAll();

                return users;
            } catch (err){
                console.log(err);
            }
        },
    },

};