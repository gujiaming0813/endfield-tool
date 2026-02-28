/**
 * 加载遮罩层组件
 */

import { useState, useEffect } from 'react';

type LoadingPhase = 'loading' | 'expand' | 'fadeout' | 'done';

interface LoadingScreenProps {
    onComplete: () => void;
    minDuration?: number;
}

export function LoadingScreen({ onComplete, minDuration = 2500 }: LoadingScreenProps) {
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
