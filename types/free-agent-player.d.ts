import type { Player, PlayerConstructorParams } from './player';
import type { PlayerStats } from './player-stats';

export declare class FreeAgentPlayer extends Player {
  rawStatsForYear?: PlayerStats;
  projectedRawStatsForYear?: PlayerStats;
  rawStatsForScoringPeriod?: PlayerStats;
  projectedRawStatsForScoringPeriod?: PlayerStats;

  static displayName: string;
  static buildFromServer(data: object, constructorParams?: PlayerConstructorParams): FreeAgentPlayer;
}
