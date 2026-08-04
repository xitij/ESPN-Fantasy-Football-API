import _ from 'lodash';

import BaseObject from '../base-classes/base-object/base-object';

import BoxscorePlayer from '../boxscore-player/boxscore-player';

/**
 * Represents a boxscore for a week.
 *
 * @augments {BaseObject}
 */
class Boxscore extends BaseObject {
  static displayName = 'Boxscore';

  /**
   * @typedef {object} BoxscoreMap
   *
   * @property {string} playoffTierType The playoff tier for the matchup. Typical values include
   *   `WINNERS_BRACKET`, `LOSERS_CONSOLATION_LADDER`, and `NONE` (regular season).
   * @property {string} winner Which side won the matchup. Typical values include `HOME`, `AWAY`,
   *   and `UNDECIDED` (e.g. in-progress matchups or playoff byes).
   * @property {number|undefined} winnerTeamId The team id of the winning side. Derived from
   *   `winner` and the home/away team ids. `undefined` when the winner is not `HOME` or `AWAY`.
   *
   * @property {number} homeScore The total points scored by the home team.
   * @property {number} homeProjectedScore The projected total points scored by the home team.
   *   NOTE: This field is only populated in the boxscore for the current matchup period!
   * @property {number} homeTeamId The home team's id. Can be used to load a cached Team.
   * @property {BoxscorePlayer[]} homeRoster The home team's roster, containing player info and
   *                                         stats.
   *
   * @property {number} awayScore The total points scored by the away team.
   * @property {number} awayProjectedScore The projected total points scored by the away team.
   *   NOTE: This field is only populated in the boxscore for the current matchup period!
   * @property {number} awayTeamId The away team's id. Can be used to load a cached Team.
   * @property {BoxscorePlayer[]} awayRoster The away team's roster, containing player info and
   *                                         stats.
   */

  /**
   * @type {BoxscoreMap}
   */
  static responseMap = {
    playoffTierType: 'playoffTierType',
    winner: 'winner',
    winnerTeamId: {
      key: 'winner',
      manualParse: (winner, data) => {
        if (winner === 'HOME') {
          return _.get(data, 'home.teamId');
        }

        if (winner === 'AWAY') {
          return _.get(data, 'away.teamId');
        }

        return undefined;
      }
    },

    homeScore: {
      key: 'home',
      manualParse: (responseData) => (
        _.get(responseData, 'totalPointsLive') || _.get(responseData, 'totalPoints')
      )
    },
    homeProjectedScore: 'home.totalProjectedPointsLive',
    homeTeamId: 'home.teamId',
    homeRoster: {
      key: 'home.rosterForCurrentScoringPeriod.entries',
      isArray: true,
      manualParse: (responseData, data, rawData, constructorParams) => _.map(
        responseData,
        (playerData) => BoxscorePlayer.buildFromServer(playerData, constructorParams)
      )
    },

    awayScore: {
      key: 'away',
      manualParse: (responseData) => (
        _.get(responseData, 'totalPointsLive') || _.get(responseData, 'totalPoints')
      )
    },
    awayProjectedScore: 'away.totalProjectedPointsLive',
    awayTeamId: 'away.teamId',
    awayRoster: {
      key: 'away.rosterForCurrentScoringPeriod.entries',
      isArray: true,
      manualParse: (responseData, data, rawData, constructorParams) => _.map(
        responseData,
        (playerData) => BoxscorePlayer.buildFromServer(playerData, constructorParams)
      )
    }
  };
}

export default Boxscore;
