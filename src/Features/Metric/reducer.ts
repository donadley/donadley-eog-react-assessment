import { createSlice, PayloadAction } from 'redux-starter-kit';

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
  metric: Array<string>(),
  measurement: {}
}

const metricSlice = createSlice({
  name: 'metric',
  initialState,
  reducers: {
    metricDataReceived: (state, action: PayloadAction<string[]>) => {
      console.log('metricDataReceived, ', action.payload);
      state.metric = action.payload;      
    },
    measurementDataReceived: (state, action: PayloadAction<Measurement>) => {
      console.log('measurementDataReceived, ', action.payload);
      state.measurement = action.payload;
    },
    metricApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});

export const actions = metricSlice.actions;
export const reducer = metricSlice.reducer;