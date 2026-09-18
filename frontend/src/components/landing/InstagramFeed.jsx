import { Instagram, Users, LayoutGrid, MapPin } from "lucide-react";
import { useSite } from "@/context/SiteContext";

const POSTS = [
  "DbgrTyiD_tG",
  "Dbbmvjip8pu",
  "DZqa3WZD08M",
  "DZnrlKev-PR",
  "DZQgs8qD5w5",
  "DZI2UaYv26Q",
];

export default function InstagramFeed() {
  const { content } = useSite();

  return (
    <section id="instagram" className="py-20 sm:py-28 bg-white relative overflow-hidden" data-testid="instagram-section">
      <div className="absolute -bottom-24 -right-24 w-96 h-96 rounded-full bg-brand-magenta/8 blur-3xl" />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div className="max-w-xl">
            <p className="text-xs uppercase tracking-[0.22em] font-bold text-brand-magenta mb-4">Instagram</p>
            <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
              Acompanhe tudo <span className="text-gradient-motivar">de pertinho</span>
            </h2>
            <div className="mt-5 flex flex-wrap gap-x-7 gap-y-2 text-sm font-semibold text-slate-500" data-testid="instagram-stats">
              <span className="inline-flex items-center gap-1.5"><Users size={15} className="text-brand-magenta" /> 2,3 mil seguidores</span>
              <span className="inline-flex items-center gap-1.5"><LayoutGrid size={15} className="text-brand-magenta" /> 145 publicações</span>
              <span className="inline-flex items-center gap-1.5"><MapPin size={15} className="text-brand-magenta" /> Feira de Santana/BA</span>
            </div>
          </div>
          <a
            href={content.instagram}
            target="_blank"
            rel="noopener noreferrer"
            data-testid="instagram-follow-btn"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-brand-magenta to-brand-purple hover:opacity-90 text-white font-bold px-6 py-3.5 rounded-full transition-opacity"
          >
            <Instagram size={18} />
            Seguir @motivar.instituto
          </a>
        </div>

        <div className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6" data-testid="instagram-grid">
          {POSTS.map((code, i) => (
            <div
              key={code}
              data-testid={`instagram-post-${i}`}
              className="rounded-3xl overflow-hidden border border-slate-100 shadow-sm bg-slate-50"
            >
              <iframe
                src={`https://www.instagram.com/p/${code}/embed`}
                title={`Post do Instagram ${i + 1}`}
                className="w-full h-[580px] border-0"
                loading="lazy"
                scrolling="no"
                allowTransparency={true}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
