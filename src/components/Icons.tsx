/**
 * 工业科技风格图标组件
 * 主题色: #ffc107 (金黄色)
 * 风格: 几何化、切角效果、终端感
 */

interface IconProps {
    size?: number;
    color?: string;
    className?: string;
}

/** 基质检索图标 - 六边形数据库/矩阵符号 */
export function MatrixIcon({ size = 20, color = 'currentColor', className = '' }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* 六边形外框 - 切角风格 */}
            <path
                d="M12 2L20 6.5V17.5L12 22L4 17.5V6.5L12 2Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
            {/* 内部矩阵网格点 */}
            <circle cx="8" cy="8.5" r="1.2" fill={color} />
            <circle cx="12" cy="8.5" r="1.2" fill={color} />
            <circle cx="16" cy="8.5" r="1.2" fill={color} />
            <circle cx="8" cy="12" r="1.2" fill={color} />
            <circle cx="12" cy="12" r="1.5" fill={color} />
            <circle cx="16" cy="12" r="1.2" fill={color} />
            <circle cx="8" cy="15.5" r="1.2" fill={color} />
            <circle cx="12" cy="15.5" r="1.2" fill={color} />
            <circle cx="16" cy="15.5" r="1.2" fill={color} />
        </svg>
    );
}

/** 干员档案图标 - 人员档案卡片 */
export function CharacterIcon({ size = 20, color = 'currentColor', className = '' }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* 档案卡 - 切角矩形 */}
            <path
                d="M3 3H17L21 7V21H3V3Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
            {/* 切角装饰 */}
            <path
                d="M17 3V7H21"
                stroke={color}
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
            {/* 人形轮廓 */}
            <circle cx="10" cy="10" r="2" stroke={color} strokeWidth="1.5" />
            <path
                d="M6 17C6 14.7909 7.79086 13 10 13C12.2091 13 14 14.7909 14 17"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            {/* 档案线条 */}
            <line x1="16" y1="12" x2="19" y2="12" stroke={color} strokeWidth="1.2" />
            <line x1="16" y1="15" x2="19" y2="15" stroke={color} strokeWidth="1.2" />
        </svg>
    );
}

/** 信用商店图标 - 货币交易符号 */
export function TradeIcon({ size = 20, color = 'currentColor', className = '' }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* 菱形外框 - 代表价值/交易 */}
            <path
                d="M12 2L21 12L12 22L3 12L12 2Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
            {/* 货币符号 - 简化的信用点符号 */}
            <circle cx="12" cy="12" r="4" stroke={color} strokeWidth="1.5" />
            {/* 中心核心点 */}
            <circle cx="12" cy="12" r="1.5" fill={color} />
            {/* 交易箭头 - 双向 */}
            <path
                d="M8 6L6 8L8 10"
                stroke={color}
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
            <path
                d="M16 14L18 16L16 18"
                stroke={color}
                strokeWidth="1.2"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

/** 隐私盾牌图标 - 安全/隐私保护符号 */
export function ShieldIcon({ size = 20, color = 'currentColor', className = '' }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* 盾牌外框 - 切角风格 */}
            <path
                d="M12 2L20 5V11C20 16 16.5 20.5 12 22C7.5 20.5 4 16 4 11V5L12 2Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
            {/* 勾选标记 - 表示安全 */}
            <path
                d="M8 12L11 15L16 9"
                stroke={color}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
}

/** 关于页面图标 - 信息终端符号 */
export function AboutIcon({ size = 20, color = 'currentColor', className = '' }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* 终端屏幕 - 切角矩形 */}
            <path
                d="M2 6L6 2H18L22 6V18L18 22H6L2 18V6Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
            {/* 信息符号 "i" */}
            <line x1="12" y1="8" x2="12" y2="8.01" stroke={color} strokeWidth="2.5" strokeLinecap="round" />
            <line x1="12" y1="11" x2="12" y2="17" stroke={color} strokeWidth="1.8" strokeLinecap="round" />
            {/* 终端装饰线 */}
            <line x1="6" y1="6" x2="9" y2="6" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
            <line x1="6" y1="19" x2="10" y2="19" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
        </svg>
    );
}

/** 视频图标 - 播放按钮符号 */
export function VideoIcon({ size = 20, color = 'currentColor', className = '' }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* 视频框 - 切角矩形 */}
            <path
                d="M3 4H17L21 8V20H3V4Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
            {/* 切角装饰 */}
            <path
                d="M17 4V8H21"
                stroke={color}
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
            {/* 播放三角形 */}
            <path
                d="M10 9L14 12L10 15V9Z"
                fill={color}
            />
        </svg>
    );
}

/** 播放图标 - 圆形播放按钮 */
export function PlayIcon({ size = 20, color = 'currentColor', className = '' }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* 播放三角形 */}
            <path
                d="M8 5.14V19.14L19 12.14L8 5.14Z"
                fill={color}
            />
        </svg>
    );
}

/** 搜索图标 */
export function SearchIcon({ size = 20, color = 'currentColor', className = '' }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* 放大镜圆圈 */}
            <circle
                cx="11"
                cy="11"
                r="7"
                stroke={color}
                strokeWidth="1.8"
            />
            {/* 手柄 */}
            <line
                x1="16"
                y1="16"
                x2="21"
                y2="21"
                stroke={color}
                strokeWidth="1.8"
                strokeLinecap="round"
            />
        </svg>
    );
}

/** 编辑图标 - 铅笔符号 */
export function EditIcon({ size = 20, color = 'currentColor', className = '' }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* 铅笔主体 */}
            <path
                d="M4 20H8L19 9C19.5304 8.46957 19.8284 7.73913 19.8284 6.97913C19.8284 6.21913 19.5304 5.48870 19 4.95826C18.4696 4.42783 17.7391 4.12982 16.9791 4.12982C16.2191 4.12982 15.4887 4.42783 14.9583 4.95826L4 16V20Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
            {/* 笔尖 */}
            <path
                d="M13.5 6.5L17.5 10.5"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
            />
        </svg>
    );
}

/** 查看图标 - 眼睛符号 */
export function ViewIcon({ size = 20, color = 'currentColor', className = '' }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* 眼睛轮廓 */}
            <path
                d="M2 12C2 12 5 5 12 5C19 5 22 12 22 12C22 12 19 19 12 19C5 19 2 12 2 12Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
            {/* 瞳孔 */}
            <circle
                cx="12"
                cy="12"
                r="3"
                stroke={color}
                strokeWidth="1.5"
            />
        </svg>
    );
}

/** 删除图标 - 垃圾桶符号 */
export function DeleteIcon({ size = 20, color = 'currentColor', className = '' }: IconProps) {
    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className={className}
        >
            {/* 垃圾桶主体 */}
            <path
                d="M5 7H19L18 20H6L5 7Z"
                stroke={color}
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
            {/* 盖子 */}
            <path
                d="M3 7H21"
                stroke={color}
                strokeWidth="1.5"
                strokeLinecap="round"
            />
            {/* 把手 */}
            <path
                d="M8 7V5C8 4 9 3 12 3C15 3 16 4 16 5V7"
                stroke={color}
                strokeWidth="1.5"
                strokeLinejoin="round"
            />
            {/* 内部线条 */}
            <line x1="10" y1="11" x2="10" y2="16" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
            <line x1="14" y1="11" x2="14" y2="16" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
        </svg>
    );
}
