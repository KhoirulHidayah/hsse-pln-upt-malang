import ApplicationLogo from '@/Components/ApplicationLogo';
import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import { Link, usePage } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    HardHat,
    Shield,
    ClipboardList,
    ClipboardCheck,
    MapPin,
    MapPinned,
    Bell,
    Package,
    ChevronDown,
    ChevronRight,
} from 'lucide-react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    const notificationCount = usePage().props.notificationCount || 0;
    
    const [sidebarOpen, setSidebarOpen] = useState(() => {
        const saved = localStorage.getItem('sidebarOpen');
        return saved !== null ? JSON.parse(saved) : true;
    });

    // State dropdown dengan localStorage
    const [masterDataOpen, setMasterDataOpen] = useState(() => {
        const saved = localStorage.getItem('masterDataOpen');
        return saved !== null ? JSON.parse(saved) : false;
    });
    
    const [monitoringOpen, setMonitoringOpen] = useState(() => {
        const saved = localStorage.getItem('monitoringOpen');
        return saved !== null ? JSON.parse(saved) : false;
    });
    
    const [transaksiOpen, setTransaksiOpen] = useState(() => {
        const saved = localStorage.getItem('transaksiOpen');
        return saved !== null ? JSON.parse(saved) : false;
    });

    useEffect(() => {
        localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen));
    }, [sidebarOpen]);

    useEffect(() => {
        localStorage.setItem('masterDataOpen', JSON.stringify(masterDataOpen));
    }, [masterDataOpen]);

    useEffect(() => {
        localStorage.setItem('monitoringOpen', JSON.stringify(monitoringOpen));
    }, [monitoringOpen]);

    useEffect(() => {
        localStorage.setItem('transaksiOpen', JSON.stringify(transaksiOpen));
    }, [transaksiOpen]);

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Sidebar - Fixed Position */}
            <aside
                className={`${
                    sidebarOpen ? 'w-64' : 'w-20'
                } fixed top-0 left-0 h-screen bg-gradient-to-b from-cyan-700 to-teal-800 text-white shadow-lg transition-all duration-300 flex flex-col z-40`}
            >
                {/* Header Sidebar */}
                <div className="flex items-center justify-center h-16 px-4 border-b border-cyan-600/30 bg-white/10">
                    <Link href="/" className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-lg bg-white flex items-center justify-center p-1">
                            <img
                                src="/img/hsse_pln.png"
                                alt="Logo UPT Malang"
                                className="h-full w-full object-contain flex-shrink-0"
                            />
                        </div>
                        {sidebarOpen && (
                            <span className="text-lg font-semibold text-white tracking-wide whitespace-nowrap">
                                UPT MALANG
                            </span>
                        )}
                    </Link>
                </div>

                {/* Menu Sidebar */}
                <nav className="mt-3 flex-1 overflow-y-auto">
                    <ul className="space-y-0.5">
                        {/* Dashboard */}
                        <SidebarItem
                            open={sidebarOpen}
                            icon={<LayoutDashboard />}
                            text="Dashboard"
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                        />

                        {/* Master Data Section */}
                        <SectionDropdown
                            open={sidebarOpen}
                            title="Master Data"
                            isOpen={masterDataOpen}
                            toggle={() => setMasterDataOpen(!masterDataOpen)}
                        >
                            <SidebarItem
                                open={sidebarOpen}
                                icon={<Shield />}
                                text="Jenis APD"
                                href={route('jenis-apd.index')}
                                active={route().current('jenis-apd.*')}
                                isSubmenu
                            />

                            <SidebarItem
                                open={sidebarOpen}
                                icon={<HardHat />}
                                text="Master APD"
                                href={route('apd.index')}
                                active={route().current('apd.*')}
                                isSubmenu
                            />

                            <SidebarItem
                                open={sidebarOpen}
                                icon={<MapPin />}
                                text="Lokasi"
                                href={route('lokasi.index')}
                                active={route().current('lokasi.*')}
                                isSubmenu
                            />

                            <SidebarItem
                                open={sidebarOpen}
                                icon={<MapPinned />}
                                text="Gardu Induk"
                                href={route('gardu-induk.index')}
                                active={route().current('gardu-induk.*')}
                                isSubmenu
                            />
                        </SectionDropdown>

                        {/* Monitoring Section */}
                        <SectionDropdown
                            open={sidebarOpen}
                            title="Monitoring"
                            isOpen={monitoringOpen}
                            toggle={() => setMonitoringOpen(!monitoringOpen)}
                        >
                            <SidebarItem
                                open={sidebarOpen}
                                icon={<ClipboardCheck />}
                                text="Monitoring APD"
                                href={route('monitoring-apd.index')}
                                active={route().current('monitoring-apd.*')}
                                isSubmenu
                            />

                            <SidebarItem
                                open={sidebarOpen}
                                icon={<Bell />}
                                text="Notifikasi"
                                href={route('notifikasi.index')}
                                active={route().current('notifikasi.*')}
                                badge={notificationCount > 0 ? notificationCount : null}
                                isSubmenu
                            />
                        </SectionDropdown>

                        {/* Transaksi Section */}
                        <SectionDropdown
                            open={sidebarOpen}
                            title="Transaksi"
                            isOpen={transaksiOpen}
                            toggle={() => setTransaksiOpen(!transaksiOpen)}
                        >
                            <SidebarItem
                                open={sidebarOpen}
                                icon={<Package />} 
                                text="Serah Terima Barang"
                                href={route('serah-terima.index')}
                                active={route().current('serah-terima.*')}
                                isSubmenu
                            />
                        </SectionDropdown>

                    </ul>
                </nav>
            </aside>

            {/* Konten utama - dengan margin kiri sesuai lebar sidebar */}
            <div 
                className={`${
                    sidebarOpen ? 'ml-64' : 'ml-20'
                } min-h-screen flex flex-col transition-all duration-300`}
            >
                {/* Navbar atas */}
                <nav className="bg-white border-b border-gray-200 shadow-sm px-4 flex justify-between items-center h-16 sticky top-0 z-30">
                    {/* Tombol toggle sidebar */}
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="text-cyan-700 hover:text-cyan-800 focus:outline-none transition-colors"
                    >
                        <svg
                            className="h-6 w-6"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M4 6h16M4 12h16M4 18h16"
                            />
                        </svg>
                    </button>

                    {/* User Dropdown */}
                    <Dropdown>
                        <Dropdown.Trigger>
                            <span className="inline-flex rounded-md">
                                <button
                                    type="button"
                                    className="inline-flex items-center bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:text-cyan-700 focus:outline-none transition-colors"
                                >
                                    <div className="h-8 w-8 rounded-full bg-cyan-100 flex items-center justify-center mr-2">
                                        <span className="text-cyan-700 font-semibold text-sm">
                                            {user.name.charAt(0).toUpperCase()}
                                        </span>
                                    </div>
                                    {user.name}
                                    <svg
                                        className="-me-0.5 ms-2 h-4 w-4"
                                        xmlns="http://www.w3.org/2000/svg"
                                        viewBox="0 0 20 20"
                                        fill="currentColor"
                                    >
                                        <path
                                            fillRule="evenodd"
                                            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </button>
                            </span>
                        </Dropdown.Trigger>

                        <Dropdown.Content align="right" width="48">
                            <Dropdown.Link href={route('profile.edit')}>
                                Profile
                            </Dropdown.Link>
                            <Dropdown.Link href={route('logout')} method="post" as="button">
                                Log Out
                            </Dropdown.Link>
                        </Dropdown.Content>
                    </Dropdown>
                </nav>

                {/* Header opsional */}
                {header && (
                    <header className="bg-white shadow">
                        <div className="max-w-7xl mx-auto px-4 py-6">{header}</div>
                    </header>
                )}

                {/* Konten halaman */}
                <main className="flex-1 p-6 overflow-x-auto">{children}</main>
            </div>
        </div>
    );
}

