import React, { useEffect, useState } from 'react';

export default function Home() {
  useEffect(() => {
    localStorage.removeItem('token');
  }, []);
  return (
    <>
      <h4>Use a CRM link, or account email and password to begin.</h4>
    </>
  );
}
