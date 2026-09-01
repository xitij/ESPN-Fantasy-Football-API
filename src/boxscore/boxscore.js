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
   * Non-starting roster slots excluded when summing roster projected points.
   * @type {string[]}
   */
  static _nonStarterPositions = ['Bench', 'IR'];

  /**
   * Returns the projected team score, preferring ESPN's live team projection when present.
   * Falls back to summing starter `projectedPoints` values on the roster.
   * @private
   *
   * @param  {number|undefined} liveProjectedScore ESPN `totalProjectedPointsLive` value.
   * @param  {BoxscorePlayer[]} [roster=[]] The side's roster.
   * @returns {number} The projected score for the side.
   */
  static _getProjectedScore(liveProjectedScore, roster = []) {
    if (_.isNumber(liveProjectedScore)) {
      return liveProjectedScore;
    }

    const starters = _.reject(roster, (player) => (
      _.includes(this._nonStarterPositions, player.rosteredPosition)
    ));

    return _.sum(
      _.filter(_.map(starters, 'projectedPoints'), _.isNumber)
    );
  }

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
   *   Uses ESPN's live team projection when available; otherwise sums starter
   *   `BoxscorePlayer#projectedPoints` values (Bench/IR excluded).
   * @property {number} homeTeamId The home team's id. Can be used to load a cached Team.
   * @property {BoxscorePlayer[]} homeRoster The home team's roster, containing player info and
   *                                         stats.
   *
   * @property {number} awayScore The total points scored by the away team.
   * @property {number} awayProjectedScore The projected total points scored by the away team.
   *   Uses ESPN's live team projection when available; otherwise sums starter
   *   `BoxscorePlayer#projectedPoints` values (Bench/IR excluded).
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
    homeTeamId: 'home.teamId',
    homeRoster: {
      key: 'home.rosterForCurrentScoringPeriod.entries',
      isArray: true,
      manualParse: (responseData, data, rawData, constructorParams) => _.map(
        responseData,
        (playerData) => BoxscorePlayer.buildFromServer(playerData, constructorParams)
      )
    },
    homeProjectedScore: {
      key: 'home.totalProjectedPointsLive',
      defer: true,
      manualParse: (liveProjectedScore, data, rawData, constructorParams, instance) => (
        Boxscore._getProjectedScore(liveProjectedScore, instance.homeRoster)
      )
    },

    awayScore: {
      key: 'away',
      manualParse: (responseData) => (
        _.get(responseData, 'totalPointsLive') || _.get(responseData, 'totalPoints')
      )
    },
    awayTeamId: 'away.teamId',
    awayRoster: {
      key: 'away.rosterForCurrentScoringPeriod.entries',
      isArray: true,
      manualParse: (responseData, data, rawData, constructorParams) => _.map(
        responseData,
        (playerData) => BoxscorePlayer.buildFromServer(playerData, constructorParams)
      )
    },
    awayProjectedScore: {
      key: 'away.totalProjectedPointsLive',
      defer: true,
      manualParse: (liveProjectedScore, data, rawData, constructorParams, instance) => (
        Boxscore._getProjectedScore(liveProjectedScore, instance.awayRoster)
      )
    }
  };
}

export default Boxscore;
