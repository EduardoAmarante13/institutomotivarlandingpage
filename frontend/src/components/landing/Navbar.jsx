import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Lock, Heart } from "lucide-react";

const LINKS = [
  { href: "#quem-somos", label: "Sobre Nós" },
  { href: "#atendimentos", label: "Atendimentos" },
  { href: "#acoes", label: "Ações" },
  { href: "#galeria", label: "Galeria" },
  { href: "#instagram", label: "Instagram" },
  { href: "#ajudar", label: "Como Ajudar" },
  { href: "#contato", label: "Contato" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-testid="site-navbar"
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled || open ? "glass-nav" : "bg-transparent"}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 sm:h-20">
        <a href="#topo" className="flex items-center shrink-0" data-testid="navbar-logo">
          <img
            src="/logo.png"
            alt="Instituto Motivar"
            className="h-10 sm:h-12 w-auto object-contain transition-transform duration-300 hover:scale-[1.03]"
          />
        </a>

        <nav className="hidden lg:flex items-center gap-7" data-testid="navbar-links">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              data-testid={`nav-link-${l.href.slice(1)}`}
              className="text-sm font-semibold text-slate-600 hover:text-brand-blue transition-colors"
            >
              {l.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2.5">
          <Link
            to="/admin"
            data-testid="admin-login-button"
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-brand-blue transition-colors px-2 py-1"
            title="Área administrativa"
          >
            <Lock size={13} />
            Painel
          </Link>
          <a
            href="#ajudar"
            data-testid="navbar-donate-btn"
            className="inline-flex items-center gap-1.5 bg-brand-blue hover:bg-brand-cyan text-white text-sm font-bold px-4 sm:px-5 py-2.5 rounded-full transition-colors duration-300"
          >
            <Heart size={15} className="fill-current" />
            Ajudar
          </a>
          <button
            data-testid="navbar-mobile-toggle"
            className="lg:hidden p-2 text-slate-700"
            onClick={() => setOpen(!open)}
            aria-label="Abrir menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {open && (
        <nav className="lg:hidden px-6 pb-6 pt-2 flex flex-col gap-4 glass-nav" data-testid="navbar-mobile-menu">
          {LINKS.map((l) => (
            <a
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className="text-base font-semibold text-slate-700"
            >
              {l.label}
            </a>
          ))}
          <Link to="/admin" className="text-sm font-semibold text-slate-400 flex items-center gap-1.5">
            <Lock size={13} /> Painel administrativo
          </Link>
        </nav>
      )}
    </header>
  );
}
