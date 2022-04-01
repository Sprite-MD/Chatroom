module.exports = {
    Query: {
        getUsers: () => {
            // Dummy users for test
            const users = [
                {
                    username: "john",
                    email: "john@gmail.com"
                },
                {
                    username: "huy",
                    email: "huy@gmail.com"
                },
            ]

            return users
        },
    },

};