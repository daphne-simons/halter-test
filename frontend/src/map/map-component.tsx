import React, { useRef, useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import mapboxgl from 'mapbox-gl'
import { Flex } from '@chakra-ui/react'
import PaddocksLayer from './layers/paddocks.layer'
import {
  getAllCows,
  getAllNames,
  getCowsAtTimeStamp,
  getSingleCow,
  getSingleCowTimes,
} from '../apiClient'
import { format } from 'date-fns'
import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'
import { useSearchParams } from 'react-router-dom' // good for retaining information and sharing with others via link

// env for mapbox
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

const MapComponent: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const [map, setMap] = useState<mapboxgl.Map | null>(null)
  // Keep track of the selected time
  const [selectedTime, setSelectedTime] = useState<string>(
    '2024-10-31 11:00:04.000'
  )
  const [searchParams, setSearchParams] = useSearchParams('')
  const [selectedCow, setSelectedCow] = useState('')
  // Get the current selected cow from the URL (if it exists)

  // --- QUERIES ---
  // Single Cow all data:
  const { data: singleCow } = useQuery({
    queryKey: ['singleCow', selectedCow],
    queryFn: () => getSingleCow(selectedCow), // this is the cowName e.g. '172'
  })

  // times for single cow:
  const { data: singleCowTimes } = useQuery({
    queryKey: ['singleCowTimes', selectedCow],
    queryFn: () => getSingleCowTimes(selectedCow),
  })

  // all cows by time:
  const { data: allCows } = useQuery({
    queryKey: ['allCowsByTime', selectedTime],
    queryFn: () => getAllCows(),
  })

  const { data: cowNames } = useQuery({
    queryKey: ['cowNames'],
    queryFn: () => getAllNames(),
  })

  // Format the selected time into something my mapbox-gl filter function can understand,
  // andprop drill THIS into the <PaddocksLayer/> component:
  const formattedTime = format(selectedTime, 'yyyy-MM-dd HH:mm:ss.SSS')

  // --- SLIDER HANDLER ---
  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    const newSelectedTime = startTime.getTime() + newValue * 1000 * 60 * 60 // Adding hours based on slider value
    setSelectedTime(new Date(newSelectedTime).toISOString())
    setSearchParams({
      selectedTime: new Date(newSelectedTime).toISOString(),
      selectedCow: selectedCow ? selectedCow : '',
    })
  }

  // Extract the earliest and latest time from the singleCowTimes data
  const startTime = singleCowTimes
    ? new Date(singleCowTimes.earliest_time)
    : new Date('2024-10-31T11:03:52.000')
  const endTime = singleCowTimes
    ? new Date(singleCowTimes.latest_time)
    : new Date('2024-11-01T10:51:25.000')

  // Calculate the number of hours between start and end times
  const totalHours =
    (endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60)

  //  Custom Marks:
  const marks: { value: number; label: string }[] = []
  // Loop through and create marks every hour
  let currentTime = startTime
  while (currentTime <= endTime) {
    const hours = currentTime.getHours().toString().padStart(2, '0')
    const minutes = currentTime.getMinutes().toString().padStart(2, '00')
    const label = `${hours}:${minutes}`
    // Add hoursly steps into marks array
    marks.push({
      value: (currentTime.getTime() - startTime.getTime()) / (1000 * 60 * 60),
      label,
    })
    // Increment by 1 hour
    currentTime = new Date(currentTime.getTime() + 1000 * 60 * 60)
  }
  // --- DROPDOWN HANDLER ---
  // Handle when a user selects a cow from the dropdown
  const handleNameChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newCowName = event.target.value
    setSearchParams({
      selectedTime: selectedTime ? selectedTime : '',
      selectedCow: newCowName,
    }) // Update the query string with the selected cow
    setSelectedCow(newCowName)
  }
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

  // TODO: figure out a way to make the cow names appear in the correct order, without losing their unique qualities e.g. 008 doesnt become 8.
  // let orderedCowNames: { cattle_name: string }[] = []
  // if (cowNames) {
  //   orderedCowNames = cowNames
  //     .map((cow) => Number(cow.cattle_name))
  //     .sort((a, b) => a - b)
  //     .map((cattle_name) => ({ cattle_name: cattle_name.toString() }))
  // }

  return (
    <>
      <Flex
        className="map-container"
        ref={mapContainerRef}
        width="full"
        position="relative"
      />
      {/* COW NAME SELECTOR */}
      <label>
        Pick a Cow:
        <select
          name="selectedCow"
          value={selectedCow} // Make the dropdown reflect the selected value
          onChange={handleNameChange} // Update the URL when a new cow is selected
        >
          {cowNames?.map((cow) => (
            <option key={cow.cattle_name} value={cow.cattle_name}>
              {cow.cattle_name}
            </option>
          ))}
        </select>
      </label>
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
              ? (new Date(selectedTime).getTime() - startTime.getTime()) /
                (1000 * 60 * 60)
              : 0
          } // Converting to hours
          onChange={handleSliderChange}
          defaultValue={0}
          step={1}
          min={0}
          max={totalHours} // Use the total hours difference between startTime and endTime
          marks={marks} // one every hour
        />
      </Box>
      {map && (
        <PaddocksLayer
          map={map}
          singleCow={singleCow} // single cows data
          allCows={allCows} // send all cows data
          selectedTime={formattedTime}
          selectedCow={selectedCow}
        />
      )}
    </>
  )
}

export default MapComponent
