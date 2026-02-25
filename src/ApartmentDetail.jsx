/* eslint-disable react/no-unknown-property */
/* eslint-disable react/prop-types */
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { floorData } from './data/floorData';
import { blockData } from './data/blockData';
import './BuildingMap.css';

// Import floor images (using same as FloorDetail for consistency)
import Floor3Block3 from './Images/floors/3-Block-Floors3-16.png';
import Floor2Block1 from './Images/floors/1-Block-Floors-3-12.png';
import Floor2_4Block2_4 from './Images/floors/2-4-Block-Floors-3-14.png';
import Floor5Block5 from './Images/floors/5-Block-Floors-3-12.png';
import Floor2Block3 from './Images/floors/3-Block-Floor-2.png';
import Floor1Block3 from './Images/floors/3-Block-Floor-1.png';
import Floor1Block2_4 from './Images/floors/2-4-Block-Floor-1.png';
import Floor2Block2_4 from './Images/floors/2-4-Block-Floor-2.png';
import Floor15Block2_4 from './Images/floors/2-4-Block-Floor-15.png';
import Floor1Block1 from './Images/floors/Block1-Floor-1.png';
import Floor1Block5 from './Images/floors/Block5-floor1.png';
import Floor13Block1 from './Images/floors/Block1-Floor-13.png';
import Floor13Block5 from './Images/floors/Block5-Floor-13.png';
import Floor2_Block1 from './Images/floors/Block1-Floor-2.png';
import Floor2_Block5 from './Images/floors/Block5-Floor-2.png';


const floorImages = {
    '3-Block-Floors3-16': Floor3Block3,
    '1-Block-Floors-2-12': Floor2Block1,
    '2-4-Block-Floors-3-14': Floor2_4Block2_4,
    '5-Block-Floors-3-12': Floor5Block5,
    '3-Block-Floor-2': Floor2Block3,
    '3-Block-Floor-1': Floor1Block3,
    '2-4-Block-Floor-1': Floor1Block2_4,
    '2-4-Block-Floor-2': Floor2Block2_4,
    '2-4-Block-Floor-15': Floor15Block2_4,
    'Block1-Floor-1': Floor1Block1,
    'Block5-floor1': Floor1Block5,
    'Block1-Floor-13': Floor13Block1,
    'Block5-Floor-13': Floor13Block5,
    'Block1-Floor-2': Floor2_Block1,
    'Block5-Floor-2': Floor2_Block5
};


