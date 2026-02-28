/**
 * 信用商店页面
 */

import { useState, useMemo } from 'react';
import tradeData from '../data/trade_data.json';
import type { TradeItem } from '../types';

type SortKey = 'price' | 'stamina' | 'efficiency';
type SortOrder = 'asc' | 'desc';

export function TradeTool() {
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
            let valA = 0;
            let valB = 0;
            if (sortKey === 'price') { valA = a.price; valB = b.price; }
            else if (sortKey === 'stamina') { valA = a.stamina; valB = b.stamina; }
            else if (sortKey === 'efficiency') { valA = getEfficiency(a); valB = getEfficiency(b); }
            if (sortOrder === 'asc') return valA - valB;
            return valB - valA;
        });
    }, [items, sortKey, sortOrder]);

    const getSortIcon = (key: SortKey) => {
        if (sortKey !== key) return <span style={{ opacity: 0.3 }}>⇅</span>;
        return sortOrder === 'asc' ? '↑' : '↓';
    };

    const getEfficiencyColor = (eff: number) => {
        if (eff > 0.033) return '#52c41a';
        if (eff > 0.03) return 'var(--theme-yellow)';
        return '#888';
    };

    return (
        <div className="about-layout fade-in">
            <div className="about-card">
                <div className="card-header">
                    <h2>信用商店性价比 // PROCUREMENT</h2>
                </div>
                <div className="card-scroll-body">
                    <div className="tool-section" style={{ marginBottom: 0 }}>
                        <p style={{ fontSize: '0.9em', color: '#888', marginTop: 0 }}>
                            * 性价比 = 等效体力 / 信用点价格 (数值越高越划算)
                        </p>

                        <div className="table-container" style={{ marginTop: '20px' }}>
                            <table className="tech-table" style={{ width: '100%' }}>
                                <thead>
                                    <tr>
                                        <th>商品名称</th>
                                        <th
                                            className="sortable-th"
                                            onClick={() => handleSort('price')}
                                            style={{ cursor: 'pointer', color: sortKey === 'price' ? 'var(--theme-yellow)' : 'inherit' }}
                                        >
                                            信用价格 {getSortIcon('price')}
                                        </th>
                                        <th
                                            className="sortable-th"
                                            onClick={() => handleSort('stamina')}
                                            style={{ cursor: 'pointer', color: sortKey === 'stamina' ? 'var(--theme-yellow)' : 'inherit' }}
                                        >
                                            等效体力 {getSortIcon('stamina')}
                                        </th>
                                        <th
                                            className="sortable-th"
                                            onClick={() => handleSort('efficiency')}
                                            style={{ cursor: 'pointer', color: sortKey === 'efficiency' ? 'var(--theme-yellow)' : 'inherit' }}
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
                                                <td style={{ color: getEfficiencyColor(eff), fontWeight: 'bold' }}>
                                                    {eff.toFixed(4)}
                                                </td>
                                                <td style={{ fontSize: '0.85em', color: '#888', maxWidth: '200px', whiteSpace: 'normal' }}>
                                                    {item.note || '-'}
                                                </td>
                                            </tr>
                                        );
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
