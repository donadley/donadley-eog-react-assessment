import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';
import { Provider, createClient, useQuery, useSubscription, defaultExchanges, subscriptionExchange } from 'urql';
import { devtoolsExchange } from '@urql/devtools';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { useGeolocation } from 'react-use';
import LinearProgress from '@material-ui/core/LinearProgress';
import Chip from '../../components/Chip';
import { IState } from '../../store';
import MultipleSelect from '../../components/MultipleSelect';

const subscriptionClient = new SubscriptionClient(
    "ws://react.eogresources.com/graphql",
    {
      reconnect: true,
    }
  );

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
  exchanges: [
    devtoolsExchange,
    ...defaultExchanges,
    subscriptionExchange({
        forwardSubscription: operation => subscriptionClient.request(operation)
    })

  ]
});

const getMeasurements = (state: IState) => {
  console.log('getMeasurements', state);
  return state.metric.measurement;
};

export default () => {
  return (
    <Provider value={client}>
      <Measurement />
    </Provider>
  );
};

const Measurement = () => {
  const query = `
  query($input: MeasurementQuery) {
    getMeasurements(input: $input) {
      metric
      at
      value
      unit
    }
  }
  `;

  const dispatch = useDispatch();
  const measurements = useSelector(getMeasurements);

  const input = {
    metricName: "flareTemp",
    after: Date.now()
  };

  const [result] = useQuery({
    query,
    variables: {
      input,
    },
  });

  console.log('result',result);
  const { fetching, data, error } = result;
  useEffect(() => {
    if (error) {
      dispatch(actions.metricApiErrorReceived({ error: error.message }));
      console.error('error', error);
      return;
    }
    if (!data) return;
    console.log('data', data);
    const { getMeasurements } = data;
    dispatch(actions.measurementDataReceived(getMeasurements));
  }, []);

  if (fetching) return <LinearProgress />
  console.log('data', data);

  return <></>
};


const Subscription = () => {

  const query = `
  subscription {
      newMeasurement {
          metric
          at
          value
          unit
      }
  }
`;

const dispatch = useDispatch();
const measurements = useSelector(getMeasurements);

const input = {
  metricName: "flareTemp",
  after: Date.now()
};

const [result] = useSubscription({
  query
});


console.log('result',result);
const { fetching, data, error } = result;

if (!data) return <LinearProgress />;

if (fetching) return <LinearProgress />
console.log('data', data);

return <></>
};