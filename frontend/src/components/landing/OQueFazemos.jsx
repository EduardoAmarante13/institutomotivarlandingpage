import { motion } from "framer-motion";
import { Brain, Activity, Scale, ShoppingBasket, Trophy } from "lucide-react";

const AREAS = [
  {
    icon: Brain,
    color: "from-brand-cyan to-brand-blue",
    title: "Acolhimento Neurodiverso",
    text: "Suporte a pessoas com TEA (autismo), síndromes e deficiências diversas, com respeito à singularidade de cada um.",
  },
  {
    icon: Activity,
    color: "from-brand-magenta to-brand-purple",
    title: "Reabilitação Multidisciplinar",
    text: "Fisioterapia, psicologia, fonoaudiologia e terapias integradas conduzidas por profissionais voluntários.",
  },
  {
    icon: Scale,
    color: "from-brand-purple to-brand-blue",
    title: "Assistência Jurídica",
    text: "Orientação gratuita sobre BPC, direitos da pessoa com deficiência, benefícios e documentação.",
  },
  {
    icon: ShoppingBasket,
    color: "from-brand-yellow to-brand-magenta",
    title: "Famílias em Vulnerabilidade",
    text: "Cestas básicas, agasalhos e apoio emergencial para quem atravessa momentos de dificuldade.",
  },
  {
    icon: Trophy,
    color: "from-brand-blue to-brand-cyan",
    title: "Cultura, Esporte e Lazer",
    text: "Atividades recreativas e esportivas que promovem socialização, autoestima e alegria.",
  },
];

export default function OQueFazemos() {
  return (
    <section id="atendimentos" className="py-20 sm:py-28 relative overflow-hidden" data-testid="atendimentos-section">
      <div className="absolute top-1/3 -left-32 w-96 h-96 rounded-full bg-brand-cyan/10 blur-3xl" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="max-w-2xl">
          <p className="text-xs uppercase tracking-[0.22em] font-bold text-brand-cyan mb-4">O que fazemos</p>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
            Um atendimento para <span className="text-gradient-motivar">cada necessidade</span>
          </h2>
          <p className="mt-4 text-base text-slate-600 leading-relaxed">
            Diferentes patologias, condições e realidades. Uma única certeza: ninguém fica para trás.
          </p>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {AREAS.map((a, i) => (
            <motion.div
              key={a.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: i * 0.07 }}
              className={`rounded-3xl bg-white border border-slate-100 p-7 card-hover ${i === 0 ? "lg:col-span-2 lg:flex lg:items-center lg:gap-8" : ""}`}
              data-testid={`area-card-${i}`}
            >
              <div className={`shrink-0 w-14 h-14 rounded-2xl bg-gradient-to-br ${a.color} grid place-items-center text-white shadow-lg`}>
                <a.icon size={26} />
              </div>
              <div className="mt-5 lg:mt-0">
                <h3 className="font-display text-xl font-bold text-slate-900">{a.title}</h3>
                <p className="mt-2 text-sm sm:text-base text-slate-500 leading-relaxed">{a.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
