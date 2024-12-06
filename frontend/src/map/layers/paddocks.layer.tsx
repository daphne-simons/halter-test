import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Map } from 'mapbox-gl'
import paddocksGeojson from '../../assets/geojson/paddocks.json'
import cowIcon from '../../assets/cow.png'
import { FeatureCollection } from 'geojson'
import { Cow, getSingleCow } from '../../apiClient'

interface PaddocksLayerProps {
  map: Map | null
  cowsByTime: Cow[] | undefined
}

const PaddocksLayer: React.FC<PaddocksLayerProps> = ({ map, cowsByTime }) => {
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
      if (!cowsByTime || cowsByTime.length === 0) return // No data to display

      // Create GeoJSON features from cowsByTime data
      const cowFeatures = cowsByTime.map((cow) => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [cow.longitude, cow.latitude], // Use cow's longitude and latitude
        },
        properties: {
          imageId: cow.cattle_name,
          iconSize: [10, 10],
        },
      }))

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
          map.addLayer(
            {
              id: 'cow-points',
              type: 'symbol',
              source: 'cow-location',
              layout: {
                'icon-image': 'cow',
                'icon-size': 0.15,
              },
            }
            // 'paddocks-border' // Add cow-points layer just before the paddocks-border layer
          )
        }
      }
    }

    const initializeMap = () => {
      updateCowPoints()
      addLayer()
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
  }, [map, cowsByTime]) // React to changes in map or cowsByTime

  return null // This component doesn't render anything in the DOM
}

export default PaddocksLayer
