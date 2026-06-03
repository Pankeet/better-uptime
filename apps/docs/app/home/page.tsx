"use client";
import { useState, useEffect } from "react"
import { Activity, ArrowRight, Bell, Check, ChevronRight, Globe, Monitor, Radio, Shield, Timer, TrendingUp, Zap, Menu, X, CircleCheck, CircleAlert as AlertCircle, Clock } from "lucide-react"
import { Badge } from "@repo/ui/badge"
import { Button } from "@repo/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@repo/ui/card"
import { Separator } from "@repo/ui/separator"
import { ModeToggle } from "@repo/ui/mode-toggle"

const NAV_LINKS = ["Features", "How It Works", "Pricing", "Docs"]

const STATS = [
  { value: "99.9%", label: "Uptime Accuracy", icon: TrendingUp },
  { value: "3min", label: "Check Interval", icon: Timer },
  { value: "Global", label: "Worker Regions", icon: Globe },
  { value: "<1s", label: "Avg Detection", icon: Zap },
]

const FEATURES = [
  {
    icon: Activity,
    title: "Real-time Monitoring",
    description:
      "Continuous HTTP checks from distributed worker processes. Detects outages in under 3 minutes with intelligent status classification.",
  },
  {
    icon: Globe,
    title: "Distributed Workers",
    description:
      "Workers deployed across multiple regions consume Redis Stream jobs and perform checks in parallel for accurate geo-redundancy.",
  },
  {
    icon: Bell,
    title: "Instant Alerts",
    description:
      "Email notifications powered by Resend trigger the moment your site transitions from Up to Down — no false positives.",
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description:
      "NextAuth.js with Google OAuth and credentials sign-in. Your site data is owned by you with per-user isolation enforced at the API layer.",
  },
  {
    icon: TrendingUp,
    title: "Response Metrics",
    description:
      "Every check records response time as a WebsiteTick. Visualize historical latency trends and uptime percentages over time.",
  },
  {
    icon: Radio,
    title: "Redis Streams",
    description:
      "A producer enqueues website check jobs every 3 minutes. Workers read from consumer groups per region for reliable, at-least-once delivery.",
  },
]

const HOW_IT_WORKS = [
  {
    step: "01",
    title: "Add Your Website",
    description:
      "Sign up and paste in any URL. Your site is immediately persisted to PostgreSQL and registered for monitoring.",
    icon: Monitor,
  },
  {
    step: "02",
    title: "Jobs Are Queued",
    description:
      "Our producer runs every 3 minutes, enqueuing check jobs into a Redis Stream for every active monitored URL.",
    icon: Radio,
  },
  {
    step: "03",
    title: "Workers Check & Record",
    description:
      "Distributed workers pull jobs from their regional consumer group, perform the HTTP check, then write a WebsiteTick to the database.",
    icon: Zap,
  },
  {
    step: "04",
    title: "See Your Status",
    description:
      "Your dashboard shows live status, response times, and historical uptime trends — always current, always accurate.",
    icon: TrendingUp,
  },
]

const MOCK_SITES = [
  { name: "api.example.com", status: "up", latency: "142ms", uptime: "99.98%" },
  { name: "app.mybrand.io", status: "up", latency: "88ms", uptime: "100%" },
  {
    name: "checkout.store.dev",
    status: "down",
    latency: "—",
    uptime: "98.41%",
  },
  { name: "docs.myproject.co", status: "up", latency: "210ms", uptime: "99.72%" },
]

