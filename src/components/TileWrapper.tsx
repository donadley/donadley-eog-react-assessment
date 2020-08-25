import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions, selectors } from '../Features/Metric/reducer';
import { useSubscription } from 'urql';


import Tile from './Title';

import Box from '@material-ui/core/Box';


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
    pause: selectedMetrics.length === 0
  });

  const { data, error } = result;
  useEffect(() => {
    if (error) {
      dispatch(actions.metricApiErrorReceived({ error: error.message }));
      console.error('error', error);
      return;
    }
    if (!data) return;
    const { newMeasurement } = data;
    if (selectedMetrics.indexOf(newMeasurement.metric) !== -1) {
      dispatch(actions.newMeasurementReceived(newMeasurement));
    }
  }, [dispatch, data, error, selectedMetrics]);

  if (selectedMetrics.length > 0) {
    return (
      <Box display="flex" flexDirection="column" flexWrap="wrap" height={450} p={1} m={1}>
        {newMeasurements
        .filter(metric => selectedMetrics.indexOf(metric.metric) !== -1)
        .map(({ metric, value }) => {
                return <Box p={1} bgcolor="grey.300" key={Math.random().toString(36).substring(7)}>
                  <Tile metric={metric} value={value}></Tile>
                  </Box>
            
        })}
      </Box>
    );
  }else{
      return <></>
  }
};
