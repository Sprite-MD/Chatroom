const { GraphQLServer, PubSub } = require("graphql-yoga");

const typeDefs = `
    type Message {
        id: ID!
        user: String!
        text: String!
    }

    type Query{
        messages: [Message!]
    }

    type Mutation{
        postMessage(user: String!, text: String!): ID!
    }

    type Subscription{
        messages: [Message!]
    }
`;

const pubsub = new PubSub();

const messages = [];    // stores all messages sent
const subscribers = []; // stores any new messages sent upon listening

const onMessagesUpdates = (user) => subscribers.push(user); // push new users to subscriber array

const resolvers = {
    Query: {    // gets all messages
        messages: () => messages, // returns message array
    },

    Mutation: {     // post new messages and returns id
        postMessage: (parent, {user, text }) => {
            const id = messages.length;     // create id for new message
            messages.push({id, user, text});    // push Message obj to message array
            subscribers.forEach((fn) => fn());
            return id;  
        },
    },

    Subscription: {
        messages: {
            subscribe: (parent, args, {pubsub}) => {
                // Creates random num as channel to publish messages to
                const channel = Math.random().toString(36).slice(2,15);

                // push user to sub array with onMessagesUpdates func
                // publish updated messages arr to channel as callback
                onMessagesUpdates(() => pubsub.publish(channel, {messages}));

                // publish all messages immediately once a user subscribed
                setTimeout(() => pubsub.publish(channel, {messages}), 0);

                return pubsub.asyncIterator(channel);
            },
        },
    },
};

const server = new GraphQLServer({typeDefs, resolvers, context: {pubsub}});
server.start(({ port }) => {
    console.log(`Server started at ${port}`)
})