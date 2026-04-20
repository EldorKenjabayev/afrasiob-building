/* eslint-disable react/no-unknown-property */
import { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './BuildingMap.css';
import Blocks from './Images/blocks/Blocks.webp';
import Loading from './components/Loading';
import wsService from './wsService';

// ================================================================
//  Har bir blok uchun barcha [qavat, xonadon] ro'yxati
//  Blok 1: 13 qavat (0-12), 12-qavat=2 apt, boshqalar=4
//  Blok 2: 15 qavat (0-14), 0=4 apt, 14=3 apt, boshqalar=5
//  Blok 3: 16 qavat (0-15), 0=6 apt, boshqalar=5
//  Blok 4: 15 qavat (0-14), 0=4 apt, 14=3 apt, boshqalar=5
//  Blok 5: 13 qavat (0-12), 0=4 apt, 12=2 apt, boshqalar=5
// ================================================================
function buildBlockApts() {
    const r = {};

    r[1] = [];
    for (let f = 0; f <= 12; f++) {
        const maxA = f === 12 ? 2 : 4;
        for (let a = 0; a < maxA; a++) r[1].push([f, a]);
    }

    r[2] = [];
    for (let f = 0; f <= 14; f++) {
        const maxA = f === 0 ? 4 : f === 14 ? 3 : 5;
        for (let a = 0; a < maxA; a++) r[2].push([f, a]);
    }

    r[3] = [];
    for (let f = 0; f <= 15; f++) {
        const maxA = f === 0 ? 6 : 5;
        for (let a = 0; a < maxA; a++) r[3].push([f, a]);
    }

    r[4] = [];
    for (let f = 0; f <= 14; f++) {
        const maxA = f === 0 ? 4 : f === 14 ? 3 : 5;
        for (let a = 0; a < maxA; a++) r[4].push([f, a]);
    }

    r[5] = [];
    for (let f = 0; f <= 12; f++) {
        const maxA = f === 0 ? 4 : f === 12 ? 2 : 5;
        for (let a = 0; a < maxA; a++) r[5].push([f, a]);
    }

    return r;
}

const BLOCK_APTS = buildBlockApts();

// ================================================================
//  KOMPONENT
// ================================================================
const BuildingMap = () => {
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState(-1);
    const [showLabel, setShowLabel] = useState(false);
    const [modeIndex, setModeIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [blinkKey, setBlinkKey] = useState(0);
    const [color, setColor] = useState('#ff8c14'); // YANTAR Default

    const handleColorChange = (e) => {
        e.stopPropagation();
        const hex = e.target.value;
        setColor(hex);
        
        // HEX to RGB
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        wsService.sendCommand(`COLOR_${r}_${g}_${b}`);
    };

    const modeIntervalRef = useRef(null);
    // Spiral rejimi uchun har bir blokda qaysi pozitsiyada ekanligini saqlaydi
    const spiralCursors = useRef({ 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 });

    const modes = [
        { name: 'Oddiy',     label: 'ODDIY'     },  // 0 — statik random
        { name: 'Tasodifiy', label: 'TASODIFIY' },  // 1 — har 5s yangi random
        { name: 'Spiral',    label: 'SPIRAL'    },  // 2 — ketma-ket sliding
    ];

    const blocks = [
        {
            id: 'block-1',
            text: '1-blok',
            d: "M559.5 1079.5L573 1138L556 1160L529.5 1195.5L849 1311.5L879.5 1255L870.5 1185L908 1133.5L878.5 926.5L871.5 925L861 920V909.5L866 904.5L875.5 908L856 762L868.5 750L869 735.5L854 730.5L847.5 673.5L812.5 662L811 654H807.5L806.5 650L875 577.5L872.5 576.5V573L916.5 526L895 519.5L893 511L887 508.5V506.5L897.5 495L924 467.5L807.5 434.5L738 415L716 436.5L642 415L556 494.5V501.5H560.5L564 510L585 516L540 558.5V562L544 562.5L473 630L473.5 635L478.5 636.5L481.5 644L513.5 654.5L562 871L553.5 879L555.5 891L566 895L592.5 1011.5L545.5 1064.5L548.5 1074.5L559.5 1079.5Z",
            pinX: 720,
            pinY: 480
        },
        {
            id: 'block-2',
            text: '2-blok',
            d: "M1186.5 1441L1205.5 1391V1305L1239 1249.5L1231 1044.5H1236L1239 1040.3V1029L1230 1025.5L1221 787.5L1230.5 789.5V782.5H1232L1243 768V762.5L1228 757.5L1227.5 733.5L1226 685L1206 678.5L1205 670.5H1199.5V665.5L1318 517L1270 504L1279 493.5V487L1284 482V477L1075 420.5L1053.5 443.5L969.5 420.5L925 467.5L888 506.5V508L894 510.5L896 518.5L918 525.5L873.5 573V576L876 577.5L808 650L808.5 653H812L813.5 660.5L848.5 672.5L855 729.5L870 734.5L869.5 750L857 762L876.5 909.5L866 905.5L862 909.5V919.5L871.5 924.5L879 926L909 1133.5L871 1185L880.5 1255L849.561 1311.72L1186.5 1441Z",
            pinX: 1060,
            pinY: 480
        },
        {
            id: 'block-3',
            text: '3-blok',
            d: "M1207 1391L1187.5 1441.5L1705 1632.5L1886.5 1227.5L1831.5 1204L1839 1130L1766 1102L1820.5 618.5L1848 571.5V568L1836.5 564.5L1848.5 547L1863 519.5V514.5L1700.5 471L1564 435.5L1526 489L1472.5 474.5L1445 511L1344.5 483.5L1319 516L1319.5 517L1201 665.5V669H1206.5L1207.5 677.5L1227.5 684L1229.5 756.5L1244.5 761.5V768L1233 784H1232V792L1223 790L1231.5 1024.5L1240.5 1028V1040.5L1237 1045.5H1233L1240.5 1249.5L1207 1305V1391Z",
            pinX: 1530,
            pinY: 480
        },
        {
            id: 'block-4',
            text: '4-blok',
            d: "M1835 1202L1887.5 1225.5L1996.5 985L1942 970L1951.5 899L1884.5 879.5L1927 529.5L1951 495L1950.5 486.5L1979 435L1966.5 431.5L1987 394.5V389.5L1954.5 381.5V372.5L1951 373.5V363.5L1832.5 334L1846 310V304L1725.5 274L1704.5 268.5L1676.5 307.5L1650 300.5L1565.5 415.5V421.5L1569 422L1569.5 430.5L1587 434.5L1583.5 439.5L1701.5 470L1864 513.5V521L1851 546.5L1839 564L1849.5 567.5V571.5L1822.5 618.5L1769 1100.5L1842 1128.5L1835 1202Z",
            pinX: 1800,
            pinY: 330
        },
        {
            id: 'block-5',
            text: '5-blok',
            d: "M1943.5 969L1997 984L2090.5 791.5L2038 768L2038.5 763.5L2046.5 711.5L2054 692L1991 672.5L2001 656L2002 636H1996V632.5L2008 615V600H2005V596L2014 581V562.5H2012L2020 548L2020.5 525H2014.5V523.5L2027 502V487H2021.5V484L2033.5 463.5V448H2027V447L2040 424V408H2035V404L2046 384V378.5L2072.5 331V326L2062.5 323L2080 292.5L2079.5 288.5L2051 282L2051.5 270L1935 243L1951.5 216V210.5L1821 180L1798 212.5L1773.5 207L1726.5 273L1847.5 303V310L1834 333.5L1952 362.5V372.5L1956 371.5V380.5L1988.5 388.5V394.5L1969 430.5L1980 434.5L1951.5 486.5L1952 495L1928 529.5L1885.5 879L1953 898.5L1943.5 969Z",
            pinX: 1950,
            pinY: 240
        }
    ];

    // ================================================================
    //  MODE ANIMATSIYALARI (faqat bosh sahifada, blok tanlanmagan holda)
    // ================================================================

    /** Barcha joriy intervallarni to'xtatadi */
    const stopModeAnimation = useCallback(() => {
        if (modeIntervalRef.current) {
            clearInterval(modeIntervalRef.current);
            modeIntervalRef.current = null;
        }
    }, []);

    /**
     * Berilgan rejimni ishga tushiradi:
     *  0 = ODDIY    — bir marta tasodifiy (statik)
     *  1 = TASODIFIY — har 5 sekundda yangi tasodifiy
     *  2 = SPIRAL   — har blok o'z ketma-ketligida aylanadi, staggered boshlash
     */
    const startModeAnimation = useCallback((mode) => {
        stopModeAnimation();

        if (mode === 0) {
            // ── ODDIY: faqat bir marta yuboramiz, o'zgarmaydi ──
            wsService.sendCommand('STATIC');

        } else if (mode === 1) {
            // ── TASODIFIY: darhol va keyin har 5s ──
            wsService.sendCommand('STATIC');
            modeIntervalRef.current = setInterval(() => wsService.sendCommand('STATIC'), 5000);

        } else if (mode === 2) {
            // ── SPIRAL / LEFT-SHIFTER ──
            // Har bir blok o'z ro'yxatini ketma-ket bosib o'tadi.
            // Boshlanish nuqtasi staggered: blok 2 → 20%, blok 3 → 40%, ...
            spiralCursors.current = {
                1: 0,
                2: Math.floor(BLOCK_APTS[2].length * 0.20),
                3: Math.floor(BLOCK_APTS[3].length * 0.40),
                4: Math.floor(BLOCK_APTS[4].length * 0.60),
                5: Math.floor(BLOCK_APTS[5].length * 0.80),
            };

            const tick = () => {
                [1, 2, 3, 4, 5].forEach(b => {
                    const list = BLOCK_APTS[b];
                    const pos = spiralCursors.current[b] % list.length;
                    const [f, a] = list[pos];
                    wsService.sendCommand(`AP_${b}_${f}_${a}`);
                    spiralCursors.current[b]++;
                });
            };

            tick(); // darhol birinchi tick
            modeIntervalRef.current = setInterval(tick, 400); // har 400ms
        }
    }, [stopModeAnimation]);

    // ================================================================
    //  NAVIGATSIYA
    // ================================================================
    const activateBlock = (index) => {
        if (activeIndex === index) {
            navigate(`/block/${index + 1}`);
        } else {
            setActiveIndex(index);
            setShowLabel(true);
            setBlinkKey(prev => prev + 1);
        }
    };

    const resetBlocks = () => {
        setActiveIndex(-1);
        setShowLabel(false);
        setBlinkKey(prev => prev + 1);
    };

    const handleModeNext = (e) => {
        e.stopPropagation();
        setModeIndex(prev => (prev + 1) % modes.length);
    };

    const handleModePrev = (e) => {
        e.stopPropagation();
        setModeIndex(prev => (prev - 1 + modes.length) % modes.length);
    };

    const handleClickBlock = (index, e) => {
        e.stopPropagation();
        activateBlock(index);
    };

    // ================================================================
    //  LABEL ANIMATSIYa
    // ================================================================
    useEffect(() => {
        if (activeIndex !== -1) {
            const timer = setTimeout(() => setShowLabel(true), 10);
            return () => clearTimeout(timer);
        } else {
            setShowLabel(false);
        }
    }, [activeIndex]);

    // ================================================================
    //  WEBSOCKET + MODE LOGIKAS
    // ================================================================
    useEffect(() => {
        if (activeIndex === -1) {
            // Hech blok tanlanmagan → mode animatsiyasi ishlaydi
            startModeAnimation(modeIndex);
        } else {
            // Blok tanlangan → animatsiyani to'xtat, faqat o'sha blokni yoq
            stopModeAnimation();
            wsService.sendCommand(`B${activeIndex + 1}_ON`);
        }

        return () => stopModeAnimation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [modeIndex, activeIndex]);

    // ================================================================
    //  RENDER
    // ================================================================
    return (
        <div className="building-map-container" onClick={resetBlocks}>
            {isLoading && <Loading />}

            <div className="controls">
                <button className="nav-btn" onClick={handleModeNext}>↑</button>
                <div className="current-mode">
                    {modes[modeIndex].label}
                </div>
                <button className="nav-btn" onClick={handleModePrev}>↓</button>
            </div>

            <div 
                title="Rang sozlamasi" 
                style={{ 
                    position: 'absolute',
                    top: '20px',
                    right: '25px',
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '8px', 
                    background: '#000', 
                    padding: '8px 14px', 
                    borderRadius: '25px',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.5)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    zIndex: 1000
                }}
                onClick={(e) => e.stopPropagation()}
            >
                <span style={{ fontSize: '20px', display: 'flex', alignItems: 'center' }}>⚙️</span>
                <input 
                    type="color" 
                    value={color} 
                    onChange={handleColorChange} 
                    style={{ 
                        cursor: 'pointer', 
                        border: 'none', 
                        background: 'transparent', 
                        height: '30px', 
                        width: '35px',
                        padding: '0'
                    }}
                />
            </div>

            <div
                id="block-label"
                className={`label-popup ${showLabel && activeIndex !== -1 ? 'show' : ''}`}
                style={{ display: activeIndex !== -1 ? 'block' : 'none' }}
            >
                {activeIndex !== -1 ? blocks[activeIndex].text : ''}
            </div>

            <svg
                width="100%"
                height="100%"
                viewBox="0 0 2736 1824"
                preserveAspectRatio="xMidYMid slice"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
            >
                <rect width="2736" height="1824" fill="url(#pattern0_2756_1160)" />

                {blocks.map((block, index) => {
                    const isActive = index === activeIndex;
                    return (
                        <path
                            key={`${block.id}-${blinkKey}`}
                            id={block.id}
                            d={block.d}
                            className={isActive ? 'active' : 'blinking'}
                            fill="#0A51F5"
                            fillOpacity="0.40"
                            stroke="#ffffff"
                            strokeWidth="1"
                            onClick={(e) => handleClickBlock(index, e)}
                        />
                    );
                })}

                {activeIndex !== -1 && (
                    <g
                        transform={`translate(${blocks[activeIndex].pinX}, ${blocks[activeIndex].pinY})`}
                        style={{ pointerEvents: 'none' }}
                    >
                        <path
                            d="M24 0C10.745 0 0 10.745 0 24c0 13.255 24 40 24 40s24-26.745 24-40C48 10.745 37.255 0 24 0zm0 33c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9z"
                            fill="#ff0000"
                            stroke="#ffffff"
                            strokeWidth="2"
                            transform="translate(-24, -64)"
                        />
                    </g>
                )}

                <defs>
                    <pattern id="pattern0_2756_1160" patternContentUnits="objectBoundingBox" width="1" height="1">
                        <use xlinkHref="#image0_2756_1160" transform="matrix(0.00025 0 0 0.000375 0 -0.0625)" />
                    </pattern>
                    <image
                        id="image0_2756_1160"
                        width="4000"
                        height="3000"
                        preserveAspectRatio="none"
                        href={Blocks}
                        onLoad={() => setIsLoading(false)}
                    />
                </defs>
            </svg>

            <img
                src={Blocks}
                style={{ display: 'none' }}
                onLoad={() => setIsLoading(false)}
                alt="preload"
            />
        </div>
    );
};

export default BuildingMap;
