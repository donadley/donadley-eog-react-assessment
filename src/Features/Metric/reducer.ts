import { createSlice, PayloadAction } from 'redux-starter-kit';
import { IState } from '../../store';
import {Measurement, ApiErrorAction} from '../../utils/types';


var initialState: any = {
  metric: {
    received: Array<string>(),
    selected: Array<string>()
  },
  measurements: [],
  newMeasurements: null
}

export type State  = {
  metric: {
    received: string[],
    selected: string[]
  };
  measurements: 
  [{
    metric: string,
    measurements: Measurement[],
  }],
  newMeasurements: [{
    metric: string,
    measurements: Measurement[],
  }]
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
  return state.metric.measurements;
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
      console.log('metricDataReceived, ', action.payload);
      state.metric.received = action.payload;      
    },
    metricDataSelected: (state, action: PayloadAction<string[]>) => {
      console.log('metricDataReceived, ', action.payload);
      state.metric.selected = action.payload;      
    },
    measurementDataReceived: (state, action: PayloadAction<{
      metric: string,
      measurements: Measurement[]
    }[]>) => {
      console.log('measurementDataReceived, ', action.payload);
      state.measurements = action.payload;
    },
    measurementSubscriptionDataReceived: (state, action: PayloadAction<Measurement>) => {
      const thrityMinAgo = new Date(new Date().getTime() - 60000 * 3 ).getTime()


      const newMeasurement = action.payload;

      state.measurements     
      .filter((measurement: {
        metric: string,
        measurements: Measurement[],
      }) => measurement.metric === newMeasurement.metric && measurement.measurements && measurement.measurements.length > 0)[0].measurements
      .filter((measurement: Measurement) => new Date(measurement.at).getTime() > thrityMinAgo)
      .push(newMeasurement);
      
      console.log('measurementSubscriptionDataReceived', action.payload);
    },
    metricApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});

export const selectors = {getMetrics, getMeasurements, getSelectedMetrics, getNewMeasurements};
export const actions = metricSlice.actions;
export const reducer = metricSlice.reducer;
