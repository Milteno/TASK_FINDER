import React, { useEffect, useState } from "react";
import { useGetMapTasksQuery } from "../../redux/features/apiSlice/apiSlice";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useNavigate } from "react-router-dom";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import "leaflet.markercluster";
import MarkerClusterGroup from "react-leaflet-cluster";
import classes from "./mapPage.module.scss";
import babyMarker from "../../images/mapMarkers/baby-marker.png";
import furnitureMarker from "../../images/mapMarkers/furniture-marker.png";
import packageMarker from "../../images/mapMarkers/package-marker.png";
import lessonMarker from "../../images/mapMarkers/lesson-marker.png";
import grassMarker from "../../images/mapMarkers/grass-marker.png";
import broomMarker from "../../images/mapMarkers/broom-marker.png";
import plantMarker from "../../images/mapMarkers/plant-marker.png";
import physicalWorkMarker from "../../images/mapMarkers/physical-work.png";
import paintingMarker from "../../images/mapMarkers/painting-marker.png";
import houseRepairMarker from "../../images/mapMarkers/house-repair-marker.png";
import petsitterMarker from "../../images/mapMarkers/petsitter-marker.png";
import defaultMarker from "../../images/mapMarkers/default-marker.png";

import babyMarkerFilter from "../../images/filterIcons/baby-marker.png";
import furnitureMarkerFilter from "../../images/filterIcons/furniture-marker.png";
import packageMarkerFilter from "../../images/filterIcons/package-marker.png";
import lessonMarkerFilter from "../../images/filterIcons/lesson-marker.png";
import grassMarkerFilter from "../../images/filterIcons/grass-marker.png";
import broomMarkerFilter from "../../images/filterIcons/broom-marker.png";
import plantMarkerFilter from "../../images/filterIcons/plant-marker.png";
import physicalWorkMarkerFilter from "../../images/filterIcons/physical-work.png";
import paintingMarkerFilter from "../../images/filterIcons/painting-marker.png";
import houseRepairMarkerFilter from "../../images/filterIcons/house-repair-marker.png";
import petsitterMarkerFilter from "../../images/filterIcons/petsitter-marker.png";

const categoryIcons: { [key: string]: string } = {
  "Opieka nad dzieckiem": babyMarker,
  "Składanie mebli": furnitureMarker,
  Inwentaryzacja: packageMarker,
  Korepetycje: lessonMarker,
  "Koszenie trawy": grassMarker,
  Sprzątanie: broomMarker,
  "Prace ogrodowe": plantMarker,
  "Pomoc w przenoszeniu": physicalWorkMarker,
  Malowanie: paintingMarker,
  "Naprawy domowe": houseRepairMarker,
  "Opieka nad zwierzęciem": petsitterMarker,
  default: defaultMarker,
};

const filterIcons: { [key: string]: string } = {
  "Opieka nad dzieckiem": babyMarkerFilter,
  "Składanie mebli": furnitureMarkerFilter,
  Inwentaryzacja: packageMarkerFilter,
  Korepetycje: lessonMarkerFilter,
  "Koszenie trawy": grassMarkerFilter,
  Sprzątanie: broomMarkerFilter,
  "Prace ogrodowe": plantMarkerFilter,
  "Pomoc w przenoszeniu": physicalWorkMarkerFilter,
  Malowanie: paintingMarkerFilter,
  "Naprawy domowe": houseRepairMarkerFilter,
  "Opieka nad zwierzęciem": petsitterMarkerFilter,
};

const createCustomIcon = (category: string) => {
  const iconUrl = categoryIcons[category] || categoryIcons["default"];
  return L.icon({
    iconUrl: iconUrl,
    iconSize: [46, 52],
    iconAnchor: [20, 42],
    popupAnchor: [0, -42],
  });
};

const MapPage: React.FC = () => {
  const { data: tasks, error, isLoading } = useGetMapTasksQuery({});
  const [mapPoints, setMapPoints] = useState<any[]>([]);
  const [filteredPoints, setFilteredPoints] = useState<any[]>([]);
  const [categoryFilter, setCategoryFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (tasks) {
      const fetchGeocodes = async () => {
        const newMapPoints = [];
        for (const task of tasks) {
          const response = await fetch(
            `https://maps.googleapis.com/maps/api/geocode/json?address=${task.location}&key=${process.env.REACT_APP_GOOGLE_MAPS_API_KEY}`
          );
          const data = await response.json();
          if (data.results.length > 0) {
            const { lat, lng } = data.results[0].geometry.location;
            newMapPoints.push({
              ...task,
              lat,
              lng,
            });
          }
        }
        setMapPoints(newMapPoints);
        setFilteredPoints(newMapPoints);
      };

      fetchGeocodes();
    }
  }, [tasks]);

  useEffect(() => {
    let filtered = mapPoints;

    if (categoryFilter) {
      filtered = filtered.filter((point) =>
        point.category.toLowerCase().includes(categoryFilter.toLowerCase())
      );
    }

    if (locationFilter) {
      filtered = filtered.filter((point) =>
        point.location.toLowerCase().includes(locationFilter.toLowerCase())
      );
    }

    setFilteredPoints(filtered);
  }, [categoryFilter, locationFilter, mapPoints]);

  const handleCategoryIconClick = (category: string) => {
    setCategoryFilter(category);
  };

  if (isLoading) {
    return <div>Ładowanie...</div>;
  }

  if (error) {
    return <div>Error: {error.toString()}</div>;
  }

  return (
    <div className={classes.mapPageWrapper}>
      <div className={classes.filterWrapper}>
        <div className={classes.filterBar}>
          <div className={classes.filterInput}>
            <input
              type="text"
              placeholder="Szukaj po kategorii"
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            />
            <input
              type="text"
              placeholder="Szukaj po lokalizacji"
              value={locationFilter}
              onChange={(e) => setLocationFilter(e.target.value)}
            />
          </div>
          <div className={classes.iconFilters}>
            {Object.keys(filterIcons).map((category) => (
              <img
                key={category}
                src={filterIcons[category]}
                alt={category}
                className={classes.icon}
                onClick={() => handleCategoryIconClick(category)}
              />
            ))}
          </div>
        </div>
      </div>
      <div className={classes.contentWrapper}>
        <div className={classes.tasksList}>
          <div className={classes.tasksScroll}>
            {filteredPoints.map((task: any) => (
              <div
                key={task._id}
                className={classes.task}
                onClick={() => navigate(`/task/${task._id}`)}
              >
                <div className={classes.taskHeader}>
                  <h3>{task.title}</h3>
                  <p className={classes.hourlyRate}>{task.hourlyRate} PLN/H</p>
                </div>
                <p>Lokalizacja: {task.location}</p>
                <p>Kategoria: {task.category}</p>
              </div>
            ))}
          </div>
        </div>

        <div className={classes.mapContainer}>
          <MapContainer
            center={[51.505, 20.09]}
            zoom={7}
            className={classes.map}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <MarkerClusterGroup>
              {filteredPoints.map((point) => (
                <Marker
                  key={point._id}
                  position={[point.lat, point.lng]}
                  icon={createCustomIcon(point.category)}
                >
                  <Popup>
                    <div>
                      <h3>{point.title}</h3>
                      <p>{point.tasks}</p>
                      <p>Kategoria: {point.category}</p>
                      <p>Stawka godzinowa: {point.hourlyRate}</p>
                      <p>Lokalizacja: {point.location}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MarkerClusterGroup>
          </MapContainer>
        </div>
      </div>
    </div>
  );
};

export default MapPage;
