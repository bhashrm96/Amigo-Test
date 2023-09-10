// Map.js
import React from 'react';
import Header from '../Components/Header';
import MapContainer from '../Components/MapContainer';

function Home() {
  return (
    <>
    <Header />
    <div className="map-container">
      <MapContainer />
    </div>
    </>
  );
}

export default Home;
