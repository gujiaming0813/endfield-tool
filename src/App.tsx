import { useState, useMemo } from 'react';
import './App.css';
import rawData from './matrix_data.json';
import type { AppData, LocationStat, LocationKey } from './types';

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

function App() {
    const [basicSelections, setBasicSelections] = useState<string[]>([]);
    const [selectedExtra, setSelectedExtra] = useState<string>('');
    const [selectedSkill, setSelectedSkill] = useState<string>('');
    const [selectedRole, setSelectedRole] = useState<string>('');

    const getStarMode = (rawStar: string) => {
        const s = String(rawStar).trim();
        if (s === '六' || s === '6') return '六';
        if (s === '五' || s === '5') return '五';
        return '四';
    };

    const options = useMemo(() => {
        return {
            roles: appData.allRoles.filter(r => r !== '否' && r !== '/'),
            basics: Array.from(new Set(weaponItems.map(d => d.basic))),
            extras: Array.from(new Set(weaponItems.map(d => d.extra))),
            skills: Array.from(new Set(weaponItems.map(d => d.skill)))
        };
    }, []);

    const handleRoleSelect = (value: string) => {
        // 允许点击取消，也允许点击切换
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

                                                    {/* --- 修改点：将角色文本替换为标签组件 --- */}
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

export default App;