# Backend Section

There is a SQLite database (`device_data.db`) that stores collar position metrics in the `device_positions` table.

## Table Structure

| Column          | Type | Description                                      |
| --------------- | ---- | ------------------------------------------------ |
| `utc_timestamp` | TEXT | UTC timestamp of the position in ISO 8601 format |
| `cattle_name`   | TEXT | Unique name for each cow                         |
| `latitude`      | REAL | Latitude coordinate           |
| `longitude`     | REAL | Longitude coordinate          |

**Primary Key**: Composite key on `utc_timestamp` and `cattle_name`.

## Testing the Database

1. **Open SQLite**: Run `sqlite3 device_data.db` in the terminal to start an SQLite session.
2. **Test Query**: Retrieve sample data with:
   ```sql
   SELECT * FROM device_positions LIMIT 5;
   ```
3. **Exit**: Type `.exit` to close the SQLite session.

## Tasks

1. **Backend API**: Build a simple API to serve the device position data stored in the SQLite database. This API will serve the data to the frontend. The language, framework and API design you use is entirely up to you. 
2. **Cloud Design**: In `NOTES.md` (or other), write a brief summary of how you would deploy the service to the cloud in whichever cloud provider you are most familiar with (e.g. AWS, GCP, Azure). Include which database you would actually use to store the data.

Note: Design this API in a generic way. Assume it may be used by other services in the future.

## Things to consider

- Consider how you would maintain consistency between the backend and the frontend (or other services potentially using this API in the future). Perhaps using something like OpenAPI to define the API and automatically generating client code is worthwile.
- When writing how you would deploy the service to the cloud, consider things like scaling, monitoring, debugging and cost. Keep in mind this is an internal tool, not a public facing service.