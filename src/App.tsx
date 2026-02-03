import { useState, useMemo } from 'react';
import './App.css';
import rawData from './data/matrix_data.json';
import tradeData from './data/trade_data.json';
import type {AppData, LocationStat, LocationKey, TradeItem} from './types';

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

// --- 辅助函数 ---
const getStarMode = (rawStar: string) => {
    const s = String(rawStar).trim();
    if (s === '六' || s === '6') return '六';
    if (s === '五' || s === '5') return '五';
    return '四';
};

// ==========================================
// 子页面 1: 基质筛选工具 (Matrix Tool)
// ==========================================
function MatrixTool() {
    const [basicSelections, setBasicSelections] = useState<string[]>([]);
    const [selectedExtra, setSelectedExtra] = useState<string>('');
    const [selectedSkill, setSelectedSkill] = useState<string>('');
    const [selectedRole, setSelectedRole] = useState<string>('');

    const options = useMemo(() => {
        return {
            roles: appData.allRoles.filter(r => r !== '否' && r !== '/'),
            basics: Array.from(new Set(weaponItems.map(d => d.basic))),
            extras: Array.from(new Set(weaponItems.map(d => d.extra))),
            skills: Array.from(new Set(weaponItems.map(d => d.skill)))
        };
    }, []);

    const handleRoleSelect = (value: string) => {
        setSelectedRole(prev => prev === value ? '' : value);
    };

    const handleBasicToggle = (value: string) => {
        setBasicSelections(prev => {
            if (prev.includes(value)) return prev.filter(item => item !== value);
            if (prev.length < 3) return [...prev, value];
            return prev;
        });
    };

    const handleExtraSelect = (value: string) => {
        if (selectedExtra === value) {
            setSelectedExtra('');
        } else {
            setSelectedExtra(value);
            setSelectedSkill('');
        }
    };

    const handleSkillSelect = (value: string) => {
        if (selectedSkill === value) {
            setSelectedSkill('');
        } else {
            setSelectedSkill(value);
            setSelectedExtra('');
        }
    };

    const handleReset = () => {
        setBasicSelections([]);
        setSelectedExtra('');
        setSelectedSkill('');
        setSelectedRole('');
    };

    const result = useMemo(() => {
        const hasRole = selectedRole !== '';
        const hasAnyAttribute = basicSelections.length > 0 || selectedExtra !== '' || selectedSkill !== '';

        if (!hasRole && !hasAnyAttribute) return null;

        const matchedWeapons = weaponItems.filter(item => {
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

        if (matchedWeapons.length === 0) {
            return { empty: true, matchedWeapons: [], bestLocations: [] };
        }

        matchedWeapons.sort((a, b) => {
            const hasRoleA = a.roleList.length > 0;
            const hasRoleB = b.roleList.length > 0;
            if (hasRoleA && !hasRoleB) return -1;
            if (!hasRoleA && hasRoleB) return 1;
            const weightA = STAR_WEIGHT[getStarMode(a.star)] || 0;
            const weightB = STAR_WEIGHT[getStarMode(b.star)] || 0;
            return weightB - weightA;
        });

        const keys = Object.keys(LOCATION_MAP) as LocationKey[];
        const locationStats: LocationStat[] = keys.map(key => {
            return {
                key: key,
                name: LOCATION_MAP[key],
                count: matchedWeapons.reduce((sum, item) => sum + item[key], 0)
            };
        });

        locationStats.sort((a, b) => b.count - a.count);
        const maxCount = locationStats[0].count;
        const bestLocations = locationStats.filter(l => l.count === maxCount && l.count > 0);

        return { empty: false, matchedWeapons, bestLocations };
    }, [basicSelections, selectedExtra, selectedSkill, selectedRole]);

    return (
        <div className="app-layout">
            {/* 左侧筛选面板 */}
            <aside className="tech-panel sidebar-panel">
                <div className="panel-header-area">
                    <h1>基质筛选终端</h1>
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

            {/* 右侧结果面板 */}
            <main className="tech-panel content-panel">
                <div className="panel-scroll-content results-wrapper">
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

                    {result && !result.empty && (
                        <div className="results-container fade-in">
                            <div className="inner-card recommendation">
                                <div className="inner-header">最佳刷取点定位 // OPTIMAL LOCATION</div>
                                <div className="inner-body">
                                    {result.bestLocations.length > 0 ? (
                                        <div className="location-results">
                                            {result.bestLocations.map(loc => (
                                                <div key={loc.key} className="location-highlight">
                                                    <span className="loc-name">{loc.name}</span>
                                                    <span className="loc-count">匹配数: {loc.count}</span>
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <p>当前组合暂无掉落数据</p>
                                    )}
                                </div>
                            </div>

                            <div className="inner-card weapons-list">
                                <div className="inner-header">
                                    检索结果 // SEARCH RESULTS
                                    <span className="result-count">[{result.matchedWeapons.length}]</span>
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
                                        {result.matchedWeapons.map((weapon, idx) => {
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
// 子页面 2: 关于页面 (示例)
// ==========================================
function AboutPage() {
    return (
        <div className="about-layout">
            <div className="about-card fade-in">
                <h2>关于本工具 // ABOUT</h2>
                <p>
                    本工具是专为《明日方舟：终末地》设计的数据查询辅助终端。<br />
                    本工具旨在帮助管理员快速查询各种数据。
                </p>

                <div className="privacy-badge">
                    <span className="shield-icon">🛡️</span>
                    隐私声明：本工具为纯前端应用，无后端数据采集
                </div>

                {/* === 工具板块 1 === */}
                <div className="tool-section">
                    <h3>
                        基质刷取检索工具
                        <span className="version-tag">v1.0.0</span>
                    </h3>

                    <ul className="tech-list">
                        <li>
                            <strong>数据来源</strong>：
                            <a
                                href="https://space.bilibili.com/329400340"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: 'var(--theme-yellow)', textDecoration: 'underline', cursor: 'pointer' }}
                            >
                                b站：皇战萌新轲
                            </a>
                        </li>
                        <li><strong>核心功能</strong>：支持多属性交集筛选与角色反向检索。</li>
                    </ul>
                </div>

                <div className="tool-section">
                    <h3>
                        信用商店性价比工具
                        <span className="version-tag">v1.0.0</span>
                    </h3>

                    <ul className="tech-list">
                        <li>
                            <strong>数据来源</strong>：
                            <a
                                href="https://bbs.nga.cn/nuke.php?func=ucp&uid=41796691"
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{ color: 'var(--theme-yellow)', textDecoration: 'underline', cursor: 'pointer' }}
                            >
                                NGA：2235hhh
                            </a>
                        </li>
                        <li><strong>核心功能</strong>：信用商店性价比查询。</li>
                    </ul>
                </div>

                {/* 预留：未来可以在这里复制上面的 <div className="tool-section"> 添加第二个工具 */}

                <div style={{marginTop: '40px', borderTop: '1px solid #333', paddingTop: '20px', fontSize: '0.9em', color: '#666'}}>
                    /// ENDFIELD INDUSTRIES PROPERTY /// UNAUTHORIZED ACCESS PROHIBITED
                </div>
            </div>
        </div>
    );
}

// ==========================================
// 子页面 3: 信用商店
// ==========================================
type SortKey = 'price' | 'stamina' | 'efficiency';
type SortOrder = 'asc' | 'desc';

function TradeTool() {
    const [items] = useState<TradeItem[]>(tradeData);
    const [sortKey, setSortKey] = useState<SortKey>('efficiency');
    const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

    // 计算性价比 (效率 = 体力 / 价格)，越高越好
    const getEfficiency = (item: TradeItem) => {
        if (item.price === 0) return 0;
        return item.stamina / item.price;
    };

    const handleSort = (key: SortKey) => {
        if (sortKey === key) {
            // 切换排序顺序
            setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
        } else {
            // 切换排序字段 (默认降序)
            setSortKey(key);
            setSortOrder('desc');
        }
    };

    const sortedItems = useMemo(() => {
        return [...items].sort((a, b) => {
            let valA = 0;
            let valB = 0;

            if (sortKey === 'price') {
                valA = a.price;
                valB = b.price;
            } else if (sortKey === 'stamina') {
                valA = a.stamina;
                valB = b.stamina;
            } else if (sortKey === 'efficiency') {
                valA = getEfficiency(a);
                valB = getEfficiency(b);
            }

            if (sortOrder === 'asc') return valA - valB;
            return valB - valA;
        });
    }, [items, sortKey, sortOrder]);

    const getSortIcon = (key: SortKey) => {
        if (sortKey !== key) return <span style={{opacity:0.3}}>⇅</span>;
        return sortOrder === 'asc' ? '↑' : '↓';
    };

    return (
        <div className="about-layout" style={{ justifyContent: 'flex-start', flexDirection: 'column', alignItems: 'center' }}>
            <div className="about-card fade-in" style={{ width: '100%', maxWidth: '1000px' }}>
                <h2>信用商店性价比 // PROCUREMENT</h2>

                <div className="tool-section">
                    <h3>
                        信用点兑换分析
                        <span className="version-tag">BETA</span>
                    </h3>
                    <p style={{fontSize:'0.9em', color:'#888'}}>
                        * 性价比 = 等效体力 / 信用点价格 (数值越高越划算)
                    </p>

                    <div className="table-container" style={{marginTop:'20px'}}>
                        <table className="tech-table" style={{ width: '100%' }}>
                            <thead>
                            <tr>
                                <th>商品名称</th>

                                <th
                                    className="sortable-th"
                                    onClick={() => handleSort('price')}
                                    style={{cursor:'pointer', color: sortKey==='price'?'var(--theme-yellow)':'inherit'}}
                                >
                                    信用价格 {getSortIcon('price')}
                                </th>
                                <th
                                    className="sortable-th"
                                    onClick={() => handleSort('stamina')}
                                    style={{cursor:'pointer', color: sortKey==='stamina'?'var(--theme-yellow)':'inherit'}}
                                >
                                    等效体力 {getSortIcon('stamina')}
                                </th>
                                <th
                                    className="sortable-th"
                                    onClick={() => handleSort('efficiency')}
                                    style={{cursor:'pointer', color: sortKey==='efficiency'?'var(--theme-yellow)':'inherit'}}
                                >
                                    性价比 (体力/币) {getSortIcon('efficiency')}
                                </th>
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
                                        <td style={{
                                            color: eff > 0.033 ? '#52c41a' : (eff > 0.03 ? 'var(--theme-yellow)' : '#888'),
                                            fontWeight: 'bold'
                                        }}>
                                            {eff.toFixed(4)}
                                        </td>
                                        <td style={{ fontSize: '0.85em', color: '#888', maxWidth: '200px', whiteSpace: 'normal' }}>
                                            {item.note || '-'}
                                        </td>
                                    </tr>
                                )
                            })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </div>
    );
}

// ==========================================
// 主应用容器 (Main App)
// ==========================================
function App() {
    const [activePage, setActivePage] = useState<'matrix' | 'about'| 'trade'>('matrix');

    return (
        <div className="app-root">
            {/* 顶部导航栏 */}
            <header className="app-header">
                <div className="logo-area">
                    <div className="logo-text">ENDFIELD</div>
                    <div className="logo-sub">TOOLS</div>
                </div>

                <nav className="nav-menu">
                    <button
                        className={`nav-item ${activePage === 'matrix' ? 'active' : ''}`}
                        onClick={() => setActivePage('matrix')}
                    >
                        基质检索
                    </button>
                    <button
                        className={`nav-item ${activePage === 'trade' ? 'active' : ''}`}
                        onClick={() => setActivePage('trade')}
                    >
                        信用商店
                    </button>
                    <button
                        className={`nav-item ${activePage === 'about' ? 'active' : ''}`}
                        onClick={() => setActivePage('about')}
                    >
                        关于终端
                    </button>
                </nav>
            </header>

            {/* 内容显示区域 */}
            <div className="app-content">
                {activePage === 'matrix' && <MatrixTool />}
                {activePage === 'about' && <AboutPage />}
                {activePage === 'trade' && <TradeTool />}
            </div>
        </div>
    );
}

export default App;