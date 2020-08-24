import React, { useRef, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions, selectors } from './reducer';
import { useQuery, useSubscription } from 'urql';
import { devtoolsExchange } from '@urql/devtools';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import LinearProgress from '@material-ui/core/LinearProgress';
import LineChart from '../../components/LineChart';
import { Measurement } from '../../utils/types';



const useSubscribe = () => {
  const measurements: 
    {
      metric: string;
      measurements: Measurement[];
    }[] = useSelector(selectors.getMeasurements);
  const selectedMetrices: string[] = useSelector(selectors.getSelectedMetrics);

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

  return data;
};

export default () => {
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
    pollInterval: 5000
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

  // useSubscribe();

  if (fetching) return <LinearProgress />;

  return <LineChart metrics={measurements} />;
};
