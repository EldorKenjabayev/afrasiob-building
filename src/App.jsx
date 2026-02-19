import { Routes, Route } from 'react-router-dom';
import BuildingMap from './BuildingMap';
import BlockDetail from './BlockDetail';

function App() {
  return (
    <Routes>
      <Route path="/" element={<BuildingMap />} />
      <Route path="/block/:id" element={<BlockDetail />} />
    </Routes>
  );
}

export default App;
