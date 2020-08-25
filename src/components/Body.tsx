import React from 'react';
import Grid from '@material-ui/core/Grid';

import Container from '@material-ui/core/Container';
import Metric from '../Features/Metric/Metric';
import Chart from '../Features/Metric/Chart';
import TileWrapper from '../components/TileWrapper';
import Box from '@material-ui/core/Box';

export default () => {
  return (
    <Container maxWidth="md">
      <Grid item md={12} style={{ backgroundColor: '#cfe8fc' }}>
        <Metric />
      </Grid>
      <Grid item md={12} >
      <Box display="flex" flexDirection="row" flexWrap="wrap" >
          <Chart />
          <TileWrapper />
      </Box>
      </Grid>
    </Container>
  );
};

// Add ability to select Metrics
// Display the current metric data
// Chart historical metric data
// Submit Your App
