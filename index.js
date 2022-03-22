const {ApolloServer, gql } = require('apollo-server');

const typeDefs = gql`
    type Book{
        title: String
        author: String
    }

    type Query{
        books: [Book]
    }

`;

const books = [
    {
        title: "Book 1",
        author: "Kate Chopp",
    },

    {
        title: "Book 2", 
        author: "John Snow",
    },
];

const resolvers = {
    Query: {
        books: () => books,
    },
};

const server = new ApolloServer({typeDefs, resolvers });

server.listen().then(({url}) => {
    console.log(` Server ready at ${url}`);
});