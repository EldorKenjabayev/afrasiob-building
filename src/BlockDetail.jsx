/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import Block1 from './Images/blocks/Block-1.webp';
import { blockData } from './data/blockData';
import './BuildingMap.css';

const BlockDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const data = blockData[id];

    // If no data found for the ID, we can fallback or handle error
    const floors = data ? data.floors : [];
    const basePath = data ? data.basePath : "";
    const blockName = data ? data.name : "Noma'lum Blok";

    const [activeFloor, setActiveFloor] = useState(-1);
    const [blinkKey, setBlinkKey] = useState(0);

    const activateFloor = (index) => {
        setActiveFloor(index);
        setBlinkKey(prev => prev + 1);
    };

    const resetFloors = () => {
        setActiveFloor(-1);
        setBlinkKey(prev => prev + 1);
    };

    const handleClickFloor = (index, e) => {
        e.stopPropagation();
        activateFloor(index);
    };

    const handleFloorUp = (e) => {
        e.stopPropagation();
        if (activeFloor === -1) {
            activateFloor(0);
        } else {
            activateFloor((activeFloor + 1) % floors.length);
        }
    };

    const handleFloorDown = (e) => {
        e.stopPropagation();
        if (activeFloor === -1) {
            activateFloor(floors.length - 1);
        } else {
            activateFloor((activeFloor - 1 + floors.length) % floors.length);
        }
    };

    if (!data) {
        return (
            <div className="building-map-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#000' }}>
                <div>
                    <h2>Blok topilmadi</h2>
                    <button onClick={() => navigate('/')} className="nav-btn" style={{ marginTop: '20px', width: 'auto', padding: '0 20px' }}>Orqaga</button>
                </div>
            </div>
        );
    }

    return (
        <div className="building-map-container" onClick={resetFloors}>
            <div
                className="detail-background-blur"
                style={{ backgroundImage: `url(${Block1})` }}
            ></div>

            <button
                onClick={(e) => { e.stopPropagation(); navigate('/'); }}
                style={{
                    position: 'absolute',
                    top: '20px',
                    left: '20px',
                    zIndex: 2000,
                    padding: '10px 20px',
                    fontSize: '16px',
                    backgroundColor: '#000',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}
            >
                ← Orqaga
            </button>

            <div className="controls">
                <button className="nav-btn" onClick={handleFloorUp}>↑</button>
                <div className="current-mode">
                    {activeFloor !== -1 ? floors[activeFloor].text : 'TANLASH'}
                </div>
                <button className="nav-btn" onClick={handleFloorDown}>↓</button>
            </div>

            {/* reuse label styling */}
            <div
                id="floor-label"
                className={`label-popup ${activeFloor !== -1 ? 'show' : ''}`}
                style={{ display: activeFloor !== -1 ? 'block' : 'none' }}
            >
                {activeFloor !== -1 ? floors[activeFloor].text : ''}
            </div>

            <svg
                width="100%"
                height="100%"
                viewBox="0 0 2736 2052"
                preserveAspectRatio="xMidYMid meet"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
            >
                <image
                    width="2736"
                    height="2052"
                    xlinkHref={Block1}
                    preserveAspectRatio="xMidYMid meet"
                />

                {/* Base Blue Path - Always visible/animated */}
                <path
                    d={basePath}
                    fill="#0A51F5"
                    fillOpacity="0.47"
                    className="blinking"
                />

                {floors.map((floor, index) => {
                    const isActive = index === activeFloor;

                    return (
                        <path
                            key={`${floor.id}-${blinkKey}`}
                            id={floor.id}
                            d={floor.d}
                            className={isActive ? 'active' : ''}
                            fill="#0A51F5"
                            fillOpacity={isActive ? "0.8" : "0"}
                            stroke={isActive ? "#ffffff" : "none"}
                            strokeWidth="1"
                            onClick={(e) => handleClickFloor(index, e)}
                            style={{ cursor: 'pointer', transition: 'fill-opacity 0.3s' }}
                            onMouseEnter={(e) => {
                                if (!isActive) e.target.style.fillOpacity = "0.6";
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) e.target.style.fillOpacity = "0";
                            }}
                        />
                    );
                })}

                <defs>
                </defs>
            </svg>
        </div>
    );
};

export default BlockDetail;
