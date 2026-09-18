import { Instagram, Mail, MapPin, MessageCircle, Lock, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import { useSite } from "@/context/SiteContext";

export default function Contato() {
  const { content } = useSite();
  const waLink = `https://wa.me/${(content.whatsapp || "").replace(/\D/g, "")}`;

  const cards = [
    { icon: MessageCircle, label: "WhatsApp", value: content.whatsapp_display || "Fale com a nossa equipe", href: waLink, testid: "contact-whatsapp" },
    { icon: Instagram, label: "Instagram", value: "@motivar.instituto", href: content.instagram, testid: "contact-instagram" },
    { icon: Mail, label: "E-mail", value: content.email, href: `mailto:${content.email}`, testid: "contact-email" },
    { icon: MapPin, label: "Endereço", value: content.endereco, href: null, testid: "contact-address" },
  ];

  return (
    <>
      <section id="contato" className="py-20 sm:py-28 bg-white" data-testid="contato-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="max-w-xl">
            <p className="text-xs uppercase tracking-[0.22em] font-bold text-brand-cyan mb-4">Contato</p>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
              Vem fazer parte dessa <span className="text-gradient-motivar">história</span>
            </h2>
          </div>

          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {cards.map((c) => {
              const inner = (
                <>
                  <div className="w-12 h-12 rounded-2xl bg-brand-cyan/10 text-brand-blue grid place-items-center">
                    <c.icon size={22} />
                  </div>
                  <p className="mt-5 text-xs font-bold uppercase tracking-wider text-slate-400">{c.label}</p>
                  <p className="mt-1 text-sm font-semibold text-slate-700 break-words">{c.value}</p>
                </>
              );
              const cls = "rounded-3xl border border-slate-100 bg-slate-50/60 p-6 card-hover block";
              return c.href ? (
                <a key={c.label} href={c.href} target="_blank" rel="noopener noreferrer" className={cls} data-testid={c.testid}>
                  {inner}
                </a>
              ) : (
                <div key={c.label} className={cls} data-testid={c.testid}>
                  {inner}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <footer className="bg-slate-900 text-white py-14" data-testid="site-footer">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-8">
            <div>
              <p className="font-display font-extrabold text-2xl tracking-tight">
                <span className="text-brand-cyan">instituto</span> <span className="text-white">motivar</span>
              </p>
              <p className="mt-2 text-sm text-white/50 max-w-sm leading-relaxed">
                Associação sem fins lucrativos dedicada à reabilitação, ao acolhimento e à cidadania.
              </p>
            </div>
            <div className="text-sm text-white/50 space-y-1.5">
              <p>CNPJ {content.cnpj}</p>
              <p>{content.endereco}</p>
              <a href={content.instagram} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1.5 text-brand-cyan font-semibold hover:text-white transition-colors">
                <Instagram size={14} /> @motivar.instituto
              </a>
            </div>
          </div>
          <div className="mt-10 pt-7 border-t border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs text-white/40">
            <p className="inline-flex items-center gap-1.5">
              Feito com <Heart size={12} className="text-brand-magenta fill-current" /> em Feira de Santana, Bahia · {new Date().getFullYear()}
            </p>
            <Link to="/admin" data-testid="footer-admin-link" className="inline-flex items-center gap-1.5 hover:text-white transition-colors">
              <Lock size={12} /> Acesso administrativo
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
