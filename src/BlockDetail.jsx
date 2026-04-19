/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { blockData } from './data/blockData';
import './BuildingMap.css';
import wsService from './wsService';

// Import images
import Block1Img from './Images/blocks/Block-1.webp';
import Block2Img from './Images/blocks/Block-1.webp';
import Block3Img from './Images/blocks/Block-3.webp';
import Block4Img from './Images/blocks/Block-4.webp';

const blockImages = {
    '1': Block1Img,
    '2': Block2Img,
    '3': Block3Img,
    '4': Block4Img,
    '5': Block4Img
};

const BlockDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const data = blockData[id];

    const floors = data ? data.floors : [];
    const basePath = data ? data.basePath : "";
    const blockName = data ? data.name : "Noma'lum Blok";
    const viewBox = data ? data.viewBox : "0 0 2736 2052";
    const bgImage = blockImages[id] || Block1Img;

    // Parse width and height from viewBox for the image element
    const viewBoxValues = viewBox.split(' ');
    const svgWidth = viewBoxValues[2] || "2736";
    const svgHeight = viewBoxValues[3] || "2052";

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
        if (activeFloor === index) {
            // Ikkinchi marta bosildi — qavat ichiga kirish
            navigate(`/block/${id}/floor/${index}`);
        } else {
            activateFloor(index);
        }
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

    // WebSocket: sahifaga kirganida darhol blokni yoq
    useEffect(() => {
        if (['1', '2', '3', '4', '5'].includes(id)) {
            // Sahifaga kirildi — butun blokni yoq
            wsService.sendCommand(`B${id}_ON`);
        }
        // Sahifadan chiqqanda — barchani o'chir
        return () => {
            wsService.sendCommand('GLOBAL_OFF');
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]);

    // WebSocket: qavat tanlanganda
    useEffect(() => {
        if (['1', '2', '3', '4', '5'].includes(id)) {
            if (activeFloor !== -1) {
                wsService.sendCommand(`FL_${id}_${activeFloor}`);
            } else {
                wsService.sendCommand(`B${id}_ON`);
            }
        }
    }, [id, activeFloor]);

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
                style={{ backgroundImage: `url(${bgImage})`, backgroundSize: 'cover' }}
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

            <div
                style={{
                    position: 'absolute',
                    top: '20px',
                    left: '50%',
                    transform: 'translateX(-50%)',
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
                {blockName}
            </div>

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
                viewBox={viewBox}
                preserveAspectRatio="xMidYMid slice"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
            >
                <image
                    width={svgWidth}
                    height={svgHeight}
                    xlinkHref={bgImage}
                    preserveAspectRatio="xMidYMid slice"
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
