# Solution Notes

## Initial noticings: 
- Front end and backend are disconnected
- Backend is a SQlite db, ready made with records that include the following columns and data types: 
utc_timestamp: text 
cattle_name: text 
latitude: REAL # 
longitude: REAL # 

The Front end is running a basic App, with essentially two components layered on top of one another. The bottom layer is the terrain, using mapboxgl from 'mapbox-gl' 
The top layer is the "break"-lines of the paddocks. This is rendered in the `<PaddocksLayer map={map}/>` component, which gets a map prop-drilled into it, and uses that information to render the paddock lines. 

Currently, because no other(real??) GeoJSON source, it is using the `geojson/paddocks.json` data (which could be based on real data?) to render the shapes. The way this happens is by using type:"source", "fill", and "line" - features that seem to work in sync with the prop-drilled "map", and allow us to render outlines/ fill, etc in relation to the maps features.)

