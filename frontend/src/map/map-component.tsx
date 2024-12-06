import React, { useRef, useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import mapboxgl from 'mapbox-gl'
import { Flex } from '@chakra-ui/react'
import PaddocksLayer from './layers/paddocks.layer'
import { getAllCows, getCowsAtTimestamp } from '../apiClient'

mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

const MapComponent: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const [map, setMap] = useState<mapboxgl.Map | null>(null)
  // All cows of all time:
  const { data: allCows } = useQuery({
    queryKey: ['cows'],
    queryFn: getAllCows,
  })

  // Get all cows by timestamp:
  const { data: allCowsByTimestamp } = useQuery({
    queryKey: ['cowsByTimestamp'],
    queryFn: () => getCowsAtTimestamp(new Date('2024-11-01T10:59:55')), // currently hardcoded, will hook up to Date/Time Picker
  })
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [175.586, -37.684],
      zoom: 16,
      attributionControl: false,
    })
    setMap(map)

    return () => map.remove()
  }, [])

  return (
    <>
      <Flex className="map-container" ref={mapContainerRef} width="full" />
      {map && (
        <PaddocksLayer
          map={map}
          allCows={allCows}
          allCowsByTimestamp={allCowsByTimestamp}
        />
      )}
    </>
  )
}

export default MapComponent
