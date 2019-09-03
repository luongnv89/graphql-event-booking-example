import React from 'react';

import { Bar } from 'react-chartjs';

const BOOKINGS_BUCKETS = {
  Cheap: {
    min: 0,
    max: 100
  },
  Normal: {
    min: 100,
    max: 1000
  },
  Expensive: {
    min: 1000,
    max: 1000000000
  }
};

const bookingChart = props => {
  const chartData = {labels: [], datasets: []};
  let value = [];
  for (const bucket in BOOKINGS_BUCKETS) {
    const filteredBookingsCount = props.bookings.reduce((prev, current) => {
      if (current.event.price >= BOOKINGS_BUCKETS[bucket].min && current.event.price < BOOKINGS_BUCKETS[bucket].max ) {
        return prev + 1;
      } else {
        return prev;
      }
    }, 0)
    value.push(filteredBookingsCount);
    chartData.labels.push(bucket);
    chartData.datasets.push({
      data: value
    });

    value = [...value];
    value[value.length - 1] = 0;
  }

  console.log(chartData);
  return <div style={{textAlign: 'center'}}><Bar data={chartData}/></div>;
}

export default bookingChart;