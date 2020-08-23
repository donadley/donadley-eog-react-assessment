import React from 'react';
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
import Measurement from '../Features/Metric/Measurement';
import LineChart from '../components/LineChart';


const useStyles = makeStyles({
  card: {
    margin: '5% 25%',
  },
});

export default () => {
  const classes = useStyles();
  return (
    <Card className={classes.card}>
      <CardHeader title="OK, donadley, you're all setup. Now What?" />
      <CardContent>
          <LineChart />
      </CardContent>
    </Card>
  );
};

// Add ability to select Metrics
// Display the current metric data
// Chart historical metric data
// Submit Your App
