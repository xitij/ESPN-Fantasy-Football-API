import _ from 'lodash';

import BoxscorePlayer from '../boxscore-player/boxscore-player';

import Boxscore from './boxscore';

describe('Boxscore', () => {
  describe('responseMap', () => {
    const buildBoxscore = (data, options) => Boxscore.buildFromServer(data, options);

    let data;
    let playerData;

    beforeEach(() => {
      playerData = {
        lineupSlotId: 2,
        playerPoolEntry: {
          player: {
            stats: [{
              appliedStats: {
                24: 2.3,
                25: 6
              },
              statSourceId: 0,
              statSplitTypeId: 1
            }, {
              appliedStats: {
                24: 4.2,
                25: 1
              },
              statSourceId: 1,
              statSplitTypeId: 1
            }]
          }
        }
      };

      data = {
        playoffTierType: 'NONE',
        winner: 'HOME',
        home: {
          totalPoints: 123,
          teamId: 3,
          rosterForCurrentScoringPeriod: {
            entries: [playerData]
          }
        },
        away: {
          totalPoints: 324,
          teamId: 2,
          rosterForCurrentScoringPeriod: {
            entries: [playerData]
          }
        }
      };
    });

    describe('playoffTierType', () => {
      test('maps to playoffTierType', () => {
        const boxscore = buildBoxscore(data);
        expect(boxscore.playoffTierType).toBe('NONE');
      });
    });

    describe('winner', () => {
      test('maps to winner', () => {
        const boxscore = buildBoxscore(data);
        expect(boxscore.winner).toBe('HOME');
      });
    });

    describe('winnerTeamId', () => {
      describe('manualParse', () => {
        test('maps to home.teamId when winner is HOME', () => {
          data.winner = 'HOME';

          const boxscore = buildBoxscore(data);
          expect(boxscore.winnerTeamId).toBe(data.home.teamId);
        });

        test('maps to away.teamId when winner is AWAY', () => {
          data.winner = 'AWAY';

          const boxscore = buildBoxscore(data);
          expect(boxscore.winnerTeamId).toBe(data.away.teamId);
        });

        test('is undefined when winner is UNDECIDED', () => {
          data.winner = 'UNDECIDED';

          const boxscore = buildBoxscore(data);
          expect(boxscore.winnerTeamId).toBeUndefined();
        });
      });
    });

    describe('homeScore', () => {
      describe('manualParse', () => {
        describe('when totalPointsLive is populated on the team\'s response', () => {
          test('maps to totalPointsLive', () => {
            data.home.totalPointsLive = data.home.totalPoints + 12;

            const boxscore = buildBoxscore(data);
            expect(boxscore.homeScore).toBe(data.home.totalPointsLive);
          });
        });

        describe('when totalPointsLive is not populated on the team\'s response', () => {
          test('maps to totalPoints', () => {
            delete data.home.totalPointsLive;

            const boxscore = buildBoxscore(data);
            expect(boxscore.homeScore).toBe(data.home.totalPoints);
          });
        });
      });
    });

    describe('awayScore', () => {
      describe('manualParse', () => {
        describe('when totalPointsLive is populated on the team\'s response', () => {
          test('maps to totalPointsLive', () => {
            data.away.totalPointsLive = data.away.totalPoints + 12;

            const boxscore = buildBoxscore(data);
            expect(boxscore.awayScore).toBe(data.away.totalPointsLive);
          });
        });

        describe('when totalPointsLive is not populated on the team\'s response', () => {
          test('maps to totalPoints', () => {
            delete data.away.totalPointsLive;

            const boxscore = buildBoxscore(data);
            expect(boxscore.awayScore).toBe(data.away.totalPoints);
          });
        });
      });
    });

    describe('homeRoster', () => {
      describe('manualParse', () => {
        test('maps to BoxscorePlayer instances', () => {
          const boxscore = buildBoxscore(data);

          expect.hasAssertions();
          _.forEach(boxscore.homeRoster, (player) => {
            expect(player).toBeInstanceOf(BoxscorePlayer);
          });
        });
      });
    });

    describe('awayRoster', () => {
      describe('manualParse', () => {
        test('maps to BoxscorePlayer instances', () => {
          const boxscore = buildBoxscore(data);

          expect.hasAssertions();
          _.forEach(boxscore.awayRoster, (player) => {
            expect(player).toBeInstanceOf(BoxscorePlayer);
          });
        });
      });
    });

    describe('homeProjectedScore', () => {
      describe('manualParse', () => {
        test('uses totalProjectedPointsLive when present', () => {
          data.home.totalProjectedPointsLive = 111.5;

          const boxscore = buildBoxscore(data);
          expect(boxscore.homeProjectedScore).toBe(111.5);
        });

        test('sums starter projectedPoints when live projection is absent', () => {
          delete data.home.totalProjectedPointsLive;

          const benchPlayerData = _.cloneDeep(playerData);
          benchPlayerData.lineupSlotId = 20; // Bench
          data.home.rosterForCurrentScoringPeriod.entries = [playerData, benchPlayerData];

          const boxscore = buildBoxscore(data);
          expect(boxscore.homeProjectedScore).toBe(boxscore.homeRoster[0].projectedPoints);
        });
      });
    });

    describe('awayProjectedScore', () => {
      describe('manualParse', () => {
        test('uses totalProjectedPointsLive when present', () => {
          data.away.totalProjectedPointsLive = 98.25;

          const boxscore = buildBoxscore(data);
          expect(boxscore.awayProjectedScore).toBe(98.25);
        });

        test('sums starter projectedPoints when live projection is absent', () => {
          delete data.away.totalProjectedPointsLive;

          const boxscore = buildBoxscore(data);
          expect(boxscore.awayProjectedScore).toBe(boxscore.awayRoster[0].projectedPoints);
        });
      });
    });
  });
});
