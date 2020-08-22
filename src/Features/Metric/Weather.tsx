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

const query = `
{
  getMetrics
}
`;

const getMetricList = (state: IState) => {
  console.log('getMetricList', state);
  return state.metric.metric;
};

export default () => {
  return (
    <Provider value={client}>
      <Metric />
    </Provider>
  );
};

const Metric = () => {
  const dispatch = useDispatch();
  const metricList = useSelector(getMetricList);

  const [result] = useQuery({
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
    console.log('data', data.getMetrics);
    const { getMetrics } = data;
    dispatch(actions.metricDataReceived(getMetrics));

  }, [dispatch, data, error]);

  if (fetching) return <LinearProgress />;

  
    return <MultipleSelect selectionList={metricList}></MultipleSelect>;

};
