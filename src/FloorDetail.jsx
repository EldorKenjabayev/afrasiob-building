/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { floorData } from './data/floorData';
import { blockData } from './data/blockData';
import './BuildingMap.css';

// Import floor images
import Floor3Block3 from './Images/floors/3-Block-Floors3-16.png';
import Floor2Block1 from './Images/floors/1-Block-Floors-3-12.png';
import Floor2_4Block2_4 from './Images/floors/2-4-Block-Floors-3-14.png';
import Floor5Block5 from './Images/floors/5-Block-Floors-3-12.png';


const floorImages = {
    '3-Block-Floors3-16': Floor3Block3,
    '1-Block-Floors-2-12': Floor2Block1,
    '2-4-Block-Floors-3-14': Floor2_4Block2_4,
    '5-Block-Floors-3-12': Floor5Block5
};


const FloorDetail = () => {
    const { blockId, floorIndex } = useParams();
    const navigate = useNavigate();

    const block = blockData[blockId];
    const blockFloorData = floorData[blockId];
    const floorNum = parseInt(floorIndex);

    // Qavat nomini olish
    const blockName = block ? block.name : "Noma'lum Blok";
    const floorName = block && block.floors[floorNum] ? block.floors[floorNum].text : `${floorNum + 1}-qavat`;

    // Mos plan topish
    let plan = null;
    if (blockFloorData && blockFloorData.floorPlans) {
        // Avval aniq qavat uchun plan bor-yo'qligini tekshirish
        const specificKey = `floor-${floorNum + 1}`;
        if (blockFloorData.floorPlans[specificKey]) {
            plan = blockFloorData.floorPlans[specificKey];
        } else {
            // default planni tekshirish
            for (const key in blockFloorData.floorPlans) {
                const p = blockFloorData.floorPlans[key];
                if (p.appliesTo && p.appliesTo.includes(floorNum + 1)) {
                    plan = p;
                    break;
                }
            }
        }
    }

    const [activeApartment, setActiveApartment] = useState(-1);
    const [blinkKey, setBlinkKey] = useState(0);

    if (!plan) {
        return (
            <div className="building-map-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#000' }}>
                <div>
                    <h2>Bu qavat uchun chizma topilmadi</h2>
                    <p>{blockName} — {floorName}</p>
                    <button onClick={() => navigate(`/block/${blockId}`)} className="nav-btn" style={{ marginTop: '20px', width: 'auto', padding: '0 20px' }}>Orqaga</button>
                </div>
            </div>
        );
    }

    const apartments = plan.apartments;
    const bgImage = floorImages[plan.image];
    const viewBox = plan.viewBox;
    const viewBoxValues = viewBox.split(' ');
    const svgWidth = viewBoxValues[2] || "2736";
    const svgHeight = viewBoxValues[3] || "2051";

    const activateApartment = (index) => {
        setActiveApartment(index);
        setBlinkKey(prev => prev + 1);
    };

    const resetApartments = () => {
        setActiveApartment(-1);
        setBlinkKey(prev => prev + 1);
    };

    const handleClickApartment = (index, e) => {
        e.stopPropagation();
        if (activeApartment === index) {
            const apt = apartments[index];
            navigate(`/block/${blockId}/floor/${floorIndex}/apartment/${apt.id}`);
        } else {
            activateApartment(index);
        }
    };

    const handleNext = (e) => {
        e.stopPropagation();
        if (activeApartment === -1) {
            activateApartment(0);
        } else {
            activateApartment((activeApartment + 1) % apartments.length);
        }
    };

    const handlePrev = (e) => {
        e.stopPropagation();
        if (activeApartment === -1) {
            activateApartment(apartments.length - 1);
        } else {
            activateApartment((activeApartment - 1 + apartments.length) % apartments.length);
        }
    };

    return (
        <div className="building-map-container" onClick={resetApartments} style={{ backgroundColor: '#ffffffff' }}>
            <div
                style={{ position: 'absolute', inset: 0, backgroundColor: '#ffffffff', zIndex: 0 }}
            ></div>

            <button
                onClick={(e) => { e.stopPropagation(); navigate(`/block/${blockId}`); }}
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
                    boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}
            >
                {blockName} — {floorName}
            </div>

            <div className="controls">
                <button className="nav-btn" onClick={handleNext}>↑</button>
                <div className="current-mode">
                    {activeApartment !== -1 ? apartments[activeApartment].text : 'TANLASH'}
                </div>
                <button className="nav-btn" onClick={handlePrev}>↓</button>
            </div>


            <svg
                width="100%"
                height="100%"
                viewBox={viewBox}
                preserveAspectRatio="xMidYMid meet"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
            >
                <image
                    width={svgWidth}
                    height={svgHeight}
                    xlinkHref={bgImage}
                    preserveAspectRatio="xMidYMid meet"
                />

                {apartments.map((apt, index) => {
                    const isActive = index === activeApartment;

                    return (
                        <path
                            key={`${apt.id}-${blinkKey}`}
                            id={apt.id}
                            d={apt.d}
                            className={isActive ? 'active' : ''}
                            fill="#0A51F5"
                            fillOpacity={isActive ? "0.8" : "0"}
                            stroke={isActive ? "#ffffff" : "none"}
                            strokeWidth="2"
                            onClick={(e) => handleClickApartment(index, e)}
                            style={{ cursor: 'pointer', transition: 'fill-opacity 0.3s' }}
                            onMouseEnter={(e) => {
                                if (!isActive) e.target.style.fillOpacity = "0.4";
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

export default FloorDetail;
