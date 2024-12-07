import React, { useRef, useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import mapboxgl from 'mapbox-gl'
import { Flex } from '@chakra-ui/react'
import PaddocksLayer from './layers/paddocks.layer'
import { getAllCows, getCowsAtTimeStamp, getSingleCow } from '../apiClient'
import { format } from 'date-fns'

// env for mapbox
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

const MapComponent: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const [map, setMap] = useState<mapboxgl.Map | null>(null)

  //TODO: get Date object from user selection, and format into a string the backend can use:
  const fakeDateTime = new Date('2024-10-31 14:07:52.000')
  console.log('beforeFormatTime', fakeDateTime)

  const formattedTime = format(fakeDateTime, 'yyyy-MM-dd HH:mm:ss.SSS')
  console.log('afterFormattedTime', formattedTime)

  // Get all cows by timestamp:
  const { data: cowsByTime } = useQuery({
    queryKey: ['cowsByTime'],
    queryFn: () => getCowsAtTimeStamp(formattedTime), // TODO: currently hardcoded, will hook up to Date/Time Picker
  })

  // Single Cow all data:
  const { data: singleCow } = useQuery({
    queryKey: ['singleCow'],
    queryFn: () => getSingleCow('172'),
  })
  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current!,
      style: 'mapbox://styles/mapbox/satellite-v9',
      center: [175.586, -37.684],
      zoom: 15,
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
          cowsByTime={cowsByTime}
          singleCow={singleCow}
        />
      )}
    </>
  )
}

export default MapComponent
