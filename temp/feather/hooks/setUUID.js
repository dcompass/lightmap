/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
import uuid from 'node-uuid';
function assignUUID(item) {
  if (!item.uuid || item.uuid.length === 0) {
    item.uuid = uuid.v4(); // eslint-disable-line no-param-reassign
  }
}
export function setUUID() {
  return (hook) => {
    const data = hook.data;
    assignUUID(data);
    return hook;
  };
}