const PRICING = [
  {
    name: "Starter",
    price: "Free",
    description: "Perfect for indie projects and personal sites.",
    features: ["5 monitored URLs", "3-minute check interval", "Email alerts", "7-day history"],
    highlight: false,
    cta: "Get Started",
  },
  {
    name: "Pro",
    price: "$12",
    period: "/mo",
    description: "For teams that need more coverage and history.",
    features: [
      "50 monitored URLs",
      "1-minute check interval",
      "Multi-region workers",
      "30-day history",
      "Slack & webhook alerts",
      "Response time charts",
    ],
    highlight: true,
    cta: "Start Free Trial",
  },
  {
    name: "Enterprise",
    price: "Custom",
    description: "Dedicated infrastructure for mission-critical apps.",
    features: [
      "Unlimited URLs",
      "30-second checks",
      "Dedicated workers",
      "90-day history",
      "SLA guarantee",
      "Priority support",
    ],
    highlight: false,
    cta: "Contact Sales",
  },
]

function StatusDot({ status }: Readonly<{ status: "up" | "down" }>) {
  return (
    <span
      className={`inline-flex size-2 rounded-full ${
        status === "up" ? "bg-emerald-500" : "bg-destructive"
      } ${status === "up" ? "shadow-[0_0_6px_2px_rgba(16,185,129,0.4)]" : "shadow-[0_0_6px_2px_rgba(239,68,68,0.4)]"}`}
    />
  )
}

function PulsingDot() {
  return (
    <span className="relative inline-flex size-2">
      <span className="absolute inline-flex size-full animate-ping rounded-full bg-emerald-400 opacity-75" />
      <span className="relative inline-flex size-2 rounded-full bg-emerald-500" />
    </span>
  )
}

