import { takeEvery, call } from 'redux-saga/effects';
import { toast } from 'react-toastify';
import { actions as metricDataReceived } from './reducer';
import { PayloadAction } from 'redux-starter-kit';
import { ApiErrorAction} from '../../utils/types';

function* apiErrorReceived(action: PayloadAction<ApiErrorAction>) {
  yield call(toast.error, `Error Received: ${action.payload.error}`);
}

export default function* watchApiError() {
  yield takeEvery(metricDataReceived.metricDataReceived.type, apiErrorReceived);
}
