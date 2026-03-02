/**
 * 干员档案页面
 */

import { useState, useMemo } from 'react';
import charRawData from '../data/character_data.json';
import type { CharacterData } from '../types';
import { isCharacterData } from '../utils/validation';

// 运行时验证数据结构
if (!isCharacterData(charRawData)) {
    throw new Error('character_data.json 数据结构无效');
}
const characterData = charRawData as CharacterData;

export function CharacterTool() {
    const [selectedFaction, setSelectedFaction] = useState<string>('');
    const [selectedRace, setSelectedRace] = useState<string>('');
    const [selectedProfession, setSelectedProfession] = useState<string>('');

    const options = useMemo(() => {
        return {
            factions: Array.from(new Set(characterData.items.map(c => c.faction))).filter(Boolean),
            races: Array.from(new Set(characterData.items.map(c => c.race))).filter(Boolean),
            professions: Array.from(new Set(characterData.items.map(c => c.profession))).filter(Boolean)
        };
    }, []);

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
        setSelectedProfession('');
    };

    const filteredCharacters = useMemo(() => {
        return characterData.items.filter(item => {
            const matchFaction = selectedFaction ? item.faction === selectedFaction : true;
            const matchRace = selectedRace ? item.race === selectedRace : true;
            const matchProfession = selectedProfession ? item.profession === selectedProfession : true;
            return matchFaction && matchRace && matchProfession;
        });
    }, [selectedFaction, selectedRace, selectedProfession]);

    const highlightStyle = {
        color: 'var(--theme-yellow)',
        fontWeight: 'bold'
    };

    return (
        <div className="app-layout fade-in">
            <aside className="tech-panel sidebar-panel">
                <div className="panel-header-area">
                    <h1>干员档案终端</h1>
                    <div className="tech-decoration">/// PERSONNEL ARCHIVES ///</div>
                </div>

                <div className="panel-scroll-content">
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
                                    <span className="result-count">[{filteredCharacters.length}]</span>
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
                                            {filteredCharacters.map((char, idx) => (
                                                <tr key={idx}>
                                                    <td className="font-bold">{char.name}</td>
                                                    <td style={{opacity: 0.7, fontSize: '0.9em'}}>{char.engName}</td>
                                                    <td style={selectedProfession === char.profession ? highlightStyle : {}}>
                                                        {char.profession}
                                                    </td>
                                                    <td style={selectedRace === char.race ? highlightStyle : {}}>
                                                        {char.race}
                                                    </td>
                                                    <td style={selectedFaction === char.faction ? highlightStyle : {}}>
                                                        {char.faction}
                                                    </td>
                                                    <td style={{fontSize: '0.85em', color: '#888'}}>{char.remark || '-'}</td>
                                                </tr>
                                            ))}
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
