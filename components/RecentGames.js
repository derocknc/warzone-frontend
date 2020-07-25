import React from 'react';
import { DateTime } from 'luxon';

export default function RecentGames(props) {
  const { playerWeeklyData } = props;

  const formatDate = (timestamp) => {
    const date = DateTime.fromSeconds(timestamp);
    const { c: { month, day, hour, minute } } = date;
  
    return `${month}/${day} - ${hour}:${minute}`;
  };
  
  // const sortMatches = () => {
  //   const { matches } = currentPlayerData;
  //   return matches.map(match => formatDate(match.utcEndSeconds));  
  // };

  const allMatches = playerWeeklyData.map((current) => current.matches);

  const flatMatches = [].concat(...allMatches);

  const sortedMatches = flatMatches.sort((a, b) => b.utcEndSeconds - a.utcEndSeconds);

  let allMatchesMerged = [];

  let matchIDs = [];
  sortedMatches.forEach((match) => {
    if (!matchIDs.find(id => id === match.matchID)) {
      //TODO: add date to this array
      matchIDs.push(match.matchID);
    }
  });
  matchIDs.forEach((id) => {
    const filtered = sortedMatches.filter(match => match.matchID === id);
    allMatchesMerged.push({ id, filtered })
  })

  return (
    <div className="recent-games">
      {allMatchesMerged && allMatchesMerged.map((match) => {
        const { filtered, id } = match;

        return (
          <div className="match">
            <h2>{id}</h2>
            <div className="player-list">
            <div className="player-list__player">
                <div>Username</div>
                <div>Date</div>
                <div>Mode</div>
                <div>Kills</div>
              </div>
            {filtered.map((playerData) => {
              const { player, playerStats } = playerData;

              return (
                <div className="player-list__player">
                  <div>{player.username}</div>
                  <div>{formatDate(playerData.utcEndSeconds)}</div>
                  <div>{playerData.mode}</div>
                  <div>{playerStats.kills}</div>
                </div>
              )
            })}
            </div>
          </div>
        )
      })}
    </div>
  );
}
