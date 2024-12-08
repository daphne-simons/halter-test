import React, { useRef, useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import mapboxgl from 'mapbox-gl'
import { Flex } from '@chakra-ui/react'
import PaddocksLayer from './layers/paddocks.layer'
import { getAllCows, getAllNames, getSingleCow } from '../apiClient'
import { format, parseISO } from 'date-fns'
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

  const [searchParams, setSearchParams] = useSearchParams('')

  const [selectedTime, setSelectedTime] = useState<string>(() => {
    const paramTime = searchParams.get('selectedTime')
    return paramTime
      ? parseISO(paramTime).toISOString()
      : new Date('2024-10-31 23:00:04.000').toISOString() // Slider starts halfway through the day - user can go back or forward in time
  })

  const [selectedCow, setSelectedCow] = useState<string>(
    () => searchParams.get('selectedCow') || ''
  )

  const [option, setOptions] = useState<string>(
    () => searchParams.get('option') || 'all'
  )

  // --- QUERIES ---
  // Single Cow all data:
  const { data: singleCow } = useQuery({
    queryKey: ['singleCow', selectedCow],
    queryFn: () => getSingleCow(selectedCow), // this is the cowName e.g. '172'
  })

  // all Cows Data:
  const { data: allCows } = useQuery({
    queryKey: ['allCows'],
    queryFn: () => getAllCows(),
  })

  //  all cow names
  const { data: cowNames } = useQuery({
    queryKey: ['cowNames'],
    queryFn: () => getAllNames(),
  })

  // --- HANDLER FUNCTIONS ---

  //  SLIDER HANDLER
  const handleSliderChange = (event: Event, newValue: number | number[]) => {
    const newSelectedTime =
      startTime.getTime() + (newValue as number) * 1000 * 60 * 60 // Adding hours based on slider value
    setSelectedTime(new Date(newSelectedTime).toISOString())
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

  // Format the selected time into something my mapbox-gl filter function can understand,
  // Prop drill formattedTime into the <PaddocksLayer/> component:
  const formattedTime = format(selectedTime, 'yyyy-MM-dd HH:mm:ss.SSS')

  // COW-NAMES / DROPDOWN HANDLER
  const handleNameChange = (event: SelectChangeEvent) => {
    const newCowName = event.target.value
    setSelectedCow(newCowName)
    // Option is implicitly set to 'single' when a cow is selected
    setOptions('single')
  }

  // --- OPTIONS / RADIO HANDLER ---
  const handleOptionChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newOption = (event.target as HTMLInputElement).value
    setOptions(newOption)
    // Clear cow selection when switching to 'all'
    if (newOption === 'all') {
      setSelectedCow('')
    }
  }

  // --- USE-EFFECTS: ---

  // Update searchParams whenever states change
  useEffect(() => {
    const params: {
      selectedTime?: string
      selectedCow?: string
      option?: string
    } = {}

    if (selectedTime) params.selectedTime = selectedTime
    if (selectedCow) params.selectedCow = selectedCow
    if (option !== 'all') params.option = option

    setSearchParams(params, { replace: true })
  }, [selectedTime, selectedCow, option, setSearchParams])

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

  //  --- RETURN BLOCK ---
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
          pt: 5, // Padding of 16px
          pl: 10,
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
                      color: 'yellow', // When checked, yellow
                    },
                  }}
                />
              }
              label="All Cows"
              sx={{
                color: 'white',
                fontSize: '18px',
              }}
            />
            <FormControlLabel
              value="single"
              control={
                <Radio
                  sx={{
                    color: '#FF4081', // Default radio button color
                    '&.Mui-checked': {
                      color: 'yellow', // When checked, yellow
                    },
                  }}
                />
              }
              label="Single Cow"
              sx={{
                color: 'white',
                fontSize: '18px',
              }}
            />
          </RadioGroup>
        </FormControl>

        {/* COW NAME SELECTOR */}
        {option === 'single' && (
          <Box sx={{ color: 'white' }}>
            <FormLabel
              sx={{
                color: 'white',
                px: 2,
                pl: 4,
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
                color: 'yellow',
                '& .MuiSelect-icon': {
                  color: 'white',
                  fontSize: '2.5rem', // Size of the dropdown arrow icon
                },
              }}
              MenuProps={{
                PaperProps: {
                  style: {
                    maxHeight: 400, // Fixed height for the dropdown
                    overflowY: 'auto', // Dropdown is scrollable
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
          bottom: 25,
          left: '50%',
          transform: 'translateX(-50%)',
          width: '85%',
          '& .MuiSlider-thumb': {
            width: 20,
            height: 20,
            backgroundColor: '#FFEB3B', // Bright yellow selector
          },
          '& .MuiSlider-rail': {
            height: 10,
            backgroundColor: '#B0BEC5', // Light grey rail color
          },
          '& .MuiSlider-track': {
            height: 10,
            backgroundColor: '#FF4081', // Bright pink track
          },
          '& .MuiSlider-markLabel': {
            color: 'white', // Marks text color white
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
          max={totalHours} // Uses the total hours difference between startTime and endTime
          marks={marks} // one mark every hour
        />
      </Box>
      {map && (
        <PaddocksLayer
          map={map}
          singleCow={singleCow} // single cows data
          allCows={allCows} // all cows data
          selectedTime={formattedTime}
          selectedCow={selectedCow}
        />
      )}
    </>
  )
}

export default MapComponent
