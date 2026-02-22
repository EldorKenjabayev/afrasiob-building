import { Routes, Route } from 'react-router-dom';
import BuildingMap from './BuildingMap';
import BlockDetail from './BlockDetail';
import FloorDetail from './FloorDetail';
import ApartmentDetail from './ApartmentDetail';


function App() {
  return (
    <Routes>
      <Route path="/" element={<BuildingMap />} />
      <Route path="/block/:id" element={<BlockDetail />} />
      <Route path="/block/:blockId/floor/:floorIndex" element={<FloorDetail />} />
      <Route path="/block/:blockId/floor/:floorIndex/apartment/:aptId" element={<ApartmentDetail />} />

    </Routes>
  );
}

export default App;
