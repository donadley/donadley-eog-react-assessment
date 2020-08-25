import { createSlice, PayloadAction } from 'redux-starter-kit';
import { IState } from '../../store';
import {Measurement, ApiErrorAction} from '../../utils/types';


var initialState: State = {
  metric: {
    received: Array<string>(),
    selected: Array<string>()
  },
  measurements: [],
  newMeasurements: []
}

export type State  = {
  metric: {
    received: string[],
    selected: string[]
  };
  measurements: 
  {
    metric: string,
    measurements: Measurement[],
  }[] | [],
  newMeasurements: Measurement[]
  }

// Selectors
const getMetrics = (state: IState) => {
  return state.metric.metric.received;
};

const getSelectedMetrics = (state: IState) => {
  return state.metric.metric.selected;
};

const getMeasurements = (state: IState) => {
  return state.metric.measurements;
};

const getNewMeasurements = (state: IState) => {
  return state.metric.newMeasurements;
};

const metricSlice = createSlice({
  name: 'metric',
  initialState,
  reducers: {
    metricDataReceived: (state, action: PayloadAction<string[]>) => {
      state.metric.received = action.payload;      
    },
    metricDataSelected: (state, action: PayloadAction<string[]>) => {
      state.metric.selected = action.payload;      
    },
    measurementDataReceived: (state, action: PayloadAction<{
      metric: string,
      measurements: Measurement[]
    }[]>) => {
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
      
    },
    newMeasurementReceived: (state, action: PayloadAction<Measurement>) => {
      const {metric} = action.payload;
      const indexOfMeasurement = state.newMeasurements.map((m: Measurement) => m.metric).indexOf(metric);
      if(indexOfMeasurement === -1){
        state.newMeasurements.push(action.payload)
      }else{
        state.newMeasurements[indexOfMeasurement] = action.payload;
      }
    },
    metricApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});

export const selectors = {getMetrics, getMeasurements, getSelectedMetrics, getNewMeasurements};
export const actions = metricSlice.actions;
export const reducer = metricSlice.reducer;
