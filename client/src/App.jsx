import './App.css';
import {
    ApolloClient,
    InMemoryCache,
    ApolloProvider,
    createHttpLink,
} from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Outlet } from 'react-router-dom';
import Nav from './components/NavTab/NavTabs';
import Footer from './components/Footer/Footer'

const httpLink = createHttpLink({
    uri: '/graphql',
});

// Construct request middleware that will attach the JWT token to every request as an `authorization` header
const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem('id_token');
    return{
        headers: {
            ...headers,
            authorization:token ? `Bearer ${token}` : '',
        },
    };
});

const client = new ApolloClient({
    // Set up our client to execute the `authLink` middleware prior to making the request to our GraphQL API
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

function App() {
    return (
        <ApolloProvider client={client}>
                <Nav />
                <main className="mx-3">
                    <Outlet />
                </main>
                <Footer />
        </ApolloProvider>
    );
}

export default App;