const ApartmentDetail = () => {
    const { blockId, floorIndex, aptId } = useParams();
    const navigate = useNavigate();

    const block = blockData[blockId];
    const blockFloorData = floorData[blockId];
    const floorNum = parseInt(floorIndex);

    // Mos plan topish (FloorDetail bilan bir xil logika)
    let plan = null;
    if (blockFloorData && blockFloorData.floorPlans) {
        const specificKey = `floor-${floorNum + 1}`;
        if (blockFloorData.floorPlans[specificKey]) {
            plan = blockFloorData.floorPlans[specificKey];
        } else {
            for (const key in blockFloorData.floorPlans) {
                const p = blockFloorData.floorPlans[key];
                if (p.appliesTo && p.appliesTo.includes(floorNum + 1)) {
                    plan = p;
                    break;
                }
            }
        }
    }

    // Tanlangan kvartirani topish
    const apartment = plan?.apartments.find(a => a.id === aptId);

    // Bounding Box hisoblash (viewBox ni crop qilish uchun)
    const apartmentViewBox = useMemo(() => {
        if (!apartment || !plan) return plan?.viewBox || "0 0 2736 2051";

        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

        // Path buyruqlarini va sonlarini ajratib olish
        const commands = apartment.d.match(/[a-df-z][^a-df-z]*/ig);
        let curX = 0;
        let curY = 0;

        const updateBounds = (x, y) => {
            if (x < minX) minX = x;
            if (y < minY) minY = y;
            if (x > maxX) maxX = x;
            if (y > maxY) maxY = y;
        };

        commands.forEach(cmd => {
            const type = cmd[0];
            const args = cmd.slice(1).trim().split(/[\s,]+/).map(Number);

            switch (type.toUpperCase()) {
                case 'M':
                case 'L':
                    curX = args[0];
                    curY = args[1];
                    updateBounds(curX, curY);
                    break;
                case 'H':
                    curX = args[0];
                    updateBounds(curX, curY);
                    break;
                case 'V':
                    curY = args[0];
                    updateBounds(curX, curY);
                    break;
                case 'Z':
                    // Closing doesn't change bounds
                    break;
            }
        });

        const width = maxX - minX;
        const height = maxY - minY;

        // Markazni aniqlash
        const centerX = minX + width / 2;
        const centerY = minY + height / 2;

        // Eng katta tomonni olish va kvadrat ko'rinishga keltirish
        const maxSide = Math.max(width, height);
        const zoomSize = maxSide * 1.4; // Masshtabni ushlab turuvchi koeffitsient

        const croppedX = centerX - zoomSize / 2;
        const croppedY = centerY - zoomSize / 2;
        const croppedW = zoomSize;
        const croppedH = zoomSize;

        return `${croppedX} ${croppedY} ${croppedW} ${croppedH}`;
    }, [apartment, plan]);

    if (!plan || !apartment) {
        return (
            <div className="building-map-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <div style={{ color: '#000', textAlign: 'center' }}>
                    <h2>Ma'lumot topilmadi</h2>
                    <button onClick={() => navigate(-1)} className="nav-btn" style={{ width: 'auto', padding: '10px 20px' }}>Orqaga</button>
                </div>
            </div>
        );
    }

    const bgImage = floorImages[plan.image];
    const originalViewBox = plan.viewBox.split(' ');
    const svgWidth = originalViewBox[2];
    const svgHeight = originalViewBox[3];

    return (
        <div className="building-map-container" style={{ backgroundColor: '#ffffff', position: 'relative' }}>
            {/* Header / Nav */}
            <button
                onClick={() => navigate(-1)}
                style={{
                    position: 'absolute', top: '20px', left: '20px', zIndex: 2000,
                    padding: '10px 20px', backgroundColor: '#000', color: '#fff',
                    border: 'none', borderRadius: '10px', cursor: 'pointer',
                    boxShadow: '0 2px 10px rgba(0,0,0,0.1)', display: 'flex', alignItems: 'center', gap: '8px'
                }}
            >
                ← Orqaga
            </button>

            <div
                style={{
                    position: 'absolute', top: '20px', left: '50%', transform: 'translateX(-50%)',
                    zIndex: 2000, padding: '10px 25px', backgroundColor: '#000', color: '#fff',
                    borderRadius: '12px', boxShadow: '0 4px 15px rgba(0,0,0,0.15)',
                    textAlign: 'center'
                }}
            >
                <div style={{ fontSize: '14px', opacity: 0.8 }}>{block.name} — {floorNum + 1}-qavat</div>
                <div style={{ fontSize: '20px', fontWeight: 'bold' }}>{apartment.text}</div>
            </div>

            {/* SVG Illustration with Zoom */}
            <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center', overflow: 'hidden' }}>
                <svg
                    width="100%"
                    height="100%"
                    viewBox={apartmentViewBox}
                    preserveAspectRatio="xMidYMid meet"
                    style={{ maxWidth: '900px', maxHeight: '900px' }}
                >
                    <defs>
                        <clipPath id="apt-clip">
                            <path d={apartment.d} />
                        </clipPath>
                    </defs>

                    {/* Background Floor Plan */}
                    <image
                        width={svgWidth}
                        height={svgHeight}
                        xlinkHref={bgImage}
                        style={{ opacity: 0.3 }}
                    />

                    {/* Highlighted Apartment with Background Image clipped to its shape */}
                    <image
                        width={svgWidth}
                        height={svgHeight}
                        xlinkHref={bgImage}
                        clipPath="url(#apt-clip)"
                        style={{ filter: 'drop-shadow(0 0 10px rgba(0,0,0,0.2))' }}
                    />

                    {/* Apartment Outline Overlay */}
                    <path
                        d={apartment.d}
                        fill="none"
                        stroke="#0A51F5"
                        strokeWidth="3"
                        strokeLinejoin="round"
                    />
                </svg>
            </div>

            {/* Bottom Info Card */}
            <div style={{
                position: 'absolute',
                top: '50%',
                left: '10px',
                transform: 'translateY(-50%)',
                width: '250px',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                backdropFilter: 'blur(10px)', padding: '20px', borderRadius: '20px',
                boxShadow: '0 10px 30px rgba(0,0,0,0.1)', zIndex: 1000,
                border: '1px solid rgba(0,0,0,0.05)'
            }}>
                <div style={{ color: '#000' }}>
                    <h3 style={{ margin: '0 0 10px 0' }}>{floorNum + 1 === 1 ? "Do'kon" : "Xonadon"} haqida</h3>
                    <p style={{ margin: '5px 0', opacity: 0.7 }}>
                        Ushbu {floorNum + 1 === 1 ? "do'kon" : "xonadon"} {block.name} ning {floorNum + 1}-qavatida joylashgan.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginTop: '15px' }}>
                        <div style={{ backgroundColor: '#f5f5f7', padding: '10px', borderRadius: '12px' }}>
                            <small style={{ display: 'block', opacity: 0.5 }}>Maydoni</small>
                            <strong>{apartment.area} m²</strong>
                        </div>
                        <div style={{ backgroundColor: '#f5f5f7', padding: '10px', borderRadius: '12px' }}>
                            <small style={{ display: 'block', opacity: 0.5 }}>Turi</small>
                            <strong>{floorNum + 1 === 1 ? "Do'kon" : `${apartment.rooms} xonali`}</strong>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApartmentDetail;
