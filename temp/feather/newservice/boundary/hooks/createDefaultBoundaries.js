/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
/**
 * Created by BaeBae on 9/20/16.
 *  "57e40260eb96f819b164e21b",
 "57e40260eb96f819b164e21c",
 "57e40260eb96f819b164e21d"
 */
let flagCreatingBoundaries = false;
const defaultBoundaries = [
  {
    _id: "57e40260eb96f819b164e21b",
    name: 'Courchevel',
    default: true,
    color: '#5757f2',
    center: [45.3082, 6.6095],
    createdBy: '-1',
  },
  {
    _id: "57e40260eb96f819b164e21c",
    name: 'Meribel',
    color: '#63b742',
    default: true,
    center: [45.3082, 6.6095],
    createdBy: '-1',
  },
  {
    _id: "57e40260eb96f819b164e21d",
    name: 'Valthorens',
    color: '#db453b',
    default: true,
    center: [45.3082, 6.6095],
    createdBy: '-1',
  },
  {
    _id: "57e40260eb96f819b164e21e",
    name: 'Menuires',
    color: '#e44258',
    default: true,
    center: [45.3082, 6.6095],
    createdBy: '-1',
  },
];
export default function () {
  const createBoundaries = (result, hook)=> {
    defaultBoundaries.map((boundary) => {
      function findthis(bnd) {
        return (bnd._id == boundary._id);
      }
      
      let res = result.find(findthis);
      if (res == undefined) {
        return hook.app.service('boundary').create(boundary)
          .then((result) => {
            console.info('result', result);
            return hook;
          }).catch(err => hook);
      } else {
        console.info("alreadyindtb:" + boundary._id);
        return hook;
      }
    });
  }
  return function createDefaultBoundaries(hook) {
    if (hook.params.provider) {
      let query = { default: true };
      return this.find({ query }).then((result) => {
        return createBoundaries(result, hook);
      });
    }
    return hook;
  };
}
