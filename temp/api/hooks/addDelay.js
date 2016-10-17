/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/

// Add a delay to test slower connections
export function addDelay(delay) {
  return (hook, next) => {
    setTimeout(next, delay);
  };
}
