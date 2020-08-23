import React from 'react';

import 'tui-chart/dist/tui-chart.css';
import {LineChart} from '@toast-ui/react-chart';

import {Measurement} from '../utils/types';

const getCategories = metrics => {
    // Collect the timestamp of each metric
    const firstValue = metrics.values().next().value;
    if(firstValue && firstValue.length > 0){
        return firstValue.map(metric => {
            if(metric && metric.at)
            {
                return new Date(metric.at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
            }else{
                return;
            }
    })
}
}

const getSeries = metrics => {
    // Collect the values of each metric
    let series = []

    metrics.forEach((value, key) => {
        console.log('MAP', value, key);
        if(value && value.length > 0){
            series.push({
                name: key,
                data: value.map(metric => {
                    if(metric && metric.value){
                       return metric.value;
                    }else{
                        return;
                    }
                })
            });
        }
    });
   
    console.log('series', series[0]);
    return series;
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

export default (props) => {
    const {metrics} = props;
    console.log('lineChart', metrics);

    if(metrics && metrics.size > 0){
        const data = {
            categories: getCategories(metrics),
            series: getSeries(metrics)
        };


        return <LineChart
            data={data} 
            options={options} 
        />
    } else {
        return <></>
    }
};