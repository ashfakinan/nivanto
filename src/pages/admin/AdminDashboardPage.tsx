import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Briefcase,
  Check,
  Database,
  ExternalLink,
  FileText,
  Home,
  Inbox,
  LayoutTemplate,
  LogOut,
  Menu,
  Plus,
  Save,
  Trash2,
  X,
} from 'lucide-react';
import { NivantoLogoLockup } from '../../components/NivantoLogo';
import { useAuth } from '../../context/AuthContext';
import {
  DEFAULT_ABOUT_CONTENT,
  DEFAULT_HOME_CONTENT,
  NIVANTO_WINGS,
} from '../../data/seedData';
import {
  deleteInquiry,
  deletePortfolio,
  deleteService,
  deleteTemplate,
  saveAboutContent,
  saveHomeContent,
  seedAllDefaultData,
  subscribeAboutContent,
  subscribeAllPortfolio,
  subscribeAllServices,
  subscribeAllTemplates,
  subscribeHomeContent,
  subscribeInquiries,
  toggleInquiryRead,
  upsertPortfolio,
  upsertService,
  upsertTemplate,
} from '../../lib/firestoreService';
import {
  isSafeUrl,
  type AboutContent,
  type HomeContent,
  type InquiryItem,
  type PortfolioItem,
  type ServiceItem,
  type TemplateItem,
} from '../../types/nivanto';

type SectionId =
  | 'home'
  | 'about'
  | 'services'
  | 'portfolio'
  | 'templates'
  | 'inquiries';

