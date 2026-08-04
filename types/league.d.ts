import type { DraftType, LineupLockTime } from './common';

export interface DraftSettings {
  date?: Date;
  type?: DraftType;
  timePerPick?: number;
  canTradeDraftPicks?: boolean;
}

export interface RosterSettings {
  lineupPositionCount?: Record<string, number>;
  positionLimits?: Record<string, number>;
  locktime?: LineupLockTime;
}

export interface ScheduleSettings {
  numberOfRegularSeasonMatchups?: number;
  regularSeasonMatchupLength?: number;
  numberOfPlayoffMatchups?: number;
  playoffMatchupLength?: number;
  numberOfPlayoffTeams?: number;
}

export declare class League {
  name?: string;
  size?: number;
  isPublic?: boolean;

  currentMatchupPeriodId?: number;
  currentScoringPeriodId?: number;

  draftSettings?: DraftSettings;
  rosterSettings?: RosterSettings;
  scheduleSettings?: ScheduleSettings;
  scoringSettings?: Record<string, number>;

  static displayName: string;
  static buildFromServer(data: object, constructorParams?: object): League;
}
