import React from 'react'
import { Flex } from '@chakra-ui/react'
import MapComponent from './map-component'

const MapScreen: React.FC = () => {
  return (
    <Flex className="map-screen" width="full" height="full">
      <MapComponent />
    </Flex>
  )
}
export default MapScreen
