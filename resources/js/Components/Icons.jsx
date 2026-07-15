// ============================================================
// 貼り付け先: resources/js/Components/Icons.jsx（新規作成）
// 役割: アプリ内で使うアイコンのSVG定義。
//       外部ライブラリへの依存を増やさないため、必要な分だけ自前で持つ。
// ============================================================

// 全アイコン共通のSVG属性（線の太さ・線端の丸みを統一する）
const commonSvgAttributes = {
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
};

// アイコンコンポーネントを生成するヘルパー。
// 各アイコンで <svg> の枠組みを毎回書かずに済むようにしている。
function createIcon(svgPaths) {
    return function Icon({ size = 22, className = '' }) {
        return (
            <svg
                viewBox="0 0 24 24"
                width={size}
                height={size}
                className={className}
                {...commonSvgAttributes}
            >
                {svgPaths}
            </svg>
        );
    };
}

export const HomeIcon     = createIcon(<><path d="M3 10.5 12 3l9 7.5" /><path d="M5 9.5V21h14V9.5" /></>);
export const ListIcon     = createIcon(<><path d="M8 6h13" /><path d="M8 12h13" /><path d="M8 18h13" /><path d="M3 6h.01" /><path d="M3 12h.01" /><path d="M3 18h.01" /></>);
export const CameraIcon   = createIcon(<><path d="M4 8h3l2-3h6l2 3h3v12H4z" /><circle cx="12" cy="13" r="3.5" /></>);
export const CalendarIcon = createIcon(<><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M3 10h18" /><path d="M8 3v4" /><path d="M16 3v4" /></>);
export const ChartIcon    = createIcon(<><path d="M4 20V10" /><path d="M10 20V4" /><path d="M16 20v-7" /><path d="M22 20H2" /></>);
export const MenuIcon     = createIcon(<><path d="M4 7h16" /><path d="M4 12h16" /><path d="M4 17h16" /></>);
export const ChevronRightIcon = createIcon(<path d="m9 5 7 7-7 7" />);
export const ChevronLeftIcon  = createIcon(<path d="m15 5-7 7 7 7" />);
export const SearchIcon   = createIcon(<><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>);
export const CheckIcon    = createIcon(<path d="m4 12.5 5 5L20 6.5" />);
export const BackIcon     = createIcon(<path d="M19 12H5m6-7-7 7 7 7" />);
export const UserIcon     = createIcon(<><circle cx="12" cy="8" r="4" /><path d="M4 21c1.5-4 5-5.5 8-5.5s6.5 1.5 8 5.5" /></>);
export const MailIcon     = createIcon(<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>);
export const LockIcon     = createIcon(<><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>);
export const TagIcon      = createIcon(<><path d="m3 12 9-9h9v9l-9 9z" /><circle cx="16.5" cy="7.5" r="1" /></>);
export const BellIcon     = createIcon(<><path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6" /><path d="M10 20a2 2 0 0 0 4 0" /></>);
export const DocumentIcon = createIcon(<><path d="M6 3h9l4 4v14H6z" /><path d="M15 3v4h4" /></>);
export const PaletteIcon  = createIcon(<><circle cx="12" cy="12" r="9" /><circle cx="8.5" cy="10" r="1" /><circle cx="12" cy="7.5" r="1" /><circle cx="15.5" cy="10" r="1" /><path d="M12 21a3 3 0 0 0 0-6h-1a2 2 0 0 1 0-4" /></>);
export const TrashIcon    = createIcon(<><path d="M4 7h16" /><path d="M9 7V4h6v3" /><path d="M6 7l1 13h10l1-13" /></>);
export const LogoutIcon   = createIcon(<><path d="M15 4h4v16h-4" /><path d="M10 8l-4 4 4 4" /><path d="M6 12h9" /></>);
export const InfoIcon     = createIcon(<><circle cx="12" cy="12" r="9" /><path d="M12 11v5" /><path d="M12 8h.01" /></>);
