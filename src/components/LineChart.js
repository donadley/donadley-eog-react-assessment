import React from 'react';

import 'tui-chart/dist/tui-chart.css';
import {LineChart} from '@toast-ui/react-chart';
import {Measurement} from '../utils/types';


const getCategories = metrics => {
    // Collect the timestamp of each metric
    return metrics[0].measurements.map(metric => new Date(metric.at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
}

const getSeries = metrics => {
    // Collect the values of each metric
  return metrics.map(metric => {
        return {
            name: metric.metric,
            data: metric.measurements.map(metric => {
                if(metric && metric.value){
                   return metric.value
                }else{
                    return metric.map((prop) => prop.value);
                }
            }
            )
        }
    });
}



const options = {
  chart: {
        title: 'Metrics'
    },
    yAxis: {
    },
    xAxis: {
        title: 'seconds',
        labelInterval: 3,
        tickInterval: 'auto'
    },
    series: {
        showLabel: false,
        spline: true,
        showDot: false,
        shifting: true
    },    
    tooltip: {
        grouped: true
    }
};

export default (metrics) => {

    console.log('lineChart', metrics);
    if(metrics && metrics.metrics && metrics.metrics.length > 0){
        const data = {
            categories: getCategories(metrics.metrics),
            series: getSeries(metrics.metrics)
        };


        return <LineChart
            data={data} 
            options={options} 
        />
    } else {
        return <></>
    }
};