/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/

#
!/usr/
bin / env
node
if (process.env.NODE_ENV !== 'production') {
  if (!require('piping')({
      hook: true,
      ignore: /(\/\.|~$|\.json$|\.scss)/i
    })) {
    return;
  }
}
require('../server.babel'); // babel registration (runtime transpilation for node)
require('../api/server');
