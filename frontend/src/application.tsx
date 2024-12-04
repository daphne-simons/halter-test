import { Route, Routes } from "react-router-dom";
import MapScreen from "./map/map-screen";

const Application = () => (
  <Routes>
    <Route path={"/"} element={<MapScreen />} />
  </Routes>
);

export default Application;
