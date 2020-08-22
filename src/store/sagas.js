import { spawn } from 'redux-saga/effects';
import metricSaga from '../Features/Metric/saga';

export default function* root() {
  yield spawn(metricSaga);
}
