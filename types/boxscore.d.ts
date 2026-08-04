import type { MatchupWinner, PlayoffTierType } from './common';
import type { BoxscorePlayer } from './boxscore-player';

export declare class Boxscore {
  playoffTierType?: PlayoffTierType;
  winner?: MatchupWinner;
  winnerTeamId?: number;

  homeScore?: number;
  homeProjectedScore?: number;
  homeTeamId?: number;
  homeRoster?: BoxscorePlayer[];

  awayScore?: number;
  awayProjectedScore?: number;
  awayTeamId?: number;
  awayRoster?: BoxscorePlayer[];

  static displayName: string;
  static buildFromServer(data: object, constructorParams?: object): Boxscore;
}
