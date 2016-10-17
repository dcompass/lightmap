/*******************************************************************************
 * Copyright (c) 2016. SkiScool.
 ******************************************************************************/
import React from 'react';
import Link from '../Link';
const Navigation = ({ myClass }) => (
  <nav className={myClass}>
    <Link to="Skiscool">
      Concept Skiscool
    </Link>
    <Link to="Map">
      Map
    </Link>
  </nav>
);
export default Navigation;
