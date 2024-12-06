# Solution Notes

## Initial noticings: 
- Front end and backend are disconnected

### Backend: 
- Backend is a SQlite db, ready made with records that include the following columns and data types: 
utc_timestamp: text 
cattle_name: text 
latitude: REAL # 
longitude: REAL # 

### Frontend: 
The Front end is running a basic App, with essentially two components layered on top of one another. The bottom layer is the terrain, using mapboxgl from 'mapbox-gl' * look up their docs. 
The top layer is the "break"-lines of the paddocks. This is rendered in the `<PaddocksLayer map={map}/>` component, which gets a map prop-drilled into it, and uses that information to render the paddock lines. 

Currently, because no other(real??) GeoJSON source, it is using the `geojson/paddocks.json` data (which could be based on real data?) to render the shapes. The way this happens is by using type:"source", "fill", and "line" - features that seem to work in sync with the prop-drilled "map", and allow us to render outlines/ fill, etc in relation to the maps features.)

## Tasks breakdown: 

### fullstack connection: 
- [X] - Setup express
- [ ] - set up express api routes 
- [ ] -  set up knex to query SQLite data 
- [ ] - do basic select() query and GET `api/v1/cows` 
- [ ] - set and use useQuery() and api function to call cows from db 

### feature / user interaction:  
- [ ] - Address the following user stories: 
    - A user should be able to select a particular point in time and display the position of the cows on the map. 
    - Sometimes a user will want to see all the cows at a particular time. 
    - Sometimes a user will want to see just one cow at a particular time. 


### Assumptions  

- In what time frame has this location data been collected? 
The result of this could determine how I create the UI. 

 oldest: 2024-10-31 14:07:52.000
 newest: 2024-11-01 10:59:55.000 
  - 19 hours, 51 minutes, and 3 seconds. AKA: 19:51:03 (hh:mm:ss).

**Assumption** : To create a UI that gives you a 24 hours window (roughly), through which you can choose a time of day. 

**Stretch**, check back in with Guidance team to see if a calendar option with a date picker would be useful. 



