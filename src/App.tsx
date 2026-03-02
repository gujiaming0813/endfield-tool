/**
 * 应用入口组件
 */

import { useState, useEffect, useCallback } from 'react';
import './App.css';

// 导航组件
import { Sidebar } from './components/Sidebar';
import { MobileNav } from './components/MobileNav';
import { LoadingScreen } from './components/LoadingScreen';
import { ContourBackground } from './components/ContourBackground';
import { ToastContainer, ConfirmDialog } from './components/Notification';
import { NotificationProvider } from './contexts/NotificationContext';

// 页面组件
import { MatrixTool } from './pages/MatrixTool';
import { CharacterTool } from './pages/CharacterTool';
import { TradeTool } from './pages/TradeTool';
import { VideoPage } from './pages/VideoPage';
import { AboutPage } from './pages/AboutPage';

// 页面类型定义
type PageType = 'matrix' | 'character' | 'trade' | 'video' | 'about';

function App() {
    // 当前页面状态
    const [activePage, setActivePage] = useState<PageType>('matrix');
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

    // 导航处理（关闭移动端菜单）
    const handleNavigate = (page: PageType) => {
        setActivePage(page);
        setMobileMenuOpen(false);
    };

    // 加载完成回调
    const handleLoadingComplete = useCallback(() => {
        requestAnimationFrame(() => {
            setLoadingDone(true);
        });
    }, []);

    // 渲染当前页面
    const renderPage = () => {
        switch (activePage) {
            case 'matrix':
                return <MatrixTool />;
            case 'character':
                return <CharacterTool />;
            case 'trade':
                return <TradeTool />;
            case 'video':
                return <VideoPage />;
            case 'about':
                return <AboutPage />;
            default:
                return <MatrixTool />;
        }
    };

    return (
        <NotificationProvider>
            {/* 加载遮罩层 */}
            {!loadingDone && (
                <LoadingScreen onComplete={handleLoadingComplete} minDuration={2500} />
            )}

            {/* 等高线背景 */}
            <ContourBackground opacity={0.06} color="#ffc107" />

            {/* 主应用 */}
            <div
                className={`app-root ${isMobile ? 'mobile' : 'desktop'}`}
                style={{ opacity: loadingDone ? 1 : 0, transition: 'opacity 0.3s ease-in' }}
            >
                {/* 桌面端：侧边栏导航 */}
                {!isMobile && (
                    <Sidebar
                        activePage={activePage}
                        onNavigate={setActivePage}
                    />
                )}

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
                    {renderPage()}
                </main>
            </div>

            {/* 通知组件 */}
            <ToastContainer />
            <ConfirmDialog />
        </NotificationProvider>
    );
}

export default App;
