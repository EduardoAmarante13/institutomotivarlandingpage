import { motion } from "framer-motion";
import { ArrowRight, HandHeart, Puzzle, Sparkles } from "lucide-react";
import { useSite } from "@/context/SiteContext";

export default function Hero() {
  const { content } = useSite();

  return (
    <section id="topo" className="relative overflow-hidden pt-28 sm:pt-36 pb-16 sm:pb-24" data-testid="hero-section">
      <div className="absolute -top-32 -left-32 w-[420px] h-[420px] rounded-full bg-brand-cyan/15 blur-3xl" />
      <div className="absolute top-40 -right-40 w-[480px] h-[480px] rounded-full bg-brand-purple/10 blur-3xl" />
      <Puzzle className="absolute top-28 left-[8%] text-brand-magenta/25 animate-floaty hidden md:block" size={44} style={{ "--tilt": "-12deg" }} />
      <Puzzle className="absolute bottom-16 right-[6%] text-brand-cyan/30 animate-floaty-slow hidden md:block" size={56} style={{ "--tilt": "14deg" }} />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 grid lg:grid-cols-[1.05fr_0.95fr] gap-12 lg:gap-8 items-center">
        <div>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            data-testid="hero-eyebrow"
            className="text-xs uppercase tracking-[0.22em] font-bold text-brand-cyan mb-5"
          >
            {content.hero_eyebrow || "Associação sem fins lucrativos"}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            data-testid="hero-title"
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-[1.04] text-slate-900"
          >
            {content.hero_title || "Motivar é transformar vidas."}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            data-testid="hero-subtitle"
            className="mt-6 text-base sm:text-lg leading-relaxed text-slate-600 max-w-xl"
          >
            {content.hero_subtitle}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mt-9 flex flex-wrap gap-4"
          >
            <a
              href="#ajudar"
              data-testid="hero-donate-btn"
              className="inline-flex items-center gap-2 bg-brand-blue hover:bg-brand-cyan text-white font-bold px-7 py-3.5 rounded-full transition-colors duration-300 shadow-lg shadow-brand-blue/25"
            >
              <HandHeart size={18} />
              Quero ajudar
            </a>
            <a
              href="#acoes"
              data-testid="hero-actions-btn"
              className="inline-flex items-center gap-2 border-2 border-slate-200 hover:border-brand-cyan text-slate-700 hover:text-brand-blue font-bold px-7 py-3.5 rounded-full transition-colors duration-300"
            >
              Conhecer as ações
              <ArrowRight size={17} />
            </a>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="relative"
        >
          <div className="blob-mask overflow-hidden shadow-2xl shadow-brand-blue/20 aspect-[4/4.4] sm:aspect-[4/4] max-w-md mx-auto">
            <img
              src={content.hero_image}
              alt="Comunidade atendida pelo Instituto Motivar"
              data-testid="hero-image"
              className="w-full h-full object-cover"
            />
          </div>

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.55 }}
            data-testid="hero-stat-familias"
            className="absolute top-8 -left-2 sm:left-2 bg-white rounded-2xl shadow-xl shadow-brand-blue/10 px-5 py-4"
          >
            <p className="font-display font-extrabold text-brand-blue text-xl leading-none">{content.stat_familias || "50+"}</p>
            <p className="text-xs text-slate-500 mt-1 font-medium">acompanhadas pela equipe</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.7 }}
            data-testid="hero-stat-voluntario"
            className="absolute bottom-10 -right-2 sm:right-4 bg-white rounded-2xl shadow-xl shadow-brand-blue/10 px-5 py-4 flex items-center gap-3"
          >
            <Sparkles className="text-brand-yellow" size={26} />
            <div>
              <p className="font-display font-extrabold text-slate-900 text-xl leading-none">{content.stat_voluntario || "100%"}</p>
              <p className="text-xs text-slate-500 mt-1 font-medium">trabalho voluntário</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
