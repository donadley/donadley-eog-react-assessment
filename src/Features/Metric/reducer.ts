import { createSlice, PayloadAction } from 'redux-starter-kit';
import { IState } from '../../store';

import Measurement from './Measurement';

export type ApiErrorAction = {
  error: string;
};

export type Measurement  = {
  metric: string;
  at: Date;
  value: number;
  unit: string;
};

var initialState = {
  metric: {
    received: Array<string>(),
    selected: Array<string>()
  },
  measurement: <Measurement[]>[]
}

// Selectors
const getMetrics = (state: IState) => {
  console.log('getMetrics', state);
  return state.metric.metric.received;
};

const getSelectedMetrics = (state: IState) => {
  console.log('getSelectedMetrics', state);
  return state.metric.metric.selected;
};

const getMeasurements = (state: IState) => {
  console.log('getMeasurements', state);
  return state.metric.measurement;
};

const metricSlice = createSlice({
  name: 'metric',
  initialState,
  reducers: {
    metricDataReceived: (state, action: PayloadAction<string[]>) => {
      console.log('metricDataReceived, ', action.payload);
      state.metric.received = action.payload;      
    },
    metricDataSelected: (state, action: PayloadAction<string[]>) => {
      console.log('metricDataReceived, ', action.payload);
      state.metric.selected = action.payload;      
    },
    measurementDataReceived: (state, action: PayloadAction<[Measurement]>) => {
      console.log('measurementDataReceived, ', action.payload);
      state.measurement = action.payload;
    },
    metricApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});

export const selectors = {getMetrics, getMeasurements, getSelectedMetrics};
export const actions = metricSlice.actions;
export const reducer = metricSlice.reducer;
