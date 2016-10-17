/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
/**
 * Created by BaeBae on 9/20/16.
 */

const year = 2016;
const year2 = 2017;
// parse a date in yyyy-mm-dd format
function parseDate(input) {
  let parsed = Date.parse(input, "YYYY-m-d");
  return new Date(parsed);
}
const defaultSeasons = [
  { name: 't1', type: 'high', startDate: (parseDate(`${year}-12-25`)), endDate: (parseDate(`${year2}-01-09`)) },
  { name: 't2', type: 'high', startDate: (parseDate(`${year2}-02-16`)), endDate: (parseDate(`${year2}-03-09`)) },
  { name: 't3', type: 'medium', startDate: (parseDate(`${year2}-01-10`)), endDate: (parseDate(`${year2}-01-15`)) },
  { name: 't4', type: 'medium', startDate: (parseDate(`${year2}-02-02`)), endDate: (parseDate(`${year2}-02-15`)) },
  { name: 't5', type: 'medium', startDate: (parseDate(`${year2}-03-23`)), endDate: (parseDate(`${year2}-04-05`)) }
];
//console.log(defaultSeasons);
export default function () {
  function createDefaultSeason(hook) {
    const promises = defaultSeasons.map((season) => {
      return hook.app.service('seasons').create(season)
        .catch(err => console.info('err', err));
    });
    Promise.all(promises)
      .then(() => hook);
  }
  
  function updateDefaultSeason(hook) {
    const promises = defaultSeasons.map((season) => {
      const query = { name: season.name };
      return hook.app.service('seasons').patch(null, {
        startDate: season.startDate,
        endDate: season.endDate
      }, { query })
        .then(a=>console.log(a))
        .catch(err => console.info('err', err));
    });
    Promise.all(promises)
      .then(() => hook);
  }
  
  return function createDefaultBoundaries(hook) {
    if (hook.params.provider) {
      return this.find()
        .then((result) => {
          if (result.length === 0) {
            return createDefaultSeason(hook);
          } else {
            //return updateDefaultSeason(hook);
          }
          return hook;
        });
    }
    return hook;
  };
}
