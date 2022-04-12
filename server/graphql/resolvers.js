const { User } = require('../models')

module.exports = {
    Query: {
        getUsers: async () => {
            try{
                const users = await User.findAll();

                return users;
            } catch (err){
                console.log(err);
            }
        },
    },

    Mutation: {
        register: async (parent, args) => {
            let {username, email, password, confirmPassword} = args;

            try {

                // Validate input data

                // Check if user/email exists

                // Hash pass
                // #3 14:32 npm install bcryptjs -- will do later if neccessary

                // Create User
                const user = await User.create({
                    username, email, password
                });
                // Return User
                return user;
            } catch(err){
                console.log(err);
                throw err;
            }
        }
    }

};