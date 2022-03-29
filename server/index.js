const {ApolloServer, gql } = require('apollo-server');

// GraphQL schema
const typeDefs = gql`
    type Query{
        messages: [Messages!]
    }

    type Message{
        id: ID!
        user: String!
        text: String!
    }

    type Mutation{
        postMessage(user: String!, text: String!)
    }

    type Subscription{
        messages: [Messages!]
    }
`;

// Resolver: map of funcs which return data for schema
const resolvers = {
    Query: {
        messages: () => messages,
    },

    Mutation: {
        postMessage:(parent, {user, text}) => {
            const id = message.length;
            messages.push({id, user, text});
            suscribers.forEach((fn) => fn());
            return id;
        },
    },

    Subscription: {
        messages: {
            subscribe: (parent, args, {pubsub}) => {
                const channel = Math.random().toString(36).slice(2,15);

                onMessagesUpdates(() => pubsub.publish(channel, {messages}));
            
                setTimeout(() => pubsub.publish(channel, {messages}), 0);

                return pubsub.asyncIterator(channel);
            },

        },
    },

};

const server = new ApolloServer({typeDefs, resolvers});

server.listen().then( ({url}) => {
    console.log(`Server started at ${url}`);
});