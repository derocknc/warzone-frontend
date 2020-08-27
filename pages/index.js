import Head from 'next/head';
import axios from 'axios';
import Chart from 'chart.js';
import {
  Table,
  TableCell,
  TableHead,
  TableBody,
  TableRow,
  TableSortLabel
} from "@material-ui/core";
import { useEffect, useState, useRef } from 'react';
import BarChart from '../components/BarChart';
import TabPanels from '../components/TabPanels';
import "../styles/styles.scss";

const prodHost = 'https://wz-api.herokuapp.com';
const localhost = 'http://localhost:4000';

const host = process.env.NODE_ENV === 'production' ? prodHost : localhost;

export default function Home() {

const [playerData, setPlayerData] = useState(null);
const [playerWeeklyData, setPlayerWeeklyData] = useState(null);

useEffect(() => {
  (async () => {
    if (!playerData) {
      try {
        const response = await axios.get(`${host}/`);
        setPlayerData(response.data);
      } catch(error) {
        console.log(error);
      }
    }
    if (!playerWeeklyData) {
      try {
        const response = await axios.get(`${host}/weekly`);
        setPlayerWeeklyData(response.data);
      } catch(error) {
        console.log(error);
      }
    }
  })();
}, []);

  return (
    <div className="container">
      <TabPanels
        playerData={playerData}
        playerWeeklyData={playerWeeklyData}
      />
    </div>
  )
}
