/**
 * Dump raw ESPN boxscore JSON vs this library's cleaned models, plus a gap report.
 *
 * Prerequisites:
 *   npm ci && npm run build
 *   .env with LEAGUE_ID, ESPN_S2, SWID
 *
 * Usage:
 *   npm run explore:boxscore
 *   SEASON_ID=2025 MATCHUP_PERIOD_ID=1 SCORING_PERIOD_ID=1 npm run explore:boxscore
 *
 * Writes to scratch/boxscore/ (gitignored):
 *   raw-response.json       Full ESPN payload
 *   raw-matchups.json       Filtered schedule rows for the matchup period
 *   clean-boxscores.json    Library Boxscore instances
 *   gap-report.json         Unmapped matchup keys + unknown scoring stat ids
 */

require('dotenv/config');

const fs = require('fs');
const path = require('path');

const axios = require('axios');
const _ = require('lodash');

const api = require('../node-dev.js');
const { Boxscore, PlayerStats } = api;

const OUT_DIR = path.join(__dirname, '..', 'scratch', 'boxscore');

const knownStatIds = new Set(
  Object.values(PlayerStats.responseMap).filter((value) => typeof value === 'string')
);

const seasonId = Number(process.env.SEASON_ID || 2025);
const matchupPeriodId = Number(process.env.MATCHUP_PERIOD_ID || 1);
const scoringPeriodId = Number(process.env.SCORING_PERIOD_ID || 1);
const leagueId = process.env.LEAGUE_ID;
const espnS2 = process.env.ESPN_S2;
const SWID = process.env.SWID;

function assertEnv() {
  const missing = ['LEAGUE_ID', 'ESPN_S2', 'SWID'].filter((key) => !process.env[key]);
  if (missing.length) {
    throw new Error(`Missing required .env keys: ${missing.join(', ')}`);
  }
  if (seasonId < 2018) {
    throw new Error('getBoxscoreForWeek requires seasonId >= 2018');
  }
}

function buildAxiosConfig() {
  return {
    baseURL: 'https://lm-api-reads.fantasy.espn.com/apis/v3/games/ffl/seasons/',
    headers: {
      Cookie: `espn_s2=${espnS2}; SWID=${SWID};`
    },
    withCredentials: true
  };
}

function writeJson(filename, data) {
  fs.writeFileSync(path.join(OUT_DIR, filename), `${JSON.stringify(data, null, 2)}\n`);
}

/** Top-level keys on a matchup object that Boxscore.responseMap never reads. */
function findUnmappedMatchupKeys(matchup) {
  const mappedRoots = new Set(['home', 'away']);
  return Object.keys(matchup)
    .filter((key) => !mappedRoots.has(key))
    .sort();
}

/** Nested keys under home/away that Boxscore does not currently map. */
function findUnmappedSideKeys(matchup) {
  const mappedSideKeys = new Set([
    'totalPointsLive',
    'totalPoints',
    'totalProjectedPointsLive',
    'totalProjectedPoints',
    'teamId',
    'rosterForCurrentScoringPeriod'
  ]);

  const report = {};
  ['home', 'away'].forEach((side) => {
    const sideData = matchup[side] || {};
    report[side] = Object.keys(sideData)
      .filter((key) => !mappedSideKeys.has(key))
      .sort();
  });
  return report;
}

