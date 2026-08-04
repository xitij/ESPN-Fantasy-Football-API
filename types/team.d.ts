import type { Player } from './player';

export interface TeamConstructorParams {
  leagueId?: number | string;
  seasonId?: number;
  [key: string]: unknown;
}

export declare class Team {
  constructor(options?: TeamConstructorParams);

  leagueId?: number | string;
  seasonId?: number;

  id?: number;
  abbreviation?: string;
  name?: string;
  ownerName?: string;
  logoURL?: string;
  wavierRank?: number;

  roster?: Player[];

  wins?: number;
  losses?: number;
  ties?: number;
  divisionWins?: number;
  divisionLosses?: number;
  divisionTies?: number;
  homeWins?: number;
  homeLosses?: number;
  homeTies?: number;
  awayWins?: number;
  awayLosses?: number;
  awayTies?: number;

  totalPointsScored?: number;
  regularSeasonPointsFor?: number;
  regularSeasonPointsAgainst?: number;
  winningPercentage?: number;

  playoffSeed?: number;
  finalStandingsPosition?: number;

  static displayName: string;
  static getIDParams(params?: object): object | undefined;
  static getCacheId(idParams?: object): string | undefined;
  static clearCache(): void;
  static get(id: string | number): Team | undefined;
  static buildFromServer(data: object, constructorParams?: TeamConstructorParams): Team;

  getCacheId(): string | undefined;
  getIDParams(): object;
}
