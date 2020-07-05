import Chart from 'chart.js';
import { useEffect, useState, useRef } from 'react';
import "../styles/styles.scss"

export default function LineGraph(props) {

const { playerWeeklyData, currentPlayerData, statType, player, label, type } = props;

const chartRef = useRef(null);

const getData = (statType) => {
  const { matches } = currentPlayerData;
  console.log(statType);
  console.log(matches.map(match => match.playerStats[statType]));
  return matches.map(match => match.playerStats[statType]);
}

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
        labels: currentPlayerData.matches.map((match, i) => i),
        datasets: [
          {
            label: label,
            data: getData(statType),
            backgroundColor: gradientLine,
            borderColor: 'rgb(73, 166, 164, 1.0)',
            borderWidth: '0',
            hoverBorderWidth: '2',
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