/** Collect scoring/stat ids present in raw player stats but missing from constants. */
function findUnknownStatIds(matchups) {
  const unknown = {};

  const visitEntries = (entries = []) => {
    entries.forEach((entry) => {
      const stats = _.get(entry, 'playerPoolEntry.player.stats')
        || _.get(entry, 'stats')
        || [];

      stats.forEach((statBlock) => {
        ['stats', 'appliedStats'].forEach((bagName) => {
          const bag = statBlock[bagName];
          if (!bag || typeof bag !== 'object') {
            return;
          }

          Object.keys(bag).forEach((statId) => {
            if (!knownStatIds.has(statId)) {
              if (!unknown[statId]) {
                unknown[statId] = { count: 0, sampleValue: bag[statId], seenIn: new Set() };
              }
              unknown[statId].count += 1;
              unknown[statId].seenIn.add(bagName);
            }
          });
        });
      });
    });
  };

  matchups.forEach((matchup) => {
    visitEntries(_.get(matchup, 'home.rosterForCurrentScoringPeriod.entries'));
    visitEntries(_.get(matchup, 'away.rosterForCurrentScoringPeriod.entries'));
  });

  return Object.keys(unknown)
    .sort((a, b) => Number(a) - Number(b))
    .map((statId) => ({
      statId,
      count: unknown[statId].count,
      sampleValue: unknown[statId].sampleValue,
      seenIn: [...unknown[statId].seenIn]
    }));
}

/** Sample player-level keys that may be useful to map onto BoxscorePlayer / Player. */
function samplePlayerEntryKeys(matchups) {
  const firstEntry = _.get(matchups, '[0].home.rosterForCurrentScoringPeriod.entries[0]');
  if (!firstEntry) {
    return null;
  }

  return {
    entryKeys: Object.keys(firstEntry).sort(),
    playerPoolEntryKeys: Object.keys(firstEntry.playerPoolEntry || {}).sort(),
    playerKeys: Object.keys(_.get(firstEntry, 'playerPoolEntry.player') || {}).sort()
  };
}

async function main() {
  assertEnv();
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const route = `${seasonId}/segments/0/leagues/${leagueId}`
    + `?view=mMatchup&view=mMatchupScore&scoringPeriodId=${scoringPeriodId}`;

  console.log(`Fetching boxscores: league=${leagueId} season=${seasonId} `
    + `matchupPeriod=${matchupPeriodId} scoringPeriod=${scoringPeriodId}`);

  const response = await axios.get(route, buildAxiosConfig());
  const schedule = _.get(response.data, 'schedule', []);
  const matchups = _.filter(schedule, { matchupPeriodId });

  if (!matchups.length) {
    console.warn('No matchups found for that matchupPeriodId. Wrote full raw response only.');
  }

  const clean = matchups.map((matchup) => (
    Boxscore.buildFromServer(matchup, { leagueId, seasonId, scoringPeriodId })
  ));

  writeJson('raw-response.json', response.data);
  writeJson('raw-matchups.json', matchups);
  writeJson('clean-boxscores.json', clean);

  const gapReport = {
    params: { leagueId, seasonId, matchupPeriodId, scoringPeriodId },
    matchupCount: matchups.length,
    unmappedMatchupKeys: matchups[0] ? findUnmappedMatchupKeys(matchups[0]) : [],
    unmappedHomeAwayKeys: matchups[0] ? findUnmappedSideKeys(matchups[0]) : {},
    unknownStatIds: findUnknownStatIds(matchups),
    samplePlayerEntryKeys: samplePlayerEntryKeys(matchups),
    notes: [
      'Boxscore currently maps only home/away score, projected score, teamId, and roster.',
      'Unknown stat ids are present in ESPN stats bags but missing from src/constants.js.',
      'Compare raw-matchups.json vs clean-boxscores.json for nested field gaps.',
      'Player identity fields are flattened via Player.responseMap (see samplePlayerEntryKeys).'
    ]
  };

  writeJson('gap-report.json', gapReport);

  console.log(`Wrote files to ${OUT_DIR}`);
  console.log(`  matchups: ${matchups.length}`);
  console.log(`  unmapped matchup keys: ${gapReport.unmappedMatchupKeys.join(', ') || '(none)'}`);
  console.log(`  unknown scoring stat ids: ${gapReport.unknownStatIds.length}`);
}

main().catch((error) => {
  console.error(error.response?.data || error);
  process.exit(1);
});
