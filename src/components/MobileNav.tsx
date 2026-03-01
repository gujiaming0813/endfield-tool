/**
 * 手机端导航栏组件
 * 支持从左上角向右下角展开的动画效果
 */

import { MatrixIcon, CharacterIcon, TradeIcon, AboutIcon, VideoIcon } from './Icons';

type PageType = 'matrix' | 'character' | 'trade' | 'video' | 'about';

interface MobileNavProps {
    activePage: PageType;
    onNavigate: (page: PageType) => void;
    isOpen: boolean;
    onToggle: () => void;
}

interface NavItem {
    id: PageType;
    label: string;
    icon: React.ReactNode;
}

const navItems: NavItem[] = [
    { id: 'matrix', label: '基质检索', icon: <MatrixIcon size={24} /> },
    { id: 'character', label: '干员档案', icon: <CharacterIcon size={24} /> },
    { id: 'trade', label: '信用商店', icon: <TradeIcon size={24} /> },
    { id: 'video', label: '精品视频', icon: <VideoIcon size={24} /> },
    { id: 'about', label: '关于终端', icon: <AboutIcon size={24} /> },
];

export function MobileNav({ activePage, onNavigate, isOpen, onToggle }: MobileNavProps) {
    const handleNavigate = (page: PageType) => {
        onNavigate(page);
        onToggle(); // 导航后自动关闭
    };

    return (
        <>
            {/* 顶部栏 - 始终可见 */}
            <header className={`mobile-header ${isOpen ? 'nav-open' : ''}`}>
                <div className="mobile-header-content">
                    <div className="mobile-logo">
                        <img src="logo.svg" alt="logo" className="mobile-logo-icon" />
                        <div className="mobile-logo-text">
                            <span className="logo-text-main">ENDFIELD</span>
                            <span className="logo-text-sub">TOOLS</span>
                        </div>
                    </div>
                    <button
                        className={`mobile-menu-btn ${isOpen ? 'open' : ''}`}
                        onClick={onToggle}
                        aria-label={isOpen ? '关闭菜单' : '打开菜单'}
                    >
                        <span className="menu-line"></span>
                        <span className="menu-line"></span>
                        <span className="menu-line"></span>
                    </button>
                </div>
            </header>

            {/* 全屏导航层 - 展开状态可见 */}
            <div className={`mobile-nav-overlay ${isOpen ? 'open' : ''}`}>
                {/* 导航内容 - 从左上角向右下角展开 */}
                <div className="mobile-nav-content">
                    {/* 导航菜单列表 - 顶部留出 header 空间 */}
                    <nav className="mobile-nav-list">
                        {navItems.map((item) => (
                            <button
                                key={item.id}
                                className={`mobile-nav-item ${activePage === item.id ? 'active' : ''}`}
                                onClick={() => handleNavigate(item.id)}
                            >
                                <span className="nav-item-icon">{item.icon}</span>
                                <span className="nav-item-label">{item.label}</span>
                                <span className="nav-item-arrow">
                                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                        <path
                                            d="M6 4L10 8L6 12"
                                            stroke="currentColor"
                                            strokeWidth="1.5"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                        />
                                    </svg>
                                </span>
                            </button>
                        ))}
                    </nav>

                    {/* 底部装饰 */}
                    <div className="mobile-nav-footer">
                        <span className="tech-decoration">/// ENDFIELD INDUSTRY ///</span>
                    </div>
                </div>
            </div>
        </>
    );
}
