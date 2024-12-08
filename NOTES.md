# Notes

Daphne Simons - Halter Full Stack Tech Test 

## Feature Request:  

### User stories: 
    - A user should be able to select a particular point in time and display the position of the cows on the map. 
    - Sometimes a user will want to see all the cows at a particular time. 
    - Sometimes a user will want to see just one cow at a particular time. 


### Initial noticings: 
- Front end and backend are disconnected

### Backend: 
- Backend is a SQlite db, ready made with records that include the following column names and data types: 

```ts
utc_timestamp: string
cattle_name: string 
latitude: number 
longitude: number
``` 

### Frontend: 
- The Front end is running a basic App, with essentially two components layered on top of one another. The bottom layer is the terrain, using mapboxgl from `mapbox-gl`. 
- **_look up their docs! Never worked with mapboxgl before_**

- The top layer is the "break"-lines of the paddocks. This is rendered in the `<PaddocksLayer map={map}/>` component, which gets a map prop-drilled into it, and uses that information to render the paddock lines. 

- Currently, because no other(real??) GeoJSON source, it is using the `geojson/paddocks.json` data (which could be based on real data?) to render the shapes. The way this happens is by using type:"source", "fill", and "line" - features that seem to work in sync with the prop-drilled "map", and allow us to render outlines/ fill, etc in relation to the maps features.)


## Tasks breakdown: 

### Fullstack connection checklist: 

Back End: 
- [X] - Setup express
- [X] - set up express api routes 
- [X] -  set up knex to query SQLite data 
- [X] - do select('*') query routes; GET `api/v1/cows` and GET `api/v1/cows/:id`

Front End: 
- [X] - set up apiClient functions to call cows from backend api
- [X] - use `@tanstack/react-query` to make a useQuery() in component - useful for it's caching and asynchronous handling features. 
- [X] - console.log data (all cows and a single cow). 
- [X] - set up functionality to get cow data by time... 

### Specifics for Time Selection:

- Make a UI feature where users can choose a specific time. 
- Check out the material UI slider options. 
- Although the time frame is approx 24 hours worth of data. As I explored this data, I realised that the data records are a bit inconsistent in terms of time_stamp regularity. 
- I decided to make a sliding range input with hourly incrementing steps.
- As a user selects an hour it will represent the cow(s) location data that occured on that exact time or the most recent record. 
- Initially I build some backend api's to query the data using the time_stamp as a parameter, so that I could use those api's in the frontend to make a time selection UI.
- As i carried on working on this, and looking further into the documentation for `mapbox` I realised it would be a better user experience to use the filtering functions provided by mapbox. This way the filtering experience would be faster (a user would not have to wait until backend requests were completed).
- Similar client side filtering logic has been applied for a single cow or all-cow selection. 


## Assumptions  

- I created a UI that gives you a 24 hour window (roughly), which lets users move through the data by hour. 
  - In reality I would check in with the Guidance team to see what kind of granularity they are looking for. 

- I assumed the Guidance team may want to be able to share link to specific moments of cow data, so I implemented `useSearchParams` which are set and persist in response to the selected time and cow. 
  - In reality I would check in with the Guidance team to see if they even need this functionality.

- I assume that the users enjoy cute cow icons as much as I do. 🐄 
  - In reality - I would check for prefered icon-style. 

- The general colour scheme i used for the UI elements is bright and high contrast in relation to the dark green of the map background. I figured contrast is key to the UI.  
  - In reality I would check the "house style" of the Guidance team, so that my choice of yellow and magenta isn't too jarring. 


## Stretch goals:

- Add a loader for everytime that a request is pending. - use the built in features from useQuery, e.g. `isFetching` or wrap my components in a <Suspense> boundary.

- Make the cow names appear in a more realistic ascending order, without losing their unique qualities 
  - e.g. 008 doesnt become 8.

- It would be ideal to display the "cattle_name" on top of each cow-icon on the map. 
  - This would allow a user to select a single cow by **clicking** on the cow icon with the name they want. 

- Add a calendar option to select a specific date. To implement this stretch goal, I would check back in with Guidance team to see if this would be useful for them. 

## Cloud Deployment Strategy

In this summary I'll focus how this app could be deployed on AWS as the cloud provider. 

1. Database Selection

    - Replace SQLite with Amazon RDS PostgreSQL
    - Reasons:
      - Better scalability for large datasets
      - Built-in backup and replication features
      - Supports complex geospatial queries with PostGIS extension
      - Easier to manage and scale compared to SQLite

2. Backend Deployment

    - Use AWS Elastic Beanstalk for the Express.js backend
    - Benefits:
      - Automatic load balancing
      - Easy deployment and scaling
      - Integrated with other AWS services
      - Supports Node.js runtime
      - Simplified environment management

3. Frontend Deployment

    - I know this is not the main focus for this test, but I wanted to include notes about possible strategy for deploying the React App to AWS using Cloudfront. 
    - Advantages:
      - Static site hosting
      - Global content delivery
      - Low-cost static website hosting
      - Easy integration with other AWS services

4. Monitoring and Observability

    - Amazon CloudWatch for metrics and logging
    - AWS X-Ray for distributed tracing
    - Set up custom dashboards to track:
      - API response times
      - Database query performance
      - Server resource utilization
      - Error rates


5. Security Considerations

    - Probably not a huge priority while in-house, but if the Guidance team needed more secure and robust security features, I would implement:
      - Use Auth0 or look into AWS IAM for access management
      - Implement VPC for network isolation
      - Enable AWS WAF for additional protection
      - Use AWS Secrets Manager for database credentials


6. Continuous Deployment

    - Along with writing automated tests, e.g. unit tests, integration tests, and end to end tests, I would also look into continuous deployment using:
      - Use AWS CodePipeline
      - Integrate with GitHub/GitLab
      - Implement blue-green deployment strategy

--- 


