/**
 * Compile-only smoke test for public declaration surface.
 * Not executed at runtime and not published to npm.
 */
import {
  Boxscore,
  BoxscorePlayer,
  Client,
  DraftPlayer,
  FreeAgentPlayer,
  League,
  NFLGame,
  Player,
  PlayerStats,
  Team
} from '../types/index';

const client = new Client({ leagueId: 123, espnS2: 's2', SWID: '{swid}' });
client.setCookies({ espnS2: 's2', SWID: '{swid}' });

async function example(): Promise<void> {
  const boxscores: Boxscore[] = await client.getBoxscoreForWeek({
    seasonId: 2025,
    matchupPeriodId: 1,
    scoringPeriodId: 1
  });

  const first: Boxscore | undefined = boxscores[0];
  const winnerTeamId: number | undefined = first?.winnerTeamId;
  const player: BoxscorePlayer | undefined = first?.homeRoster?.[0];
  const projected: number | undefined = player?.projectedPoints;
  const breakdown: PlayerStats | undefined = player?.projectedPointBreakdown;

  const teams: Team[] = await client.getTeamsAtWeek({ seasonId: 2025, scoringPeriodId: 1 });
  const draft: DraftPlayer[] = await client.getDraftInfo({ seasonId: 2025 });
  const freeAgents: FreeAgentPlayer[] = await client.getFreeAgents({
    seasonId: 2025,
    scoringPeriodId: 1
  });
  const league: League = await client.getLeagueInfo({ seasonId: 2025 });
  const games: NFLGame[] = await client.getNFLGamesForPeriod({
    startDate: '20250904',
    endDate: '20250908'
  });

  const basePlayer: Player = new Player({ seasonId: 2025, scoringPeriodId: 1 });

  void winnerTeamId;
  void projected;
  void breakdown;
  void teams;
  void draft;
  void freeAgents;
  void league;
  void games;
  void basePlayer;
}

void example;
