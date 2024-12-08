import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Map } from 'mapbox-gl'
import paddocksGeojson from '../../assets/geojson/paddocks.json'
import cowIcon from '../../assets/cow.png'
import { FeatureCollection } from 'geojson'
import { Cow } from '../../apiClient'

interface PaddocksLayerProps {
  map: Map | null
  singleCow: Cow[] | undefined
  selectedTime: string
}

const PaddocksLayer: React.FC<PaddocksLayerProps> = ({
  map,
  singleCow,
  selectedTime,
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

    const updateCowPoints = () => {
      if (!singleCow || singleCow.length === 0) return // No data to display

      // Create GeoJSON features from cow data by finding the most recent location or current location
      const cowFeatures = singleCow
        .map((cow) => {
          const cowTimestamp = new Date(cow.utc_timestamp).toISOString()
          const selectedTimeDate = new Date(selectedTime).toISOString()

          // Only include cows that have a timestamp before or equal to the selected time
          if (cowTimestamp <= selectedTimeDate) {
            return {
              ...cow, // Return the entire cow object for easier handling later
              timestamp: cowTimestamp, // Add the timestamp for sorting
            }
          }
        })
        .filter(Boolean) // Remove null values (if cow's timestamp is later than the selected time)
        .sort((a, b) => {
          // Sort by timestamp in descending order so the most recent location is first
          return b.timestamp - a.timestamp //
        })
        .map((cow) => {
          // Create the GeoJSON feature for the most recent valid timestamp per cow
          return {
            type: 'Feature',
            geometry: {
              type: 'Point',
              coordinates: [cow.longitude, cow.latitude], // Use cow's longitude and latitude
            },
            properties: {
              imageId: cow.cattle_name,
              iconSize: [10, 10],
              time: cow.utc_timestamp,
            },
          }
        })

      // Define the GeoJSON source data
      const cowGeoJson = {
        type: 'FeatureCollection',
        features: cowFeatures,
      }

      // Update or add the cow-location source
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
    // const applyTimeFilter = () => {
    //   if (map.getLayer('cow-points')) {
    //     map.setFilter('cow-points', [
    //       '==',
    //       ['get', 'time'],
    //       selectedTime, // TODO: replace this with dymaic data from user selection
    //     ])
    //   }
    // }
    const initializeMap = () => {
      updateCowPoints()
      addLayer()
      // applyTimeFilter()
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
          updateCowPoints()
        } else {
          map.on('load', initializeMap)
        }
      }
    })

    // Update cow points whenever cowsByTime changes
    updateCowPoints()
    // Update time filter whenever selectedTime changes
    // applyTimeFilter()
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
  }, [map, singleCow, selectedTime]) // TODO: React to changes in map, cowData and selectedTime

  return null // This component doesn't render anything in the DOM
}

export default PaddocksLayer
