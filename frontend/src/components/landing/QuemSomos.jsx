import { motion } from "framer-motion";
import { HeartHandshake, Scale, Puzzle, Users } from "lucide-react";
import { useSite } from "@/context/SiteContext";

const PILLARS = [
  { icon: Puzzle, color: "text-brand-cyan bg-brand-cyan/10", title: "Inclusão", text: "Cada pessoa é uma peça única — e todas completam o nosso coração." },
  { icon: HeartHandshake, color: "text-brand-magenta bg-brand-magenta/10", title: "Acolhimento", text: "Escuta ativa e afeto para famílias que chegam em busca de apoio." },
  { icon: Scale, color: "text-brand-purple bg-brand-purple/10", title: "Cidadania", text: "Acesso a direitos, benefícios e justiça para quem mais precisa." },
  { icon: Users, color: "text-brand-blue bg-brand-blue/10", title: "Comunidade", text: "Voluntários, famílias e parceiros construindo juntos a transformação." },
];

export default function QuemSomos() {
  const { content } = useSite();

  return (
    <section id="quem-somos" className="py-20 sm:py-28 bg-white relative overflow-hidden" data-testid="quem-somos-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-start">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
          >
            <p className="text-xs uppercase tracking-[0.22em] font-bold text-brand-cyan mb-4">Quem somos</p>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900" data-testid="about-title">
              {content.about_title}
            </h2>
            <p className="mt-6 text-base leading-relaxed text-slate-600" data-testid="about-text">
              {content.about_text}
            </p>

            <div className="mt-10 grid sm:grid-cols-2 gap-5">
              {PILLARS.map((p, i) => (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.08 }}
                  className="rounded-2xl border border-slate-100 bg-slate-50/60 p-5 card-hover"
                  data-testid={`pillar-card-${i}`}
                >
                  <div className={`w-11 h-11 rounded-xl grid place-items-center ${p.color}`}>
                    <p.icon size={22} />
                  </div>
                  <h3 className="font-display font-bold text-slate-900 mt-4">{p.title}</h3>
                  <p className="text-sm text-slate-500 mt-1.5 leading-relaxed">{p.text}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="lg:sticky lg:top-28"
          >
            <div className="relative rounded-3xl bg-gradient-to-br from-brand-cyan/15 via-white to-brand-blue/10 border border-brand-blue/10 p-8 sm:p-10" data-testid="president-card">
              <Puzzle className="absolute -top-5 -right-4 text-brand-magenta/30 animate-floaty" size={52} style={{ "--tilt": "18deg" }} />
              <div className="flex items-center gap-5">
                <img
                  src={content.president_photo}
                  alt={content.president_name}
                  data-testid="president-photo"
                  className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl object-cover shadow-lg shadow-brand-blue/20 border-4 border-white"
                />
                <div>
                  <p className="text-xs uppercase tracking-[0.18em] font-bold text-brand-magenta">Presidência</p>
                  <h3 className="font-display text-xl sm:text-2xl font-extrabold text-slate-900 mt-1" data-testid="president-name">
                    {content.president_name}
                  </h3>
                  <p className="text-sm font-semibold text-brand-blue" data-testid="president-role">{content.president_role}</p>
                </div>
              </div>
              <p className="mt-6 text-base leading-relaxed text-slate-600" data-testid="president-bio">
                {content.president_bio}
              </p>
              <div className="mt-7 pt-6 border-t border-brand-blue/10 flex flex-wrap gap-x-8 gap-y-2 text-sm">
                <span className="font-semibold text-slate-500">Fundado em <span className="text-brand-blue font-bold">{content.stat_anos || "2022"}</span></span>
                <span className="font-semibold text-slate-500">Reconhecido de <span className="text-brand-blue font-bold">utilidade pública</span></span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
