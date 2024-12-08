import React, { useRef, useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import mapboxgl from 'mapbox-gl'
import { Flex } from '@chakra-ui/react'
import PaddocksLayer from './layers/paddocks.layer'
import { getAllCows, getAllNames, getSingleCow } from '../apiClient'
import { format } from 'date-fns'
// searchParams - good for retaining information and sharing with others via url
import { useSearchParams } from 'react-router-dom'
// Material UI imports. I understand Chakra has some similar features but I decided to roll with these for now.
import Box from '@mui/material/Box'
import Slider from '@mui/material/Slider'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'
import FormControl from '@mui/material/FormControl'
import FormLabel from '@mui/material/FormLabel'
import Select, { SelectChangeEvent } from '@mui/material/Select'
import MenuItem from '@mui/material/MenuItem'

// env for mapbox
mapboxgl.accessToken = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN

const MapComponent: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement | null>(null)
  const [map, setMap] = useState<mapboxgl.Map | null>(null)
  const [selectedTime, setSelectedTime] = useState<string>(
    '2024-10-31 23:00:04.000'
  ) // Slider starts halfway through the day - user can go back or forward in time

  const [searchParams, setSearchParams] = useSearchParams('')
  const [selectedCow, setSelectedCow] = useState('')
  const [option, setOptions] = useState('all')

  // --- QUERIES ---
  // Single Cow all data:
  const { data: singleCow } = useQuery({
    queryKey: ['singleCow', selectedCow],
    queryFn: () => getSingleCow(selectedCow), // this is the cowName e.g. '172'
  })

  // all Cows Data:
  const { data: allCows, isFetching } = useQuery({
    queryKey: ['allCows'],
    queryFn: () => getAllCows(),
  })

  //  all cow names
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

  // Extract the earliest and latest time
  const startTime = new Date('2024-10-31 11:00:04.000') // use allCows data earliest time
  const endTime = new Date('2024-11-01 10:59:55.000') // use allCows data earliest time

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
  // --- COW-NAMES / DROPDOWN HANDLER ---
  const handleNameChange = (event: SelectChangeEvent) => {
    const newCowName = event.target.value
    setSearchParams({
      selectedTime: selectedTime ? selectedTime : '',
      selectedCow: newCowName,
    }) // Update the query string with the selected cow
    setSelectedCow(newCowName)
  }

  // --- OPTIONS / RADIO BUTTON HANDLER ---
  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newOption = (event.target as HTMLInputElement).value
    setOptions(newOption)
    setSearchParams({
      selectedTime: selectedTime ? selectedTime : '',
      selectedCow: selectedCow ? selectedCow : '',
    })
    setSelectedCow('')
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
          position: 'absolute',
          top: 10,
          left: 10,
          zIndex: 1000,
          bg: 'whiteAlpha.900', // Semi-transparent white background
          p: 4, // Padding of 16px
          borderRadius: 'md', // Medium border radius (you can adjust this)
          boxShadow: 'md', // Medium shadow for depth
          color: 'yellow', // Apply yellow color to all text inside the Box
          width: 'auto', // Optional: define width or let it auto-fit
        }}
      >
        {/* RADIO BUTTONS FOR: 'All Cows' and 'Single Cow' */}
        <FormControl fullWidth>
          <FormLabel
            id="demo-controlled-radio-buttons-group"
            sx={{
              color: 'white', // Keep the label text white
              fontSize: '24px', // Make the text larger (adjust as necessary)
              '& .MuiFormLabel-asterisk': {
                color: 'white', // Ensure the asterisk for required fields is also white (if any)
              },
              '&.Mui-focused': {
                color: 'white', // Ensure the label remains white even when focused
              },
              '&.Mui-error': {
                color: 'white', // Ensure the label remains white in case of error (optional)
              },
              '&.MuiRadioGroup-root.Mui-focused': {
                color: 'white', // Keep the label white when radio group is focused
              },
            }}
          >
            Display Options:
          </FormLabel>
          <RadioGroup
            aria-labelledby="demo-controlled-radio-buttons-group"
            name="controlled-radio-buttons-group"
            value={option}
            onChange={handleOptionChange}
          >
            <FormControlLabel
              value="all"
              control={
                <Radio
                  sx={{
                    color: '#FF4081', // Default radio button color
                    '&.Mui-checked': {
                      color: 'yellow', // When checked, keep it pink
                    },
                  }}
                />
              }
              label="All Cows"
              sx={{
                color: 'white', // Make the label text white initially
                fontSize: '18px', // Adjust font size
                '&.Mui-checked': {
                  color: '#FF4081', // Change the label color to hot pink when selected
                },
              }}
            />
            <FormControlLabel
              value="single"
              control={
                <Radio
                  sx={{
                    color: '#FF4081', // Default radio button color
                    '&.Mui-checked': {
                      color: 'yellow', // When checked, keep it pink
                    },
                  }}
                />
              }
              label="Single Cow"
              sx={{
                color: 'white', // Make the label text white initially
                fontSize: '18px', // Adjust font size
                '&.Mui-checked': {
                  color: '#FF4081', // Change the label color to hot pink when selected
                },
              }}
            />
          </RadioGroup>
        </FormControl>

        {/* COW NAME SELECTOR */}
        {option === 'single' && (
          <Box sx={{ color: 'white' }}>
            {' '}
            {/* Adds margin-top for spacing */}
            <FormLabel
              sx={{
                color: 'white',
                px: 2,
              }}
            >
              Pick a Cow:
            </FormLabel>
            <Select
              value={selectedCow} // Reflect the selected value
              onChange={handleNameChange} // Update the URL when a new cow is selected
              label="Select a Cow" // Placeholder for better UX
              sx={{
                width: '100px',
                color: 'yellow', // Change the text color of the select dropdown
                '& .MuiInputLabel-root': {
                  color: '#FF4081', // Make the label text hot pink
                },
                '& .MuiSelect-root': {
                  color: '#FF4081', // Change the text color of the select dropdown
                },
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'white', // Set border color to white
                  },
                  '&:hover fieldset': {
                    borderColor: 'white', // Hover state border color to white
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'white', // Focused state border color to white
                  },
                },
                '& .MuiSelect-icon': {
                  color: 'white', // Set the dropdown arrow icon color to hot pink
                  fontSize: '2.5rem', // Increase the size of the dropdown arrow icon (adjust as necessary)
                },
                // Adjust the dropdown box styling
                '& .MuiInputBase-root': {
                  marginTop: '8px', // Optional: Add spacing between label and dropdown
                  color: '#FF4081',
                },
              }}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 400, // Set a fixed height for the dropdown (you can adjust as needed)
                    overflowY: 'auto', // Ensures the dropdown is scrollable if content exceeds max height
                  },
                },
              }}
            >
              {cowNames?.map((cow) => (
                <MenuItem key={cow.cattle_name} value={cow.cattle_name}>
                  {cow.cattle_name}
                </MenuItem>
              ))}
            </Select>
          </Box>
        )}
      </Box>
      {/* TIME SLIDER */}
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
