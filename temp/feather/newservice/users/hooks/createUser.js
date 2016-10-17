/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/

const findAndCreate = (hook, uuid, data)=> {
  const services = hook.app.service('clients');
  return services.find({ query: { uuid } })
    .then((result) => {
      const userOptions = {
        resorts: data.resorts,
        languages: data.languages,
        category: data.category,
        background: data.background || '',
      };
      if (result.length === 0) {
        userOptions.uuid = uuid;
        return services.create(userOptions)
          .then(() => hook);
      }
      console.info('options', userOptions);
      const query = { uuid };
      console.info('query', query);
      if (data && data.resorts) {
        // patch only when data is not null;
        // data is null when it's coming from facebook ... to not erase the data already stored
        const query = { uuid };
        return services.patch(null, userOptions, { query })
          .then(() => hook);
      } else {
        return hook;
      }
    });
}
export default function createUser() {
  return (hook)=> {
    let data = hook._data;
    let usertype = '';
    let uuid = '';
    // from manual register
    if (data && hook.params.query && hook.params.query.uuid) {
      usertype = data.usertype;
      uuid = hook.params.query.uuid;
    }
    if (hook.result && hook.result.length) {
      // from patch
      uuid = hook.result[0].uuid;
      usertype = hook.result[0].usertype;
      if (!data) {
        data = {};
      }
    } else {
      // from facebook
      if (hook.result) {
        uuid = hook.result.uuid;
        usertype = hook.result.usertype;
        if (!data) {
          data = {};
        }
      }
    }
    if (uuid && (usertype === 'client')) {
      return findAndCreate(hook, uuid, data);
    }
    return hook;
  };
}
