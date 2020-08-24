import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions, selectors } from './reducer';
import { Provider, createClient, useQuery, useSubscription, defaultExchanges, subscriptionExchange } from 'urql';
import { devtoolsExchange } from '@urql/devtools';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import LinearProgress from '@material-ui/core/LinearProgress';
import LineChart from '../../components/LineChart';
import { Measurement } from '../../utils/types';

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

const useSubscribe = () => {
  const measurements: [
    {
      metric: string;
      measurements: Measurement[];
    },
  ] = useSelector(selectors.getMeasurements);
  const selectedMetrices: string[] = useSelector(selectors.getSelectedMetrics);
  // const newMeasurements: [
  //   {
  //     metric: string;
  //     measurements: Measurement[];
  //   },
  // ] = useSelector(selectors.getNewMeasurements);

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

  const [result] = useSubscription({
    query,
  });

  const { fetching, data, error } = result;

  useEffect(() => {
    if (error) {
      dispatch(actions.metricApiErrorReceived({ error: error.message }));
      console.error('error', error);
      return;
    }
    if (!data) return;
    const { newMeasurement } = data;

    if(!newMeasurement) return;

    if ( measurements && measurements.length > 0) {
      if (selectedMetrices.indexOf(newMeasurement.metric) != -1) {   
        console.log('newMeasurement',newMeasurement);
        dispatch(actions.measurementSubscriptionDataReceived(newMeasurement));
      }
    }
  }, [dispatch, data, error]);

  // console.log('data', data);
  return data;
};

export default () => {
  return (
    <Provider value={client}>
      <Chart />
    </Provider>
  );
};

const Chart = () => {
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
  const updatedMeasurements = useSelector(selectors.getNewMeasurements);

  const createInput = () => {
    if (selectedMetrics.length > 0) {
      return selectedMetrics.map((metricName: any) => {
        return {
          metricName: metricName,
          after: thirtyMinAgo.current,
        };
      });
    } else {
      return [];
    }
  };

  const input = createInput();

  const [result] = useQuery({
    query,
    variables: {
      input,
    },
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

    // const selectedMeasurements = (metric: string) => {
    //   return getMultipleMeasurements
    //     .filter((measurement: { metric: string; measurements: Measurement[] }) => measurement.metric === metric)
    //     .map((metric: { metric: string; measurements: Measurement[] }) => metric.measurements);
    // };

    // // Collect all of the selected measurements
    // var selectedMeasurements2 = selectedMetrics.map((metric: string) => {
    //   return { metric: metric, measurements: selectedMeasurements(metric) };
    // });
    // console.log('selectedMeasurements', selectedMeasurements2);

    // dispatch(actions.measurementSubscriptionDataReceived(selectedMeasurements2));

    // newMeasurements[newMeasurement.metric] = getMultipleMeasurements.filter(measruement: any => measruement.metric === newMeasurement.metric).measurements
  }, [dispatch, data, error]);

  useSubscribe();

  if (fetching) return <LinearProgress />;

  return <LineChart metrics={measurements} />;
};
