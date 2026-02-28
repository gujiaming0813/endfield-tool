/**
 * 可折叠侧边栏组件
 * 鼠标悬停自动展开，移开自动收起
 * 工业科技风格：深色背景 + 金黄主题色
 */

import { MatrixIcon, CharacterIcon, TradeIcon, AboutIcon } from './Icons';

type PageType = 'matrix' | 'character' | 'trade' | 'about';

interface SidebarProps {
    activePage: PageType;
    onNavigate: (page: PageType) => void;
}

interface NavItem {
    id: PageType;
    label: string;
    icon: React.ReactNode;
}

const navItems: NavItem[] = [
    { id: 'matrix', label: '基质检索', icon: <MatrixIcon size={22} /> },
    { id: 'character', label: '干员档案', icon: <CharacterIcon size={22} /> },
    { id: 'trade', label: '信用商店', icon: <TradeIcon size={22} /> },
    { id: 'about', label: '关于终端', icon: <AboutIcon size={22} /> },
];

export function Sidebar({ activePage, onNavigate }: SidebarProps) {
    return (
        <aside className="sidebar">
            {/* Logo 区域 */}
            <div className="sidebar-header">
                <div className="sidebar-logo">
                    <img src="logo.svg" alt="logo" className="logo-icon" />
                    <div className="logo-text-group">
                        <span className="logo-text">ENDFIELD</span>
                        <span className="logo-sub">TOOLS</span>
                    </div>
                </div>
            </div>

            {/* 导航菜单 */}
            <nav className="sidebar-nav">
                {navItems.map(item => (
                    <button
                        key={item.id}
                        className={`nav-item ${activePage === item.id ? 'active' : ''}`}
                        onClick={() => onNavigate(item.id)}
                        title={item.label}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-label">{item.label}</span>
                    </button>
                ))}
            </nav>

            {/* 底部装饰 */}
            <div className="sidebar-footer">
                <div className="footer-text">
                    <span className="tech-decoration">/// ENDFIELD ///</span>
                    <span className="tech-decoration">INDUSTRY</span>
                </div>
                <div className="footer-line" />
            </div>
        </aside>
    );
}
