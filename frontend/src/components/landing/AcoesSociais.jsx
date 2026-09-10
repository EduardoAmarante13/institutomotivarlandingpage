import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Star, CalendarDays } from "lucide-react";
import { useSite } from "@/context/SiteContext";

const STATUS_STYLE = {
  "Concluído": "bg-slate-100 text-slate-600",
  "Em Andamento": "bg-amber-100 text-amber-700",
  "Recorrente": "bg-emerald-100 text-emerald-700",
};

export default function AcoesSociais() {
  const { acoes, loading } = useSite();
  const [filtro, setFiltro] = useState("Todas");

  const categorias = useMemo(
    () => ["Todas", ...new Set(acoes.map((a) => a.categoria).filter(Boolean))],
    [acoes]
  );
  const filtradas = filtro === "Todas" ? acoes : acoes.filter((a) => a.categoria === filtro);

  return (
    <section id="acoes" className="py-20 sm:py-28 bg-white" data-testid="acoes-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="text-xs uppercase tracking-[0.22em] font-bold text-brand-cyan mb-4">Ações sociais</p>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
              O que estamos fazendo <span className="text-gradient-motivar">agora</span>
            </h2>
          </div>
          <div className="flex flex-wrap gap-2" data-testid="acoes-filters">
            {categorias.map((c) => (
              <button
                key={c}
                data-testid={`filter-${c.toLowerCase().replace(/\s+/g, "-")}`}
                onClick={() => setFiltro(c)}
                className={`px-4 py-2 rounded-full text-sm font-bold transition-colors ${
                  filtro === c
                    ? "bg-brand-blue text-white"
                    : "bg-slate-100 text-slate-600 hover:bg-brand-cyan/15 hover:text-brand-blue"
                }`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <p className="mt-14 text-slate-400 text-sm" data-testid="acoes-loading">Carregando ações…</p>
        ) : filtradas.length === 0 ? (
          <p className="mt-14 text-slate-400 text-sm" data-testid="acoes-empty">Nenhuma ação nesta categoria ainda.</p>
        ) : (
          <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {filtradas.map((acao, i) => (
              <motion.article
                key={acao.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: (i % 3) * 0.08 }}
                className="group rounded-3xl overflow-hidden bg-slate-50 border border-slate-100 card-hover"
                data-testid={`project-card-${i}`}
              >
                <div className="relative aspect-[16/10] overflow-hidden">
                  {acao.imagem ? (
                    <img
                      src={acao.imagem}
                      alt={acao.titulo}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-brand-cyan/30 to-brand-blue/30" />
                  )}
                  <span className={`absolute top-4 left-4 text-xs font-bold px-3 py-1.5 rounded-full ${STATUS_STYLE[acao.status] || "bg-slate-100 text-slate-600"}`}>
                    {acao.status}
                  </span>
                  {acao.destaque && (
                    <span className="absolute top-4 right-4 bg-brand-yellow text-slate-900 text-xs font-bold px-3 py-1.5 rounded-full inline-flex items-center gap-1">
                      <Star size={12} className="fill-current" /> Destaque
                    </span>
                  )}
                </div>
                <div className="p-6">
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-cyan">{acao.categoria}</p>
                  <h3 className="font-display text-xl font-bold text-slate-900 mt-2">{acao.titulo}</h3>
                  <p className="mt-2.5 text-sm text-slate-500 leading-relaxed line-clamp-3">{acao.descricao}</p>
                  {acao.data && (
                    <p className="mt-4 inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400">
                      <CalendarDays size={13} /> {acao.data}
                    </p>
                  )}
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
