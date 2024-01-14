import React, { useEffect, useState, useContext } from 'react';
import Nav from '../Nav';
import { Outlet } from 'react-router-dom';

const Layout = () => {
  return (
    <div>
      <h1>Landing Page</h1>
      <div>
        <Nav />
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
