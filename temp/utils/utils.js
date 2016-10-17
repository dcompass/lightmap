/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/

const str_rot13 = (str)=> {
  return (str + '').replace(/[a-z]/gi, function (s) {
    return String.fromCharCode(s.charCodeAt(0) + (s.toLowerCase() < 'n' ? 13 : -13));
  });
};
const setfirstuppercase = (str)=> {
  return ((str.charAt(0).toUpperCase()) + str.substring(1));
};
const setalldowncase = (str)=> {
  return str.toLowerCase();
};
const decodeParam = (val)=> {
  if (!(typeof val === 'string' || val.length === 0)) {
    return val;
  }
  try {
    return decodeURIComponent(val);
  } catch (err) {
    if (err instanceof URIError) {
      err.message = `Failed to decode param '${val}'`;
      err.status = 400;
    }
    throw err;
  }
}
// Match the provided URL path pattern to an actual URI string. For example:
//   matchURI({ path: '/posts/:id' }, '/dummy') => null
//   matchURI({ path: '/posts/:id' }, '/posts/123') => { id: 123 }
const matchURI = (route, path) => {
  const match = route.pattern.exec(path);
  if (!match) {
    return null;
  }
  const params = Object.create(null);
  for (let i = 1; i < match.length; i++) {
    params[route.keys[i - 1].name] = match[i] !== undefined ? decodeParam(match[i]) : undefined;
  }
  return params;
}
module.exports = { str_rot13, matchURI, setfirstuppercase };
