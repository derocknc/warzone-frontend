import {
  Table,
  TableCell,
  TableHead,
  TableBody,
  TableRow,
  TableSortLabel
} from "@material-ui/core";
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import { useEffect, useState, useRef } from 'react';
import LineGraph from './LineGraph';
import "../styles/styles.scss";

export default function LastTwentyStats(props) {
  const { playerWeeklyData } = props;

  const getRounded = (number, decimals) => {
    return number.toFixed(decimals);
  };

  const convertToPercentage = (number) => {
    const percentage = number * 100;
    return percentage.toFixed(0);
  };

  const allPlayers = playerWeeklyData?.map((player => player.playerName));

  const allIndividualStats = [
    {
      stat: 'teamPlacement',
      label: 'Team Placement'
    },
    {
      stat: 'kills',
      label: 'Kills'
    },
    {
      stat: 'damageDone',
      label: 'Damage'
    },
    {
      stat: 'percentTimeMoving',
      label: '% Time Moving'
    }
  ];

  const [currentPlayer, setCurrentPlayer] = useState(allPlayers?.[0]);
  const [currentStat, setCurrentStat] = useState(allIndividualStats?.[0].stat);

  const getLabel = () => {
    const curr = allIndividualStats?.find(stat => stat.stat === currentStat);
    return curr.label;
  };

  const getCurrentPlayerData = () => {
    return playerWeeklyData?.find(weeklyData => weeklyData.playerName === currentPlayer);
  };

  const handleChange = (event) => {
    setCurrentPlayer(event.target.value);
  };

  const handleStatChange = (event) => {
    setCurrentStat(event.target.value);
  };

  const calculateGulagKD = (matches) => {
    let kills = 0;
    let deaths = 0;
    matches.forEach((match) => {
      const { playerStats: { gulagKills, gulagDeaths } } = match;

      if (gulagKills) {
        kills += 1;
      } else if (!gulagKills && gulagDeaths) {
        deaths += 1;
      }
    });
    const ratio = kills / deaths;

    return getRounded(ratio, 2);
  };

  return (
    <>
      <div className="table-container">
        <h1 className="table-container__heading">Last 20 Games</h1>
        <Table>
          <TableHead >
            <TableCell>
              Name
            </TableCell>
            <TableCell>
              K/D
            </TableCell>
            <TableCell>
              K/G
            </TableCell>
            <TableCell>
              Gulag
            </TableCell>
            <TableCell>
              Dmg/G
            </TableCell>
          </TableHead>
          <TableBody>
            {playerWeeklyData && playerWeeklyData.map((player) => {

              const { matches } = player;

              return (
                <TableRow>
                  <TableCell>
                    {player.playerName}
                  </TableCell>
                  <TableCell>
                    {getRounded(player.summary.all.kdRatio, 2)}
                  </TableCell>
                  <TableCell>
                    {getRounded(player.summary.all.killsPerGame, 2)}
                  </TableCell>
                  <TableCell>
                    {calculateGulagKD(matches)}
                  </TableCell>
                  <TableCell>
                    {getRounded(player.summary.all.damageDone / player.matches.length, 0)}
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
      <div className="per-player">
        <div className="per-player__selects">
          <div className="per-player__select per-player__select--player">
            <FormControl>
              <InputLabel id="demo-simple-select-label">Player</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={currentPlayer}
                onChange={handleChange}
              >
              {allPlayers && allPlayers.map((player, i) => {
                return (
                  <MenuItem
                    key={i}
                    value={player}
                  >
                    {player}
                  </MenuItem>
                )
              })}
              </Select>
            </FormControl>
          </div>
          <div className="per-player__select">
            <FormControl>
              <InputLabel id="demo-simple-select-label">Stat</InputLabel>
              <Select
                labelId="demo-simple-select-label"
                id="demo-simple-select"
                value={currentStat}
                onChange={handleStatChange}
              >
              {allIndividualStats.map((stat, i) => {
                return (
                  <MenuItem
                    key={i}
                    value={stat.stat}
                  >
                    {stat.label}
                  </MenuItem>
                )
              })}
              </Select>
            </FormControl>
          </div>
        </div>
        <div className="per-player__graph">
          <LineGraph 
            playerWeeklyData={playerWeeklyData}
            currentPlayerData={getCurrentPlayerData()}
            type="line"
            player={currentPlayer}
            statType={currentStat}
            label={getLabel()}
          />
        </div>
      </div>
    </>
  )
}
