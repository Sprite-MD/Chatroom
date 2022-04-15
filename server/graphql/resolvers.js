const { formatApolloErrors } = require('apollo-server-errors');
const { User } = require('../models');
const {UserInputError, AuthenticationError} = require('apollo-server');
const bcrypt = require('bcryptjs');

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

        login: async (parent, args) => {
            const { username, password } = args;
            let errors = {}

            try{
                const user = await User.findOne({
                    where: { username }
                });

                if (!user){
                    errors.username = 'User not found';
                    throw new UserInputError('User not found', { errors });
                }

                const correctPassword = await bcrypt.compare(password, user.password)
                if (!correctPassword){
                    errors.password = 'Password is incorrect'
                    throw new AuthenticationError('Password is incorrect', {errors})
                }

                return user
            }catch(err){
                console.log(err)
                throw err
            };
        },
    },

    Mutation: {
        register: async (parent, args) => {
            let {username, email, password, confirmPassword} = args;
            let errors = {};

            try {

                // Validate input data
                if (email.trim() === '') errors.email = 'Email must not be empty';
                if (username.trim() === '') errors.username = 'Username must not be empty';
                if (password.trim() === '') errors.password = 'Password must not be empty';
                if (confirmPassword.trim() === '') errors.confirmPassword = 'repeat password must not be empty';

                if (password != confirmPassword) errors.confirmPassword = 'Password must match'

                // // Check if user/email exists
                // const userByUsername = await User.findOne({ where: { username }});
                // const userByEmail = await User.findOne({ where: { email }});

                // if (userByUsername) error.username = "Username is taken";
                // if (userByEmail) error.email = "Email is taken";

                if (Object.keys(errors).length  > 0){
                    throw errors;
                };
                // Hash pass
                // #3 14:32 npm install bcryptjs 
                // password = await bcrypt.hash(password, 6);

                // Create User
                const user = await User.create({
                    username, email, password,
                });

                // Return User
                return user;

            } catch(err){
                console.log(err);
                if (err.name === 'SequelizeUniqueConstraintError'){
                    err.errors.forEach( 
                        (e) => (errors[e.path] = `${e.path} is already taken`)
                    )
                    
                } else if (err.name === 'SequelizeValidationError'){
                    err.errors.forEach( (e) => (errors[e.path] = e.message))
                }
                throw new UserInputError("Bad input", { errors });
            }
        }
    }

};