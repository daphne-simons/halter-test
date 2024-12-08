import React, { useRef, useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import mapboxgl from 'mapbox-gl'
import { Flex } from '@chakra-ui/react'
import PaddocksLayer from './layers/paddocks.layer'
import {
  getAllCows,
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
    '2024-10-31 11:03:52.000'
  )
  const [searchParams, setSearchParams] = useSearchParams()
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

  singleCowTimes && console.log('singleCowTimes', singleCowTimes)
  // Handle when a user selects a cow from the dropdown
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newCowName = event.target.value
    setSearchParams({ selectedCow: newCowName }) // Update the query string with the selected cow
    setSelectedCow(newCowName)
  }

  // Format the selected time into something my filter function can understand,
  // andprop drill THIS into the paddocks layer component:
  const formattedTime = format(selectedTime, 'yyyy-MM-dd HH:mm:ss.SSS')
  // Handle Slider Change
  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    const newSelectedTime =
      new Date('2024-10-31T11:03:52.000').getTime() + newValue * 1000 * 60 * 60 // Adding hours based on slider value
    setSelectedTime(new Date(newSelectedTime).toISOString())
  }

  //  Custom Marks:
  const marks: { value: number; label: string }[] = []
  // Start date and end date

  const startTime = new Date('2024-10-31T11:03:52.000')
  const endTime = new Date('2024-11-01T10:57:28.000')
  // Loop through and create marks every hour
  let currentTime = startTime
  while (currentTime <= endTime) {
    const hours = currentTime.getHours().toString().padStart(2, '0')
    const minutes = currentTime.getMinutes().toString().padStart(2, '00')
    const label = `${hours}:${minutes}`
    // Add hoursly steps into marks array
    marks.push({
      value: (currentTime - startTime) / (1000 * 60 * 60),
      label,
    })
    // Increment by 1 hour
    currentTime = new Date(currentTime.getTime() + 1000 * 60 * 60)
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

  // Dummy data - hook up to backend API
  const cowNames = [
    { cattle_name: '008' },
    { cattle_name: '101' },
    { cattle_name: '102' },
    { cattle_name: '105' },
    { cattle_name: '107' },
    { cattle_name: '108' },
    { cattle_name: '110' },
    { cattle_name: '112' },
    { cattle_name: '113' },
    { cattle_name: '114' },
    { cattle_name: '115' },
    { cattle_name: '116' },
    { cattle_name: '118' },
    { cattle_name: '119' },
    { cattle_name: '12' },
    { cattle_name: '120' },
    { cattle_name: '121' },
    { cattle_name: '123' },
    { cattle_name: '124' },
    { cattle_name: '127' },
    { cattle_name: '128' },
    { cattle_name: '129' },
    { cattle_name: '13' },
    { cattle_name: '130' },
    { cattle_name: '132' },
    { cattle_name: '138' },
    { cattle_name: '141' },
    { cattle_name: '142' },
    { cattle_name: '145' },
    { cattle_name: '148' },
    { cattle_name: '15' },
    { cattle_name: '153' },
    { cattle_name: '154' },
    { cattle_name: '155' },
    { cattle_name: '156' },
    { cattle_name: '158' },
    { cattle_name: '159' },
    { cattle_name: '160' },
    { cattle_name: '161' },
    { cattle_name: '163' },
    { cattle_name: '165' },
    { cattle_name: '166' },
    { cattle_name: '168' },
    { cattle_name: '169' },
    { cattle_name: '171' },
  ]

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
          onChange={handleSelectChange} // Update the URL when a new cow is selected
        >
          {cowNames.map((cow) => (
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
          selectedCow={selectedCow}
        />
      )}
    </>
  )
}

export default MapComponent
