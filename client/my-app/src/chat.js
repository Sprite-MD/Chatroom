import { ApolloClient, InMemoryCache, useMutation, useSubscription, gql} from '@apollo/client';
import { webSocketLink } from "@apollo/client/link/ws";
import {Container, Chip, Grid, TextField, Button} from "@material-ui/core";

const link = new webSocketLink({
    uri: `ws://localhost:4000/`,
    options: {
        reconnect: true,
    },
});

export const client = new ApolloClient({
    link,
    uri: 'HTTP://localhost:4000/',
    cache: new InMemoryCache(),
});

export const Chat = () => {
    return (
        <div>
            <h3>Welcome to the chatroom.</h3>
        </div>
    )
}