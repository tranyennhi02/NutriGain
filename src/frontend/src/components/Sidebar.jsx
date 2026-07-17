import { useTranslation } from 'react-i18next';
import NutriGainLogo from "./NutriGainLogo";
import { BookOpen } from "lucide-react";

export default function Sidebar({
  userEmail,
  isOpen = false,
  activeSection = "overview",
  onClose,
  onNavigate,
  onLogout,
  maintainMode = false,
}) {
  const { t } = useTranslation();
  const initials = (userEmail || "NG").slice(0, 2).toUpperCase();

  const menuItems = [
    { id: "overview", labelKey: "sidebar.overview", path: "/dashboard", icon: DashboardIcon },
    { id: "meal-plan", labelKey: "sidebar.mealPlan", path: "/dashboard", icon: MealIcon },
    { id: "journal", labelKey: "sidebar.journal", path: "/dashboard", icon: JournalIcon },
    { id: "charts", labelKey: maintainMode ? "sidebar.chartsWeight" : "sidebar.charts", path: "/dashboard", icon: ChartIcon },
    { id: "thanh-tich", labelKey: "sidebar.achievements", path: "/thanh-tich", icon: HealthEducationSidebarItem },
    { id: "health-education", labelKey: "sidebar.healthEducation", path: "/health-education", icon: HealthEducationSidebarItem },
    { id: "notifications", labelKey: "sidebar.notifications", path: "/dashboard", icon: BellIcon },
    { id: "account", labelKey: "sidebar.account", path: "/dashboard", icon: UserIcon },
    { id: "help", labelKey: "sidebar.help", path: "/dashboard", icon: HelpIcon },
  ];

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-brand-border bg-brand-mint shadow-2xl shadow-brand-navy/10 backdrop-blur-2xl transition-transform duration-300 lg:translate-x-0 ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      }`}
    >
      <div className="flex items-center justify-between px-5 pb-4 pt-5">
        <button
          type="button"
          onClick={() => onNavigate?.("overview", "/dashboard")}
          aria-label={t('sidebar.goToOverview')}
          className="rounded-xl transition hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-primary/40"
        >
          <NutriGainLogo size="sm" />
        </button>
        <button
          className="grid h-10 w-10 place-items-center rounded-xl bg-white text-brand-text-sub shadow-sm lg:hidden"
          onClick={onClose}
          aria-label={t('sidebar.closeMenu')}
        >
          <CloseIcon />
        </button>
      </div>

      <nav className="sidebar-scroll flex-1 px-3 pb-5">
        <div className="mb-3 px-4 text-xs font900 uppercase tracking-[0.18em] text-brand-text-sub">
          {t('sidebar.workspace')}
        </div>
        <div className="space-y-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                type="button"
                className={`group flex w-full items-center gap-3 rounded-2xl px-3 py-3 text-left text-sm font900 transition ${
                  isActive
                    ? "bg-brand-navy text-white shadow-xl shadow-brand-navy/20"
                    : "text-brand-text-sub hover:bg-white hover:text-brand-navy hover:shadow-sm"
                }`}
                onClick={() => onNavigate?.(item.id, item.path)}
              >
                <span
                  className={`grid h-9 w-9 place-items-center rounded-xl transition ${
                    isActive ? "bg-brand-primary text-white" : "bg-white text-brand-primary shadow-sm"
                  }`}
                >
                  <Icon />
                </span>
                <span className="min-w-0 flex-1 truncate">{t(item.labelKey)}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <div className="m-4 rounded-3xl border border-white/80 bg-brand-surface p-4 shadow-xl shadow-brand-navy/8">
        <div className="flex items-center gap-3">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-gradient-to-br from-brand-primary to-brand-primary-dark text-sm font-black text-white shadow-lg shadow-brand-navy/20">
            {initials}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font900 text-brand-text-main">{userEmail || "user@nutrigain.vn"}</p>
          </div>
        </div>
        <button
          type="button"
          className="mt-4 flex h-11 w-full items-center justify-center gap-2 rounded-2xl bg-brand-primary px-4 text-sm font900 text-white transition hover:bg-brand-primary-dark"
          onClick={onLogout}
        >
          <LogoutIcon />
          {t('sidebar.logout')}
        </button>
      </div>
    </aside>
  );
}

function IconBase({ children }) {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {children}
    </svg>
  );
}

function DashboardIcon() {
  return <IconBase><path d="M4 13h7V4H4z" /><path d="M13 20h7V4h-7z" /><path d="M4 20h7v-5H4z" /></IconBase>;
}

function JournalIcon() {
  return <IconBase><path d="M7 4h10a2 2 0 0 1 2 2v14H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" /><path d="M9 8h6" /><path d="M9 12h5" /></IconBase>;
}

function ChartIcon() {
  return <IconBase><path d="M4 19V5" /><path d="M4 19h16" /><path d="M8 15l3-4 3 2 4-6" /></IconBase>;
}

function MealIcon() {
  return <IconBase><path d="M6 3v18" /><path d="M10 3v7a4 4 0 0 1-8 0V3" /><path d="M18 3v18" /><path d="M18 3c2 2 3 4 3 7s-1 5-3 7" /></IconBase>;
}

function HealthEducationSidebarItem() {
  return <BookOpen className="h-5 w-5" strokeWidth={2} />;
}

function UserIcon() {
  return <IconBase><path d="M20 21a8 8 0 0 0-16 0" /><path d="M12 13a5 5 0 1 0 0-10 5 5 0 0 0 0 10z" /></IconBase>;
}

function BellIcon() {
  return <IconBase><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 7h18s-3 0-3-7" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></IconBase>;
}

function HelpIcon() {
  return <IconBase><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z" /><path d="M9.1 9a3 3 0 1 1 5.8 1c-.8 1.1-2 1.5-2.4 2.8" /><path d="M12 17h.01" /></IconBase>;
}

function CloseIcon() {
  return <IconBase><path d="M18 6 6 18" /><path d="m6 6 12 12" /></IconBase>;
}

function LogoutIcon() {
  return <IconBase><path d="M10 17l5-5-5-5" /><path d="M15 12H3" /><path d="M21 3v18" /></IconBase>;
}