export default function HomePage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <div className="min-h-svh bg-background text-foreground">
      {/* ── Nav ── */}
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-200 ${
          scrolled
            ? "border-b border-border bg-background/90 backdrop-blur-md"
            : "bg-transparent"
        }`}
      >
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2">
            <div className="flex size-8 items-center justify-center rounded-lg bg-primary">
              <Activity className="size-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold tracking-tight">Better Uptime</span>
          </div>

          <nav className="hidden items-center gap-6 md:flex">
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(" ", "-")}`}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {link}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ModeToggle />
            <Button variant="ghost" size="sm" className="hidden md:inline-flex">
              Sign In
            </Button>
            <Button size="sm" className="hidden md:inline-flex">
              Get Started
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </Button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="border-t border-border bg-background px-4 py-4 md:hidden">
            <nav className="flex flex-col gap-3">
              {NAV_LINKS.map((link) => (
                <a
                  key={link}
                  href={`#${link.toLowerCase().replace(" ", "-")}`}
                  className="text-sm text-muted-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link}
                </a>
              ))}
              <Separator />
              <Button variant="outline" size="sm">Sign In</Button>
              <Button size="sm">Get Started</Button>
            </nav>
          </div>
        )}
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-32 pb-24">
        {/* Grid background */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            maskImage:
              "radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
          }}
        />
        {/* Glow */}
        <div className="pointer-events-none absolute -top-40 left-1/2 size-150 -translate-x-1/2 rounded-full bg-primary/5 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Badge variant="outline" className="mb-6 gap-1.5 px-3 py-1.5 text-xs">
              <PulsingDot />
              Active monitoring — now in development
            </Badge>

            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight text-balance sm:text-5xl lg:text-6xl">
              Know when your site goes{" "}
              <span className="relative">
                <span className="text-foreground">down</span>
                <span className="absolute -bottom-1 left-0 h-0.5 w-full bg-destructive/60 blur-[1px]" />
              </span>
              {" "}before your users do
            </h1>

            <p className="mt-6 text-lg leading-relaxed text-muted-foreground text-balance">
              Better Uptime runs distributed HTTP checks from regional workers, streams jobs through
              Redis, and persists every result to PostgreSQL — giving you a complete picture of your
              site&apos;s availability and response time.
            </p>

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Button size="lg" className="w-full sm:w-auto rounded-full px-8">
                Start monitoring free
                <ArrowRight />
              </Button>
              <Button size="lg" variant="outline" className="w-full sm:w-auto rounded-full px-8">
                View on GitHub
              </Button>
            </div>
          </div>

          {/* Mock Dashboard */}
          <div className="mx-auto mt-16 max-w-4xl">
            <Card className="overflow-hidden border shadow-2xl">
              <CardHeader className="border-b bg-muted/30 py-3">
                <div className="flex items-center gap-1.5">
                  <span className="size-3 rounded-full bg-destructive/70" />
                  <span className="size-3 rounded-full bg-yellow-400/70" />
                  <span className="size-3 rounded-full bg-emerald-400/70" />
                  <span className="ml-4 text-xs text-muted-foreground">
                    dashboard.betteruptime.app
                  </span>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="border-b px-5 py-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">Monitored Sites</p>
                      <p className="text-xs text-muted-foreground">Last checked 43s ago</p>
                    </div>
                    <Badge variant="outline" className="gap-1.5">
                      <PulsingDot />
                      Live
                    </Badge>
                  </div>
                </div>
                <div>
                  {MOCK_SITES.map((site, i) => (
                    <div key={site.name}>
                      <div className="flex items-center justify-between px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <StatusDot status={site.status as "up" | "down"} />
                          <div>
                            <p className="text-sm font-medium">{site.name}</p>
                            <p className="text-xs text-muted-foreground">
                              {site.status === "up" ? "Operational" : "Outage detected"}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-6">
                          <div className="hidden text-right sm:block">
                            <p className="text-xs text-muted-foreground">Latency</p>
                            <p className="text-sm font-mono font-medium">{site.latency}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-muted-foreground">Uptime</p>
                            <p className="text-sm font-mono font-medium">{site.uptime}</p>
                          </div>
                          <Badge
                            variant={site.status === "up" ? "outline" : "destructive"}
                            className={
                              site.status === "up"
                                ? "border-emerald-300 bg-emerald-50 text-emerald-700 dark:border-emerald-700 dark:bg-emerald-950 dark:text-emerald-300"
                                : ""
                            }
                          >
                            {site.status === "up" ? "Up" : "Down"}
                          </Badge>
                        </div>
                      </div>
                      {i < MOCK_SITES.length - 1 && <Separator />}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="border-y border-border bg-muted/30 py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 gap-8 lg:grid-cols-4">
            {STATS.map(({ value, label, icon: Icon }) => (
              <div key={label} className="flex flex-col items-center gap-2 text-center">
                <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10">
                  <Icon className="size-5 text-primary" />
                </div>
                <p className="text-3xl font-extrabold tracking-tight">{value}</p>
                <p className="text-sm text-muted-foreground">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4">Features</Badge>
            <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight sm:text-4xl">
              Everything you need to stay ahead of downtime
            </h2>
            <p className="mt-4 text-muted-foreground leading-7">
              A modern monitoring pipeline built on proven infrastructure — Next.js, PostgreSQL,
              and Redis Streams powering every check.
            </p>
          </div>

          <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {FEATURES.map(({ icon: Icon, title, description }) => (
              <Card
                key={title}
                className="group relative overflow-hidden transition-shadow hover:shadow-lg"
              >
                <div className="pointer-events-none absolute inset-0 opacity-0 transition-opacity group-hover:opacity-100"
                  style={{
                    background:
                      "radial-gradient(200px at var(--mouse-x, 50%) var(--mouse-y, 50%), var(--accent) 0%, transparent 80%)",
                  }}
                />
                <CardHeader>
                  <div className="mb-3 flex size-10 items-center justify-center rounded-lg border bg-background">
                    <Icon className="size-5 text-foreground" />
                  </div>
                  <CardTitle className="text-base">{title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="leading-relaxed">{description}</CardDescription>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="border-y border-border bg-muted/30 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4">How It Works</Badge>
            <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight sm:text-4xl">
              A monitoring loop you can trust
            </h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              Four clear stages from sign-up to live status — no magic, just solid engineering.
            </p>
          </div>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {HOW_IT_WORKS.map(({ step, title, description, icon: Icon }, index) => (
              <div key={step} className="relative flex flex-col gap-4">
                {/* Connector line */}
                {index < HOW_IT_WORKS.length - 1 && (
                  <div className="absolute top-5 left-10 hidden h-px w-[calc(100%+2rem)] bg-border lg:block" />
                )}
                <div className="relative flex items-center gap-3">
                  <div className="relative flex size-10 shrink-0 items-center justify-center rounded-full border-2 border-primary bg-background">
                    <Icon className="size-4 text-primary" />
                  </div>
                  <span className="font-mono text-xs font-bold text-muted-foreground">{step}</span>
                </div>
                <div>
                  <p className="text-sm font-semibold">{title}</p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Architecture Callout ── */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="overflow-hidden rounded-2xl border bg-muted/20">
            <div className="grid gap-0 lg:grid-cols-2">
              <div className="p-10 lg:p-14">
                <Badge variant="outline" className="mb-6">Architecture</Badge>
                <h2 className="scroll-m-20 text-2xl font-semibold tracking-tight sm:text-3xl">
                  Built as a TypeScript monorepo
                </h2>
                <p className="mt-4 leading-7 text-muted-foreground">
                  Turborepo + pnpm workspaces keep the web app, producer, worker, and shared packages
                  in a single repository with strict typing and fast incremental builds.
                </p>
                <div className="mt-8 space-y-3">
                  {[
                    { icon: Monitor, label: "apps/docs", desc: "Next.js 16 web app & API routes" },
                    { icon: Radio, label: "apps/producer", desc: "Queues checks every 3 minutes" },
                    { icon: Zap, label: "apps/worker", desc: "Consumes Redis Stream & records ticks" },
                    { icon: Shield, label: "packages/store", desc: "Prisma schema & PostgreSQL client" },
                  ].map(({ icon: Icon, label, desc }) => (
                    <div key={label} className="flex items-start gap-3">
                      <div className="mt-0.5 flex size-6 shrink-0 items-center justify-center rounded bg-primary/10">
                        <Icon className="size-3.5 text-primary" />
                      </div>
                      <div>
                        <span className="font-mono text-sm font-semibold">{label}</span>
                        <span className="ml-2 text-sm text-muted-foreground">{desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-center border-t bg-muted/30 p-10 lg:border-t-0 lg:border-l lg:p-14">
                <div className="w-full max-w-xs space-y-2 font-mono text-xs">
                  {[
                    { indent: 0, text: "better-uptime/", dim: false },
                    { indent: 1, text: "apps/", dim: true },
                    { indent: 2, text: "docs/", dim: false, accent: true },
                    { indent: 2, text: "producer/", dim: false, accent: true },
                    { indent: 2, text: "worker/", dim: false, accent: true },
                    { indent: 1, text: "packages/", dim: true },
                    { indent: 2, text: "store/", dim: false },
                    { indent: 2, text: "redis/", dim: false },
                    { indent: 2, text: "ui/", dim: false },
                    { indent: 1, text: "turbo.json", dim: true },
                    { indent: 1, text: "pnpm-workspace.yaml", dim: true },
                  ].map(({ indent, text, dim, accent }) => (
                    <div
                      key={text}
                      className={`flex items-center gap-1 ${dim ? "text-muted-foreground" : ""} ${accent ? "text-foreground" : ""}`}
                      style={{ paddingLeft: `${indent * 16}px` }}
                    >
                      {indent > 0 && (
                        <ChevronRight className="size-3 shrink-0 text-muted-foreground/50" />
                      )}
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Pricing ── */}
      <section id="pricing" className="border-t border-border bg-muted/20 py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <Badge variant="secondary" className="mb-4">Pricing</Badge>
            <h2 className="scroll-m-20 text-3xl font-semibold tracking-tight sm:text-4xl">
              Simple, transparent pricing
            </h2>
            <p className="mt-4 leading-7 text-muted-foreground">
              Start free. Scale when you need to. No credit card required.
            </p>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-3">
            {PRICING.map(({ name, price, period, description, features, highlight, cta }) => (
              <Card
                key={name}
                className={`relative flex flex-col ${highlight ? "border-primary shadow-lg ring-1 ring-primary" : ""}`}
              >
                {highlight && (
                  <div className="absolute left-1/5 -translate-x-1/2">
                    <Badge className="px-3 py-0.5 text-md">Most Popular</Badge>
                  </div>
                )}
                <CardHeader className={highlight ? "pt-8" : ""}>
                  <CardTitle className="text-base font-medium text-muted-foreground">{name}</CardTitle>
                  <div className="flex items-end gap-0.5">
                    <span className="text-4xl font-extrabold tracking-tight">{price}</span>
                    {period && <span className="mb-1 text-sm text-muted-foreground">{period}</span>}
                  </div>
                  <CardDescription>{description}</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-1 flex-col gap-6">
                  <ul className="flex-1 space-y-2.5">
                    {features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2.5 text-sm">
                        <CircleCheck className="size-4 shrink-0 text-emerald-500" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button
                    variant={highlight ? "default" : "outline"}
                    className="w-full"
                  >
                    {cta}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Status snapshot ── */}
      <section className="border-y border-border py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-4">
              <div className="flex size-12 items-center justify-center rounded-full border-2 border-emerald-300 bg-emerald-50 dark:border-emerald-700 dark:bg-emerald-950">
                <CircleCheck className="size-6 text-emerald-600 dark:text-emerald-400" />
              </div>
              <div>
                <p className="font-semibold">All systems operational</p>
                <p className="text-sm text-muted-foreground">Last updated 14 seconds ago</p>
              </div>
            </div>
            <div className="flex items-center gap-6 text-center">
              {[
                { icon: Clock, label: "Avg Response", value: "138ms" },
                { icon: AlertCircle, label: "Open Incidents", value: "0" },
                { icon: Activity, label: "Checks today", value: "14,280" },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex flex-col items-center gap-0.5">
                  <Icon className="size-4 text-muted-foreground" />
                  <p className="text-xl font-bold">{value}</p>
                  <p className="text-xs text-muted-foreground">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="relative overflow-hidden rounded-2xl bg-primary px-8 py-16 text-center text-primary-foreground sm:px-16">
            <div className="pointer-events-none absolute inset-0 opacity-10"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 30% 50%, white, transparent 60%), radial-gradient(circle at 70% 50%, white, transparent 60%)",
              }}
            />
            <div className="relative">
              <h2 className="scroll-m-20 text-3xl font-extrabold tracking-tight sm:text-4xl">
                Start monitoring in under 60 seconds
              </h2>
              <p className="mx-auto mt-4 max-w-xl leading-7 opacity-80">
                Sign up free, add your first URL, and Better Uptime takes it from there. No credit card.
                No lock-in. Cancel any time.
              </p>
              <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Button
                  size="lg"
                  variant="secondary"
                  className="w-full rounded-full px-8 sm:w-auto"
                >
                  Create free account
                  <ArrowRight />
                </Button>
                <Button
                  size="lg"
                  variant="ghost"
                  className="w-full rounded-full px-8 text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground sm:w-auto"
                >
                  Read the docs
                </Button>
              </div>
              <div className="mt-6 flex items-center justify-center gap-6 text-sm opacity-70">
                {["No credit card required", "5 free monitors", "Cancel anytime"].map((item, i) => (
                  <span key={item} className="flex items-center gap-1.5">
                    {i > 0 && <span className="opacity-40">·</span>}
                    <Check className="size-3.5" />
                    {item}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-border bg-muted/20 py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-md bg-primary">
                <Activity className="size-3.5 text-primary-foreground" />
              </div>
              <span className="text-sm font-bold">Better Uptime</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              {["Privacy", "Terms", "Status", "GitHub"].map((item) => (
                <a key={item} href="#" className="transition-colors hover:text-foreground">
                  {item}
                </a>
              ))}
            </div>
            <p className="text-xs text-muted-foreground">
              © 2026 Better Uptime. Built with Next.js, PostgreSQL & Redis.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
