import type { InjuryStatus, PlayerAvailabilityStatus } from './common';

export interface PlayerConstructorParams {
  seasonId?: number;
  scoringPeriodId?: number;
  [key: string]: unknown;
}

export declare class Player {
  constructor(options?: PlayerConstructorParams);

  seasonId?: number;
  scoringPeriodId?: number;

  id?: number;
  firstName?: string;
  lastName?: string;
  fullName?: string;
  jerseyNumber?: number;
  proTeam?: string;
  proTeamAbbreviation?: string;
  defaultPosition?: string;
  eligiblePositions?: string[];

  averageDraftPosition?: number;
  auctionValueAverage?: number;
  percentChange?: number;
  percentStarted?: number;
  percentOwned?: number;

  acquiredDate?: Date;

  availabilityStatus?: PlayerAvailabilityStatus;
  isDroppable?: boolean;
  isInjured?: boolean;
  injuryStatus?: InjuryStatus;

  outlooksByWeek?: Record<string, string>;

  static displayName: string;
  static flattenResponse: boolean;
  static getIDParams(params?: object): object | undefined;
  static getCacheId(idParams?: object): string | undefined;
  static clearCache(): void;
  static get(id: string | number): Player | undefined;
  static buildFromServer(data: object, constructorParams?: PlayerConstructorParams): Player;

  getCacheId(): string | undefined;
  getIDParams(): object;
}
