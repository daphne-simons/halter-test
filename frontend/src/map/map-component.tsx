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
  // Keep track of the selected time
  const [selectedTime, setSelectedTime] = useState<string>(
    '2024-10-31 11:03:52.000'
  )
  // Format the selected time into something my filter function can understand,
  // andprop drill THIS into the paddocks layer component:
  const formattedTime = format(selectedTime, 'yyyy-MM-dd HH:mm:ss.SSS')

  //  Custom Marks:
  const marks: { value: number; label: string }[] = []
  // Start date and end date
  const startDate = new Date('2024-10-31T11:03:52.000')
  const endDate = new Date('2024-11-01T10:57:28.000')
  // Loop through and create marks every hour
  let currentTime = startDate
  while (currentTime <= endDate) {
    const hours = currentTime.getHours().toString().padStart(2, '0')
    const minutes = currentTime.getMinutes().toString().padStart(2, '00')
    const label = `${hours}:${minutes}`

    marks.push({
      value: (currentTime - startDate) / (1000 * 60 * 60), // Value in terms of hourly steps
      label,
    })

    // Increment by 1 hour
    currentTime = new Date(currentTime.getTime() + 1000 * 60 * 60)
  }
  // Handle Slider Change
  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    const newSelectedTime =
      new Date('2024-10-31T11:03:52.000').getTime() + newValue * 1000 * 60 * 60 // Adding hours based on slider value
    setSelectedTime(new Date(newSelectedTime).toISOString())
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
          aria-label="Time selector"
          value={
            selectedTime
              ? (new Date(selectedTime).getTime() -
                  new Date('2024-10-31T11:03:52.000').getTime()) /
                (1000 * 60 * 60)
              : 0
          } // Converting to hours
          onChange={handleSliderChange}
          defaultValue={0}
          step={1}
          min={0}
          max={24} // 24 hours
          marks={marks} // one every hour
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
