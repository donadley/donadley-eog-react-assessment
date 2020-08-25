import React from 'react';
import Grid from '@material-ui/core/Grid';

import Container from '@material-ui/core/Container';
import Card from '@material-ui/core/Card';
import CardHeader from './CardHeader';
import Typography from '@material-ui/core/Typography';
import CardContent from '@material-ui/core/CardContent';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemText from '@material-ui/core/ListItemText';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from './Avatar';
import Metric from '../Features/Metric/Metric';
import Chart from '../Features/Metric/Chart';
import TileWrapper from '../components/TileWrapper';
import Box from '@material-ui/core/Box';

const useStyles = makeStyles({
  card: {
    margin: '5% 25%',
  },
});

export default () => {
  const classes = useStyles();
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
