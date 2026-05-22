import { Heart, BarChart3, Globe, Shield, Zap, ArrowRight, Check } from 'lucide-react';
import Link from 'next/link';

function HomePage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 via-blue-50 to-slate-100">
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 border-b border-slate-200/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="w-8 h-8 text-blue-600 fill-blue-600" />
            <span className="text-xl font-bold text-slate-900">Better Uptime</span>
          </div>
          <Link href="/signup" className="px-6 py-2 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      <main className="pt-24 pb-20">
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100/60 border border-blue-200/80 mb-8">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-500 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            <span className="text-sm font-medium text-blue-700">Always Watching · Always Available</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-bold text-slate-900 mb-6 leading-tight">
            Never Miss a <span className="bg-linear-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Downtime</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto mb-8 leading-relaxed">
            Real-time website monitoring powered by distributed workers. Monitor your websites from multiple regions and get instant alerts when something goes wrong.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button className="px-8 py-3 rounded-lg bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-all hover:shadow-lg hover:shadow-blue-600/30 flex items-center justify-center gap-2 group">
              Start Free Trial
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button className="px-8 py-3 rounded-lg bg-white text-slate-900 font-semibold border border-slate-300 hover:border-slate-400 hover:bg-slate-50 transition-all">
              View Documentation
            </button>
          </div>

          <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-slate-200/50 mb-20">
            <div className="absolute inset-0 bg-linear-to-br from-blue-600/10 to-cyan-600/10"></div>
            <div className="relative backdrop-blur-sm bg-linear-to-br from-slate-800 to-slate-900 p-8 sm:p-12">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">99.9%</div>
                  <div className="text-sm text-slate-400">Uptime Accuracy</div>
                </div>
                <div className="text-center border-x border-slate-700">
                  <div className="text-3xl font-bold text-cyan-400 mb-2">60+</div>
                  <div className="text-sm text-slate-400">Global Regions</div>
                </div>
                <div className="text-center">
                  <div className="text-3xl font-bold text-blue-400 mb-2">&lt;1s</div>
                  <div className="text-sm text-slate-400">Detection Time</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center mb-16">
            <h2 className="text-4xl sm:text-5xl font-bold text-slate-900 mb-4">Powerful Features</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">Everything you need to monitor your web infrastructure with confidence</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: Globe,
                title: "Distributed Monitoring",
                description: "Check your sites from 60+ global regions simultaneously for accurate, real-world performance insights"
              },
              {
                icon: BarChart3,
                title: "Detailed Analytics",
                description: "Track response times, uptime trends, and performance metrics with beautiful, interactive dashboards"
              },
              {
                icon: Zap,
                title: "Instant Alerts",
                description: "Get notified in real-time when your websites go down. Choose email, SMS, or webhook notifications"
              },
              {
                icon: Shield,
                title: "Enterprise Security",
                description: "Bank-grade security with OAuth 2.0, encrypted data storage, and compliance with industry standards"
              },
              {
                icon: Heart,
                title: "99.9% Reliability",
                description: "Built on distributed architecture with Redis streams and PostgreSQL for rock-solid performance"
              },
              {
                icon: Check,
                title: "Easy Integration",
                description: "Add websites in seconds. Simple API for custom integrations and advanced monitoring scenarios"
              }
            ].map((feature) => (
              <div
                key={feature.title}
                className="group p-8 rounded-xl bg-white border border-slate-200/60 hover:border-blue-300 hover:shadow-lg hover:shadow-blue-100/50 transition-all duration-300 hover:scale-105"
              >
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-lg bg-linear-to-br from-blue-100 to-cyan-100 mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-7 h-7 text-blue-600" />
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed text-justify">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="rounded-2xl bg-linear-to-r from-blue-600 to-cyan-600 p-12 sm:p-16 text-center">
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Start Monitoring Today
            </h2>
            <p className="text-lg text-blue-100 max-w-2xl mx-auto mb-8">
              Get real-time insights into your website&apos;s performance. No credit card required.
            </p>
            <button className="px-8 py-4 rounded-lg bg-white text-blue-600 font-bold hover:bg-slate-50 transition-colors shadow-lg">
              Get Started Free
            </button>
          </div>
        </section>

        <footer className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 border-t border-slate-200/50 mt-20">
          <div className="flex flex-col sm:flex-row items-center justify-between">
            <div className="flex items-center gap-2 mb-6 sm:mb-0">
              <Heart className="w-6 h-6 text-blue-600 fill-blue-600" />
              <span className="font-bold text-slate-900">Better Uptime</span>
            </div>
            <div className="flex gap-8 text-sm text-slate-600">
              <Link href="#" className="hover:text-slate-900 transition-colors">Privacy</Link>
              <Link href="#" className="hover:text-slate-900 transition-colors">Terms</Link>
              <Link href="#" className="hover:text-slate-900 transition-colors">Docs</Link>
              <Link href="#" className="hover:text-slate-900 transition-colors">Contact</Link>
            </div>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default HomePage;