export function AdminDashboardPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [activeSection, setActiveSection] = useState<SectionId>('home');
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [toast, setToast] = useState<{ type: 'ok' | 'err'; text: string } | null>(
    null
  );
  const [seeding, setSeeding] = useState(false);

  // Live Firestore states
  const [homeForm, setHomeForm] = useState<HomeContent>(DEFAULT_HOME_CONTENT);
  const [aboutForm, setAboutForm] = useState<AboutContent>(DEFAULT_ABOUT_CONTENT);
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioItem[]>([]);
  const [templates, setTemplates] = useState<TemplateItem[]>([]);
  const [inquiries, setInquiries] = useState<InquiryItem[]>([]);
  const [savingHome, setSavingHome] = useState(false);
  const [savingAbout, setSavingAbout] = useState(false);

  // Modal/drawer editor states
  const [editingService, setEditingService] = useState<
    (Omit<ServiceItem, 'id'> & { id?: string; featuresText: string }) | null
  >(null);
  const [editingPortfolio, setEditingPortfolio] = useState<
    (Omit<PortfolioItem, 'id'> & { id?: string }) | null
  >(null);
  const [editingTemplate, setEditingTemplate] = useState<
    (Omit<TemplateItem, 'id'> & { id?: string }) | null
  >(null);

  const showToast = (type: 'ok' | 'err', text: string) => {
    setToast({ type, text });
    window.setTimeout(() => {
      setToast((prev) => (prev?.text === text ? null : prev));
    }, 3500);
  };

  useEffect(() => {
    const u1 = subscribeHomeContent((d) => setHomeForm(d));
    const u2 = subscribeAboutContent((d) => setAboutForm(d));
    const u3 = subscribeAllServices((items) => setServices(items));
    const u4 = subscribeAllPortfolio((items) => setPortfolio(items));
    const u5 = subscribeAllTemplates((items) => setTemplates(items));
    const u6 = subscribeInquiries((items) => setInquiries(items));
    return () => {
      u1();
      u2();
      u3();
      u4();
      u5();
      u6();
    };
  }, []);

  const unreadCount = inquiries.filter((i) => !i.read).length;

  const handleSignOut = async () => {
    await logout();
    navigate('/inan1422008admin/login', { replace: true });
  };

  const handleSeedData = async () => {
    setSeeding(true);
    try {
      await seedAllDefaultData();
      showToast('ok', 'Default Nivanto brand content seeded to Firestore.');
    } catch {
      showToast('err', 'Failed to seed data. Check Firestore permissions.');
    } finally {
      setSeeding(false);
    }
  };

  const handleSaveHome = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingHome(true);
    try {
      await saveHomeContent(homeForm);
      showToast('ok', 'Home content updated live.');
    } catch {
      showToast('err', 'Could not save home content.');
    } finally {
      setSavingHome(false);
    }
  };

  const handleSaveAbout = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingAbout(true);
    try {
      await saveAboutContent(aboutForm);
      showToast('ok', 'About content updated live.');
    } catch {
      showToast('err', 'Could not save about content.');
    } finally {
      setSavingAbout(false);
    }
  };

  const handleSaveService = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingService) return;
    try {
      const features = editingService.featuresText
        .split('\n')
        .map((line) => line.trim())
        .filter(Boolean);
      await upsertService({
        id: editingService.id,
        title: editingService.title,
        description: editingService.description,
        price: editingService.price,
        currency: editingService.currency || '৳',
        features,
        wing: editingService.wing,
        featured: editingService.featured,
        order: Number(editingService.order) || 1,
        active: editingService.active,
      });
      setEditingService(null);
      showToast('ok', 'Service saved.');
    } catch {
      showToast('err', 'Failed to save service.');
    }
  };

  const handleSavePortfolio = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPortfolio) return;
    try {
      await upsertPortfolio(editingPortfolio);
      setEditingPortfolio(null);
      showToast('ok', 'Portfolio item saved.');
    } catch {
      showToast('err', 'Failed to save portfolio item.');
    }
  };

  const handleSaveTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTemplate) return;
    try {
      await upsertTemplate(editingTemplate);
      setEditingTemplate(null);
      showToast('ok', 'Template saved.');
    } catch {
      showToast('err', 'Failed to save template.');
    }
  };

  const navItems: {
    id: SectionId;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
    badge?: number;
  }[] = [
    { id: 'home', label: 'Home Content', icon: Home },
    { id: 'about', label: 'About Content', icon: FileText },
    { id: 'services', label: 'Services Manager', icon: Briefcase },
    { id: 'portfolio', label: 'Portfolio Manager', icon: ExternalLink },
    { id: 'templates', label: 'Templates Manager', icon: LayoutTemplate },
    { id: 'inquiries', label: 'Inquiries', icon: Inbox, badge: unreadCount },
  ];

  const formatDate = (ts: unknown): string => {
    if (!ts) return 'Just now';
    if (typeof ts === 'object' && ts !== null && 'toDate' in ts) {
      const d = (ts as { toDate: () => Date }).toDate();
      return d.toLocaleString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
    return String(ts);
  };

  return (
    <div className="min-h-screen bg-[#F8F6F2] text-[#1C2440] flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex w-[264px] shrink-0 bg-[#1C2440] text-white flex-col justify-between p-5 border-r border-white/10">
        <div className="space-y-8">
          <div className="px-2 pt-1">
            <NivantoLogoLockup variant="reversed" size="sm" />
            <p className="text-[11px] text-white/45 mt-2 truncate">
              {user?.email || 'Admin Console'}
            </p>
          </div>

          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeSection === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveSection(item.id)}
                  className={`w-full flex items-center justify-between gap-3 px-3.5 py-2.5 rounded-[12px] text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-[#2B5FAA] text-white'
                      : 'text-white/65 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className="inline-flex items-center gap-2.5 truncate">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <span className="px-2 py-0.5 rounded-full bg-[#E8900A] text-white text-[11px] font-bold tabular-nums">
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        <div className="space-y-2 pt-6 border-t border-white/10">
          <button
            type="button"
            disabled={seeding}
            onClick={handleSeedData}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-[12px] text-xs font-semibold text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <Database className="w-4 h-4 text-[#E8900A]" />
            {seeding ? 'Seeding...' : 'Seed Default Content'}
          </button>
          <Link
            to="/"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-[12px] text-xs font-semibold text-white/75 hover:text-white hover:bg-white/10 transition-colors"
          >
            <ExternalLink className="w-4 h-4" />
            View Live Website
          </Link>
          <button
            type="button"
            onClick={handleSignOut}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-[12px] text-xs font-semibold text-white/65 hover:text-[#DC2626] hover:bg-white/5 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Top Bar */}
        <header className="bg-white border-b border-[#E5E1D8] px-6 py-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open admin menu"
              className="lg:hidden p-2 rounded-[10px] border border-[#E5E1D8] text-[#1C2440]"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="font-display font-bold text-lg text-[#1C2440]">
                {navItems.find((n) => n.id === activeSection)?.label}
              </h1>
              <p className="text-xs text-[#6B7280]">
                Changes sync directly to the live customer website
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleSeedData}
              disabled={seeding}
              className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2 rounded-[10px] bg-[#F8F6F2] border border-[#E5E1D8] text-xs font-semibold text-[#1C2440]"
            >
              <Database className="w-3.5 h-3.5 text-[#E8900A]" />
              Seed
            </button>
            <button
              type="button"
              onClick={handleSignOut}
              className="lg:hidden inline-flex items-center gap-1.5 px-3 py-2 rounded-[10px] bg-[#1C2440] text-white text-xs font-semibold"
            >
              <LogOut className="w-3.5 h-3.5" />
              Out
            </button>
          </div>
        </header>

        {/* Mobile Drawer */}
        {mobileNavOpen && (
          <div className="fixed inset-0 z-50 lg:hidden bg-[#1C2440]/70 flex">
            <div className="w-72 bg-[#1C2440] text-white p-5 flex flex-col justify-between">
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <NivantoLogoLockup variant="reversed" size="sm" />
                  <button
                    type="button"
                    onClick={() => setMobileNavOpen(false)}
                    className="p-2 rounded-lg text-white/70 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
                <nav className="space-y-1">
                  {navItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setActiveSection(item.id);
                          setMobileNavOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-[12px] text-sm font-medium ${
                          activeSection === item.id
                            ? 'bg-[#2B5FAA] text-white'
                            : 'text-white/70'
                        }`}
                      >
                        <span className="inline-flex items-center gap-2.5">
                          <Icon className="w-4 h-4" />
                          {item.label}
                        </span>
                        {item.badge !== undefined && item.badge > 0 && (
                          <span className="px-2 py-0.5 rounded-full bg-[#E8900A] text-white text-[11px] font-bold">
                            {item.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>
            </div>
            <div className="flex-1" onClick={() => setMobileNavOpen(false)} />
          </div>
        )}

        {/* Toast Notification */}
        {toast && (
          <div className="px-6 pt-4">
            <div
              role="status"
              className={`rounded-[14px] px-4 py-3 text-sm font-medium border ${
                toast.type === 'ok'
                  ? 'bg-[#16A34A]/10 border-[#16A34A]/25 text-[#16A34A]'
                  : 'bg-[#DC2626]/10 border-[#DC2626]/25 text-[#DC2626]'
              }`}
            >
              {toast.text}
            </div>
          </div>
        )}

        {/* Content Viewport */}
        <div className="flex-1 p-6 max-w-5xl w-full">
          {/* 1. HOME CONTENT */}
          {activeSection === 'home' && (
            <form
              onSubmit={handleSaveHome}
              className="rounded-[22px] bg-white border border-[#E5E1D8] p-7 space-y-5"
            >
              <div>
                <label className="block text-xs font-semibold text-[#1C2440] mb-1.5">
                  Hero Headline
                </label>
                <input
                  type="text"
                  required
                  maxLength={160}
                  value={homeForm.hero_headline}
                  onChange={(e) =>
                    setHomeForm({ ...homeForm, hero_headline: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-[12px] bg-[#F8F6F2] border border-[#E5E1D8] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C2440] mb-1.5">
                  Hero Subtext / Tagline
                </label>
                <textarea
                  rows={2}
                  required
                  maxLength={320}
                  value={homeForm.hero_subtext}
                  onChange={(e) =>
                    setHomeForm({ ...homeForm, hero_subtext: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-[12px] bg-[#F8F6F2] border border-[#E5E1D8] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C2440] mb-1.5">
                  Intro Paragraph
                </label>
                <textarea
                  rows={4}
                  required
                  maxLength={800}
                  value={homeForm.intro_paragraph}
                  onChange={(e) =>
                    setHomeForm({ ...homeForm, intro_paragraph: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-[12px] bg-[#F8F6F2] border border-[#E5E1D8] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C2440] mb-1.5">
                  CTA Heading Text
                </label>
                <input
                  type="text"
                  required
                  maxLength={200}
                  value={homeForm.cta_text}
                  onChange={(e) =>
                    setHomeForm({ ...homeForm, cta_text: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-[12px] bg-[#F8F6F2] border border-[#E5E1D8] text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={savingHome}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-[14px] bg-[#2B5FAA] text-white text-sm font-semibold hover:opacity-95 disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                {savingHome ? 'Saving...' : 'Save Home Content'}
              </button>
            </form>
          )}

          {/* 2. ABOUT CONTENT */}
          {activeSection === 'about' && (
            <form
              onSubmit={handleSaveAbout}
              className="rounded-[22px] bg-white border border-[#E5E1D8] p-7 space-y-5"
            >
              <div>
                <label className="block text-xs font-semibold text-[#1C2440] mb-1.5">
                  Who We Are
                </label>
                <textarea
                  rows={4}
                  required
                  maxLength={2000}
                  value={aboutForm.who_we_are}
                  onChange={(e) =>
                    setAboutForm({ ...aboutForm, who_we_are: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-[12px] bg-[#F8F6F2] border border-[#E5E1D8] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C2440] mb-1.5">
                  Our Vision
                </label>
                <textarea
                  rows={4}
                  required
                  maxLength={2000}
                  value={aboutForm.vision}
                  onChange={(e) =>
                    setAboutForm({ ...aboutForm, vision: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-[12px] bg-[#F8F6F2] border border-[#E5E1D8] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#1C2440] mb-1.5">
                  Our Wings Summary
                </label>
                <textarea
                  rows={4}
                  required
                  maxLength={2000}
                  value={aboutForm.wings_summary}
                  onChange={(e) =>
                    setAboutForm({ ...aboutForm, wings_summary: e.target.value })
                  }
                  className="w-full px-4 py-3 rounded-[12px] bg-[#F8F6F2] border border-[#E5E1D8] text-sm"
                />
              </div>

              <button
                type="submit"
                disabled={savingAbout}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-[14px] bg-[#2B5FAA] text-white text-sm font-semibold hover:opacity-95 disabled:opacity-60"
              >
                <Save className="w-4 h-4" />
                {savingAbout ? 'Saving...' : 'Save About Content'}
              </button>
            </form>
          )}

          {/* 3. SERVICES MANAGER */}
          {activeSection === 'services' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#6B7280] tabular-nums">
                  {services.length} services in Firestore
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setEditingService({
                      title: '',
                      description: '',
                      price: '',
                      currency: '৳',
                      features: [],
                      featuresText: '',
                      wing: 'Nivanto Core',
                      featured: false,
                      order: services.length + 1,
                      active: true,
                    })
                  }
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[14px] bg-[#E8900A] text-white text-sm font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  Add New Service
                </button>
              </div>

              {services.length === 0 ? (
                <div className="rounded-[22px] bg-white border border-[#E5E1D8] p-10 text-center space-y-3">
                  <p className="font-display font-bold text-lg">
                    No services in Firestore yet
                  </p>
                  <p className="text-sm text-[#6B7280]">
                    Click &ldquo;Seed Default Content&rdquo; in the sidebar or add your first service above.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {services.map((svc) => (
                    <div
                      key={svc.id}
                      className="rounded-[18px] bg-white border border-[#E5E1D8] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#6B7280]">
                          <span className="font-mono font-semibold text-[#1C2440] tabular-nums">
                            #{svc.order}
                          </span>
                          <span>·</span>
                          <span className="font-semibold text-[#2B5FAA]">{svc.wing}</span>
                          <span>·</span>
                          <span className={svc.active ? 'text-[#16A34A]' : 'text-[#DC2626]'}>
                            {svc.active ? 'Active' : 'Inactive'}
                          </span>
                          {svc.featured && (
                            <>
                              <span>·</span>
                              <span className="text-[#E8900A] font-semibold">Featured</span>
                            </>
                          )}
                        </div>
                        <h3 className="font-display font-bold text-base text-[#1C2440]">
                          {svc.title} —{' '}
                          <span className="tabular-nums">
                            {svc.currency}
                            {svc.price}
                          </span>
                        </h3>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={async () => {
                            await upsertService({ ...svc, active: !svc.active });
                            showToast(
                              'ok',
                              `${svc.title} marked ${!svc.active ? 'active' : 'inactive'}.`
                            );
                          }}
                          className="px-3 py-2 rounded-[10px] border border-[#E5E1D8] text-xs font-semibold hover:border-[#2B5FAA]"
                        >
                          {svc.active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            setEditingService({
                              ...svc,
                              featuresText: (svc.features || []).join('\n'),
                            })
                          }
                          className="px-3 py-2 rounded-[10px] bg-[#F8F6F2] border border-[#E5E1D8] text-xs font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            await deleteService(svc.id);
                            showToast('ok', 'Service deleted.');
                          }}
                          aria-label={`Delete ${svc.title}`}
                          className="p-2 rounded-[10px] border border-[#E5E1D8] text-[#DC2626] hover:bg-[#DC2626]/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 4. PORTFOLIO MANAGER */}
          {activeSection === 'portfolio' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#6B7280] tabular-nums">
                  {portfolio.length} portfolio projects
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setEditingPortfolio({
                      title: '',
                      description: '',
                      category: 'Clothing & Retail',
                      image_url: '',
                      live_url: '',
                      featured: true,
                      order: portfolio.length + 1,
                      active: true,
                    })
                  }
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[14px] bg-[#E8900A] text-white text-sm font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  Add New Project
                </button>
              </div>

              {portfolio.length === 0 ? (
                <div className="rounded-[22px] bg-white border border-[#E5E1D8] p-10 text-center space-y-3">
                  <p className="font-display font-bold text-lg">
                    No portfolio items yet
                  </p>
                  <p className="text-sm text-[#6B7280]">
                    Add any live website URL and fallback thumbnail to render live previews.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {portfolio.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-[18px] bg-white border border-[#E5E1D8] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#6B7280]">
                          <span className="font-mono font-semibold text-[#1C2440] tabular-nums">
                            #{item.order}
                          </span>
                          <span>·</span>
                          <span className="font-semibold text-[#2B5FAA]">{item.category}</span>
                          <span>·</span>
                          <span className={item.active ? 'text-[#16A34A]' : 'text-[#DC2626]'}>
                            {item.active ? 'Active' : 'Inactive'}
                          </span>
                          {item.featured && (
                            <>
                              <span>·</span>
                              <span className="text-[#E8900A] font-semibold">Featured</span>
                            </>
                          )}
                        </div>
                        <h3 className="font-display font-bold text-base text-[#1C2440] truncate">
                          {item.title}
                        </h3>
                        <p className="text-xs text-[#6B7280] truncate">{item.live_url}</p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        {isSafeUrl(item.live_url) && (
                          <a
                            href={item.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-2 rounded-[10px] border border-[#E5E1D8] text-xs font-semibold text-[#2B5FAA] hover:bg-[#2B5FAA]/5"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Test Preview
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={async () => {
                            await upsertPortfolio({ ...item, active: !item.active });
                          }}
                          className="px-3 py-2 rounded-[10px] border border-[#E5E1D8] text-xs font-semibold"
                        >
                          {item.active ? 'Hide' : 'Show'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingPortfolio(item)}
                          className="px-3 py-2 rounded-[10px] bg-[#F8F6F2] border border-[#E5E1D8] text-xs font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            await deletePortfolio(item.id);
                            showToast('ok', 'Portfolio project deleted.');
                          }}
                          aria-label={`Delete ${item.title}`}
                          className="p-2 rounded-[10px] border border-[#E5E1D8] text-[#DC2626] hover:bg-[#DC2626]/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 5. TEMPLATES MANAGER */}
          {activeSection === 'templates' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <p className="text-sm text-[#6B7280] tabular-nums">
                  {templates.length} readymade templates
                </p>
                <button
                  type="button"
                  onClick={() =>
                    setEditingTemplate({
                      title: '',
                      description: '',
                      image_url: '',
                      live_url: '',
                      price: '5,000',
                      currency: '৳',
                      whatsapp_number: '+8801720266825',
                      active: true,
                      order: templates.length + 1,
                    })
                  }
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[14px] bg-[#E8900A] text-white text-sm font-semibold"
                >
                  <Plus className="w-4 h-4" />
                  Add New Template
                </button>
              </div>

              {templates.length === 0 ? (
                <div className="rounded-[22px] bg-white border border-[#E5E1D8] p-10 text-center space-y-3">
                  <p className="font-display font-bold text-lg">
                    No templates yet
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {templates.map((tpl) => (
                    <div
                      key={tpl.id}
                      className="rounded-[18px] bg-white border border-[#E5E1D8] p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                    >
                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#6B7280]">
                          <span className="font-mono font-semibold text-[#1C2440] tabular-nums">
                            #{tpl.order}
                          </span>
                          <span>·</span>
                          <span className="font-semibold text-[#2B5FAA] tabular-nums">
                            {tpl.currency}
                            {tpl.price}
                          </span>
                          <span>·</span>
                          <span className={tpl.active ? 'text-[#16A34A]' : 'text-[#DC2626]'}>
                            {tpl.active ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                        <h3 className="font-display font-bold text-base text-[#1C2440] truncate">
                          {tpl.title}
                        </h3>
                        <p className="text-xs text-[#6B7280] truncate">
                          WhatsApp: {tpl.whatsapp_number}
                        </p>
                      </div>

                      <div className="flex flex-wrap items-center gap-2 shrink-0">
                        {isSafeUrl(tpl.live_url) && (
                          <a
                            href={tpl.live_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 px-3 py-2 rounded-[10px] border border-[#E5E1D8] text-xs font-semibold text-[#2B5FAA] hover:bg-[#2B5FAA]/5"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                            Test Preview
                          </a>
                        )}
                        <button
                          type="button"
                          onClick={async () => {
                            await upsertTemplate({ ...tpl, active: !tpl.active });
                          }}
                          className="px-3 py-2 rounded-[10px] border border-[#E5E1D8] text-xs font-semibold"
                        >
                          {tpl.active ? 'Deactivate' : 'Activate'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingTemplate(tpl)}
                          className="px-3 py-2 rounded-[10px] bg-[#F8F6F2] border border-[#E5E1D8] text-xs font-semibold"
                        >
                          Edit
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            await deleteTemplate(tpl.id);
                            showToast('ok', 'Template deleted.');
                          }}
                          aria-label={`Delete ${tpl.title}`}
                          className="p-2 rounded-[10px] border border-[#E5E1D8] text-[#DC2626] hover:bg-[#DC2626]/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* 6. INQUIRIES */}
          {activeSection === 'inquiries' && (
            <div className="space-y-4">
              {inquiries.length === 0 ? (
                <div className="rounded-[22px] bg-white border border-[#E5E1D8] p-12 text-center space-y-2">
                  <p className="font-display font-bold text-lg text-[#1C2440]">
                    No customer inquiries yet
                  </p>
                  <p className="text-sm text-[#6B7280]">
                    Submissions from the Contact page will appear here in real time.
                  </p>
                </div>
              ) : (
                inquiries.map((inq) => (
                  <div
                    key={inq.id}
                    className={`rounded-[20px] border p-6 space-y-3 ${
                      inq.read
                        ? 'bg-white border-[#E5E1D8]'
                        : 'bg-white border-[#2B5FAA]/50'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2 text-xs text-[#6B7280]">
                          <span
                            className={`font-semibold ${
                              inq.read ? 'text-[#6B7280]' : 'text-[#E8900A]'
                            }`}
                          >
                            {inq.read ? 'Read' : 'Unread'}
                          </span>
                          <span>·</span>
                          <span className="tabular-nums">{formatDate(inq.timestamp)}</span>
                          <span>·</span>
                          <span className="text-[#2B5FAA] font-semibold">{inq.service}</span>
                        </div>
                        <h3 className="font-display font-bold text-lg text-[#1C2440]">
                          {inq.name}
                          {inq.business_name ? ` — ${inq.business_name}` : ''}
                        </h3>
                        <p className="text-sm font-medium text-[#2B5FAA] tabular-nums">
                          {inq.phone}
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <button
                          type="button"
                          onClick={async () => {
                            await toggleInquiryRead(inq.id, !inq.read);
                          }}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] bg-[#F8F6F2] border border-[#E5E1D8] text-xs font-semibold text-[#1C2440] hover:border-[#2B5FAA]"
                        >
                          <Check className="w-3.5 h-3.5" />
                          {inq.read ? 'Mark Unread' : 'Mark Read'}
                        </button>
                        <button
                          type="button"
                          onClick={async () => {
                            await deleteInquiry(inq.id);
                            showToast('ok', 'Inquiry deleted.');
                          }}
                          aria-label={`Delete inquiry from ${inq.name}`}
                          className="p-2 rounded-[10px] border border-[#E5E1D8] text-[#DC2626] hover:bg-[#DC2626]/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <p className="text-sm text-[#1C2440] bg-[#F8F6F2] rounded-[12px] p-4 leading-relaxed whitespace-pre-line">
                      {inq.message}
                    </p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>

      {/* SERVICE EDITOR MODAL */}
      {editingService && (
        <div className="fixed inset-0 z-50 bg-[#1C2440]/70 flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={handleSaveService}
            className="w-full max-w-lg rounded-[22px] bg-white p-7 space-y-4 shadow-2xl my-8"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-xl">
                {editingService.id ? 'Edit Service' : 'Add New Service'}
              </h2>
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="p-1.5 rounded-lg hover:bg-[#F8F6F2]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Title *</label>
                <input
                  type="text"
                  required
                  value={editingService.title}
                  onChange={(e) =>
                    setEditingService({ ...editingService, title: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-[10px] bg-[#F8F6F2] border border-[#E5E1D8] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Wing *</label>
                <select
                  value={editingService.wing}
                  onChange={(e) =>
                    setEditingService({ ...editingService, wing: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-[10px] bg-[#F8F6F2] border border-[#E5E1D8] text-sm"
                >
                  {NIVANTO_WINGS.map((w) => (
                    <option key={w.code} value={w.subBrand}>
                      {w.subBrand}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Currency</label>
                <input
                  type="text"
                  required
                  value={editingService.currency}
                  onChange={(e) =>
                    setEditingService({ ...editingService, currency: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-[10px] bg-[#F8F6F2] border border-[#E5E1D8] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Price *</label>
                <input
                  type="text"
                  required
                  value={editingService.price}
                  onChange={(e) =>
                    setEditingService({ ...editingService, price: e.target.value })
                  }
                  placeholder="5,000"
                  className="w-full px-3.5 py-2.5 rounded-[10px] bg-[#F8F6F2] border border-[#E5E1D8] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Order</label>
                <input
                  type="number"
                  required
                  value={editingService.order}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      order: Number(e.target.value),
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-[10px] bg-[#F8F6F2] border border-[#E5E1D8] text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Description *</label>
              <textarea
                rows={3}
                required
                value={editingService.description}
                onChange={(e) =>
                  setEditingService({
                    ...editingService,
                    description: e.target.value,
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-[10px] bg-[#F8F6F2] border border-[#E5E1D8] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">
                Features (one per line)
              </label>
              <textarea
                rows={4}
                value={editingService.featuresText}
                onChange={(e) =>
                  setEditingService({
                    ...editingService,
                    featuresText: e.target.value,
                  })
                }
                placeholder="Full source code included&#10;30-day warranty"
                className="w-full px-3.5 py-2.5 rounded-[10px] bg-[#F8F6F2] border border-[#E5E1D8] text-sm"
              />
            </div>

            <div className="flex items-center gap-6 text-sm">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingService.active}
                  onChange={(e) =>
                    setEditingService({ ...editingService, active: e.target.checked })
                  }
                />
                Active
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingService.featured}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      featured: e.target.checked,
                    })
                  }
                />
                Featured on Home
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditingService(null)}
                className="px-4 py-2.5 rounded-[12px] border border-[#E5E1D8] text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-[12px] bg-[#2B5FAA] text-white text-sm font-semibold"
              >
                Save Service
              </button>
            </div>
          </form>
        </div>
      )}

      {/* PORTFOLIO EDITOR MODAL */}
      {editingPortfolio && (
        <div className="fixed inset-0 z-50 bg-[#1C2440]/70 flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={handleSavePortfolio}
            className="w-full max-w-lg rounded-[22px] bg-white p-7 space-y-4 shadow-2xl my-8"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-xl">
                {editingPortfolio.id ? 'Edit Portfolio Project' : 'Add Portfolio Project'}
              </h2>
              <button
                type="button"
                onClick={() => setEditingPortfolio(null)}
                className="p-1.5 rounded-lg hover:bg-[#F8F6F2]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Project Title *</label>
                <input
                  type="text"
                  required
                  value={editingPortfolio.title}
                  onChange={(e) =>
                    setEditingPortfolio({
                      ...editingPortfolio,
                      title: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-[10px] bg-[#F8F6F2] border border-[#E5E1D8] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Category *</label>
                <input
                  type="text"
                  required
                  value={editingPortfolio.category}
                  onChange={(e) =>
                    setEditingPortfolio({
                      ...editingPortfolio,
                      category: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-[10px] bg-[#F8F6F2] border border-[#E5E1D8] text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">
                Live Site URL (for iframe preview) *
              </label>
              <input
                type="text"
                required
                value={editingPortfolio.live_url}
                onChange={(e) =>
                  setEditingPortfolio({
                    ...editingPortfolio,
                    live_url: e.target.value,
                  })
                }
                placeholder="https://example.vercel.app or /demo/vastra-dhaka"
                className="w-full px-3.5 py-2.5 rounded-[10px] bg-[#F8F6F2] border border-[#E5E1D8] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">
                Fallback Thumbnail URL *
              </label>
              <input
                type="text"
                required
                value={editingPortfolio.image_url}
                onChange={(e) =>
                  setEditingPortfolio({
                    ...editingPortfolio,
                    image_url: e.target.value,
                  })
                }
                placeholder="https://... or data:image/svg+xml..."
                className="w-full px-3.5 py-2.5 rounded-[10px] bg-[#F8F6F2] border border-[#E5E1D8] text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold mb-1">Description *</label>
                <textarea
                  rows={3}
                  required
                  value={editingPortfolio.description}
                  onChange={(e) =>
                    setEditingPortfolio({
                      ...editingPortfolio,
                      description: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-[10px] bg-[#F8F6F2] border border-[#E5E1D8] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Order</label>
                <input
                  type="number"
                  required
                  value={editingPortfolio.order}
                  onChange={(e) =>
                    setEditingPortfolio({
                      ...editingPortfolio,
                      order: Number(e.target.value),
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-[10px] bg-[#F8F6F2] border border-[#E5E1D8] text-sm"
                />
              </div>
            </div>

            <div className="flex items-center gap-6 text-sm">
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingPortfolio.active}
                  onChange={(e) =>
                    setEditingPortfolio({
                      ...editingPortfolio,
                      active: e.target.checked,
                    })
                  }
                />
                Active
              </label>
              <label className="inline-flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={editingPortfolio.featured}
                  onChange={(e) =>
                    setEditingPortfolio({
                      ...editingPortfolio,
                      featured: e.target.checked,
                    })
                  }
                />
                Featured on Home
              </label>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditingPortfolio(null)}
                className="px-4 py-2.5 rounded-[12px] border border-[#E5E1D8] text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-[12px] bg-[#2B5FAA] text-white text-sm font-semibold"
              >
                Save Project
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TEMPLATE EDITOR MODAL */}
      {editingTemplate && (
        <div className="fixed inset-0 z-50 bg-[#1C2440]/70 flex items-center justify-center p-4 overflow-y-auto">
          <form
            onSubmit={handleSaveTemplate}
            className="w-full max-w-lg rounded-[22px] bg-white p-7 space-y-4 shadow-2xl my-8"
          >
            <div className="flex items-center justify-between">
              <h2 className="font-display font-bold text-xl">
                {editingTemplate.id ? 'Edit Template' : 'Add Readymade Template'}
              </h2>
              <button
                type="button"
                onClick={() => setEditingTemplate(null)}
                className="p-1.5 rounded-lg hover:bg-[#F8F6F2]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1">Template Title *</label>
                <input
                  type="text"
                  required
                  value={editingTemplate.title}
                  onChange={(e) =>
                    setEditingTemplate({ ...editingTemplate, title: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-[10px] bg-[#F8F6F2] border border-[#E5E1D8] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">WhatsApp Number *</label>
                <input
                  type="text"
                  required
                  value={editingTemplate.whatsapp_number}
                  onChange={(e) =>
                    setEditingTemplate({
                      ...editingTemplate,
                      whatsapp_number: e.target.value,
                    })
                  }
                  placeholder="+8801720266825"
                  className="w-full px-3.5 py-2.5 rounded-[10px] bg-[#F8F6F2] border border-[#E5E1D8] text-sm"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="block text-xs font-semibold mb-1">Currency</label>
                <input
                  type="text"
                  required
                  value={editingTemplate.currency}
                  onChange={(e) =>
                    setEditingTemplate({
                      ...editingTemplate,
                      currency: e.target.value,
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-[10px] bg-[#F8F6F2] border border-[#E5E1D8] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Price *</label>
                <input
                  type="text"
                  required
                  value={editingTemplate.price}
                  onChange={(e) =>
                    setEditingTemplate({ ...editingTemplate, price: e.target.value })
                  }
                  className="w-full px-3.5 py-2.5 rounded-[10px] bg-[#F8F6F2] border border-[#E5E1D8] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1">Order</label>
                <input
                  type="number"
                  required
                  value={editingTemplate.order}
                  onChange={(e) =>
                    setEditingTemplate({
                      ...editingTemplate,
                      order: Number(e.target.value),
                    })
                  }
                  className="w-full px-3.5 py-2.5 rounded-[10px] bg-[#F8F6F2] border border-[#E5E1D8] text-sm"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">
                Live Preview URL *
              </label>
              <input
                type="text"
                required
                value={editingTemplate.live_url}
                onChange={(e) =>
                  setEditingTemplate({ ...editingTemplate, live_url: e.target.value })
                }
                placeholder="https://... or /demo/vastra-dhaka"
                className="w-full px-3.5 py-2.5 rounded-[10px] bg-[#F8F6F2] border border-[#E5E1D8] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">
                Preview Image URL *
              </label>
              <input
                type="text"
                required
                value={editingTemplate.image_url}
                onChange={(e) =>
                  setEditingTemplate({ ...editingTemplate, image_url: e.target.value })
                }
                className="w-full px-3.5 py-2.5 rounded-[10px] bg-[#F8F6F2] border border-[#E5E1D8] text-sm"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold mb-1">Description *</label>
              <textarea
                rows={3}
                required
                value={editingTemplate.description}
                onChange={(e) =>
                  setEditingTemplate({
                    ...editingTemplate,
                    description: e.target.value,
                  })
                }
                className="w-full px-3.5 py-2.5 rounded-[10px] bg-[#F8F6F2] border border-[#E5E1D8] text-sm"
              />
            </div>

            <label className="inline-flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="checkbox"
                checked={editingTemplate.active}
                onChange={(e) =>
                  setEditingTemplate({ ...editingTemplate, active: e.target.checked })
                }
              />
              Active (visible on Templates page)
            </label>

            <div className="flex justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setEditingTemplate(null)}
                className="px-4 py-2.5 rounded-[12px] border border-[#E5E1D8] text-sm font-semibold"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-[12px] bg-[#2B5FAA] text-white text-sm font-semibold"
              >
                Save Template
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
