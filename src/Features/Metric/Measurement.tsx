import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions, selectors } from './reducer';
import { Provider, createClient, useQuery, useSubscription, defaultExchanges, subscriptionExchange } from 'urql';
import { devtoolsExchange } from '@urql/devtools';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import LinearProgress from '@material-ui/core/LinearProgress';
import LineChart from '../../components/LineChart';

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



export default () => {

  return (
    <Provider value={client}>
      <Measurement />
    </Provider>
  );
};

const Measurement = () => {
  const thirtyMin = 60000 * 30;
  const thirtyMinAgo = useRef(new Date(new Date().getTime() - thirtyMin).getTime());

  const query = `
  query($input: [MeasurementQuery]) {
    getMultipleMeasurements(input: $input) {
      metric
      measurements{
        metric
        at
        value
        unit
      }
    }
  }
  `;

  const dispatch = useDispatch();
  const selectedMetrics = useSelector(selectors.getSelectedMetrics);
  const measurements = useSelector(selectors.getMeasurements);


  const createInput = () => {
    if(selectedMetrics.length > 0){
      return selectedMetrics.map(metricName => {
        return {
          metricName: metricName,
          after: thirtyMinAgo.current
        }
      });
    }else{
      return [];
    }
  };

  
  const input = createInput();

  const [result] = useQuery({
    query,
    variables: {
      input
    }
  });

  const { fetching, data, error } = result;
  useEffect(() => {
    if (error) {
      dispatch(actions.metricApiErrorReceived({ error: error.message }));
      console.error('error', error);
      return;
    }
    if (!data) return;
    const { getMultipleMeasurements } = data;
    dispatch(actions.measurementDataReceived(getMultipleMeasurements));
  }, [dispatch, data, error]);

  if (fetching) return <LinearProgress />;

  return <LineChart metrics={measurements} />;
};

// const Subscription = () => {
//   const query = `
//   subscription {
//       newMeasurement {
//           metric
//           at
//           value
//           unit
//       }
//   }
// `;

//   const dispatch = useDispatch();
//   const measurements = useSelector(selectors.getMeasurements);

//   const input = {
//     metricName: 'flareTemp',
//     after: Date.now(),
//   };

//   const [result] = useSubscription({
//     query,
//   });

//   console.log('result', result);
//   const { fetching, data, error } = result;

//   if (!data) return <LinearProgress />;

//   if (fetching) return <LinearProgress />;
//   console.log('data', data);

//   return <></>;
// };
