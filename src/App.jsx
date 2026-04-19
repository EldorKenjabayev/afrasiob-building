import { Routes, Route, Link } from 'react-router-dom';
import BuildingMap from './BuildingMap';
import BlockDetail from './BlockDetail';
import FloorDetail from './FloorDetail';
import ApartmentDetail from './ApartmentDetail';

function App() {
  return (
    <div className="app-main-wrapper">
      <Link to="/" className="top-left-logo">
        <img src="/logo.svg" alt="Afrosiyob Logo" />
      </Link>
      
      <Routes>
        <Route path="/" element={<BuildingMap />} />
        <Route path="/block/:id" element={<BlockDetail />} />
        <Route path="/block/:blockId/floor/:floorIndex" element={<FloorDetail />} />
        <Route path="/block/:blockId/floor/:floorIndex/apartment/:aptId" element={<ApartmentDetail />} />
      </Routes>

      <style>{`
        .app-main-wrapper {
          position: relative;
          min-height: 100vh;
        }
        .top-left-logo {
          position: fixed;
          top: 20px;
          left: 20px;
          z-index: 1000;
          cursor: pointer;
          transition: transform 0.3s ease;
        }
        .top-left-logo:hover {
          transform: scale(1.05);
        }
        .top-left-logo img {
          width: 150px;
          height: auto;
          filter: drop-shadow(0 2px 4px rgba(0,0,0,0.1));
        }
        @media (max-width: 768px) {
          .top-left-logo img {
            width: 100px;
          }
          .top-left-logo {
            top: 10px;
            left: 10px;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
