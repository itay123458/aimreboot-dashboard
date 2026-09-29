'use client';
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from 'react';
import {
  ArrowDown,
  ArrowUp,
  Search,
  X,
  Play,
  ArrowRight,
  Check,
  CheckCircle2,
  ChevronRight,
  CircleHelp,
  Command,
  Copy,
  Globe2,
  Hammer,
  Layers3,
  LayoutDashboard,
  LockKeyhole,
  MessageSquare,
  Music2,
  Pause,
  ShieldCheck,
  Sparkles,
  Terminal,
  TrendingUp,
  Users,
  Wrench,
  Zap,
} from 'lucide-react';
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
const features = [
  {
    name: 'Moderation',
    icon: ShieldCheck,
    detail: 'A little more order. A lot less effort.',
    description:
      'Tools to help your team manage a safer, more welcoming server.',
    items: [
      'Warnings and moderation cases',
      'Timeouts, bans, and message cleanup',
      'Member notes and server logs',
    ],
    color: 'violet',
  },
  {
    name: 'Community',
    icon: Users,
    detail: 'Give your members a place to belong.',
    description: 'Bring everyday community interactions together in one bot.',
    items: [
      'Support tickets and applications',
      'Giveaways and birthday celebrations',
      'Verification and community tools',
    ],
    color: 'blue',
  },
  {
    name: 'Levels & economy',
    icon: TrendingUp,
    detail: 'Make participation feel rewarding.',
    description:
      'Recognize your members and add a playful economy to your server.',
    items: [
      'Member XP and level roles',
      'Ranks and leaderboards',
      'Balances, rewards, and a server shop',
    ],
    color: 'gold',
  },
  {
    name: 'Music',
    icon: Music2,
    detail: 'The right soundtrack for your server.',
    description:
      'Music controls for your community’s shared listening sessions.',
    items: [
      'Track search and playback',
      'Queues and playback controls',
      'Voice-channel listening',
    ],
    color: 'pink',
  },
  {
    name: 'Server tools',
    icon: Wrench,
    detail: 'The practical things, taken care of.',
    description: 'Useful tools for day-to-day server life, all in one place.',
    items: [
      'Polls and countdowns',
      'Server counters and information',
      'Time, search, and utility commands',
    ],
    color: 'teal',
  },
  {
    name: 'Welcome & roles',
    icon: MessageSquare,
    detail: 'Make a great first impression.',
    description:
      'Help new members settle in and find their place in your community.',
    items: [
      'Welcome and goodbye messages',
      'Automatic roles and reaction roles',
      'Member verification',
    ],
    color: 'orange',
  },
] as const;
function Mark({ small = false }: { small?: boolean }) {
  return (
    <span className={`brand-mark ${small ? 'small' : ''}`} aria-hidden="true">
      <Zap fill="currentColor" strokeWidth={1.5} />
    </span>
  );
}
const sections = [
  { id: 'overview', label: 'Overview', icon: LayoutDashboard },
  { id: 'features', label: 'Bot features', icon: Layers3 },
  { id: 'help', label: 'How to use the bot', icon: CircleHelp },
  { id: 'development', label: 'Development', icon: Hammer },
  { id: 'questions', label: 'Common questions', icon: MessageSquare },
];
function Navigation({ active }: { active: string }) {
  const { setOpenMobile } = useSidebar();

  return (
    <Sidebar className="navigation">
      <SidebarHeader className="brand">
        <Mark />
        <a href="#overview">
          AimReboot<span>MADE FOR COMMUNITIES</span>
        </a>
      </SidebarHeader>
      <SidebarContent className="navigation-content">
        <div className="workspace">
          <Globe2 size={20} />
          <div>
            Public workspace<small>No sign-in needed</small>
          </div>
          <LockKeyhole size={14} />
        </div>
        <p className="nav-label">WORKSPACE</p>
        <SidebarMenu>
          {sections.map((item) => (
            <SidebarMenuItem key={item.id}>
              <SidebarMenuButton
                isActive={active === item.id}
                className="nav-link"
                render={
                  <a
                    href={`#${item.id}`}
                    aria-label={item.label}
                    aria-current={active === item.id ? 'location' : undefined}
                  />
                }
                onClick={() => {
                  setOpenMobile(false);
                }}
              >
                <item.icon />
                <span>{item.label}</span>
                {item.id === 'features' && <span className="nav-count">6</span>}
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="sidebar-bottom">
        <div className="signature">
          <Mark small />
          <span>Made for your community.</span>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
export default function Dashboard() {
  const [selected, setSelected] = useState<(typeof features)[number] | null>(
    null,
  );
  const [copyState, setCopyState] = useState('idle');
  const [query, setQuery] = useState('');
  const [active, setActive] = useState('overview');
  const [motionPaused, setMotionPaused] = useState(false);
  const [helpHighlighted, setHelpHighlighted] = useState(false);
  const navigationIntent = useRef<string | null>(null);
  const highlightTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const triggerRef = useRef<HTMLElement | null>(null);
  const copyTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const visibleFeatures = features.filter((feature) =>
    [feature.name, feature.description, ...feature.items]
      .join(' ')
      .toLowerCase()
      .includes(query.trim().toLowerCase()),
  );
  const navigateTo = useCallback((id: string, addHistory = true) => {
    const section = document.getElementById(id);
    if (!section || !sections.some((item) => item.id === id)) return;
    navigationIntent.current = id;
    setActive(id);
    if (addHistory && window.location.hash !== `#${id}`)
      window.history.pushState(null, '', `#${id}`);
    const reduced =
      window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
      document.querySelector('.motion-paused');
    section.scrollIntoView({
      block: 'start',
      behavior: reduced ? 'instant' : 'smooth',
    });
    section.focus({ preventScroll: true });
    if (id === 'help') {
      setHelpHighlighted(true);
      if (highlightTimer.current) clearTimeout(highlightTimer.current);
      highlightTimer.current = setTimeout(
        () => setHelpHighlighted(false),
        2200,
      );
    }
  }, []);
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      if (navigationIntent.current) return;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      if (maxScroll > 0 && window.scrollY >= maxScroll - 4) {
        setActive('questions');
        return;
      }
      const marker =
        (document.querySelector('.topbar')?.getBoundingClientRect().bottom ??
          80) + 40;
      // Compare all section positions, not only whichever observer entry changed.
      const reached = sections
        .map((section, order) => ({
          id: section.id,
          order,
          top:
            document.getElementById(section.id)?.getBoundingClientRect().top ??
            Infinity,
        }))
        .filter((section) => section.top <= marker)
        .sort((a, b) => b.top - a.top || a.order - b.order);
      setActive(reached[0]?.id ?? 'overview');
    };
    const schedule = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    const manualScroll = () => {
      if (navigationIntent.current) window.scrollTo({ top: window.scrollY, behavior: 'instant' });
      navigationIntent.current = null;
      schedule();
    };
    const onKey = (event: KeyboardEvent) => {
      if (
        event.target instanceof HTMLElement &&
        (event.target.matches('input, textarea') ||
          event.target.isContentEditable)
      )
        return;
      if (
        [
          'ArrowDown',
          'ArrowUp',
          'PageDown',
          'PageUp',
          'Home',
          'End',
          ' ',
        ].includes(event.key)
      )
        manualScroll();
    };
    const followHash = () => {
      const id = window.location.hash.slice(1) || 'overview';
      navigateTo(id, false);
    };
    const initial = requestAnimationFrame(() => {
      if (window.location.hash) followHash();
      else update();
    });
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('wheel', manualScroll, { passive: true });
    window.addEventListener('pointerdown', manualScroll, { passive: true });
    window.addEventListener('touchmove', manualScroll, { passive: true });
    window.addEventListener('keydown', onKey);
    window.addEventListener('resize', manualScroll);
    window.addEventListener('hashchange', followHash);
    window.addEventListener('popstate', followHash);
    const resize = new ResizeObserver(schedule);
    const main = document.getElementById('main');
    if (main) resize.observe(main);
    return () => {
      cancelAnimationFrame(initial);
      cancelAnimationFrame(frame);
      resize.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('wheel', manualScroll);
      window.removeEventListener('pointerdown', manualScroll);
      window.removeEventListener('touchmove', manualScroll);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', manualScroll);
      window.removeEventListener('hashchange', followHash);
      window.removeEventListener('popstate', followHash);
      if (highlightTimer.current) clearTimeout(highlightTimer.current);
    };
  }, [navigateTo]);
  useEffect(
    () => () => {
      if (copyTimer.current) clearTimeout(copyTimer.current);
    },
    [],
  );
  async function copyHelp() {
    if (copyTimer.current) clearTimeout(copyTimer.current);
    try {
      await navigator.clipboard.writeText('/help');
      setCopyState('copied');
      copyTimer.current = setTimeout(() => setCopyState('idle'), 3500);
    } catch {
      setCopyState('failed');
      const command = document.getElementById('help-command');
      if (command instanceof HTMLInputElement) {
        command.focus();
        command.select();
      }
    }
  }
  return (
    <SidebarProvider
      className={motionPaused ? 'motion-paused' : 'motion-enabled'}
      style={{ '--sidebar-width': '248px' } as CSSProperties}
      onClick={(event) => {
        if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey)
          return;
        const link =
          event.target instanceof Element
            ? event.target.closest('a[href^="#"]')
            : null;
        const id = link?.getAttribute('href')?.slice(1);
        if (id && sections.some((section) => section.id === id)) {
          event.preventDefault();
          navigateTo(id);
        }
      }}
    >
      <a className="skip-link" href="#main">
        Skip to dashboard
      </a>
      <Navigation active={active} />
      <SidebarInset className="dashboard-shell">
        <header className="topbar">
          <div className="breadcrumb">
            <SidebarTrigger className="menu-toggle" />
            <span>Workspace</span>
            <ChevronRight size={14} />
            <strong>
              {sections.find((section) => section.id === active)?.label}
            </strong>
          </div>
          <div className="topbar-actions">
            <Button
              variant="ghost"
              className="motion-toggle"
              aria-label={
                motionPaused ? 'Enable animations' : 'Pause animations'
              }
              aria-pressed={motionPaused}
              title={motionPaused ? 'Enable animations' : 'Pause animations'}
              onClick={() => setMotionPaused((value) => !value)}
            >
              {motionPaused ? <Play /> : <Pause />}
              <span>Animations {motionPaused ? 'off' : 'on'}</span>
            </Button>
            <span className="public-label">
              <Globe2 size={16} />
              Public preview<span className="preview-avatar">A</span>
            </span>
          </div>
        </header>
        <main id="main" className="dashboard-content">
          <section id="overview" tabIndex={-1}>
            <div className="page-heading">
              <div>
                <p className="eyebrow">AIMREBOOT DASHBOARD</p>
                <h1>A place for your community.</h1>
                <p className="page-description">
                  Your bot, its features, and what’s coming together.
                </p>
              </div>
              <span className="outline-label">
                <span className="status-dot" />
                Early preview
              </span>
            </div>
            <div className="wip-banner">
              <div className="wip-copy">
                <span className="wip-tag">
                  <Hammer size={14} />
                  UNDER DEVELOPMENT
                </span>
                <h2>
                  Something good is taking shape<span>.</span>
                </h2>
                <p>
                  AimReboot isn’t finished yet. Dashboard controls and bot
                  features are paused while we build and test.
                </p>
                <p className="thank-you">
                  Thanks for being here early. <Sparkles size={15} />
                </p>
                <a href="#development" className="text-link">
                  Where things stand <ArrowDown size={16} />
                </a>
              </div>
              <div className="build-card">
                <div className="build-card-top">
                  <Mark />
                  <span>
                    AimReboot<small>THE NEXT CHAPTER</small>
                  </span>
                  <span className="build-preview-label">PREVIEW</span>
                </div>
                <div className="build-row">
                  <span>
                    <Terminal /> /help command
                  </span>
                  <span className="available">
                    <span className="status-dot" />
                    Available
                  </span>
                </div>
                <div className="build-row">
                  <span>
                    <Layers3 /> Bot features
                  </span>
                  <span className="paused">
                    <Pause />
                    Paused
                  </span>
                </div>
                <div className="build-row">
                  <span>
                    <LayoutDashboard /> Dashboard controls
                  </span>
                  <span className="gold-text">In development</span>
                </div>
                <div className="build-card-bottom">
                  <LockKeyhole size={13} />
                  Public view · controls stay disabled
                </div>
              </div>
            </div>
            <div className="stats-grid">
              <div className="stat">
                <span className="stat-icon">
                  <Command />
                </span>
                <div>
                  <p>Available command</p>
                  <strong>
                    01 <span>/help</span>
                  </strong>
                </div>
              </div>
              <div className="stat">
                <span className="stat-icon">
                  <Layers3 />
                </span>
                <div>
                  <p>Feature areas</p>
                  <strong>
                    06 <span>currently paused</span>
                  </strong>
                </div>
              </div>
              <div className="stat">
                <span className="stat-icon">
                  <Globe2 />
                </span>
                <div>
                  <p>Dashboard access</p>
                  <strong className="word-stat">
                    Public <span>browse freely</span>
                  </strong>
                </div>
              </div>
            </div>
          </section>
          <div className="content-grid">
            <section id="features" tabIndex={-1}>
              <div className="section-heading">
                <div>
                  <h2>Built around your server</h2>
                  <p>
                    Explore the feature areas. Configuration will come later.
                  </p>
                </div>
                <span className="small-label">6 AREAS</span>
              </div>
              <div className="feature-search">
                <Search size={18} aria-hidden="true" />
                <Input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search features, e.g. music or roles"
                  aria-label="Search bot features"
                />
                {query && (
                  <Button
                    variant="ghost"
                    size="icon"
                    aria-label="Clear feature search"
                    onClick={() => setQuery('')}
                  >
                    <X />
                  </Button>
                )}
              </div>
              <output className="search-count" aria-live="polite">
                {visibleFeatures.length} of {features.length} feature areas
              </output>
              <div className="feature-grid">
                {visibleFeatures.map((feature, index) => (
                  <button
                    key={feature.name}
                    className="feature-card"
                    style={{ '--card-index': index } as CSSProperties}
                    onClick={(event) => {
                      triggerRef.current = event.currentTarget;
                      setSelected(feature);
                    }}
                    aria-haspopup="dialog"
                    aria-label={`View ${feature.name} details`}
                  >
                    <div className="feature-top">
                      <span className={`feature-icon ${feature.color}`}>
                        <feature.icon size={22} />
                      </span>
                      <span className="paused">
                        <Pause size={11} />
                        Paused
                      </span>
                    </div>
                    <h3>{feature.name}</h3>
                    <p>{feature.detail}</p>
                    <div className="feature-bottom">
                      Explore feature <ArrowRight size={16} />
                    </div>
                  </button>
                ))}
              </div>
              {visibleFeatures.length === 0 && (
                <div className="empty-search">
                  <Search size={26} />
                  <h3>No matching features</h3>
                  <p>Try a different word, or explore all six areas.</p>
                  <Button variant="outline" onClick={() => setQuery('')}>
                    Show all features
                  </Button>
                </div>
              )}
            </section>
            <aside className="right-column">
              <section
                id="help"
                tabIndex={-1}
                className={`help-card ${helpHighlighted ? 'destination-highlight' : ''}`}
              >
                <div className="section-heading">
                  <h2>How to use the bot</h2>
                  <span className="available-dot" />
                </div>
                <p>
                  For now, <code>/help</code> is the only active command in
                  AimReboot.
                </p>
                <div className="command-box">
                  <Terminal size={19} />
                  <input
                    id="help-command"
                    aria-label="Help command"
                    value="/help"
                    readOnly
                    onFocus={(event) => event.target.select()}
                  />
                  <Button
                    variant="ghost"
                    className="copy-command"
                    onClick={copyHelp}
                    aria-label={
                      copyState === 'copied' ? 'Copied /help' : 'Copy /help'
                    }
                  >
                    {copyState === 'copied' ? <Check /> : <Copy />}
                    <span>
                      {copyState === 'copied' ? 'Copied!' : 'Copy command'}
                    </span>
                  </Button>
                </div>
                <output
                  className={`copy-feedback ${copyState}`}
                  aria-live="polite"
                >
                  {copyState === 'copied'
                    ? 'Copied! Paste it in a server with AimReboot.'
                    : copyState === 'failed'
                      ? 'Select /help above and copy it manually.'
                      : 'Use it in a Discord server with AimReboot.'}
                </output>
                <div className="help-hint">
                  <CircleHelp size={17} />
                  <p>
                    It shows the current work-in-progress notice. Other commands
                    stay disabled.
                  </p>
                </div>
              </section>
              <section
                id="development"
                tabIndex={-1}
                className="development-card"
              >
                <div className="section-heading">
                  <h2>Where things stand</h2>
                  <Hammer size={18} />
                </div>
                <ol className="release-list">
                  <li className="complete">
                    <span className="step-icon">
                      <Check size={14} />
                    </span>
                    <div>
                      <strong>A public first look</strong>
                      <p>
                        You’re here. Explore the dashboard without signing in.
                      </p>
                      <span className="step-label">AVAILABLE NOW</span>
                    </div>
                  </li>
                  <li className="current">
                    <span className="step-icon">
                      <span />
                    </span>
                    <div>
                      <strong>Building & testing</strong>
                      <p>
                        Bot features and dashboard controls are still being
                        worked on.
                      </p>
                      <span className="step-label">IN PROGRESS</span>
                    </div>
                  </li>
                  <li>
                    <span className="step-icon">
                      <LockKeyhole size={12} />
                    </span>
                    <div>
                      <strong>A fuller experience</strong>
                      <p>
                        More to share when it’s ready. No launch date just yet.
                      </p>
                      <span className="step-label">AHEAD</span>
                    </div>
                  </li>
                </ol>
              </section>
            </aside>
          </div>
          <section id="questions" tabIndex={-1} className="faq-section">
            <div className="section-heading">
              <div>
                <h2>A few things to know</h2>
                <p>A quick guide to this early preview.</p>
              </div>
              <CircleHelp size={22} />
            </div>
            <Accordion className="faq-grid">
              {[
                [
                  'Can I configure my server here?',
                  'Not yet. This is a public preview. Server settings and bot actions are paused while AimReboot is in development.',
                ],
                [
                  'What can I use right now?',
                  'Explore the feature cards, search for a feature, and copy /help to use in a Discord server with AimReboot. It displays the current development notice.',
                ],
                [
                  'When will everything be ready?',
                  'There is no launch date yet. Features are being built and tested, and this dashboard will be updated as work progresses.',
                ],
                [
                  'Is my server data visible here?',
                  'No. This preview does not connect to private server data or show live analytics. Anyone can explore it without signing in.',
                ],
              ].map(([question, answer]) => (
                <AccordionItem key={question} value={question}>
                  <AccordionTrigger>{question}</AccordionTrigger>
                  <AccordionContent>
                    <p>{answer}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>
          <footer className="page-footer">
            <span>
              <Zap size={14} />
              AimReboot <span>/</span> Made for communities.
            </span>
            <a className="back-top" href="#overview">
              Back to top <ArrowUp size={15} />
            </a>
            <span>Public preview · Not live server analytics</span>
          </footer>
        </main>
      </SidebarInset>
      <Sheet
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <SheetContent className="feature-sheet" finalFocus={triggerRef}>
          {selected && (
            <>
              <SheetHeader>
                <span className={`feature-icon ${selected.color}`}>
                  <selected.icon size={25} />
                </span>
                <SheetTitle className="sheet-title">{selected.name}</SheetTitle>
                <SheetDescription className="sheet-description">
                  {selected.description}
                </SheetDescription>
              </SheetHeader>
              <div className="sheet-body">
                <span className="paused">
                  <Pause size={12} />
                  Currently paused
                </span>
                <h3>Part of this feature area</h3>
                <ul>
                  {selected.items.map((item) => (
                    <li key={item}>
                      <CheckCircle2 size={17} />
                      {item}
                    </li>
                  ))}
                </ul>
                <div className="sheet-note">
                  <Hammer size={20} />
                  <div>
                    <strong>A little more time in the workshop.</strong>
                    <p>
                      This is a preview of AimReboot’s capabilities. Commands,
                      automatic actions, and configuration are disabled during
                      development.
                    </p>
                  </div>
                </div>
                <p className="sheet-help">
                  You can still use <code>/help</code> in Discord.
                </p>
                <Button
                  className="sheet-action"
                  onClick={() => {
                    triggerRef.current =
                      document.getElementById('help-command');
                    setSelected(null);
                    navigateTo('help');
                  }}
                >
                  How to use /help <ArrowRight size={16} />
                </Button>
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </SidebarProvider>
  );
}
