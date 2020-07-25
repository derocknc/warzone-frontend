import Chart from 'chart.js';
import { DateTime } from 'luxon';
import { useEffect, useState, useRef } from 'react';
import "../styles/styles.scss"

export default function LineGraph(props) {

const { playerWeeklyData, currentPlayerData, statType, player, label, type } = props;

const chartRef = useRef(null);

const getData = (statType) => {
  const { matches } = currentPlayerData;
  return matches.map(match => match.playerStats[statType]);
}

const getAverage = (statType) => {
  const { matches } = currentPlayerData;
  const stat = matches.map(match => match.playerStats[statType]);
  const total = stat.reduce((acc, curr) => {
    return acc + curr;
  }, 0);
  if (statType === 'percentTimeMoving') {
    const avg = (total / 20);
    return `${avg.toFixed(0)}%`
  }
  return total / 20;
}


const formatDate = (timestamp) => {
  const date = DateTime.fromSeconds(timestamp);
  const { c: { month, day, hour, minute } } = date;

  return `${month}/${day} - ${hour}:${minute}`;
};

const getDates = () => {
  const { matches } = currentPlayerData;
  return matches.map(match => formatDate(match.utcEndSeconds));  
};

useEffect(() => {
  const chartEl = chartRef.current.getContext("2d");

  const { height: graphHeight } = chartEl.canvas;

  let gradientLine = chartEl
    .createLinearGradient(0, 0, 0, graphHeight);
      gradientLine.addColorStop(0, "rgb(73, 166, 164, 1.0)");
      gradientLine.addColorStop(0.25, "rgb(73, 166, 164, 0.25)");
      gradientLine.addColorStop(1, "rgb(73, 166, 164, 0.05)");

  if (playerWeeklyData) {
    new Chart(chartEl, {
      type: type,
      data: {
        labels: getDates(),
        datasets: [
          {
            label: `Average: ${getAverage(statType)}`,
            data: getData(statType),
            backgroundColor: gradientLine,
            borderColor: 'rgb(73, 166, 164, 1.0)',
            borderWidth: '0',
            hoverBorderWidth: '2',
            pointRadius: 2
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          xAxes: [{
            gridLines: {
                display: false,
            },
            ticks: {
              fontColor: '#CFD5D5',
            }
          }],
          yAxes: [{
              gridLines: {
                  display: false,
              },
              ticks: {
                fontColor: '#CFD5D5',
                min: 0,
              }
          }]
        },
        legend: {
          labels: {
            fontColor: '#CFD5D5',
            boxWidth: 0
          }
        }
      }
    });
  }
}, [player, statType]);

  return (
    <canvas
      id={statType}
      ref={chartRef}
    />
  )
}
