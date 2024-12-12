import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Map } from 'mapbox-gl'
import paddocksGeojson from '../../assets/geojson/paddocks.json'
import cowIcon from '../../assets/cow.png' // cute little cow icon
import { FeatureCollection } from 'geojson'
import { Cow } from '../../apiClient' // interface

interface PaddocksLayerProps {
  map: Map | null
  singleCow: Cow[] | undefined
  allCows: Cow[] | undefined
  selectedTime: string
  selectedCow: string
}

const PaddocksLayer: React.FC<PaddocksLayerProps> = ({
  map,
  singleCow,
  allCows,
  selectedTime,
  selectedCow,
}) => {
  useEffect(() => {
    if (!map) return

    const addLayer = () => {
      // Add the GeoJSON source if it doesn't already exist
      if (!map.getSource('paddocks')) {
        map.addSource('paddocks', {
          type: 'geojson',
          data: paddocksGeojson as FeatureCollection,
        })
      }

      // Add the fill layer for the polygons
      if (!map.getLayer('paddocks-fill')) {
        map.addLayer({
          id: 'paddocks-fill',
          type: 'fill',
          source: 'paddocks',
          layout: {},
          paint: {
            'fill-color': '#888888',
            'fill-opacity': 0.4,
          },
        })
      }

      // Add the line layer for the white border
      if (!map.getLayer('paddocks-border')) {
        map.addLayer({
          id: 'paddocks-border',
          type: 'line',
          source: 'paddocks',
          layout: {},
          paint: {
            'line-color': '#ffffff',
            'line-width': 2,
          },
        })
      }
    }

    // Benefits of the updateCowPoints function:
    // - Handles both single cow and all cows scenarios
    // - Only records before the selected time are considered
    // - Only the most recent record for each cow is kept
    const updateCowPoints = () => {
      let cowData = selectedCow ? singleCow : allCows

      if (!cowData || cowData.length === 0) return // No data to display

      // Create an object to store the most recent location for each cow
      // Using an object allows us to efficiently track the latest position per cow
      const cowsMap: { [key: string]: Cow } = {}
      // Convert the selected time to a Date object for effective comparison
      const selectedTimeDate = new Date(selectedTime)
      // Iterate through all cow data to find the most recent position
      cowData.forEach((cow) => {
        // Convert the cow's timestamp to a Date object
        const cowTimestamp = new Date(cow.utc_timestamp)

        // Key filtering logic:
        // 1. Only consider records at or before the selected time
        // 2. Update the cow's position if:
        //    - No previous record exists for this cow, OR
        //    - This record is more recent than the previously stored record
        if (cowTimestamp <= selectedTimeDate) {
          if (
            // runs checks
            !cowsMap[cow.cattle_name] ||
            new Date(cowsMap[cow.cattle_name].utc_timestamp) < cowTimestamp
          ) {
            // updates position
            cowsMap[cow.cattle_name] = cow
          }
        }
      })

      // Create GeoJSON features from the most recent cow data
      const cowFeatures = Object.values(cowsMap).map((cow) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [cow.longitude, cow.latitude],
        },
        properties: {
          imageId: cow.cattle_name,
          iconSize: [10, 10],
          time: cow.utc_timestamp, // Timestamp for time-based filtering
        },
      }))

      // Define the GeoJSON source data
      const cowGeoJson = {
        type: 'FeatureCollection',
        features: cowFeatures,
      }

      // Add the cow-location source
      if (!map.getSource('cow-location')) {
        map.addSource('cow-location', {
          type: 'geojson',
          data: cowGeoJson as FeatureCollection, // Use dynamically generated GeoJSON
        })

        // Attach the image layer to the 'cow-location' source
        if (!map.getLayer('cow-points')) {
          map.addLayer({
            id: 'cow-points',
            type: 'symbol',
            source: 'cow-location',
            layout: {
              'icon-image': 'cow',
              'icon-size': 0.15,
            },
          })
        }
      }
      // This makes sure that the cow icons are on top of the paddocks layers
      if (map.getLayer('cow-points')) {
        if (map.getLayer('paddocks-fill')) {
          map.moveLayer('paddocks-fill', 'cow-points') // Move paddocks-fill below cow-points
        }
        if (map.getLayer('paddocks-border')) {
          map.moveLayer('paddocks-border', 'cow-points') // Move paddocks-border below cow-points
        }
      }
    }
    // Time Filter from mapbox
    const applyTimeFilter = () => {
      if (map.getLayer('cow-points')) {
        map.setFilter('cow-points', ['<=', ['get', 'time'], selectedTime])
      }
    }
    const initializeMap = () => {
      addLayer()
      updateCowPoints()
      applyTimeFilter()
    }

    // Ensure that the map style has loaded before adding layers or sources
    if (map.isStyleLoaded()) {
      initializeMap() // Call only if the map style is loaded
    } else {
      map.on('load', () => {
        initializeMap() // Only after style has fully loaded
      })
    }
    // Load the cow icon and ensure the map is initialized
    map.loadImage(cowIcon, (error, image) => {
      if (error) throw error
      if (image) {
        if (!map.hasImage('cow')) {
          map.addImage('cow', image)
        }
        if (map.isStyleLoaded()) {
          initializeMap()
        } else {
          map.on('load', initializeMap)
        }
      }
    })

    // Clean up when the component unmounts
    return () => {
      if (map.getLayer('paddocks-fill')) {
        map.removeLayer('paddocks-fill')
      }
      if (map.getLayer('paddocks-border')) {
        map.removeLayer('paddocks-border')
      }
      if (map.getSource('paddocks')) {
        map.removeSource('paddocks')
      }
      if (map.getLayer('cow-points')) {
        map.removeLayer('cow-points')
      }
      if (map.getSource('cow-location')) {
        map.removeSource('cow-location')
      }
    }
  }, [map, singleCow, allCows, selectedTime, selectedCow]) //  Component re-renders when there are changes in map, cowData and selectedTime and selectedCow

  return null // This component doesn't render anything in the DOM
}

export default PaddocksLayer
