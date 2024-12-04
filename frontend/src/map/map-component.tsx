import React, { useRef, useEffect, useState } from "react";
import mapboxgl from "mapbox-gl";
import { Flex } from "@chakra-ui/react";
import PaddocksLayer from "./layers/paddocks.layer";

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;

const MapComponent: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const [map, setMap] = useState<mapboxgl.Map | null>(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: "mapbox://styles/mapbox/satellite-v9",
      center: [175.586, -37.684],
      zoom: 16,
      attributionControl: false,
    });
    setMap(map);

    return () => map.remove();
  }, []);

  return (
    <>
      <Flex className="map-container" ref={mapContainerRef} width="full" />
      {map && <PaddocksLayer map={map} />}
    </>
  );
};

export default MapComponent;
