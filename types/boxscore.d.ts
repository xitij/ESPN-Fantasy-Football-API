import type { MatchupWinner, PlayoffTierType } from './common';
import type { BoxscorePlayer } from './boxscore-player';

export declare class Boxscore {
  playoffTierType?: PlayoffTierType;
  winner?: MatchupWinner;
  winnerTeamId?: number;

  homeScore?: number;
  /**
   * Projected total points for the home team.
   * Uses ESPN's live team projection when available; otherwise sums starter
   * `BoxscorePlayer.projectedPoints` values (Bench/IR excluded).
   */
  homeProjectedScore?: number;
  homeTeamId?: number;
  homeRoster?: BoxscorePlayer[];

  awayScore?: number;
  /**
   * Projected total points for the away team.
   * Uses ESPN's live team projection when available; otherwise sums starter
   * `BoxscorePlayer.projectedPoints` values (Bench/IR excluded).
   */
  awayProjectedScore?: number;
  awayTeamId?: number;
  awayRoster?: BoxscorePlayer[];

  static displayName: string;
  static buildFromServer(data: object, constructorParams?: object): Boxscore;
}
