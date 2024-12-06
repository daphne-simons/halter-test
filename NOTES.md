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
BE: 
- [X] - Setup express
- [X] - set up express api routes 
- [X] -  set up knex to query SQLite data 
- [X] - do basic select() query routes; GET `api/v1/cows` and GET `api/v1/cows/:id`
FE: 
- [ ] - set up apiClient function to call cows from backend
- [ ] - use useQuery() in a component to see if i can console.log all cows, and a single cow. 
- [ ] - set up functions to get cow data by minute:

UI for Time Selection:

- Make a UI widget (like a datetime picker) where users can choose a specific date and time.
Send the selected time to the server as a query parameter.

Client-Side API Update:

- Send the selected timestamp to the server.

Server-Side Update:

- Receive the timestamp and query the database for records matching that specific time.

Database Update:

- Fetch data for the specific utc_timestamp. If needed, you can retrieve records rounded to the nearest minute.

- [ ] - figure out how to render this data on the map.


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





