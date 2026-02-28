/**
 * 关于页面
 */

export function AboutPage() {
    return (
        <div className="about-layout fade-in">
            <div className="about-card">
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
