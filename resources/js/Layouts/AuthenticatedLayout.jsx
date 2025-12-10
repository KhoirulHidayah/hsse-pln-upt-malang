import Dropdown from '@/Components/Dropdown';
import NavLink from '@/Components/NavLink';
import { Link, usePage, router } from '@inertiajs/react';
import { useState, useEffect } from 'react';
import {
    LayoutDashboard,
    HardHat,
    Shield,
    ClipboardCheck,
    MapPin,
    MapPinned,
    Bell,
    Package,
    ChevronDown,
    ChevronRight,
    X,
} from 'lucide-react';

export default function AuthenticatedLayout({ header, children }) {
    const user = usePage().props.auth.user;
    
    const [sidebarOpen, setSidebarOpen] = useState(() => {
        const saved = localStorage.getItem('sidebarOpen');
        return saved !== null ? JSON.parse(saved) : true;
    });

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

    const [notificationOpen, setNotificationOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [unreadCount, setUnreadCount] = useState(0);

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

    // Fetch notifications preview
    useEffect(() => {
        fetchNotifications();
        const interval = setInterval(fetchNotifications, 60000);
        return () => clearInterval(interval);
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await fetch(route('notifikasi.preview'));
            const data = await response.json();
            setNotifications(data.notifications);
            setUnreadCount(data.unread_count);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    const handleMarkAsRead = (id) => {
        router.post(route('notifikasi.markAsRead', id), {}, {
            preserveState: true,
            onSuccess: () => {
                fetchNotifications();
            }
        });
    };

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Sidebar */}
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
                        <SidebarItem
                            open={sidebarOpen}
                            icon={<LayoutDashboard />}
                            text="Dashboard"
                            href={route('dashboard')}
                            active={route().current('dashboard')}
                        />

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
                                badge={unreadCount > 0 ? unreadCount : null}
                                isSubmenu
                            />
                        </SectionDropdown>

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

            {/* Main Content */}
            <div 
                className={`${
                    sidebarOpen ? 'ml-64' : 'ml-20'
                } min-h-screen flex flex-col transition-all duration-300`}
            >
                {/* Navbar */}
                <nav className="bg-white border-b border-gray-200 shadow-sm px-4 flex justify-between items-center h-16 sticky top-0 z-30">
                    <button
                        onClick={() => setSidebarOpen(!sidebarOpen)}
                        className="text-cyan-700 hover:text-cyan-800 focus:outline-none transition-colors"
                    >
                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>

                    <div className="flex items-center gap-4">
                        {/* Notification Bell Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() => setNotificationOpen(!notificationOpen)}
                                className="relative p-2 text-gray-600 hover:text-cyan-700 hover:bg-cyan-50 rounded-lg transition-colors"
                            >
                                <Bell className="h-5 w-5" />
                                {unreadCount > 0 && (
                                    <span className="absolute top-1 right-1 h-4 w-4 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                                        {unreadCount > 9 ? '9+' : unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* Notification Dropdown */}
                            {notificationOpen && (
                                <>
                                    <div 
                                        className="fixed inset-0 z-40"
                                        onClick={() => setNotificationOpen(false)}
                                    />
                                    <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-[500px] overflow-hidden flex flex-col">
                                        {/* Header */}
                                        <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gradient-to-r from-cyan-50 to-teal-50">
                                            <div>
                                                <h3 className="font-semibold text-gray-900">Notifikasi APD</h3>
                                                <p className="text-xs text-gray-500">{unreadCount} belum dibaca</p>
                                            </div>
                                            <button
                                                onClick={() => setNotificationOpen(false)}
                                                className="text-gray-400 hover:text-gray-600"
                                            >
                                                <X className="h-5 w-5" />
                                            </button>
                                        </div>

                                        {/* Notifications List */}
                                        <div className="overflow-y-auto flex-1">
                                            {notifications.length === 0 ? (
                                                <div className="p-8 text-center">
                                                    <Bell className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                                                    <p className="text-gray-500 text-sm">Tidak ada notifikasi</p>
                                                </div>
                                            ) : (
                                                notifications.map((notif) => (
                                                    <div
                                                        key={notif.monitoring_id}
                                                        onClick={() => {
                                                            if (!notif.is_read) {
                                                                handleMarkAsRead(notif.monitoring_id);
                                                            }
                                                            router.visit(route('notifikasi.show', notif.monitoring_id));
                                                            setNotificationOpen(false);
                                                        }}
                                                        className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors ${
                                                            !notif.is_read ? 'bg-cyan-50/50' : ''
                                                        }`}
                                                    >
                                                        <div className="flex gap-3">
                                                            <div className={`flex-shrink-0 w-10 h-10 rounded-lg flex items-center justify-center ${
                                                                notif.badge_color === 'red' ? 'bg-red-100' : 'bg-yellow-100'
                                                            }`}>
                                                                <Bell className={`h-5 w-5 ${
                                                                    notif.badge_color === 'red' ? 'text-red-600' : 'text-yellow-600'
                                                                }`} />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-start justify-between gap-2">
                                                                    <h4 className="text-sm font-semibold text-gray-900 truncate">
                                                                        {notif.apd_nama}
                                                                    </h4>
                                                                    {!notif.is_read && (
                                                                        <span className="flex-shrink-0 w-2 h-2 bg-cyan-600 rounded-full"></span>
                                                                    )}
                                                                </div>
                                                                <p className="text-xs text-gray-600 mt-1">
                                                                    {notif.status_text}
                                                                </p>
                                                                <p className="text-xs text-gray-400 mt-1">
                                                                    {notif.created_at}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>

                                        {/* Footer */}
                                        {notifications.length > 0 && (
                                            <div className="p-3 border-t border-gray-200 bg-gray-50">
                                                <Link
                                                    href={route('notifikasi.index')}
                                                    onClick={() => setNotificationOpen(false)}
                                                    className="block text-center text-sm font-medium text-cyan-600 hover:text-cyan-700"
                                                >
                                                    Lihat Semua Notifikasi
                                                </Link>
                                            </div>
                                        )}
                                    </div>
                                </>
                            )}
                        </div>

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
                                        <svg className="-me-0.5 ms-2 h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </span>
                            </Dropdown.Trigger>
                            <Dropdown.Content align="right" width="48">
                                <Dropdown.Link href={route('profile.edit')}>Profile</Dropdown.Link>
                                <Dropdown.Link href={route('logout')} method="post" as="button">Log Out</Dropdown.Link>
                            </Dropdown.Content>
                        </Dropdown>
                    </div>
                </nav>

                {header && (
                    <header className="bg-white shadow">
                        <div className="max-w-7xl mx-auto px-4 py-6">{header}</div>
                    </header>
                )}

                <main className="flex-1 p-6 overflow-x-auto">{children}</main>
            </div>
        </div>
    );
}

function SectionDropdown({ open, title, isOpen, toggle, children }) {
    return (
        <li className="relative mx-2">
            <button
                onClick={toggle}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-semibold text-cyan-200 uppercase tracking-wider bg-cyan-700/30 hover:bg-cyan-700/50 transition-colors rounded-lg ${
                    !open ? 'justify-center' : ''
                }`}
            >
                {open && <span>{title}</span>}
                {open ? (
                    isOpen ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
                ) : (
                    <div className="h-1 w-8 bg-cyan-300 rounded"></div>
                )}
            </button>
            {isOpen && <ul className="space-y-0.5 mt-0.5 mx-0">{children}</ul>}
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
                <span className={`h-5 w-5 flex-shrink-0 relative transition-all duration-200 ${
                    active ? 'text-gray-900' : 'text-white/80 group-hover:text-white'
                }`}>
                    {icon}
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