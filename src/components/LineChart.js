import React from 'react';

import 'tui-chart/dist/tui-chart.css';
import {LineChart} from '@toast-ui/react-chart';

import {exampleMutilpleData, exmpleData} from '../exampleData/mockData';


const getCategories = metrics => {
    // Collect the timestamp of each metric
    return metrics[0].measurements.map(metric => new Date(metric.at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'}));
}

const getSeries = metrics => {
    // Collect the values of each metric
    const finished = metrics.map(metric => {
        return {
            name: metric.metric,
            data: metric.measurements.map(metric => metric.value)
        }
    });
    return finished;
}



const options = {
  chart: {
        title: 'Metrics'
    },
    yAxis: {
        title: 'F°'
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
    if(metrics.metrics.length > 0){
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