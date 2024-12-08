import React, { useRef, useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import mapboxgl from 'mapbox-gl'
import { Flex } from '@chakra-ui/react'
import PaddocksLayer from './layers/paddocks.layer'
import { getAllCows, getCowsAtTimeStamp, getSingleCow } from '../apiClient'
import { format } from 'date-fns'
import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'

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
  // TODO: bring in Material UI custom slider for time selection
  // Hook this up to a change event and have it alter the filter value (selectedTime)
  const marks = [
    {
      value: 0,
      label: '00:00',
    },
    {
      value: 1,
      label: '01:00',
    },
    {
      value: 2,
      label: '02:00',
    },
    {
      value: 3,
      label: '03:00',
    },
    {
      value: 4,
      label: '04:00',
    },
    {
      value: 5,
      label: '05:00',
    },
    {
      value: 6,
      label: '06:00',
    },
    {
      value: 7,
      label: '07:00',
    },
    {
      value: 8,
      label: '08:00',
    },
    {
      value: 9,
      label: '09:00',
    },
    {
      value: 10,
      label: '10:00',
    },
    {
      value: 11,
      label: '11:00',
    },
    {
      value: 12,
      label: '12:00',
    },
  ]

  function valuetext(value: number) {
    return `${value}`
  }
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
  // useEffect that creates the map
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
      <Flex
        className="map-container"
        ref={mapContainerRef}
        width="full"
        position="relative"
      />
      <Box
        sx={{
          position: 'absolute', // This makes it absolute within the relative parent
          bottom: 20, // Position it 20px from the bottom of the map
          left: '50%', // Center it horizontally
          transform: 'translateX(-50%)', // Correct for centering
          width: '80%', // Make the slider wide (adjust to your needs)
          '& .MuiSlider-thumb': {
            width: 20,
            height: 20,
            backgroundColor: '#FFEB3B', // Bright yellow thumb color
          },
          '& .MuiSlider-rail': {
            height: 10,
            backgroundColor: '#B0BEC5', // Light grey rail color
          },
          '& .MuiSlider-track': {
            height: 10,
            backgroundColor: '#FF4081', // Bright pink or bright blue
          },
          '& .MuiSlider-markLabel': {
            color: 'white', // Change the marks text color to white
          },
        }}
      >
        <Slider
          aria-label="Custom marks"
          defaultValue={0}
          getAriaValueText={valuetext}
          step={1}
          min={0}
          max={12}
          valueLabelDisplay="auto"
          marks={marks}
        />
      </Box>
      {map && (
        <PaddocksLayer
          map={map}
          singleCow={singleCow}
          selectedTime={formattedTime}
        />
      )}
    </>
  )
}

export default MapComponent
