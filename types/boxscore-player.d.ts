import type { Player, PlayerConstructorParams } from './player';
import type { PlayerStats } from './player-stats';

export declare class BoxscorePlayer extends Player {
  rosteredPosition?: string;
  totalPoints?: number;
  projectedPoints?: number;
  pointBreakdown?: PlayerStats;
  projectedPointBreakdown?: PlayerStats;
  rawStats?: PlayerStats;
  projectedRawStats?: PlayerStats;

  static displayName: string;
  static buildFromServer(data: object, constructorParams?: PlayerConstructorParams): BoxscorePlayer;
}
