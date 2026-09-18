import { motion } from "framer-motion";
import { HandHeart, Users, ShieldCheck, ShoppingBag, MessageCircle, Instagram } from "lucide-react";
import { useSite } from "@/context/SiteContext";

export default function ComoAjudar() {
  const { content } = useSite();
  const waNumber = (content.whatsapp || "").replace(/\D/g, "");
  const waDoar = `https://wa.me/${waNumber}?text=${encodeURIComponent("Olá! Quero fazer uma doação para o Instituto Motivar.")}`;
  const waVoluntario = `https://wa.me/${waNumber}?text=${encodeURIComponent("Olá! Quero ser voluntário(a) do Instituto Motivar.")}`;

  return (
    <section id="ajudar" className="py-20 sm:py-28 bg-brand-blue relative overflow-hidden grain" data-testid="ajudar-section">
      <div className="absolute -top-24 -right-24 w-96 h-96 rounded-full bg-brand-cyan/20 blur-3xl" />
      <div className="absolute bottom-0 -left-24 w-96 h-96 rounded-full bg-brand-purple/20 blur-3xl" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.22em] font-bold text-brand-cyan mb-4">Como ajudar</p>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white">
            Sua ajuda vira <span className="text-brand-yellow">futuro</span>
          </h2>
        </div>

        <div className="mt-12 grid lg:grid-cols-2 gap-7">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="rounded-3xl bg-white p-8 sm:p-10 shadow-2xl flex flex-col"
            data-testid="donate-card"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-emerald/10 grid place-items-center text-brand-emerald">
                <HandHeart size={24} />
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900">Faça uma doação</h3>
            </div>
            <p className="mt-4 text-sm sm:text-base text-slate-500 leading-relaxed flex-1">{content.donate_text}</p>
            <div className="mt-5 rounded-2xl bg-brand-emerald/5 border border-brand-emerald/20 px-5 py-4 flex items-start gap-3">
              <MessageCircle className="text-brand-emerald shrink-0 mt-0.5" size={18} />
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
                Doações combinadas direto pelo WhatsApp <span className="font-bold text-slate-700">{content.whatsapp_display}</span> — com recibo e total transparência.
              </p>
            </div>
            <a
              href={waDoar}
              target="_blank"
              rel="noopener noreferrer"
              data-testid="donate-whatsapp-btn"
              className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-brand-emerald hover:bg-emerald-600 text-white font-bold px-6 py-3.5 rounded-full transition-colors"
            >
              <MessageCircle size={17} />
              Quero doar
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="flex flex-col gap-7"
          >
            <div className="rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 p-8 sm:p-10 flex-1" data-testid="volunteer-card">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-brand-yellow/20 grid place-items-center text-brand-yellow">
                  <Users size={24} />
                </div>
                <h3 className="font-display text-xl font-bold text-white">Seja voluntário</h3>
              </div>
              <p className="mt-4 text-sm sm:text-base text-white/70 leading-relaxed">{content.volunteer_text}</p>
              <a
                href={waVoluntario}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="volunteer-submit-btn"
                className="mt-6 inline-flex items-center gap-2 bg-brand-yellow hover:bg-amber-400 text-slate-900 font-bold px-6 py-3.5 rounded-full transition-colors"
              >
                <HandHeart size={18} />
                Quero ser voluntário
              </a>
            </div>

            <div className="rounded-3xl bg-white/10 backdrop-blur-md border border-white/15 p-8 sm:p-10 flex-1" data-testid="brecho-card">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-brand-magenta/20 grid place-items-center text-brand-magenta">
                  <ShoppingBag size={24} />
                </div>
                <h3 className="font-display text-xl font-bold text-white">Brechó Motivar</h3>
              </div>
              <p className="mt-4 text-sm sm:text-base text-white/70 leading-relaxed">
                Nosso brechó solidário também sustenta os atendimentos. Peças garimpadas com carinho — cada compra vira cuidado.
              </p>
              <a
                href="https://www.instagram.com/brecho.motivar/"
                target="_blank"
                rel="noopener noreferrer"
                data-testid="brecho-instagram-btn"
                className="mt-6 inline-flex items-center gap-2 bg-white hover:bg-slate-100 text-slate-900 font-bold px-6 py-3.5 rounded-full transition-colors"
              >
                <Instagram size={18} />
                @brecho.motivar
              </a>
            </div>
          </motion.div>
        </div>

        <div className="mt-7 rounded-3xl bg-white/5 border border-white/10 px-8 py-6 flex items-start gap-4" data-testid="transparency-strip">
          <ShieldCheck className="text-brand-cyan shrink-0 mt-0.5" size={26} />
          <p className="text-sm text-white/70 leading-relaxed">
            <span className="font-bold text-white">Transparência:</span> associação registrada sob o CNPJ{" "}
            <span className="font-mono font-semibold text-white">{content.cnpj}</span>, reconhecida de utilidade pública
            pela Câmara Municipal de Feira de Santana. Todo recurso é integralmente revertido às ações.
          </p>
        </div>
      </div>
    </section>
  );
}
