import type { Player, PlayerConstructorParams } from './player';
import type { PlayerStats } from './player-stats';

export declare class DraftPlayer extends Player {
  teamId?: number;
  overallPickNumber?: number;
  roundNumber?: number;
  roundPickNumber?: number;
  isKeeper?: boolean;
  bidAmount?: number;
  nominatingTeamId?: number;
  positionalRanking?: number;
  overallRanking?: number;
  rawStatsForYear?: PlayerStats;
  projectedRawStatsForYear?: PlayerStats;
  pointsScoredThisSeason?: number;

  static displayName: string;
  static getIDParams(params?: object): object | undefined;
  static buildFromServer(data: object, constructorParams?: PlayerConstructorParams): DraftPlayer;
}
