import React, { useEffect, useState } from 'react';
import { withGoogleMap, GoogleMap, Marker, DirectionsRenderer, InfoWindow } from 'react-google-maps';
import axios from 'axios';

function MapContainer(props) {
  const [locations, setLocations] = useState([]);
  const [directions, setDirections] = useState(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [infoWindowOpen, setInfoWindowOpen] = useState(false);

  useEffect(() => {
    axios
      .get('http://localhost:3001/api/locations')
      .then((response) => {
        setLocations(response.data);
      })
      .catch((error) => {
        console.error('Error fetching data', error);
      });
  }, []);

  const handleGetDirections = () => {
    if (locations.length > 0) {
      const { Latitude, Longitude } = locations[0];
      const destination = { lat: parseFloat(Latitude), lng: parseFloat(Longitude) };

      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const origin = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          const directionsService = new window.google.maps.DirectionsService();
          const results = await directionsService.route({
            origin,
            destination,
            travelMode: window.google.maps.TravelMode.DRIVING,
          });
          setDirections(results);
        },
        (error) => {
          console.error('Error getting user location:', error);
        }
      );
    } else {
      console.warn('No location selected.');
    }
  };

  const handleMarkerClick = (marker) => {
    setSelectedMarker(marker);
    setInfoWindowOpen(true);
  };

  const handleInfoWindowClose = () => {
    setInfoWindowOpen(false);
  };

  return (
    <div >
      <div className='d-flex justify-content-center'>
      <button className='btn-primary' onClick={handleGetDirections}>Get Directions</button>
      </div>

      <div className="map-container">
        {locations.length > 0 && (
          <MyMapComponent
            containerElement={<div style={{ height: '100vh' }} />}
            mapElement={<div style={{ height: '100%' }} />}
            locations={locations}
            directions={directions}
            selectedMarker={selectedMarker}
            infoWindowOpen={infoWindowOpen}
            onMarkerClick={handleMarkerClick}
            onInfoWindowClose={handleInfoWindowClose}
          />
        )}
      </div>
    </div>
  );
}

const MyMapComponent = withGoogleMap((props) => (
  <GoogleMap
    defaultZoom={5}
    defaultCenter={{ lat: 20.5937, lng: 78.9629 }}
  >
    {props.locations.length > 0 &&
      props.locations.map((location) => (
        <Marker
          key={location.id}
          title={location.name}
          zIndex={400}
          position={{
            lat: parseFloat(location.Latitude),
            lng: parseFloat(location.Longitude),
          }}
          onClick={() => props.onMarkerClick(location)}
        >
          {props.selectedMarker === location && props.infoWindowOpen && (
            <InfoWindow onCloseClick={props.onInfoWindowClose}>
              <div>
              <img
                src={require("../Images/img.png")}
                alt=""
                style={{ height: '250px', width: '450px'}}
              />
                <p><strong>Address:</strong> main road, Sector 1, Shankar Nagar, Raipur, Chhattisgarh 492007</p>
                <p><strong>Phone:</strong> 078980 83460</p>
              </div>
            </InfoWindow>
          )}
        </Marker>
      ))}
    {props.directions && <DirectionsRenderer directions={props.directions} />}
  </GoogleMap>
));

export default MapContainer;
