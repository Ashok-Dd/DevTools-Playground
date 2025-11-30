import { Link } from "react-router-dom";
import { ArrowRight, Code2, Wrench, Lock, Zap, Sparkles, Shield, Clock, Menu, X, LogIn } from "lucide-react";
import ThemeToggle from "../components/togglebutton";
import { useState } from "react";

export default function Landing() {
      const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[var(--bg)] text-[var(--text)] flex flex-col transition-all">

      {/* Navbar */}
       <header className="w-full py-5 px-6 flex justify-between items-center border-b border-[var(--border)] bg-[var(--bg-secondary)] backdrop-blur-sm sticky top-0 z-50">

        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-[var(--primary)] to-purple-600 flex items-center justify-center">
            <Code2 size={24} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            DevTools <span className="text-[var(--primary)]">Playground</span>
          </h1>
        </div>

        {/* Desktop Menu */}
        <div className="hidden md:flex items-center gap-4">
          <ThemeToggle />

          <Link
            to="/login"
            className="px-5 py-2.5 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--hover-bg)] transition-all font-medium"
          >
            Login
          </Link>

          <Link
            to="/register"
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[var(--primary)] to-purple-600 hover:from-[var(--primary-hover)] hover:to-purple-700 transition-all text-white font-medium shadow-lg shadow-[var(--primary)]/25"
          >
            Get Started
          </Link>
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden p-2 rounded-lg bg-[var(--card-bg)] border border-[var(--border)]"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </header>
      {menuOpen && (
        <div className="md:hidden flex flex-col gap-4 px-6 py-4 border-b border-[var(--border)] bg-[var(--bg-secondary)] transition-all animate-slideDown">
          <ThemeToggle />


          <Link
            to="/login"
            onClick={() => setMenuOpen(false)}
            className="px-4 py-3 flex gap-4  rounded-xl bg-[var(--card-bg)] border border-[var(--border)] hover:bg-[var(--hover-bg)] transition-all font-medium"
          >
            <LogIn /> Login
          </Link>

          <Link
            to="/register"
            onClick={() => setMenuOpen(false)}
            className="px-4 py-3 rounded-xl bg-gradient-to-r from-[var(--primary)] to-purple-600 text-white font-medium hover:from-[var(--primary-hover)] hover:to-purple-700 transition-all shadow-md shadow-[var(--primary)]/30"
          >
            Get Started
          </Link>
        </div>
      )}

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-8 py-20 relative overflow-hidden">
        {/* Gradient Orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[var(--primary)] opacity-10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 opacity-10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        
        <div className="relative z-10 max-w-5xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[var(--card-bg)] border border-[var(--border)] mb-8 shadow-sm">
            <Sparkles size={16} className="text-[var(--primary)]" />
            <span className="text-sm font-semibold text-[var(--primary)]">No AI • Pure Developer Tools</span>
          </div>
          
          {/* Main Heading */}
          <h2 className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight tracking-tight">
            The Ultimate <br />
            <span className="bg-gradient-to-r from-[var(--primary)] via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Developer Toolbox
            </span>
          </h2>

          {/* Subtitle */}
          <p className="text-[var(--text-light)] max-w-3xl mx-auto text-lg md:text-xl mb-12 leading-relaxed">
            Test APIs, convert JSON, decode JWTs, debug regex, encode URLs and much more — 
            all in one clean, fast, developer-friendly interface built for productivity.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
            <Link
              to="/dashboard"
              className="px-8 py-4 rounded-xl bg-gradient-to-r from-[var(--primary)] to-purple-600 hover:from-[var(--primary-hover)] hover:to-purple-700 text-white text-lg font-semibold flex items-center gap-2 transition-all shadow-xl shadow-[var(--primary)]/30 hover:shadow-2xl hover:shadow-[var(--primary)]/40 hover:scale-105"
            >
              Explore Tools <ArrowRight size={20} />
            </Link>
            
          </div>

          {/* Feature Pills */}
          <div className="flex flex-wrap gap-4 justify-center text-sm">
            <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-[var(--card-bg)] border border-[var(--border)] shadow-sm">
              <Zap size={18} className="text-yellow-500" />
              <span className="font-medium text-[var(--text)]">Lightning Fast</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-[var(--card-bg)] border border-[var(--border)] shadow-sm">
              <Shield size={18} className="text-green-500" />
              <span className="font-medium text-[var(--text)]">100% Private</span>
            </div>
            <div className="flex items-center gap-2 px-5 py-3 rounded-full bg-[var(--card-bg)] border border-[var(--border)] shadow-sm">
              <Clock size={18} className="text-blue-500" />
              <span className="font-medium text-[var(--text)]">Always Available</span>
            </div>
          </div>
        </div>
      </main>

      {/* Tools Preview Section */}
      <section className="py-24 px-8 bg-[var(--bg-secondary)] border-t border-[var(--border)] transition-all">
        <div className="max-w-6xl mx-auto">
          {/* Section Header */}
          <div className="text-center mb-16">
            <h3 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[var(--primary)] to-purple-600 bg-clip-text text-transparent">
              Tools You'll Use Daily
            </h3>
            <p className="text-[var(--text-light)] text-lg md:text-xl max-w-2xl mx-auto">
              Powerful utilities designed for modern development workflows
            </p>
          </div>

          {/* Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* Tool Card 1 */}
            <div className="group p-8 bg-[var(--card-bg)] rounded-2xl border border-[var(--border)] shadow-lg hover:shadow-2xl hover:border-[var(--primary)] transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Code2 size={32} className="text-white" />
              </div>
              <h4 className="text-2xl font-bold mb-3 text-[var(--text)]">API Tester</h4>
              <p className="text-[var(--text-light)] leading-relaxed">
                Send GET, POST, PUT, DELETE requests with speed and precision. Test endpoints instantly with detailed responses.
              </p>
            </div>

            {/* Tool Card 2 */}
            <div className="group p-8 bg-[var(--card-bg)] rounded-2xl border border-[var(--border)] shadow-lg hover:shadow-2xl hover:border-green-500 transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-green-500 to-green-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Wrench size={32} className="text-white" />
              </div>
              <h4 className="text-2xl font-bold mb-3 text-[var(--text)]">JSON ↔ CSV Tools</h4>
              <p className="text-[var(--text-light)] leading-relaxed">
                Convert and preview structured data instantly. Seamless transformations between formats at your fingertips.
              </p>      
            </div>

            {/* Tool Card 3 */}
            <div className="group p-8 bg-[var(--card-bg)] rounded-2xl border border-[var(--border)] shadow-lg hover:shadow-2xl hover:border-purple-500 transition-all duration-300 hover:-translate-y-2">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-purple-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg">
                <Lock size={32} className="text-white" />
              </div>
              <h4 className="text-2xl font-bold mb-3 text-[var(--text)]">JWT Decoder</h4>
              <p className="text-[var(--text-light)] leading-relaxed">
                Decode and inspect authentication tokens with clean JSON formatting. Debug auth flows with ease.
              </p>
            </div>
          </div>

          {/* View All Tools Button */}
          <div className="text-center mt-12">
            <Link
              to="/dashboard"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[var(--card-bg)] border border-[var(--border)] hover:border-[var(--primary)] hover:bg-[var(--hover-bg)] transition-all font-semibold text-[var(--text)]"
            >
              View All Tools <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 text-center text-[var(--text-light)] border-t border-[var(--border)] bg-[var(--bg)]">
        <p className="text-sm font-medium">
          © 2025 DevTools Playground — Built for Developers, by Developers
        </p>
      </footer>
    </div>
  );
}