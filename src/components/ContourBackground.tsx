/**
 * 等高线背景组件
 * 风格: 终末地工业科技 - 深色背景 + 金黄色等高线
 * 参考: HUD/Sci-Fi FUI 细线条设计
 */

interface ContourBackgroundProps {
    /** 等高线透明度 (0.03-0.15) */
    opacity?: number;
    /** 等高线颜色 */
    color?: string;
}

export function ContourBackground({
    opacity = 0.06,
    color = '#ffc107'
}: ContourBackgroundProps) {
    return (
        <div
            className="contour-background"
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                pointerEvents: 'none',
                zIndex: 0,
                overflow: 'hidden',
            }}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 1920 1080"
                preserveAspectRatio="xMidYMid slice"
                style={{
                    width: '100%',
                    height: '100%',
                    opacity,
                }}
            >
                <defs>
                    {/* 终端风格渐变 */}
                    <linearGradient id="contourGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor={color} stopOpacity="0" />
                        <stop offset="30%" stopColor={color} stopOpacity="1" />
                        <stop offset="70%" stopColor={color} stopOpacity="1" />
                        <stop offset="100%" stopColor={color} stopOpacity="0" />
                    </linearGradient>
                {/* 扫描线图案 - 非常细微 */}
                    <pattern
                        id="scanlines"
                        patternUnits="userSpaceOnUse"
                        width="4"
                        height="4"
                    >
                        <line
                            x1="0" y1="0" x2="0" y2="4"
                            stroke={color}
                            strokeWidth="0.3"
                            strokeOpacity="0.15"
                        />
                    </pattern>
                {/* 网格点阵 */}
                    <pattern
                        id="gridDots"
                        patternUnits="userSpaceOnUse"
                        width="40"
                        height="40"
                    >
                        <circle
                            cx="20"
                            cy="20"
                            r="0.5"
                            fill={color}
                            fillOpacity="0.2"
                        />
                    </pattern>
                </defs>

                {/* 背景网格点阵 */}
                <rect width="100%" height="100%" fill="url(#gridDots)" />

                {/* ============ 等高线地形组 ============ */}

                {/* 组1: 左上角 - 同心椭圆群 */}
                <g fill="none" stroke={color} strokeWidth="0.5" strokeOpacity="0.6">
                    <ellipse cx="180" cy="120" rx="60" ry="45" />
                    <ellipse cx="180" cy="120" rx="95" ry="72" />
                    <ellipse cx="180" cy="120" rx="135" ry="100" />
                    <ellipse cx="180" cy="120" rx="180" ry="135" />
                    <ellipse cx="180" cy="120" rx="230" ry="175" />
                    <ellipse cx="180" cy="120" rx="290" ry="220" />
                </g>

                {/* 组2: 右下角 - 同心椭圆群 */}
                <g fill="none" stroke={color} strokeWidth="0.5" strokeOpacity="0.6">
                    <ellipse cx="1750" cy="950" rx="80" ry="55" />
                    <ellipse cx="1750" cy="950" rx="130" ry="90" />
                    <ellipse cx="1750" cy="950" rx="190" ry="130" />
                    <ellipse cx="1750" cy="950" rx="260" ry="180" />
                    <ellipse cx="1750" cy="950" rx="340" ry="235" />
                    <ellipse cx="1750" cy="950" rx="430" ry="300" />
                </g>

                {/* 组3: 中左 - 倾斜椭圆 */}
                <g fill="none" stroke={color} strokeWidth="0.4" strokeOpacity="0.5">
                    <ellipse cx="350" cy="550" rx="50" ry="35" transform="rotate(-20 350 550)" />
                    <ellipse cx="350" cy="550" rx="85" ry="60" transform="rotate(-20 350 550)" />
                    <ellipse cx="350" cy="550" rx="130" ry="90" transform="rotate(-20 350 550)" />
                    <ellipse cx="350" cy="550" rx="185" ry="130" transform="rotate(-20 350 550)" />
                    <ellipse cx="350" cy="550" rx="250" ry="175" transform="rotate(-20 350 550)" />
                </g>

                {/* 组4: 右上 - 倾斜椭圆 */}
                <g fill="none" stroke={color} strokeWidth="0.4" strokeOpacity="0.5">
                    <ellipse cx="1550" cy="180" rx="55" ry="40" transform="rotate(25 1550 180)" />
                    <ellipse cx="1550" cy="180" rx="95" ry="70" transform="rotate(25 1550 180)" />
                    <ellipse cx="1550" cy="180" rx="145" ry="105" transform="rotate(25 1550 180)" />
                    <ellipse cx="1550" cy="180" rx="205" ry="150" transform="rotate(25 1550 180)" />
                    <ellipse cx="1550" cy="180" rx="275" ry="200" transform="rotate(25 1550 180)" />
                </g>

                {/* ============ 地形曲线 - 山脊/山谷 ============ */}

                {/* 曲线1: 水平波动 - 上部 */}
                <g fill="none" stroke={color} strokeWidth="0.4" strokeOpacity="0.4">
                    <path d="M0,320 Q240,280 480,350 Q720,300 960,360 Q1200,310 1440,370 Q1680,330 1920,360" />
                    <path d="M0,355 Q240,315 480,385 Q720,335 960,395 Q1200,345 1440,405 Q1680,365 1920,395" />
                    <path d="M0,390 Q240,350 480,420 Q720,370 960,430 Q1200,380 1440,440 Q1680,400 1920,430" />
                </g>

                {/* 曲线2: 水平波动 - 下部 */}
                <g fill="none" stroke={color} strokeWidth="0.4" strokeOpacity="0.4">
                    <path d="M0,720 Q280,770 560,700 Q840,760 1120,710 Q1400,770 1680,730 1920,760" />
                    <path d="M0,760 Q280,810 560,740 Q840,800 1120,750 Q1400,810 1680,770 1920,800" />
                    <path d="M0,800 Q280,850 560,780 Q840,840 1120,790 Q1400,850 1680,810 1920,840" />
                </g>

                {/* 曲线3: 斜向 - 左侧 */}
                <g fill="none" stroke={color} strokeWidth="0.35" strokeOpacity="0.35">
                    <path d="M80,0 Q130,180 180,360 Q230,540 300,720 Q360,900 440,1080" />
                    <path d="M120,0 Q170,180 220,360 Q270,540 340,720 Q400,900 480,1080" />
                    <path d="M160,0 Q210,180 260,360 Q310,540 380,720 Q440,900 520,1080" />
                </g>

                {/* 曲线4: 斜向 - 右侧 */}
                <g fill="none" stroke={color} strokeWidth="0.35" strokeOpacity="0.35">
                    <path d="M1840,0 Q1790,180 1740,360 Q1690,540 1620,720 Q1560,900 1480,1080" />
                    <path d="M1800,0 Q1750,180 1700,360 Q1650,540 1580,720 Q1520,900 1440,1080" />
                    <path d="M1760,0 Q1710,180 1660,360 Q1610,540 1540,720 Q1480,900 1400,1080" />
                </g>

                {/* ============ 六边形装饰 - 终末地标志性元素 ============ */}
                <g fill="none" stroke={color} strokeWidth="0.4" strokeOpacity="0.5">
                    {/* 左侧六边形 */}
                    <polygon points="580,80 620,60 660,80 660,120 620,140 580,120" />
                    <polygon points="580,80 620,60 660,80 660,120 620,140 580,120" transform="scale(1.5)" />
                    {/* 右侧六边形 */}
                    <polygon points="1320,960 1360,940 1400,960 1400,1000 1360,1020 1320,1000" />
                </g>

                {/* ============ 小型圆形等高线组 - 点缀 ============ */}
                <g fill="none" stroke={color} strokeWidth="0.35" strokeOpacity="0.4">
                    <circle cx="100" cy="920" r="25" />
                    <circle cx="100" cy="920" r="45" />
                    <circle cx="100" cy="920" r="70" />
                </g>

                <g fill="none" stroke={color} strokeWidth="0.35" strokeOpacity="0.4">
                    <circle cx="1850" cy="80" r="20" />
                    <circle cx="1850" cy="80" r="40" />
                    <circle cx="1850" cy="80" r="65" />
                </g>

                <g fill="none" stroke={color} strokeWidth="0.35" strokeOpacity="0.4">
                    <circle cx="960" cy="540" r="30" />
                    <circle cx="960" cy="540" r="55" />
                    <circle cx="960" cy="540" r="85" />
                </g>

                {/* ============ 终端装饰框 - 角落装饰 ============ */}
                <g fill="none" stroke={color} strokeWidth="0.3" strokeOpacity="0.3">
                    {/* 左上角装饰 */}
                    <path d="M0,0 L60,0 L60,10 L10,10 L10,60 L0,60 Z" />
                    {/* 右上角装饰 */}
                    <path d="M1920,0 L1860,0 L1860,10 L1910,10 L1910,60 L1920,60 Z" />
                    {/* 左下角装饰 */}
                    <path d="M0,1080 L60,1080 L60,1070 L10,1070 L10,1020 L0,1020 Z" />
                    {/* 右下角装饰 */}
                    <path d="M1920,1080 L1860,1080 L1860,1070 L1910,1070 L1910,1020 L1920,1020 Z" />
                </g>

                {/* ============ 坐标标记 - 终末地风格 ============ */}
                <g fill={color} fillOpacity="0.25" fontFamily="monospace" fontSize="8">
                    <text x="20" y="108">SEC-A1</text>
                    <text x="1850" y="108">SEC-D4</text>
                    <text x="20" y="1000">SEC-B2</text>
                    <text x="1850" y="1000">SEC-C3</text>
                </g>
            </svg>
        </div>
    );
}