/* Komponen tambahan */

function SectionDropdown({ open, title, isOpen, toggle, children }) {
    return (
        <li className="relative mx-2">
            {/* Section Header - Clickable */}
            <button
                onClick={toggle}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-cyan-200 uppercase tracking-wider bg-cyan-700/30 hover:bg-cyan-700/50 transition-colors rounded-lg ${
                    !open ? 'justify-center' : ''
                }`}
            >
                {open && <span>{title}</span>}
                {open ? (
                    isOpen ? (
                        <ChevronDown className="h-4 w-4" />
                    ) : (
                        <ChevronRight className="h-4 w-4" />
                    )
                ) : (
                    <div className="h-1 w-8 bg-cyan-300 rounded"></div>
                )}
            </button>

            {/* Submenu Items */}
            {isOpen && (
                <ul className="space-y-0.5 mt-0.5 mx-0">
                    {children}
                </ul>
            )}
        </li>
    );
}

function SidebarItem({ open, icon, text, href, active = false, badge = null, isSubmenu = false }) {
    return (
        <li className={`relative ${isSubmenu ? '' : 'mx-2'} my-0.5`}>
            <NavLink
                href={href}
                active={active}
                className={`flex items-center gap-3 px-4 py-2.5 transition-all duration-200 no-underline relative group w-full focus:outline-none ${
                    active
                        ? 'bg-gradient-to-r from-lime-400 to-green-500 text-gray-900 rounded-lg shadow-lg font-semibold'
                        : 'text-white/80 hover:text-white hover:bg-white/10 rounded-lg'
                }`}
            >
                {/* Icon */}
                <span className={`h-5 w-5 flex-shrink-0 relative transition-all duration-200 ${
                    active ? 'text-gray-900' : 'text-white/80 group-hover:text-white'
                }`}>
                    {icon}
                    {/* Badge untuk icon saat sidebar tertutup */}
                    {!open && badge && (
                        <span className="absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-cyan-800 shadow-lg animate-pulse">
                            {badge > 9 ? '9+' : badge}
                        </span>
                    )}
                </span>
                
                {open && (
                    <div className="flex items-center justify-between flex-1">
                        <span className={`text-[15px] whitespace-nowrap transition-all duration-200 ${
                            active ? 'font-bold text-gray-900' : 'font-medium'
                        }`}>
                            {text}
                        </span>
                        {/* Badge dengan animasi */}
                        {badge && (
                            <span className="ml-auto bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full min-w-[20px] text-center shadow-lg animate-pulse">
                                {badge > 99 ? '99+' : badge}
                            </span>
                        )}
                    </div>
                )}
            </NavLink>
        </li>
    );
}