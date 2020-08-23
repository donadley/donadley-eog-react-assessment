import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions } from './reducer';
import { Provider, createClient, useQuery } from 'urql';
import { useGeolocation } from 'react-use';
import LinearProgress from '@material-ui/core/LinearProgress';
import Chip from '../../components/Chip';
import { IState } from '../../store';
import MultipleSelect from '../../components/MultipleSelect';

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
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
  }, [dispatch, data, error]);

  if (fetching) return <LinearProgress />

  return <></>
};
