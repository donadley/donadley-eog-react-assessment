import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions, selectors } from '../Features/Metric/reducer';
import { useSubscription } from 'urql';

import LinearProgress from '@material-ui/core/LinearProgress';
import { Measurement, ApiErrorAction } from '../utils/types';
import Tile from './Title';

export default () => {
  // Query last konwn values

  const query = `
  subscription {
      newMeasurement {
          metric          
          value
      }
  }
  `;

  const selectedMetrics = useSelector(selectors.getSelectedMetrics);
  const newMeasurements = useSelector(selectors.getNewMeasurements);

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
    if (selectedMetrics.indexOf(newMeasurement.metric) != -1) {
      dispatch(actions.newMeasurementReceived(newMeasurement));
    }
  }, [dispatch, data, error]);

  return (
    <>
      {newMeasurements.map(({ metric, value }) => {
        return <Tile metric={metric} value={value}></Tile>;
      })}
    </>
  );
};
