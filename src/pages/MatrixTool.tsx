/**
 * 基质检索页面
 */

import { useState, useMemo } from 'react';
import rawData from '../data/matrix_data.json';
import type { AppData, LocationStat, LocationKey, WeaponData } from '../types';
import { LOCATION_MAP, STAR_WEIGHT, getStarMode } from '../constants';

const appData = rawData as unknown as AppData;
const weaponItems = appData.items;

export function MatrixTool() {
    // 侧边栏筛选状态
    const [basicSelections, setBasicSelections] = useState<string[]>([]);
    const [selectedExtra, setSelectedExtra] = useState<string>('');
    const [selectedSkill, setSelectedSkill] = useState<string>('');
    const [selectedRole, setSelectedRole] = useState<string>('');
    const [selectedLocation, setSelectedLocation] = useState<LocationKey | null>(null);

    const options = useMemo(() => {
        return {
            roles: appData.allRoles.filter(r => r !== '否' && r !== '/'),
            basics: Array.from(new Set(weaponItems.map(d => d.basic))),
            extras: Array.from(new Set(weaponItems.map(d => d.extra))),
            skills: Array.from(new Set(weaponItems.map(d => d.skill))),
            locations: Object.keys(LOCATION_MAP) as LocationKey[]
        };
    }, []);

    const handleRoleSelect = (value: string) => {
        setSelectedRole(prev => prev === value ? '' : value);
    };

    const handleLocationSidebarSelect = (key: LocationKey) => {
        setSelectedLocation(prev => prev === key ? null : key);
    };

    const handleBasicToggle = (value: string) => {
        setBasicSelections(prev => {
            if (prev.includes(value)) {
                return prev.filter(item => item !== value);
            }
            if (prev.length < 3) {
                return [...prev, value];
            }
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

    const result = useMemo(() => {
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

        let targetWeapons = [];

        if (selectedRole) {
            targetWeapons = weaponItems.filter(w => w.roleList.includes(selectedRole) && attrFilter(w));
        } else if (selectedLocation) {
            targetWeapons = weaponItems.filter(w => w[selectedLocation] === 1 && attrFilter(w));
        } else {
            targetWeapons = weaponItems.filter(w => attrFilter(w));
        }

        if (targetWeapons.length === 0) {
            return { empty: true, displayWeapons: [], validLocations: [], activeLocation: null, targetCount: 0 };
        }

        const keys = Object.keys(LOCATION_MAP) as LocationKey[];
        const locationStats: LocationStat[] = keys.map(key => ({
            key: key,
            name: LOCATION_MAP[key],
            count: targetWeapons.reduce((sum, item) => sum + item[key], 0)
        }));

        const validLocations = locationStats
            .filter(l => l.count > 0)
            .sort((a, b) => b.count - a.count);

        let activeLocation = selectedLocation;
        if (!activeLocation && validLocations.length > 0) {
            activeLocation = validLocations[0].key as LocationKey;
        }

        let displayWeapons = [];
        if (activeLocation) {
            const allInLoc = weaponItems.filter(w => w[activeLocation!] === 1);
            displayWeapons = allInLoc.filter(w => attrFilter(w));
        } else {
            displayWeapons = targetWeapons;
        }

        const processedWeapons = displayWeapons.map(w => ({
            ...w,
            isTarget: selectedRole ? w.roleList.includes(selectedRole) : true
        }));

        processedWeapons.sort((a, b) => {
            if (a.isTarget && !b.isTarget) return -1;
            if (!a.isTarget && b.isTarget) return 1;
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

                    <div className="filter-section">
                        <div className="section-title"><span className="title-icon">A</span>基础属性 (最多3项)</div>
                        <div className="button-grid">
                            {options.basics.map(opt => {
                                const isActive = basicSelections.includes(opt);
                                const isDisabled = !isActive && basicSelections.length >= 3;
                                return (
                                    <button
                                        key={opt}
                                        className={`tech-btn ${isActive ? 'active' : ''}`}
                                        onClick={() => handleBasicToggle(opt)}
                                        disabled={isDisabled}
                                    >
                                        {opt}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    <div className="filter-separator"></div>

                    <div className="filter-section">
                        <div className="section-title"><span className="title-icon">B</span>附加属性 (与C互斥)</div>
                        <div className="button-grid">
                            {options.extras.map(opt => (
                                <button
                                    key={opt}
                                    className={`tech-btn ${selectedExtra === opt ? 'active' : ''} ${selectedSkill ? 'muted' : ''}`}
                                    onClick={() => handleExtraSelect(opt)}
                                >
                                    {opt}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="filter-section">
                        <div className="section-title"><span className="title-icon">C</span>技能属性 (与B互斥)</div>
                        <div className="button-grid">
                            {options.skills.map(opt => (
                                <button
                                    key={opt}
                                    className={`tech-btn ${selectedSkill === opt ? 'active' : ''} ${selectedExtra ? 'muted' : ''}`}
                                    onClick={() => handleSkillSelect(opt)}
                                >
                                    {opt}
                                </button>
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
