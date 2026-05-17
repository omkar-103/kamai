// components/Footer.jsx
import {
  Gem, Shield, Zap, Globe, ChevronRight,
  Twitter, Linkedin, Github,
  Mail, Phone, MapPin, Clock,
  Star, Award, Lock
} from 'lucide-react';

const FooterLink = ({ href = '#', children, accent = '#1BD4CA' }) => (
  <a
    href={href}
    className="group flex items-center gap-1.5 text-white/40 hover:text-white text-sm transition-colors duration-200"
  >
    <span
      className="w-0 group-hover:w-2 h-px transition-all duration-200 shrink-0"
      style={{ background: accent }}
    />
    {children}
  </a>
);

const SocialBtn = ({ href, label, icon: Icon, hoverColor, glowColor }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    aria-label={label}
    className="group relative"
  >
    <div
      className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 blur-md"
      style={{ background: glowColor }}
    />
    <div
      className="relative w-10 h-10 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center transition-all duration-200 group-hover:border-white/25 group-hover:-translate-y-0.5"
    >
      <Icon className="w-4 h-4 text-white/40 group-hover:text-white transition-colors duration-200" />
    </div>
  </a>
);

export default function Footer() {
  return (
    <footer className="relative bg-[#080715] border-t border-white/[0.06] overflow-hidden">

      {/* Ambient background glows */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute bottom-0 left-0 w-[600px] h-[300px] bg-[#1BD4CA] opacity-[0.04] blur-[160px] rounded-full" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[300px] bg-[#7B6BFF] opacity-[0.04] blur-[160px] rounded-full" />
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#1BD4CA]/20 to-transparent" />
      </div>

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Contact Strip ── */}
        <div className="py-6 border-b border-white/[0.05]">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: Mail,   label: 'Email',    value: 'support@kamai.in',  color: '#1BD4CA' },
              { icon: Phone,  label: 'Phone',    value: '1800-KAMAI-IN',     color: '#7B6BFF' },
              { icon: MapPin, label: 'Location', value: 'Mumbai, India',     color: '#22C55E' },
              { icon: Clock,  label: 'Support',  value: '24 / 7 Available',  color: '#F59E0B' },
            ].map(({ icon: Icon, label, value, color }) => (
              <div key={label} className="flex items-center gap-3 group">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-all duration-200"
                  style={{ background: `${color}12`, border: `1px solid ${color}25` }}
                >
                  <Icon className="w-3.5 h-3.5" style={{ color }} />
                </div>
                <div>
                  <p className="text-[10px] text-white/30 uppercase tracking-wider">{label}</p>
                  <p className="text-xs text-white/70 font-medium">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Main Grid ── */}
        <div className="py-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 border-b border-white/[0.05]">

          {/* Brand column */}
          <div className="lg:col-span-1">
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-4">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] blur-lg opacity-50 rounded-xl" />
                <div className="relative w-9 h-9 rounded-xl bg-gradient-to-br from-[#1BD4CA] to-[#7B6BFF] p-[1.5px]">
                  <div className="w-full h-full bg-[#080715] rounded-xl flex items-center justify-center">
                    <Gem className="w-4 h-4 text-white" />
                  </div>
                </div>
              </div>
              <span className="text-xl font-black bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] bg-clip-text text-transparent">
                Kamai
              </span>
            </div>

            <p className="text-white/40 text-xs leading-relaxed mb-5">
              AI-powered financial OS for India's gig workers. Track income, automate taxes, and build wealth — all in one app.
            </p>

            {/* Trust badges */}
            <div className="flex flex-wrap gap-2 mb-5">
              {[
                { icon: Shield, text: 'RBI Compliant',     color: '#22C55E' },
                { icon: Lock,   text: 'Bank-Grade',         color: '#1BD4CA' },
                { icon: Award,  text: 'ISO 27001',          color: '#F59E0B' },
              ].map(({ icon: Icon, text, color }) => (
                <div
                  key={text}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-semibold"
                  style={{ background: `${color}12`, border: `1px solid ${color}25`, color }}
                >
                  <Icon className="w-2.5 h-2.5" />
                  {text}
                </div>
              ))}
            </div>

            {/* Social icons */}
            <div className="flex items-center gap-2">
              <SocialBtn href="https://in.linkedin.com/in/omkar-parelkar" label="LinkedIn"  icon={Linkedin} hoverColor="#0077B5" glowColor="rgba(0,119,181,0.4)" />
              <SocialBtn href="https://www.omkarparelkar.com/"            label="Website"  icon={Globe}    hoverColor="#1BD4CA"  glowColor="rgba(27,212,202,0.35)" />
              <SocialBtn href="https://x.com/omkar_1003"                  label="Twitter"  icon={Twitter}  hoverColor="#1DA1F2"  glowColor="rgba(29,161,242,0.4)" />
              <SocialBtn href="https://github.com/omkar-103"              label="GitHub"   icon={Github}   hoverColor="#ffffff"  glowColor="rgba(255,255,255,0.2)" />
            </div>
          </div>

          {/* Products */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <Zap className="w-3 h-3 text-[#1BD4CA]" />
              Products
            </h4>
            <ul className="space-y-2.5">
              {['Smart Vault', 'Goal Tracker', 'AI Insights', 'Auto-Save', 'Analytics'].map(item => (
                <li key={item}><FooterLink accent="#1BD4CA">{item}</FooterLink></li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <Globe className="w-3 h-3 text-[#7B6BFF]" />
              Resources
            </h4>
            <ul className="space-y-2.5">
              {['Help Center', 'API Docs', 'Blog', 'Community', 'Status'].map(item => (
                <li key={item}><FooterLink accent="#7B6BFF">{item}</FooterLink></li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4 flex items-center gap-2">
              <Star className="w-3 h-3 text-yellow-400" />
              Company
            </h4>
            <ul className="space-y-2.5">
              {['About Us', 'Careers', 'Press Kit', 'Partners', 'Contact'].map(item => (
                <li key={item}><FooterLink accent="#F59E0B">{item}</FooterLink></li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── Bottom Bar ── */}
        <div className="py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
            <span className="text-white/30 text-xs">© 2026 Kamai · All rights reserved</span>
            {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((item, i) => (
              <span key={item} className="flex items-center gap-4">
                <span className="text-white/10">·</span>
                <a href="#" className="text-white/30 hover:text-white/70 text-xs transition-colors">{item}</a>
              </span>
            ))}
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-green-500/5 border border-green-500/15">
            <div className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-green-400 text-[10px] font-medium">All systems operational</span>
          </div>
        </div>

        {/* ── Founder Signature — The Finale ── */}
        <div className="pb-8">
          <div className="relative rounded-2xl overflow-hidden">
            {/* Border glow */}
            <div className="absolute -inset-[1px] rounded-2xl bg-gradient-to-r from-[#1BD4CA]/20 via-[#7B6BFF]/15 to-[#1BD4CA]/20 blur-sm" />
            <div className="relative bg-gradient-to-r from-[#0B0F19]/80 via-[#080715]/60 to-[#0B0F19]/80 border border-white/[0.06] rounded-2xl px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-4">

              {/* Corner accents */}
              <div className="absolute top-0 left-0 w-10 h-10 pointer-events-none">
                <div className="absolute top-0 left-3 right-0 h-px bg-gradient-to-r from-[#1BD4CA]/50 to-transparent" />
                <div className="absolute top-3 left-0 bottom-0 w-px bg-gradient-to-b from-[#1BD4CA]/50 to-transparent" />
              </div>
              <div className="absolute bottom-0 right-0 w-10 h-10 pointer-events-none">
                <div className="absolute bottom-0 left-0 right-3 h-px bg-gradient-to-l from-[#7B6BFF]/50 to-transparent" />
                <div className="absolute bottom-3 right-0 top-0 w-px bg-gradient-to-t from-[#7B6BFF]/50 to-transparent" />
              </div>

              {/* Left: attribution */}
              <div className="flex items-center gap-3">
                <span className="text-white/30 text-xs uppercase tracking-widest">Crafted with</span>
                <span className="text-red-400 text-sm animate-pulse">❤️</span>
                <span className="text-white/30 text-xs uppercase tracking-widest">by</span>
                <a
                  href="https://www.omkarparelkar.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-bold bg-gradient-to-r from-[#1BD4CA] to-[#7B6BFF] bg-clip-text text-transparent hover:opacity-80 transition-opacity text-sm"
                >
                  Omkar Parelkar
                </a>
              </div>

              {/* Divider */}
              <div className="hidden sm:block w-px h-6 bg-white/10" />

              {/* Right: social buttons */}
              <div className="flex items-center gap-2">
                {[
                  { href: 'https://www.omkarparelkar.com/',       label: 'Website',  icon: Globe,    hoverColor: '#1BD4CA', glowColor: 'rgba(27,212,202,0.35)' },
                  { href: 'https://in.linkedin.com/in/omkar-parelkar', label: 'LinkedIn', icon: Linkedin, hoverColor: '#0077B5', glowColor: 'rgba(0,119,181,0.4)' },
                  { href: 'https://x.com/omkar_1003',              label: 'Twitter',  icon: Twitter,  hoverColor: '#1DA1F2', glowColor: 'rgba(29,161,242,0.4)' },
                  { href: 'https://github.com/omkar-103',          label: 'GitHub',   icon: Github,   hoverColor: '#ffffff', glowColor: 'rgba(255,255,255,0.2)' },
                ].map(({ href, label, icon: Icon, hoverColor, glowColor }) => (
                  <a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="group relative"
                  >
                    <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 blur-md"
                      style={{ background: glowColor }} />
                    <div className="relative w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center transition-all duration-200 group-hover:border-white/25 group-hover:-translate-y-0.5">
                      <Icon className="w-3.5 h-3.5 text-white/40 group-hover:text-white transition-colors duration-200" />
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>

      </div>
    </footer>
  );
}