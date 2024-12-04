# Frontend Section

This is a simple web app built with **React**, **TypeScript**, and **Vite**. **Chakra UI** is used as the component library. It displays a **Mapbox** map with GeoJSON data representing farm paddocks.

## Running the App

1. **Pre-requisites**: Ensure you have Node.js (version 20 or higher) and yarn installed.
2. **Install Dependencies**: Run `yarn install` in the terminal to install project dependencies.
3. **Start the App**: Run `yarn dev` to start the development server.

## Tasks

1. **Inputs**: Implement a simple UI to allow users to specify inputs (e.g. datetime(s), cattle name(s)) that will be used to fetch posiiotn data.
1. **Data fetching**: Fetch the position data from the API you built in the backend section
1. **Data visualization**: Display the fetched data on the map, in a way that best meets the guidance team's requirements. 



## Things to consider

- Consider how you would structure data fetching if this were a more complex platform and not just a simple web app. E.g. caching, error handling, and loading states.
- For data visualiation, consider whether addtional UI elements might help the user better interact with the data. 
- Consider the context in which this tool will be used.