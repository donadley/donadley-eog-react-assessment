export type ApiErrorAction = {
    error: string;
  };
  
  export type Measurement  = {
    metric: string;
    at: Date;
    value: number;
    unit: string;
  };
  