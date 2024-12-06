import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Map } from 'mapbox-gl'
import paddocksGeojson from '../../assets/geojson/paddocks.json'
import cowIcon from '../../assets/cow.png'
import { FeatureCollection } from 'geojson'
import { Cow, getSingleCow } from '../../apiClient'

interface PaddocksLayerProps {
  map: Map | null
  allCows: Cow[] | undefined
  allCowsByTimestamp: Cow[] | undefined
}

const PaddocksLayer: React.FC<PaddocksLayerProps> = ({
  map,
  allCows,
  allCowsByTimestamp,
}) => {
  const { data: singleCow } = useQuery({
    queryKey: ['singleCow'],
    queryFn: () => getSingleCow('173'),
  })
  console.log('alldata', allCows)
  // console.log('singleCowData', singleCow)
  console.log('cowsByTime', allCowsByTimestamp)

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

    const addCowMarker = () => {
      // Load the image for the cow marker
      map.loadImage(cowIcon, (error, image) => {
        if (error) throw error
        if (image) {
          if (!map.hasImage('cow')) {
            map.addImage('cow', image)
          }
        }

        if (!map.getSource('cow-location')) {
          map.addSource('cow-location', {
            type: 'geojson',
            data: {
              type: 'FeatureCollection',
              features: [
                {
                  type: 'Feature',
                  geometry: {
                    type: 'Point',
                    // TODO: these coordinates will be responding to the actual database coordinates, so will need to map through that data dynamically.
                    coordinates: [175.589402, -37.682369],
                  },
                  properties: {
                    message: 'moo',
                    imageId: 1,
                    iconSize: [10, 10],
                  },
                },
              ],
            },
          })
        }
        // attach this image layer to the 'cow-location' source created above.
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
      })
    }
    // Check if the map has finished loading
    if (map.isStyleLoaded()) {
      addLayer()
      addCowMarker()
    } else {
      map.on('load', () => {
        addLayer()
        addCowMarker()
      })
    }

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
      if (map.getSource('cow-icon')) {
        map.removeSource('cow-icon')
      }
    }
  }, [map])

  return null // This component doesn't render anything in the DOM
}

export default PaddocksLayer
