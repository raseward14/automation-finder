import React, { useEffect, useState } from 'react';
import { APIConstants } from '../constants'; 

export default function Home() {

  useEffect(() => {
    localStorage.clear();
    console.log('LocalStorage cleared!');    
  }, []);

  return (
    <>
      <h4>Use a CRM link, or account email and password to begin.</h4>
    </>
  );
}
