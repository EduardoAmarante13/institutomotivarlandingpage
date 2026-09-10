import { motion } from "framer-motion";
import { toast } from "sonner";
import { Copy, HandHeart, Users, ShieldCheck, QrCode } from "lucide-react";
import { useSite } from "@/context/SiteContext";

export default function ComoAjudar() {
  const { content } = useSite();

  const copyPix = async () => {
    try {
      await navigator.clipboard.writeText(content.pix_key || "");
      toast.success("Chave PIX copiada com sucesso!");
    } catch {
      toast.error("Não foi possível copiar. Selecione a chave manualmente.");
    }
  };

  const waLink = `https://wa.me/${(content.whatsapp || "").replace(/\D/g, "")}?text=${encodeURIComponent("Olá! Quero ser voluntário(a) do Instituto Motivar.")}`;

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
            className="rounded-3xl bg-white p-8 sm:p-10 shadow-2xl"
            data-testid="pix-card"
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-brand-emerald/10 grid place-items-center text-brand-emerald">
                <QrCode size={24} />
              </div>
              <h3 className="font-display text-xl font-bold text-slate-900">Doe via PIX</h3>
            </div>
            <p className="mt-4 text-sm sm:text-base text-slate-500 leading-relaxed">{content.donate_text}</p>

            <div className="mt-6 rounded-2xl border-2 border-dashed border-brand-emerald/30 bg-brand-emerald/5 p-5">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Chave PIX</p>
              <p className="font-mono font-bold text-slate-900 text-base sm:text-lg break-all mt-1" data-testid="pix-key-value">
                {content.pix_key}
              </p>
              <p className="text-xs text-slate-400 mt-1.5">{content.pix_name} · CNPJ {content.cnpj}</p>
            </div>

            <button
              onClick={copyPix}
              data-testid="pix-copy-button"
              className="mt-5 w-full inline-flex items-center justify-center gap-2 bg-brand-emerald hover:bg-emerald-600 text-white font-bold px-6 py-3.5 rounded-full transition-colors"
            >
              <Copy size={17} />
              Copiar chave PIX
            </button>
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
                href={waLink}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="volunteer-submit-btn"
                className="mt-6 inline-flex items-center gap-2 bg-brand-yellow hover:bg-amber-400 text-slate-900 font-bold px-6 py-3.5 rounded-full transition-colors"
              >
                <HandHeart size={18} />
                Quero ser voluntário
              </a>
            </div>

            <div className="rounded-3xl bg-white/5 border border-white/10 px-8 py-6 flex items-start gap-4" data-testid="transparency-strip">
              <ShieldCheck className="text-brand-cyan shrink-0 mt-0.5" size={26} />
              <p className="text-sm text-white/70 leading-relaxed">
                <span className="font-bold text-white">Transparência:</span> associação registrada sob o CNPJ{" "}
                <span className="font-mono font-semibold text-white">{content.cnpj}</span>, reconhecida de utilidade pública
                pela Câmara Municipal de Feira de Santana. Todo recurso é integralmente revertido às ações.
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
