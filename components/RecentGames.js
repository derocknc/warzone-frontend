import React from 'react';
import {
  Table,
  TableCell,
  TableHead,
  TableBody,
  TableRow,
  TableSortLabel
} from "@material-ui/core";
import { DateTime } from 'luxon';

export default function RecentGames(props) {
  const { playerWeeklyData } = props;

  const formatDate = (timestamp) => {
    const date = DateTime.fromSeconds(timestamp);
    const { c: { month, day, hour, minute } } = date;
  
    return `${month}/${day} - ${hour}:${minute}`;
  };

  const allMatches = playerWeeklyData.map((current) => current.matches);

  const flatMatches = [].concat(...allMatches);

  const sortedMatches = flatMatches.sort((a, b) => b.utcEndSeconds - a.utcEndSeconds);

  let allMatchesMerged = [];

  const modeConfig = {
    'br_brsolo': 'Solos',
    'br_brduos': 'Duos',
    'br_brduostim_name2': 'Stimulus Duos',
    'br_brtrios': 'Trios',
    'br_brquads': 'Quads'
  }

  let matchIDs = [];
  sortedMatches.forEach((match) => {
    const { matchID, mode, utcEndSeconds, playerStats: { teamPlacement } } = match;
    if (!matchIDs.find(id => id.matchID === matchID)) {
      matchIDs.push({ matchID, mode, utcEndSeconds, teamPlacement });
    }
  });
  matchIDs.forEach((game) => {
    const filtered = sortedMatches.filter(match => match.matchID === game.matchID);
    allMatchesMerged.push({ game, filtered })
  })

  const suffixConfig = {
    0: 'th',
    1: 'st',
    2: 'nd',
    3: 'th',
    4: 'th',
    5: 'th',
    6: 'th',
    7: 'th',
    8: 'th',
    9: 'th',
  }

  const formatPlacementSuffix = (number) => {
    const stringified = number.toString();
    const lastDigit = stringified.charAt(stringified.length - 1);
    return suffixConfig[lastDigit];
  };

  const calculateGulag = (kills, deaths) => {
    if (kills && !deaths) {
      return 'W';
    } else if (!kills && !deaths) {
      return 'N/A';
    } else if (kills && deaths) {
      return `W(${deaths})`;
    } else {
      const showDeaths = deaths - 1;
      if (showDeaths) {
        return `L(${deaths - 1})`;
      } else {
        return 'L';
      }
    }
  };

  return (
    <div className="recent-games">
      {allMatchesMerged && allMatchesMerged.map((match) => {
        const { filtered, game } = match;

        return (
          <div className="match">
            <h2>
              <span className={`match__placement ${game.teamPlacement === 1 && `match__placement--first`}`}>
                {`${game.teamPlacement}${formatPlacementSuffix(game.teamPlacement)}`}
              </span>
              {`${modeConfig[game.mode]} @ ${formatDate(game.utcEndSeconds)}`}
            </h2>
            <Table>
              <TableHead>
                <TableCell>
                  Username
                </TableCell>
                <TableCell>
                  Kills
                </TableCell>
                <TableCell>
                  Damage
                </TableCell>
                <TableCell>
                  Gulag
                </TableCell>
              </TableHead>
              <TableBody>
                {filtered.map((playerData) => {
                  const { player, playerStats } = playerData;

                  console.log(playerData);

                  return (
                    <TableRow>
                      <TableCell>
                        {player.username}
                      </TableCell>
                      <TableCell>
                        {playerStats.kills}
                      </TableCell>
                      <TableCell>
                        {playerStats.damageDone}
                      </TableCell>
                      <TableCell>
                        {calculateGulag(playerStats.gulagKills, playerStats.gulagDeaths)}
                      </TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
            </Table>
          </div>
        )
      })}
    </div>
  );
}
