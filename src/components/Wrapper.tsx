import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';

import { Provider, createClient, defaultExchanges, subscriptionExchange } from 'urql';
import { devtoolsExchange } from '@urql/devtools';
import { SubscriptionClient } from 'subscriptions-transport-ws';

const subscriptionClient = new SubscriptionClient('ws://react.eogresources.com/graphql', {
  reconnect: true,
});

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
  exchanges: [
    devtoolsExchange,
    ...defaultExchanges,
    subscriptionExchange({
      forwardSubscription: operation => subscriptionClient.request(operation),
    }),
  ],
});

const useStyles = makeStyles({
  root: {
    flexGrow: 1,
  },
});

const Wrapper: React.FC = ({ children }) => {
  const classes = useStyles();
  return (
    <Provider value={client}>
      <div className={classes.root}>
        <Grid container spacing={1}>
          {children}
        </Grid>
      </div>
    </Provider>
  );
};

export default Wrapper;
