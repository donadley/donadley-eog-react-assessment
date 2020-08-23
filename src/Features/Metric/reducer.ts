import { createSlice, PayloadAction } from 'redux-starter-kit';
import { IState } from '../../store';
import {Measurement, ApiErrorAction} from '../../utils/types';


var initialState: State = {
  metric: {
    received: Array<string>(),
    selected: Array<string>()
  },
  measurement: [{
    metric: null,
    measurements: null
  }],
  newMeasurements: new Map<string,  null>()
}

export type State  = {
  metric: {
    received: string[],
    selected: string[]
  };
  measurement: 
  [{
    metric: string | null,
    measurements: Measurement[] | null,
  }],
  newMeasurements: Map<string, Measurement[] | null>

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

const getNewMeasurements = (state: IState) => {
  console.log('getNewMeasurements', state);
  return state.metric.newMeasurements;
};

const metricSlice = createSlice({
  name: 'metric',
  initialState,
  reducers: {
    metricDataReceived: (state, action: PayloadAction<string[]>) => {
      console.log('metricDataReceived', action.payload);
      state.metric.received = action.payload;      
    },
    metricDataSelected: (state, action: PayloadAction<string[]>) => {
      console.log('metricDataReceived', action.payload);
      state.metric.selected = action.payload;      
    },
    measurementDataReceived: (state, action: PayloadAction<[{
      metric: string,
      measurements: Measurement[],
    }]>) => {
      console.log('measurementDataReceived', action.payload);
      state.measurement = action.payload;
    },
    measurementSubscriptionDataReceived: (state, action: PayloadAction<Map<string, Measurement[] | null>>) => {
      console.log('measurementSubscriptionDataReceived', action.payload);
      state.newMeasurements = action.payload;
    },
    metricApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});

export const selectors = {getMetrics, getMeasurements, getSelectedMetrics, getNewMeasurements};
export const actions = metricSlice.actions;
export const reducer = metricSlice.reducer;
