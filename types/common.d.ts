/**
 * Shared string-union types used across the public API.
 * Known ESPN values are listed; `string` remains allowed for forward compatibility.
 */

export type DraftType =
  | 'OFFLINE'
  | 'SNAKE'
  | 'AUTOPICK'
  | 'SNAIL'
  | 'AUCTION'
  | string;

export type InjuryStatus =
  | 'ACTIVE'
  | 'BEREAVEMENT'
  | 'DAY_TO_DAY'
  | 'DOUBTFUL'
  | 'FIFTEEN_DAY_DL'
  | 'INJURY_RESERVE'
  | 'OUT'
  | 'PATERNITY'
  | 'PROBABLE'
  | 'QUESTIONABLE'
  | 'SEVEN_DAY_DL'
  | 'SIXTY_DAY_DL'
  | 'SUSPENSION'
  | 'TEN_DAY_DL'
  | 'NORMAL'
  | string;

export type LineupLockTime =
  | 'INDIVIDUAL_GAME'
  | 'FIRSTGAME_SCORINGPERIOD'
  | string;

export type PlayerAvailabilityStatus =
  | 'FREEAGENT'
  | 'ONTEAM'
  | 'WAIVERS'
  | string;

export type PlayoffTierType =
  | 'WINNERS_BRACKET'
  | 'LOSERS_CONSOLATION_LADDER'
  | 'NONE'
  | string;

export type MatchupWinner =
  | 'HOME'
  | 'AWAY'
  | 'TIE'
  | 'UNDECIDED'
  | string;

export type NFLGameStatus =
  | 'Not Started'
  | 'In Progress'
  | 'Final'
  | string;
