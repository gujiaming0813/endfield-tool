import { useState, useMemo, useEffect, useCallback } from 'react';
import './App.css';
import rawData from './data/matrix_data.json';
import tradeData from './data/trade_data.json';
import charRawData from './data/character_data.json';
// 1. 引入 WeaponData 类型
import type { AppData, LocationStat, LocationKey, TradeItem, WeaponData, CharacterData } from './types';
// 引入侧边栏组件
import { Sidebar } from './components/Sidebar';
// 引入手机端导航组件
import { MobileNav } from './components/MobileNav';

const appData = rawData as unknown as AppData;
const weaponItems = appData.items;
const characterData = charRawData as unknown as CharacterData;

// ==========================================
// 加载遮罩层组件
// ==========================================
type LoadingPhase = 'loading' | 'expand' | 'fadeout' | 'done';

interface LoadingScreenProps {
    onComplete: () => void;
    minDuration?: number;
}

function LoadingScreen({ onComplete, minDuration = 2500 }: LoadingScreenProps) {
    const [progress, setProgress] = useState(0);
    const [phase, setPhase] = useState<LoadingPhase>('loading');

    useEffect(() => {
        const startTime = Date.now();
        const totalDuration = minDuration;
        const progressInterval = 30;

        const updateProgress = () => {
            const elapsed = Date.now() - startTime;
            const newProgress = Math.min((elapsed / totalDuration) * 100, 100);
            setProgress(newProgress);

            if (newProgress >= 100) {
                clearInterval(timer);
                // 进入展开阶段
                setPhase('expand');
                // 展开动画持续 800ms 后进入淡出
                setTimeout(() => {
                    setPhase('fadeout');
                    // 淡出动画持续 500ms 后完成
                    setTimeout(() => {
                        setPhase('done');
                        onComplete();
                    }, 500);
                }, 800);
            }
        };

        const timer = setInterval(updateProgress, progressInterval);
        return () => clearInterval(timer);
    }, [minDuration, onComplete]);

    if (phase === 'done') return null;

    return (
        <div className={`loading-overlay ${phase}`}>
            {/* 背景层 - 展开阶段从左到右填充黄色 */}
            <div className="loading-bg-expand" style={{ width: phase === 'loading' ? '0%' : '100%' }} />

            {/* 进度条容器 - 最左侧垂直进度条 */}
            <div className="loading-progress-container">
                <div className="loading-progress-bar">
                    <div className="loading-progress-fill" style={{ height: `${progress}%` }} />
                    <div className="loading-progress-head" style={{ top: `${progress}%` }}>
                        <span className="loading-head-percent">{Math.floor(progress)}%</span>
                    </div>
                </div>
            </div>

            {/* 中心内容 */}
            <div className="loading-content">
                <img src="logo.svg" alt="logo" className="loading-logo-img" />
                <div className="loading-logo">ENDFIELD</div>
                <div className="loading-subtitle">INDUSTRY</div>
            </div>

            {/* 底部装饰 */}
            <div className="loading-footer">
                <div className="loading-line" />
                <span>LOADING SYSTEM</span>
                <div className="loading-line" />
            </div>
        </div>
    );
}

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
            skills: Array.from(new Set(weaponItems.map(d => d.skill))),
            // 必须包含 Locations 列表供侧边栏渲染
            locations: Object.keys(LOCATION_MAP) as LocationKey[]
        };
    }, []);

    // === 筛选操作处理 (每次变动都重置地区为自动选择) ===

    // 1. 点击干员：切换角色，【不清空】手动区域
    const handleRoleSelect = (value: string) => {
        if (selectedRole === value) {
            setSelectedRole('');
        } else {
            setSelectedRole(value);
        }
    };

    // 2. 点击侧边栏区域：切换区域，【不清空】角色
    const handleLocationSidebarSelect = (key: LocationKey) => {
        if (selectedLocation === key) {
            setSelectedLocation(null); // 再次点击取消
        } else {
            setSelectedLocation(key);
            // 这里不再调用 setSelectedRole('')，允许两者共存
        }
    };

    // 3. 基础属性筛选：最多选 3 个，不清空角色/区域
    const handleBasicToggle = (value: string) => {
        setBasicSelections(prev => {
            // 如果已选中，则取消
            if (prev.includes(value)) {
                return prev.filter(item => item !== value);
            }
            // 如果未选中且少于3个，则添加
            if (prev.length < 3) {
                return [...prev, value];
            }
            // 否则不变
            return prev;
        });
    };

    // 4. 附加属性筛选：与技能互斥，单选，不清空角色/区域
    const handleExtraSelect = (value: string) => {
        if (selectedExtra === value) {
            setSelectedExtra('');
        } else {
            setSelectedExtra(value);
            setSelectedSkill(''); // 附加与技能互斥
        }
    };

    // 5. 技能属性筛选：与附加互斥，单选，不清空角色/区域
    const handleSkillSelect = (value: string) => {
        if (selectedSkill === value) {
            setSelectedSkill('');
        } else {
            setSelectedSkill(value);
            setSelectedExtra(''); // 技能与附加互斥
        }
    };

    // 6. 结果页点击卡片切换区域
    const handleResultLocationSwitch = (key: LocationKey) => {
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
        // 1. 属性过滤器 (通用)
        // 修复：将 item: any 改为 item: WeaponData
        const attrFilter = (item: WeaponData) => {
            const basicMatch = basicSelections.length === 0 || basicSelections.includes(item.basic);
            let otherMatch = true;
            if (selectedExtra) otherMatch = item.extra === selectedExtra;
            else if (selectedSkill) otherMatch = item.skill === selectedSkill;
            return basicMatch && otherMatch;
        };

        const hasInput = selectedRole !== '' || selectedLocation !== null ||
            basicSelections.length > 0 || selectedExtra !== '' || selectedSkill !== '';

        if (!hasInput) return null;

        // 2. 确定“目标武器 (Targets)”
        // 这是所有符合当前筛选逻辑的武器池
        let targetWeapons = [];

        if (selectedRole) {
            // 如果选了角色：目标是该角色的适配武器 (叠加属性)
            // 即使选了区域，Target 依然是该角色的武器（用于统计该角色在各区的分布）
            targetWeapons = weaponItems.filter(w => w.roleList.includes(selectedRole) && attrFilter(w));
        } else if (selectedLocation) {
            // 如果没选角色但选了区域：目标是该区域的武器 (叠加属性)
            targetWeapons = weaponItems.filter(w => w[selectedLocation!] === 1 && attrFilter(w));
        } else {
            // 纯属性模式
            targetWeapons = weaponItems.filter(w => attrFilter(w));
        }

        if (targetWeapons.length === 0) {
            return { empty: true, displayWeapons: [], validLocations: [], activeLocation: null, targetCount: 0 };
        }

        // 3. 统计区域分布
        const keys = Object.keys(LOCATION_MAP) as LocationKey[];
        const locationStats: LocationStat[] = keys.map(key => {
            return {
                key: key,
                name: LOCATION_MAP[key],
                count: targetWeapons.reduce((sum, item) => sum + item[key], 0)
            };
        });

        const validLocations = locationStats
            .filter(l => l.count > 0)
            .sort((a, b) => b.count - a.count);

        // 4. 确定当前展示的区域 (Active Location)
        // 优先级：手动选择 (selectedLocation) > 自动推荐 (Best Location for Role)
        let activeLocation = selectedLocation;

        if (!activeLocation && validLocations.length > 0) {
            // 只要没有手动选区域，就自动定位到掉落最多的区域
            activeLocation = validLocations[0].key as LocationKey;
        }

        // 5. 生成展示列表
        let displayWeapons = [];

        if (activeLocation) {
            // 如果确定了区域，显示该区域符合属性的所有武器
            // 这样能实现：在“枢纽区”查看“陈”的掉落，同时也能看到该区其他的“攻击力”武器
            const allInLoc = weaponItems.filter(w => w[activeLocation!] === 1);
            displayWeapons = allInLoc.filter(w => attrFilter(w));
        } else {
            // 如果没确定区域 (纯属性模式)，显示所有 Target
            displayWeapons = targetWeapons;
        }

        // 6. 标记与排序
        const processedWeapons = displayWeapons.map(w => {
            let isTarget = false;
            // 仅在角色模式下，高亮该角色的适配武器
            if (selectedRole) {
                isTarget = w.roleList.includes(selectedRole);
            } else {
                // 其他模式下，大家都是平等的
                isTarget = true;
            }
            return { ...w, isTarget };
        });

        processedWeapons.sort((a, b) => {
            // 优先显示适配武器
            if (a.isTarget && !b.isTarget) return -1;
            if (!a.isTarget && b.isTarget) return 1;
            // 其次按星级
            const weightA = STAR_WEIGHT[getStarMode(a.star)] || 0;
            const weightB = STAR_WEIGHT[getStarMode(b.star)] || 0;
            return weightB - weightA;
        });

        return {
            empty: false,
            displayWeapons: processedWeapons,
            validLocations,
            activeLocation,
            targetCount: targetWeapons.length
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
                    {/* A. 干员筛选 */}
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

                    {/* [修复] 区域直达模块 - 绑定 selectedLocation 实现正确高亮 */}
                    <div className="filter-section">
                        <div className="section-title"><span className="title-icon">LOC</span>区域直达</div>
                        <div className="button-grid">
                            {options.locations.map(locKey => (
                                <button
                                    key={locKey}
                                    className={`tech-btn ${selectedLocation === locKey ? 'active' : ''}`}
                                    onClick={() => handleLocationSidebarSelect(locKey)}
                                >
                                    {LOCATION_MAP[locKey]}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="filter-separator"></div>

                    {/* 基础属性筛选 */}
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

                    {/* 附加属性筛选 */}
                    <div className="filter-section">
                        <div className="section-title"><span className="title-icon">B</span>附加属性 (与C互斥)</div>
                        <div className="button-grid">
                            {options.extras.map(opt => (
                                <button key={opt} className={`tech-btn ${selectedExtra === opt ? 'active' : ''} ${selectedSkill ? 'muted' : ''}`} onClick={() => handleExtraSelect(opt)}>{opt}</button>
                            ))}
                        </div>
                    </div>

                    {/* 技能属性筛选 */}
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
                            <p>请选择 [干员]、[区域] 或 [属性] 进行检索</p>
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
                                <div className="inner-header">区域分布与切换 // LOCATION SWITCH</div>
                                <div className="inner-body">
                                    <div className="location-results">
                                        {/* 渲染区域卡片：高亮当前 activeLocation */}
                                        {result!.validLocations.map(loc => {
                                            const isActive = result!.activeLocation === loc.key;
                                            return (
                                                <div
                                                    key={loc.key}
                                                    className={`location-highlight ${isActive ? 'active' : ''}`}
                                                    onClick={() => handleResultLocationSwitch(loc.key as LocationKey)}
                                                >
                                                    <span className="loc-name">{loc.name}</span>
                                                    <span className="loc-count">
                                                        含目标: {loc.count} / {result!.targetCount}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                        {/* 如果纯属性模式且未自动定位，显示汇总 */}
                                        {result!.validLocations.length === 0 && result!.activeLocation && (
                                            <div className="location-highlight active">
                                                <span className="loc-name">{LOCATION_MAP[result!.activeLocation]}</span>
                                                <span className="loc-count">当前展示</span>
                                            </div>
                                        )}
                                    </div>
                                    <p style={{marginTop: '15px', fontSize: '0.8em', color: '#666'}}>
                                        {selectedRole
                                            ? selectedLocation
                                                ? `* 正在查看 [${selectedRole}] 在 [${LOCATION_MAP[selectedLocation]}] 的掉落。`
                                                : `* 已为您自动定位到 [${selectedRole}] 掉落最多的区域。`
                                            : `* 已为您自动定位到命中数最多的区域，点击上方可切换查看。`}
                                    </p>
                                </div>
                            </div>

                            <div className="inner-card weapons-list">
                                <div className="inner-header">
                                    {selectedRole ? '区域掉落筛选 (标星为适配)' : '检索结果'} // RESULTS
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
                                            // 动态样式：目标高亮
                                            const isHighlight = weapon.isTarget;
                                            const rowStyle = isHighlight
                                                ? { background: 'rgba(255, 193, 7, 0.08)' }
                                                : { opacity: 0.6 };

                                            return (
                                                <tr key={idx} className={`star-${starMode}`} style={rowStyle}>
                                                    <td className="font-bold" style={{color: isHighlight ? 'var(--theme-yellow)' : 'inherit'}}>
                                                        {weapon.name}
                                                        {selectedRole && isHighlight && <span style={{marginLeft:'5px', fontSize:'0.8em'}}>★</span>}
                                                    </td>
                                                    <td><span className={`badge star-${starMode}`}>{starMode}星</span></td>
                                                    <td>{weapon.basic}</td>
                                                    <td className={selectedExtra ? 'attr-extra font-bold' : ''}>{weapon.extra}</td>
                                                    <td className={selectedSkill ? 'attr-skill font-bold' : ''}>{weapon.skill}</td>
                                                    <td>
                                                        {weapon.roleList.length === 0 ? (
                                                            <span style={{ opacity: 0.3 }}>-</span>
                                                        ) : (
                                                            <div className="role-tag-container">
                                                                {weapon.roleList.map((roleName, rIdx) => {
                                                                    const isSelectedRole = roleName === selectedRole;
                                                                    return (
                                                                        <span
                                                                            key={rIdx}
                                                                            className={`role-tag ${isSelectedRole ? 'active' : ''}`}
                                                                            onClick={(e) => {
                                                                                e.stopPropagation();
                                                                                handleRoleSelect(roleName);
                                                                            }}
                                                                        >
                                                                            {roleName}
                                                                        </span>
                                                                    );
                                                                })}
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
                        <h3>基质刷取检索工具 <span className="version-tag">v1.1.0</span></h3>
                        <ul className="tech-list">
                            <li><strong>数据来源</strong>：<a href="https://space.bilibili.com/329400340" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--theme-yellow)', textDecoration: 'underline', cursor: 'pointer' }}>b站：皇战萌新轲</a></li>
                            <li><strong>功能更新</strong>：支持属性叠加筛选；角色与区域可组合查询。</li>
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

// ==========================================
// 页面 4: 干员档案
// ==========================================
function CharacterTool() {
    // 筛选状态
    const [selectedFaction, setSelectedFaction] = useState<string>('');
    const [selectedRace, setSelectedRace] = useState<string>('');
    const [selectedProfession, setSelectedProfession] = useState<string>('');

    // 选项数据
    const options = useMemo(() => {
        return {
            factions: Array.from(new Set(characterData.items.map(c => c.faction))).filter(Boolean),
            races: Array.from(new Set(characterData.items.map(c => c.race))).filter(Boolean),
            professions: Array.from(new Set(characterData.items.map(c => c.profession))).filter(Boolean)
        };
    }, []);

    // 交互处理：单选但可叠加
    const handleFactionSelect = (val: string) => {
        setSelectedFaction(prev => prev === val ? '' : val);
    };

    const handleRaceSelect = (val: string) => {
        setSelectedRace(prev => prev === val ? '' : val);
    };

    const handleProfessionSelect = (val: string) => {
        setSelectedProfession(prev => prev === val ? '' : val);
    };

    const handleReset = () => {
        setSelectedFaction('');
        setSelectedRace('');
    };

    // 核心计算逻辑
    const filteredCharacters = useMemo(() => {
        return characterData.items.filter(item => {
            const matchFaction = selectedFaction ? item.faction === selectedFaction : true;
            const matchRace = selectedRace ? item.race === selectedRace : true;
            // [新增] 职业匹配
            const matchProfession = selectedProfession ? item.profession === selectedProfession : true;

            return matchFaction && matchRace && matchProfession;
        });
    }, [selectedFaction, selectedRace, selectedProfession]);

    return (
        <div className="app-layout fade-in">
            <aside className="tech-panel sidebar-panel">
                <div className="panel-header-area">
                    <h1>干员档案终端</h1>
                    <div className="tech-decoration">/// PERSONNEL ARCHIVES ///</div>
                </div>

                <div className="panel-scroll-content">
                    {/* 阵营筛选 */}
                    <div className="filter-section">
                        <div className="section-title"><span className="title-icon">FAC</span>所属阵营 (关联查询)</div>
                        <div className="button-grid">
                            {options.factions.map(fac => (
                                <button
                                    key={fac}
                                    className={`tech-btn ${selectedFaction === fac ? 'active' : ''}`}
                                    onClick={() => handleFactionSelect(fac)}
                                >
                                    {fac}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="filter-separator"></div>

                    {/* 种族筛选 */}
                    <div className="filter-section">
                        <div className="section-title"><span className="title-icon">RAC</span>种族分类 (关联查询)</div>
                        <div className="button-grid">
                            {options.races.map(race => (
                                <button
                                    key={race}
                                    className={`tech-btn ${selectedRace === race ? 'active' : ''}`}
                                    onClick={() => handleRaceSelect(race)}
                                >
                                    {race}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* 职业筛选 */}
                    <div className="filter-section">
                        <div className="section-title"><span className="title-icon">JOB</span>职业分类 (关联查询)</div>
                        <div className="button-grid">
                            {options.professions.map(prof => (
                                <button
                                    key={prof}
                                    className={`tech-btn ${selectedProfession === prof ? 'active' : ''}`}
                                    onClick={() => handleProfessionSelect(prof)}
                                >
                                    {prof}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="panel-footer-area">
                    <button className="reset-btn" onClick={handleReset}>RESET FILTER // 重置</button>
                </div>
            </aside>

            <main className="tech-panel content-panel">
                <div className={`panel-scroll-content results-wrapper ${filteredCharacters.length > 0 ? 'has-results' : ''}`}>
                    {filteredCharacters.length === 0 ? (
                        <div className="no-data-state">
                            <h2>NO MATCH FOUND</h2>
                            <p>未找到符合条件的干员档案。</p>
                        </div>
                    ) : (
                        <div className="results-container fade-in">
                            <div className="inner-card weapons-list">
                                <div className="inner-header">
                                    档案列表 // PERSONNEL LIST
                                    <span className="result-count">
                                        [{filteredCharacters.length}]
                                    </span>
                                </div>
                                <div className="table-container">
                                    <table className="tech-table">
                                        <thead>
                                        <tr>
                                            <th>代号</th>
                                            <th>英文名</th>
                                            <th>职业</th>
                                            <th>种族</th>
                                            <th>阵营</th>
                                            <th>备注</th>
                                        </tr>
                                        </thead>
                                        <tbody>
                                        {filteredCharacters.map((char, idx) => {
                                            // [高亮样式]：仅字体变色和加粗
                                            const highlightStyle = {
                                                color: 'var(--theme-yellow)',
                                                fontWeight: 'bold'
                                            };

                                            return (
                                                <tr key={idx}>
                                                    <td className="font-bold">{char.name}</td>
                                                    <td style={{opacity:0.7, fontSize:'0.9em'}}>{char.engName}</td>

                                                    {/* [新增] 职业列：匹配时直接应用 highlightStyle，不使用 badge */}
                                                    <td style={selectedProfession === char.profession ? highlightStyle : {}}>
                                                        {char.profession}
                                                    </td>

                                                    {/* [修改] 种族列应用高亮 */}
                                                    <td style={selectedRace === char.race ? highlightStyle : {}}>
                                                        {char.race}
                                                    </td>

                                                    {/* [修改] 阵营列应用高亮 */}
                                                    <td style={selectedFaction === char.faction ? highlightStyle : {}}>
                                                        {char.faction}
                                                    </td>

                                                    <td style={{fontSize:'0.85em', color:'#888'}}>{char.remark || '-'}</td>
                                                </tr>
                                            )})}
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

function App() {
    // 增加 'character' 页面状态
    const [activePage, setActivePage] = useState<'matrix' | 'about'| 'trade' | 'character'>('matrix');
    // 加载状态
    const [loadingDone, setLoadingDone] = useState(false);
    // 移动端菜单状态
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    // 是否为移动端
    const [isMobile, setIsMobile] = useState(false);

    // 检测设备类型
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // 关闭移动端菜单（导航时）
    const handleNavigate = (page: 'matrix' | 'about' | 'trade' | 'character') => {
        setActivePage(page);
        setMobileMenuOpen(false);
    };

    const handleLoadingComplete = useCallback(() => {
        // 延迟一帧确保过渡动画完成
        requestAnimationFrame(() => {
            setLoadingDone(true);
        });
    }, []);

    return (
        <>
            {/* 加载遮罩层 */}
            {!loadingDone && (
                <LoadingScreen onComplete={handleLoadingComplete} minDuration={2500} />
            )}

            {/* 主应用 */}
            <div className={`app-root ${isMobile ? 'mobile' : 'desktop'}`} style={{ opacity: loadingDone ? 1 : 0, transition: 'opacity 0.3s ease-in' }}>
                {/* 桌面端：侧边栏导航 */}
                {!isMobile && <Sidebar activePage={activePage} onNavigate={setActivePage} />}

                {/* 移动端：顶部导航栏 */}
                {isMobile && (
                    <MobileNav
                        activePage={activePage}
                        onNavigate={handleNavigate}
                        isOpen={mobileMenuOpen}
                        onToggle={() => setMobileMenuOpen(prev => !prev)}
                    />
                )}

                {/* 主内容区 */}
                <main className={`app-main ${isMobile ? 'mobile' : ''}`}>
                    {activePage === 'matrix' && <MatrixTool />}
                    {activePage === 'character' && <CharacterTool />}
                    {activePage === 'about' && <AboutPage />}
                    {activePage === 'trade' && <TradeTool />}
                </main>
            </div>
        </>
    );
}

export default App;