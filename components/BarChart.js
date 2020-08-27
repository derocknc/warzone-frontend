import Chart from 'chart.js';
import { useEffect, useState, useRef } from 'react';
import "../styles/styles.scss"

export default function BarChart(props) {

const { playerData, statType, type, label } = props;

const getNames = () => {
  return playerData?.map(player => player?.playerName);
}

const chartRef = useRef(null);

const getData = (statType) => {
  if (statType === 'revives') {
    return playerData?.map((player) => {
      return (player?.br.revives / player?.br.gamesPlayed);
    });
  }
  if (statType === 'winPercentage') {
    return playerData?.map((player) => {
      return (player?.br.wins / player?.br.gamesPlayed);
    });
  }
  return playerData?.map(player => player.br[statType]);
}

const calculateStepSize = (statType) => {
  const data = getData(statType);
  const highest = Math.max(...data);

  return (highest / 4);
};

useEffect(() => {
  const chartEl = chartRef.current.getContext("2d");

  const { height: graphHeight } = chartEl.canvas;

  let gradientLine = chartEl
    .createLinearGradient(0, 0, 0, graphHeight);
      gradientLine.addColorStop(0, "rgb(73, 166, 164, 1.0)");
      gradientLine.addColorStop(0.25, "rgb(73, 166, 164, 0.25)");
      gradientLine.addColorStop(1, "rgb(73, 166, 164, 0.05)");

  if (playerData) {
    new Chart(chartEl, {
      type: type,
      data: {
        labels: getNames(),
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
                stepSize: calculateStepSize(statType)
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
}, [playerData, statType]);

  return (
    <canvas
      id={statType}
      ref={chartRef}
    />
  )
}
