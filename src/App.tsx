import { useState, useMemo } from 'react';
import './App.css';
import rawData from './data/matrix_data.json';
import tradeData from './data/trade_data.json';
import type { AppData, LocationStat, LocationKey, TradeItem } from './types';

const appData = rawData as unknown as AppData;
const weaponItems = appData.items;

const LOCATION_MAP: Record<LocationKey, string> = {
    loc_hub: '枢纽区',
    loc_lab: '源石研究园',
    loc_mine: '矿脉园区',
    loc_energy: '供能高地',
    loc_city: '武陵城'
};

const STAR_WEIGHT: Record<string, number> = {
    '六': 6, '6': 6,
    '五': 5, '5': 5,
    '四': 4, '4': 4
};

const getStarMode = (rawStar: string) => {
    const s = String(rawStar).trim();
    if (s === '六' || s === '6') return '六';
    if (s === '五' || s === '5') return '五';
    return '四';
};

// ==========================================
// 页面 1: 基质检索
// ==========================================
function MatrixTool() {
    // 侧边栏筛选状态
    const [basicSelections, setBasicSelections] = useState<string[]>([]);
    const [selectedExtra, setSelectedExtra] = useState<string>('');
    const [selectedSkill, setSelectedSkill] = useState<string>('');
    const [selectedRole, setSelectedRole] = useState<string>('');

    // 地区筛选状态 (null 代表“自动选择最佳”，不再代表“全部”)
    const [selectedLocation, setSelectedLocation] = useState<LocationKey | null>(null);

    const options = useMemo(() => {
        return {
            roles: appData.allRoles.filter(r => r !== '否' && r !== '/'),
            basics: Array.from(new Set(weaponItems.map(d => d.basic))),
            extras: Array.from(new Set(weaponItems.map(d => d.extra))),
            skills: Array.from(new Set(weaponItems.map(d => d.skill)))
        };
    }, []);

    // === 筛选操作处理 (每次变动都重置地区为自动选择) ===
    const handleRoleSelect = (value: string) => {
        setSelectedRole(prev => prev === value ? '' : value);
        setSelectedLocation(null);
    };

    const handleBasicToggle = (value: string) => {
        setBasicSelections(prev => {
            const newVal = prev.includes(value) ? prev.filter(item => item !== value) : (prev.length < 3 ? [...prev, value] : prev);
            return newVal;
        });
        setSelectedLocation(null);
    };

    const handleExtraSelect = (value: string) => {
        if (selectedExtra === value) {
            setSelectedExtra('');
        } else {
            setSelectedExtra(value);
            setSelectedSkill('');
        }
        setSelectedLocation(null);
    };

    const handleSkillSelect = (value: string) => {
        if (selectedSkill === value) {
            setSelectedSkill('');
        } else {
            setSelectedSkill(value);
            setSelectedExtra('');
        }
        setSelectedLocation(null);
    };

    // 点击地区切换 (强制选中，不再Toggle)
    const handleLocationSelect = (key: LocationKey) => {
        setSelectedLocation(key);
    };

    const handleReset = () => {
        setBasicSelections([]);
        setSelectedExtra('');
        setSelectedSkill('');
        setSelectedRole('');
        setSelectedLocation(null);
    };

    // === 核心计算逻辑 ===
    const result = useMemo(() => {
        // 1. 筛选出所有符合条件的武器 (Global Pool)
        const hasRole = selectedRole !== '';
        const hasAnyAttribute = basicSelections.length > 0 || selectedExtra !== '' || selectedSkill !== '';

        if (!hasRole && !hasAnyAttribute) return null;

        const globalMatchedWeapons = weaponItems.filter(item => {
            if (hasRole) {
                if (!item.roleList || item.roleList.length === 0) return false;
                if (!item.roleList.includes(selectedRole)) return false;
            }

            const basicMatch = basicSelections.length === 0 || basicSelections.includes(item.basic);
            let otherMatch = true;
            if (selectedExtra) otherMatch = item.extra === selectedExtra;
            else if (selectedSkill) otherMatch = item.skill === selectedSkill;

            return basicMatch && otherMatch;
        });

        if (globalMatchedWeapons.length === 0) {
            return { empty: true, displayWeapons: [], validLocations: [], activeLocation: null };
        }

        // 2. 统计各地区掉落数量
        const keys = Object.keys(LOCATION_MAP) as LocationKey[];
        const locationStats: LocationStat[] = keys.map(key => {
            return {
                key: key,
                name: LOCATION_MAP[key],
                count: globalMatchedWeapons.reduce((sum, item) => sum + item[key], 0)
            };
        });

        // 3. 过滤并排序 (倒序排列：最多的在最前)
        const validLocations = locationStats
            .filter(l => l.count > 0)
            .sort((a, b) => b.count - a.count);

        // 4. 确定当前生效的地区 (Active Location)
        // 逻辑：如果用户手动选了，且该地区有效，则用用户的；否则默认用第一个(最多的)
        let activeLocation = selectedLocation;
        const bestLocation = validLocations.length > 0 ? (validLocations[0].key as LocationKey) : null;

        const isActiveValid = activeLocation && validLocations.find(l => l.key === activeLocation);

        if (!activeLocation || !isActiveValid) {
            activeLocation = bestLocation;
        }

        // 5. 根据 Active Location 过滤展示列表
        let displayWeapons = globalMatchedWeapons;
        if (activeLocation) {
            displayWeapons = globalMatchedWeapons.filter(item => item[activeLocation!] === 1);
        }

        // 6. 列表排序 (星级高 -> 低)
        displayWeapons.sort((a, b) => {
            const hasRoleA = a.roleList.length > 0;
            const hasRoleB = b.roleList.length > 0;
            if (hasRoleA && !hasRoleB) return -1;
            if (!hasRoleA && hasRoleB) return 1;
            const weightA = STAR_WEIGHT[getStarMode(a.star)] || 0;
            const weightB = STAR_WEIGHT[getStarMode(b.star)] || 0;
            return weightB - weightA;
        });

        return {
            empty: false,
            displayWeapons,
            validLocations,
            activeLocation, // 告诉 UI 到底哪个被选中了
            totalMatchCount: globalMatchedWeapons.length
        };
    }, [basicSelections, selectedExtra, selectedSkill, selectedRole, selectedLocation]);

    const hasResults = result && !result.empty;

    return (
        <div className="app-layout fade-in">
            <aside className="tech-panel sidebar-panel">
                <div className="panel-header-area">
                    <h1>基质检索终端</h1>
                    <div className="tech-decoration">/// ENDFIELD INDUSTRY ///</div>
                </div>

                <div className="panel-scroll-content">
                    <div className="filter-section">
                        <div className="section-title"><span className="title-icon">ID</span>适配角色 (优先筛选)</div>
                        <div className="button-grid">
                            {options.roles.map(role => (
                                <button
                                    key={role}
                                    className={`tech-btn ${selectedRole === role ? 'active' : ''}`}
                                    onClick={() => handleRoleSelect(role)}
                                >
                                    {role}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="filter-separator"></div>
                    <div className="filter-section">
                        <div className="section-title"><span className="title-icon">A</span>基础属性 (最多3项)</div>
                        <div className="button-grid">
                            {options.basics.map(opt => {
                                const isActive = basicSelections.includes(opt);
                                const isDisabled = !isActive && basicSelections.length >= 3;
                                return (
                                    <button key={opt} className={`tech-btn ${isActive ? 'active' : ''}`} onClick={() => handleBasicToggle(opt)} disabled={isDisabled}>{opt}</button>
                                );
                            })}
                        </div>
                    </div>
                    <div className="filter-separator"></div>
                    <div className="filter-section">
                        <div className="section-title"><span className="title-icon">B</span>附加属性 (与C互斥)</div>
                        <div className="button-grid">
                            {options.extras.map(opt => (
                                <button key={opt} className={`tech-btn ${selectedExtra === opt ? 'active' : ''} ${selectedSkill ? 'muted' : ''}`} onClick={() => handleExtraSelect(opt)}>{opt}</button>
                            ))}
                        </div>
                    </div>
                    <div className="filter-section">
                        <div className="section-title"><span className="title-icon">C</span>技能属性 (与B互斥)</div>
                        <div className="button-grid">
                            {options.skills.map(opt => (
                                <button key={opt} className={`tech-btn ${selectedSkill === opt ? 'active' : ''} ${selectedExtra ? 'muted' : ''}`} onClick={() => handleSkillSelect(opt)}>{opt}</button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="panel-footer-area">
                    <button className="reset-btn" onClick={handleReset}>RESET SYSTEM // 重置</button>
                </div>
            </aside>

            <main className="tech-panel content-panel">
                <div className={`panel-scroll-content results-wrapper ${hasResults ? 'has-results' : ''}`}>
                    {!result && (
                        <div className="placeholder-state">
                            <div className="scanner-line"></div>
                            <h2>AWAITING INPUT...</h2>
                            <p>请在左侧选择 [任意条件] 即可开始检索</p>
                        </div>
                    )}
                    {result?.empty && (
                        <div className="no-data-state">
                            <h2>NO MATCH FOUND</h2>
                            <p>未检索到符合条件的武器记录。</p>
                        </div>
                    )}

                    {hasResults && (
                        <div className="results-container fade-in">
                            <div className="inner-card recommendation">
                                <div className="inner-header">区域掉落分布 // DROP LOCATIONS</div>
                                <div className="inner-body">
                                    <div className="location-results">
                                        {/* 渲染地区列表 (已经按数量倒序排列) */}
                                        {result!.validLocations.map(loc => {
                                            // 判断是否为当前激活的地区
                                            const isActive = result!.activeLocation === loc.key;

                                            return (
                                                <div
                                                    key={loc.key}
                                                    className={`location-highlight ${isActive ? 'active' : ''}`}
                                                    onClick={() => handleLocationSelect(loc.key as LocationKey)}
                                                >
                                                    <span className="loc-name">{loc.name}</span>
                                                    <span className="loc-count">
                                                        命中: {loc.count} / {result!.totalMatchCount}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <p style={{marginTop: '15px', fontSize: '0.8em', color: '#666'}}>
                                        * 系统已为您自动选中命中数最多的区域，点击上方卡片可切换查看。
                                    </p>
                                </div>
                            </div>

                            <div className="inner-card weapons-list">
                                <div className="inner-header">
                                    检索结果 // SEARCH RESULTS
                                    <span className="result-count">
                                        [{result!.displayWeapons.length}
                                        {result!.activeLocation ? ` @ ${LOCATION_MAP[result!.activeLocation]}` : ''}]
                                    </span>
                                </div>
                                <div className="table-container">
                                    <table className="tech-table">
                                        <thead>
                                        <tr>
                                            <th>武器名称</th>
                                            <th>星级</th>
                                            <th>基础</th>
                                            <th>附加</th>
                                            <th>技能</th>
                                            <th>适配角色</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {result!.displayWeapons.map((weapon, idx) => {
                                            const starMode = getStarMode(weapon.star);
                                            return (
                                                <tr key={idx} className={`star-${starMode}`}>
                                                    <td className="font-bold">{weapon.name}</td>
                                                    <td><span className={`badge star-${starMode}`}>{starMode}星</span></td>
                                                    <td>{weapon.basic}</td>
                                                    <td className={selectedExtra ? 'attr-extra font-bold' : ''}>{weapon.extra}</td>
                                                    <td className={selectedSkill ? 'attr-skill font-bold' : ''}>{weapon.skill}</td>
                                                    <td>
                                                        {weapon.roleList.length === 0 ? (
                                                            <span style={{ opacity: 0.3 }}>-</span>
                                                        ) : (
                                                            <div className="role-tag-container">
                                                                {weapon.roleList.map((roleName, rIdx) => (
                                                                    <span
                                                                        key={rIdx}
                                                                        className={`role-tag ${roleName === selectedRole ? 'active' : ''}`}
                                                                        onClick={() => handleRoleSelect(roleName)}
                                                                        title={`点击筛选: ${roleName}`}
                                                                    >
                                      {roleName}
                                    </span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}

// ==========================================
// 页面 2: 关于页面
// ==========================================
function AboutPage() {
    return (
        <div className="about-layout">
            <div className="about-card fade-in">
                <div className="card-header">
                    <h2>关于本工具 // ABOUT</h2>
                </div>
                <div className="card-scroll-body">
                    <p>
                        本工具是专为《明日方舟：终末地》设计的数据查询辅助终端。<br />
                        本工具旨在帮助管理员快速查询各种数据。
                    </p>

                    <div className="privacy-badge">
                        <span className="shield-icon">🛡️</span>
                        隐私声明：本工具为纯前端应用，无后端数据采集
                    </div>

                    <div className="tool-section">
                        <h3>基质刷取检索工具 <span className="version-tag">v1.0.0</span></h3>
                        <ul className="tech-list">
                            <li><strong>数据来源</strong>：<a href="https://space.bilibili.com/329400340" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--theme-yellow)', textDecoration: 'underline', cursor: 'pointer' }}>b站：皇战萌新轲</a></li>
                            <li><strong>核心功能</strong>：支持多属性交集筛选与角色反向检索。</li>
                        </ul>
                    </div>

                    <div className="tool-section">
                        <h3>信用商店性价比工具 <span className="version-tag">v1.0.0</span></h3>
                        <ul className="tech-list">
                            <li><strong>数据来源</strong>：<a href="https://bbs.nga.cn/nuke.php?func=ucp&uid=41796691" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--theme-yellow)', textDecoration: 'underline', cursor: 'pointer' }}>NGA：2235hhh</a></li>
                            <li><strong>核心功能</strong>：信用商店性价比查询。</li>
                        </ul>
                    </div>

                    <div style={{marginTop: '40px', borderTop: '1px solid #333', paddingTop: '20px', fontSize: '0.9em', color: '#666'}}>
                        /// ENDFIELD INDUSTRIES PROPERTY /// UNAUTHORIZED ACCESS PROHIBITED
                    </div>
                </div>
            </div>
        </div>
    );
}

// ==========================================
// 页面 3: 信用商店
// ==========================================
type SortKey = 'price' | 'stamina' | 'efficiency';
type SortOrder = 'asc' | 'desc';

function TradeTool() {
    const [items] = useState<TradeItem[]>(tradeData);
    const [sortKey, setSortKey] = useState<SortKey>('efficiency');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

    const getEfficiency = (item: TradeItem) => {
        if (item.price === 0) return 0;
        return item.stamina / item.price;
    };

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            setSortKey(key);
            setSortOrder('desc');
        }
    };

    const sortedItems = useMemo(() => {
        return [...items].sort((a, b) => {
            let valA = 0; let valB = 0;
            if (sortKey === 'price') { valA = a.price; valB = b.price; }
            else if (sortKey === 'stamina') { valA = a.stamina; valB = b.stamina; }
            else if (sortKey === 'efficiency') { valA = getEfficiency(a); valB = getEfficiency(b); }
            if (sortOrder === 'asc') return valA - valB;
            return valB - valA;
        });
    }, [items, sortKey, sortOrder]);

    const getSortIcon = (key: SortKey) => {
        if (sortKey !== key) return <span style={{opacity:0.3}}>⇅</span>;
        return sortOrder === 'asc' ? '↑' : '↓';
    };

    return (
        <div className="about-layout">
            <div className="about-card fade-in">
                <div className="card-header">
                    <h2>信用商店性价比 // PROCUREMENT</h2>
                </div>
                <div className="card-scroll-body">
                    <div className="tool-section" style={{marginBottom: 0}}>
                        <p style={{fontSize:'0.9em', color:'#888', marginTop: 0}}>* 性价比 = 等效体力 / 信用点价格 (数值越高越划算)</p>

                        <div className="table-container" style={{marginTop:'20px'}}>
                            <table className="tech-table" style={{ width: '100%' }}>
                                <thead>
                                <tr>
                                    <th>商品名称</th>
                                    <th className="sortable-th" onClick={() => handleSort('price')} style={{cursor:'pointer', color: sortKey==='price'?'var(--theme-yellow)':'inherit'}}>信用价格 {getSortIcon('price')}</th>
                                    <th className="sortable-th" onClick={() => handleSort('stamina')} style={{cursor:'pointer', color: sortKey==='stamina'?'var(--theme-yellow)':'inherit'}}>等效体力 {getSortIcon('stamina')}</th>
                                    <th className="sortable-th" onClick={() => handleSort('efficiency')} style={{cursor:'pointer', color: sortKey==='efficiency'?'var(--theme-yellow)':'inherit'}}>性价比 (体力/币) {getSortIcon('efficiency')}</th>
                                    <th>备注</th>
                                </tr>
                                </thead>
                                <tbody>
                                {sortedItems.map(item => {
                                    const eff = getEfficiency(item);
                                    return (
                                        <tr key={item.id}>
                                            <td className="font-bold">{item.name}</td>
                                            <td>{item.price}</td>
                                            <td>{item.stamina}</td>
                                            <td style={{color: eff > 0.033 ? '#52c41a' : (eff > 0.03 ? 'var(--theme-yellow)' : '#888'), fontWeight: 'bold'}}>{eff.toFixed(4)}</td>
                                            <td style={{ fontSize: '0.85em', color: '#888', maxWidth: '200px', whiteSpace: 'normal' }}>{item.note || '-'}</td>
                                        </tr>
                                    )
                                })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function App() {
    const [activePage, setActivePage] = useState<'matrix' | 'about'| 'trade'>('matrix');

    return (
        <div className="app-root">
            <header className="app-header">
                <div className="logo-area">
                    <img src="logo.svg" alt="logo" style={{ width: '32px', height: '32px' }} />
                    <div className="logo-text">ENDFIELD</div>
                    <div className="logo-sub">TOOLS</div>
                </div>
                <nav className="nav-menu">
                    <button className={`nav-item ${activePage === 'matrix' ? 'active' : ''}`} onClick={() => setActivePage('matrix')}>基质检索</button>
                    <button className={`nav-item ${activePage === 'trade' ? 'active' : ''}`} onClick={() => setActivePage('trade')}>信用商店</button>
                    <button className={`nav-item ${activePage === 'about' ? 'active' : ''}`} onClick={() => setActivePage('about')}>关于终端</button>
                </nav>
            </header>
            <div className="app-content">
                {activePage === 'matrix' && <MatrixTool />}
                {activePage === 'about' && <AboutPage />}
                {activePage === 'trade' && <TradeTool />}
            </div>
        </div>
    );
}

export default App;