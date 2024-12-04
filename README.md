# Halter Full Stack Tech Test

## Background Context

- One of the sensors Halter collars have is a GPS. GPS location is necessary for the guidance product. At a high level, the guidance product as two modes: virtual fencing and remote shifting. 

- Virtual fencing is where a *break* (farming term for a sub-section of a paddock) is drawn in app and cows are guided to stay within these bounds. Remote shifting is where cows are guided out of a paddock, into a padock, or to another break within the paddock. 

- The collar's firmware uses GPS location frequently for guidance, but communicates this location back to the cloud infrequently due to both communication and power constraints.

- Having location data in the cloud is necessary for displaying cow location in app, but it can also be used to review past events and understand the performance of the guidance product.

- Note: No guidance specific data is provided in this test. Only location data is provided.


## Feature Request from the Guidance Team

You have received a message from the Guidance team with the following request:

> We already have a frontend that displays the paddocks of a farm, and we have a database that contains the location data of the cows. What we want now is to select a particular point in time and display the position of the cows on the map. Sometime's we'll be interested in all cows, sometimes just one. This feature will help us see how cows move over time, and in response to the guidance system.

## Task

1. A database already exists (in the `backend` folder) that contains the location data of the cows. Build a simple backend API to serve this data to the frontend. Further details can be found in `backend/README.md`.

2. Add a new feature to the simple frontend that already exists (in the `frontend` folder) to help the Guidance team continue to development the guidance product. Further details can be found in `frontend/README.md`.

3. Write a brief explanation of your approach, assumptions and any other notes you think are relevant in the `NOTES.md` (or other preferred file type) file.

Note: Everything (the frontend, backend, and database) will run locally on your machine. You will not implement any cloud services, although the backend section does ask to write a breif summary of how you might deploy the service to the cloud.

## Things to consider

- There is some ambiguity in the request. Typically you would ask the Guidance team follow up questions, but for this task, feel free to make some assumptions. Please note down the assumptions you do make.

- Consider the workflow and user experience if you were in the Guidance team, developing and iterating on the way we guide cows. 

- This test is not design to be overly complex, no need to spend too much time on it (<4 hours). The goal is to see how you approach the request, what assumptions you make, and how you implement a simple backend service and frontend feature. If you have more ideas or would do things differently given more time or resources, feel free to note them down in the `NOTES.md` file.