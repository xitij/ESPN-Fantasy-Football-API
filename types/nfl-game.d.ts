import type { NFLGameStatus } from './common';

export interface NFLTeamInfo {
  id?: number;
  team?: string;
  teamAbbrev?: string;
  record?: string;
  score?: number;
}

export declare class NFLGame {
  startTime?: Date;
  quarter?: number;
  clock?: string;
  odds?: string;
  broadcaster?: string;
  gameStatus?: NFLGameStatus;
  homeTeam?: NFLTeamInfo;
  awayTeam?: NFLTeamInfo;

  static displayName: string;
  static GAME_STATUSES: {
    pre: 'Not Started';
    in: 'In Progress';
    post: 'Final';
  };
  static buildFromServer(data: object, constructorParams?: object): NFLGame;
}
