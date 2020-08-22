import { createSlice, PayloadAction } from 'redux-starter-kit';

export type ApiErrorAction = {
  error: string;
};

var initialState = {
  metric: Array<string>()
}


const metricSlice = createSlice({
  name: 'metric',
  initialState,
  reducers: {
    metricDataReceived: (state, action: PayloadAction<string[]>) => {
      console.log('reducer, ', action.payload);
      state.metric = action.payload;      
    },
    metricApiErrorReceived: (state, action: PayloadAction<ApiErrorAction>) => state,
  },
});

export const actions = metricSlice.actions;
export const reducer = metricSlice.reducer;