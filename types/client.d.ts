import type { Boxscore } from './boxscore';
import type { DraftPlayer } from './draft-player';
import type { FreeAgentPlayer } from './free-agent-player';
import type { League } from './league';
import type { NFLGame } from './nfl-game';
import type { Team } from './team';

export interface ClientOptions {
  leagueId?: number | string;
  espnS2?: string;
  SWID?: string;
}

export interface CookieOptions {
  espnS2: string;
  SWID: string;
}

export interface SeasonScoringPeriodOptions {
  seasonId: number;
  scoringPeriodId: number;
}

export interface BoxscoreWeekOptions {
  seasonId: number;
  matchupPeriodId: number;
  scoringPeriodId: number;
}

export interface DraftInfoOptions {
  seasonId: number;
  scoringPeriodId?: number;
}

export interface NFLGamesPeriodOptions {
  startDate: string;
  endDate: string;
}

export interface LeagueInfoOptions {
  seasonId: number;
}

export declare class Client {
  leagueId?: number | string;
  espnS2?: string;
  SWID?: string;

  constructor(options?: ClientOptions);

  setCookies(options: CookieOptions): void;

  getBoxscoreForWeek(options: BoxscoreWeekOptions): Promise<Boxscore[]>;

  getDraftInfo(options: DraftInfoOptions): Promise<DraftPlayer[]>;

  getHistoricalScoreboardForWeek(options: BoxscoreWeekOptions): Promise<Boxscore[]>;

  getFreeAgents(options: SeasonScoringPeriodOptions): Promise<FreeAgentPlayer[]>;

  getTeamsAtWeek(options: SeasonScoringPeriodOptions): Promise<Team[]>;

  getHistoricalTeamsAtWeek(options: SeasonScoringPeriodOptions): Promise<Team[]>;

  getNFLGamesForPeriod(options: NFLGamesPeriodOptions): Promise<NFLGame[]>;

  getLeagueInfo(options: LeagueInfoOptions): Promise<League>;
}
