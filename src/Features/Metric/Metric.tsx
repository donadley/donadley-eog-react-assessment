import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { actions, selectors } from './reducer';
import { Provider, createClient, useQuery } from 'urql';
import LinearProgress from '@material-ui/core/LinearProgress';
import MultipleSelect from '../../components/MultipleSelect';

const client = createClient({
  url: 'https://react.eogresources.com/graphql',
});



export default () => {
  return (
    <Provider value={client}>
      <Metric />
    </Provider>
  );
};



const Metric = () => {
  // Query for list of available metrics
  const query = `
  {
    getMetrics
  }
  `;

  const dispatch = useDispatch();

  const updateSelected = (selected: string[]) => {
    dispatch(actions.metricDataSelected(selected));
  }

  const metricList = useSelector(selectors.getMetrics);

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
    const { getMetrics } = data;
    dispatch(actions.metricDataReceived(getMetrics));
  }, [dispatch, data, error]);

  if (fetching) return <LinearProgress />;

  return <MultipleSelect selectionList={metricList} callback={updateSelected} ></MultipleSelect>
};