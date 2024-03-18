import React, { useEffect, useState } from "react";
import GoogleMapReact from "google-map-react";
import RoomIcon from "@mui/icons-material/Room";
import "./Map.scss";
import axios from "axios";
import { GW_URL } from "../../config";
import { adminConfig } from "../../config";
import DataLoader from "../../components/Loader/DataLoader";

export default function SimpleMap() {
  const defaultZoom = 11;

  let school_id =
    localStorage.getItem("superadmin_school") === null
      ? decodeToken.result.school_id
      : localStorage.getItem("superadmin_school");
  const [lat, setLat] = useState(null);
  const [lng, setLng] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);

  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  const getUserLocation = () => {
    navigator.geolocation.getCurrentPosition(function (position) {
      const userLatitude = position.coords.latitude;
      const userLongitude = position.coords.longitude;

      setLatitude(userLatitude);
      setLongitude(userLongitude);
    });
  };

  const getlocation = () => {
    setIsLoading(true);
    Geolocation.getCurrentPosition(
      (position) => {
        const latitude = position.coords.latitude;
        const longitude = position.coords.longitude;
      },
      (error) => {
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 200 }
    );
  };
  const getLocation = () => {
    setLocationLoading(true);

    axios
      .get(`${GW_URL}/schools/getSchoolLocation`, adminConfig, { school_id })
      .then((res) => {
        setLat(res.data.schoolInfo[0].latitude);
        setLng(res.data.schoolInfo[0].longitude);
        setLocationLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLocationLoading(false);
      });
  };

  const addLocation = (lt, lg) => {
    axios
      .post(
        `${GW_URL}/schools/${school_id}/putSchoolLocation`,
        {
          latitude: lt,
          longitude: lg,
        },
        adminConfig
      )
      .then((res) => {
        getLocation();
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleMapClick = (event) => {
    const clickedLat = event.lat;
    const clickedLng = event.lng;

    addLocation(clickedLat, clickedLng);
  };

  useEffect(() => {
    getLocation();
    getUserLocation();
    getlocation();
  }, []);
  const defaultCenter = {
    lat: latitude,
    lng: longitude,
  };
  return (
    <>
      {locationLoading ? (
        <DataLoader Loading={locationLoading} width={100} />
      ) : lat && lng ? (
        <div className="location-selction-container">
          <RoomIcon sx={{ color: "green" }} size={40} />
          <span style={{ marginRight: 5 }}>School Location is Selected</span>
        </div>
      ) : (
        <div style={{ height: "75vh", width: "100%" }}>
          <GoogleMapReact
            bootstrapURLKeys={{ key: "" }}
            defaultCenter={defaultCenter}
            defaultZoom={defaultZoom}
            onClick={(event) => handleMapClick(event)}
            options={(maps) => ({
              gestureHandling: lat && lng ? "none" : "auto",
            })}
          >
            {}
          </GoogleMapReact>
        </div>
      )}
    </>
  );
}

const LocationPin = ({ text, lat, lng }) => {
  return (
    <div className="pin">
      <RoomIcon
        sx={{
          color: "red",
          height: 70,
          width: 70,
        }}
      />
      <p className="pin-text">{text}</p>
    </div>
  );
};
