/* eslint-disable react/no-unknown-property */
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './BuildingMap.css';
import Blocks from './Images/blocks/Blocks.webp';
const BuildingMap = () => {
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState(-1);
    const [showLabel, setShowLabel] = useState(false);
    const [modeIndex, setModeIndex] = useState(0);

    const modes = [
        { name: 'Rand', label: 'TASODIFIY' },
        { name: 'Tong', label: 'TONG' },
        { name: 'Tun', label: 'TUN' }
    ];

    // Coordinate estimation:
    // Block 1: Top point roughly 559.5, 1079.5 (based on path M). Visual center approx x=700, y=800
    // Block 2: Top point near 876, 577. Visual center approx x=1050, y=900
    // Block 3: Top point near 1207, 1391. Visual center approx x=1450, y=1000
    // Block 4: Top point near 1835, 1202. Visual center approx x=1750, y=700
    // Block 5: Top point near 1943.5, 969. Visual center approx x=2000, y=600  

    const blocks = [
        {
            id: 'block-1',
            text: '1-blok',
            d: "M559.5 1079.5L573 1138L556 1160L529.5 1195.5L849 1311.5L879.5 1255L870.5 1185L908 1133.5L878.5 926.5L871.5 925L861 920V909.5L866 904.5L875.5 908L856 762L868.5 750L869 735.5L854 730.5L847.5 673.5L812.5 662L811 654H807.5L806.5 650L875 577.5L872.5 576.5V573L916.5 526L895 519.5L893 511L887 508.5V506.5L897.5 495L924 467.5L807.5 434.5L738 415L716 436.5L642 415L556 494.5V501.5H560.5L564 510L585 516L540 558.5V562L544 562.5L473 630L473.5 635L478.5 636.5L481.5 644L513.5 654.5L562 871L553.5 879L555.5 891L566 895L592.5 1011.5L545.5 1064.5L548.5 1074.5L559.5 1079.5Z",
            pinX: 720, // Previous: 720
            pinY: 480  // Moved down from 415
        },
        {
            id: 'block-2',
            text: '2-blok',
            d: "M1186.5 1441L1205.5 1391V1305L1239 1249.5L1231 1044.5H1236L1239 1040.3V1029L1230 1025.5L1221 787.5L1230.5 789.5V782.5H1232L1243 768V762.5L1228 757.5L1227.5 733.5L1226 685L1206 678.5L1205 670.5H1199.5V665.5L1318 517L1270 504L1279 493.5V487L1284 482V477L1075 420.5L1053.5 443.5L969.5 420.5L925 467.5L888 506.5V508L894 510.5L896 518.5L918 525.5L873.5 573V576L876 577.5L808 650L808.5 653H812L813.5 660.5L848.5 672.5L855 729.5L870 734.5L869.5 750L857 762L876.5 909.5L866 905.5L862 909.5V919.5L871.5 924.5L879 926L909 1133.5L871 1185L880.5 1255L849.561 1311.72L1186.5 1441Z",
            pinX: 1060, // Previous: 1060
            pinY: 480  // Moved down from 420
        },
        {
            id: 'block-3',
            text: '3-blok',
            d: "M1207 1391L1187.5 1441.5L1705 1632.5L1886.5 1227.5L1831.5 1204L1839 1130L1766 1102L1820.5 618.5L1848 571.5V568L1836.5 564.5L1848.5 547L1863 519.5V514.5L1700.5 471L1564 435.5L1526 489L1472.5 474.5L1445 511L1344.5 483.5L1319 516L1319.5 517L1201 665.5V669H1206.5L1207.5 677.5L1227.5 684L1229.5 756.5L1244.5 761.5V768L1233 784H1232V792L1223 790L1231.5 1024.5L1240.5 1028V1040.5L1237 1045.5H1233L1240.5 1249.5L1207 1305V1391Z",
            pinX: 1530, // Previous: 1530
            pinY: 480  // Moved down from 430
        },
        {
            id: 'block-4',
            text: '4-blok',
            d: "M1835 1202L1887.5 1225.5L1996.5 985L1942 970L1951.5 899L1884.5 879.5L1927 529.5L1951 495L1950.5 486.5L1979 435L1966.5 431.5L1987 394.5V389.5L1954.5 381.5V372.5L1951 373.5V363.5L1832.5 334L1846 310V304L1725.5 274L1704.5 268.5L1676.5 307.5L1650 300.5L1565.5 415.5V421.5L1569 422L1569.5 430.5L1587 434.5L1583.5 439.5L1701.5 470L1864 513.5V521L1851 546.5L1839 564L1849.5 567.5V571.5L1822.5 618.5L1769 1100.5L1842 1128.5L1835 1202Z",
            pinX: 1800, // Previous: 1800
            pinY: 330  // Moved down from 270
        },
        {
            id: 'block-5',
            text: '5-blok',
            d: "M1943.5 969L1997 984L2090.5 791.5L2038 768L2038.5 763.5L2046.5 711.5L2054 692L1991 672.5L2001 656L2002 636H1996V632.5L2008 615V600H2005V596L2014 581V562.5H2012L2020 548L2020.5 525H2014.5V523.5L2027 502V487H2021.5V484L2033.5 463.5V448H2027V447L2040 424V408H2035V404L2046 384V378.5L2072.5 331V326L2062.5 323L2080 292.5L2079.5 288.5L2051 282L2051.5 270L1935 243L1951.5 216V210.5L1821 180L1798 212.5L1773.5 207L1726.5 273L1847.5 303V310L1834 333.5L1952 362.5V372.5L1956 371.5V380.5L1988.5 388.5V394.5L1969 430.5L1980 434.5L1951.5 486.5L1952 495L1928 529.5L1885.5 879L1953 898.5L1943.5 969Z",
            pinX: 1950, // Previous: 1950
            pinY: 240  // Moved down from 180
        }
    ];

    // Handle initial blinking effect or synchronization if needed
    // In React, simple class toggling is usually enough.
    // If strict blink synchronization is needed like in the original script:
    const [blinkKey, setBlinkKey] = useState(0);

    const activateBlock = (index) => {
        if (activeIndex === index && (index === 0 || index === 1)) {
            // Already active and it is Block 1 or 2 -> Enter Detail View
            navigate(`/block/${index + 1}`);
        } else {
            // Otherwise just select it
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
        setModeIndex((prev) => (prev + 1) % modes.length);
    };

    const handleModePrev = (e) => {
        e.stopPropagation();
        setModeIndex((prev) => (prev - 1 + modes.length) % modes.length);
    };

    const handleClickBlock = (index, e) => {
        e.stopPropagation();
        activateBlock(index);
    };

    // Label animation effect
    useEffect(() => {
        if (activeIndex !== -1) {
            const timer = setTimeout(() => setShowLabel(true), 10);
            return () => clearTimeout(timer);
        } else {
            setShowLabel(false);
        }
    }, [activeIndex]);

    return (
        <div className="building-map-container" onClick={resetBlocks}>
            <div className="controls">
                <button className="nav-btn" onClick={handleModeNext}>↑</button>
                <div className="current-mode">
                    {modes[modeIndex].label}
                </div>
                <button className="nav-btn" onClick={handleModePrev}>↓</button>
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
                    // If no block is active, ALL are blinking.
                    // If one block is active, THAT ONE is active (solid), others are blinking.
                    const isBlinking = !isActive;

                    return (
                        <path
                            key={`${block.id}-${blinkKey}`} // Key change acts as forced reflow/restart for animation
                            id={block.id}
                            d={block.d}
                            className={isActive ? 'active' : (isBlinking ? 'blinking' : '')}
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
                        {/* Red Location Pin Icon */}
                        <path
                            d="M24 0C10.745 0 0 10.745 0 24c0 13.255 24 40 24 40s24-26.745 24-40C48 10.745 37.255 0 24 0zm0 33c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9z"
                            fill="#ff0000"
                            stroke="#ffffff"
                            strokeWidth="2"
                            transform="translate(-24, -64)" // Center the tip of the pin at (0,0)
                        />
                    </g>
                )}

                <defs>
                    <pattern id="pattern0_2756_1160" patternContentUnits="objectBoundingBox" width="1" height="1">
                        <use xlinkHref="#image0_2756_1160" transform="matrix(0.00025 0 0 0.000375 0 -0.0625)" />
                    </pattern>
                    <image id="image0_2756_1160" width="4000" height="3000" preserveAspectRatio="none" href={Blocks} />
                </defs>
            </svg>
        </div>
    );
};

export default BuildingMap;
