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

  const dateConfig = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    timeZoneName: 'short'
  }

  const monthConfig = {
    'January': '01',
    'February': '02',
    'March': '03',
    'April': '04',
    'May': '05',
    'June': '06',
    'July': '07',
    'August': '08',
    'September': '09',
    'October': '10',
    'November': '11',
    'December': '12'
  };

  const formatDate = (timestamp) => {
    const date = DateTime.fromSeconds(timestamp);
    const stringDate = date.toLocaleString(DateTime.DATETIME_FULL);
    const removedEdt = stringDate.substr(0, stringDate.indexOf('EDT'));
    const splitDate = stringDate.split(' ');
    splitDate[0] = monthConfig[splitDate[0]];
    splitDate.splice(2, 1);
    splitDate.pop();
    splitDate[1] = splitDate[1].split(',')[0];
    
    const month = splitDate[0];
    const day = splitDate[1];
    const time = splitDate[2];
    const amPM = splitDate[3];
  
    return `${month}/${day} - ${time}${amPM}`;
  };

  const allMatches = playerWeeklyData?.map((current) => current?.matches);

  let flatMatches = [];

  if (allMatches) {
    flatMatches = [].concat(...allMatches);
  }

  const sortedMatches = flatMatches?.sort((a, b) => b.utcEndSeconds - a.utcEndSeconds);

  let allMatchesMerged = [];

  const modeConfig = {
    'br_brsolo': 'Solos',
    'br_brbbsolo': 'Stim Solos',
    'br_brduos': 'Duos',
    'br_brduostim_name2': 'Stim Duos',
    'br_brtrios': 'Trios',
    'br_brtriostim_name2': 'Stim Trios',
    'br_brquads': 'Quads',
    'br_brthquad': 'Crossplay - Quads',
    'br_jugg_brquadjugr': 'Juggernaut Quads',
    'br_mini_miniroyale': 'Trios - Mini',
    'br_zxp_zmbroy': 'Zombie Royale'
  }

  let matchIDs = [];
  sortedMatches?.forEach((match) => {
    if (match) {
      const { matchID, mode, utcEndSeconds, playerStats: { teamPlacement } } = match;
      if (!matchIDs.find(id => id.matchID === matchID)) {
        matchIDs.push({ matchID, mode, utcEndSeconds, teamPlacement });
      }
    }
  });
  matchIDs.forEach((game) => {
    const filtered = sortedMatches.filter(match => match?.matchID === game?.matchID);
    allMatchesMerged.push({ game, filtered })
  })

  const suffixConfig = {
    0: 'th',
    1: 'st',
    2: 'nd',
    3: 'rd',
    4: 'th',
    5: 'th',
    6: 'th',
    7: 'th',
    8: 'th',
    9: 'th',
  }

  const formatPlacementSuffix = (number) => {
    const stringified = number?.toString();
    const lastDigit = stringified?.charAt(stringified.length - 1);
    return suffixConfig?.[lastDigit] || '??';
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
              <span className={`match__placement ${game?.teamPlacement === 1 && `match__placement--first`}`}>
                {`${game.teamPlacement}${formatPlacementSuffix(game?.teamPlacement)}`}
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
