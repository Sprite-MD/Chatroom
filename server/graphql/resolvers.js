const { formatApolloErrors } = require('apollo-server-errors');
const { User } = require('../models')
const {UserInputError} = require('apollo-server')

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
            let error = {}

            try {

                // Validate input data
                if (email.trim() === '') error.email = 'Email must not be empty';
                if (username.trim() === '') error.username = 'Username must not be empty';
                if (password.trim() === '') error.password = 'Password must not be empty';
                if (confirmPassword.trim() === '') error.confirmPassword = 'repeat password must not be empty';

                if (password != confirmPassword) error.confirmPassword = 'Password must match'

                // Check if user/email exists
                const userByUsername = await User.findOne({ where: { username }});
                const userByEmail = await User.findOne({ where: { email }});

                if (userByUsername) error.username = "Username is taken";
                if (userByEmail) error.email = "Email is taken";

                if (Object.keys(error).length  > 0){
                    throw error
                };
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
                throw new UserInputError("Bad input", { error: err });
            }
        }
    }

};