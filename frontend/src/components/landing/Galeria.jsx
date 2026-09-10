import { useState } from "react";
import { motion } from "framer-motion";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Camera } from "lucide-react";
import { useSite } from "@/context/SiteContext";

export default function Galeria() {
  const { galeria, loading } = useSite();
  const [selecionada, setSelecionada] = useState(null);

  if (!loading && galeria.length === 0) return null;

  return (
    <section id="galeria" className="py-20 sm:py-28" data-testid="galeria-section">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-xl">
          <p className="text-xs uppercase tracking-[0.22em] font-bold text-brand-cyan mb-4">Galeria</p>
          <h2 className="font-display text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-slate-900">
            Momentos que <span className="text-gradient-motivar">motivam</span>
          </h2>
        </div>

        <div className="mt-12 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4" data-testid="galeria-grid">
          {galeria.map((foto, i) => (
            <motion.button
              key={foto.id}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: (i % 4) * 0.06 }}
              onClick={() => setSelecionada(foto)}
              data-testid={`gallery-photo-${i}`}
              className="group relative rounded-2xl overflow-hidden aspect-square focus:outline-none focus:ring-4 focus:ring-brand-cyan/40"
            >
              <img
                src={foto.url}
                alt={foto.legenda || "Registro do Instituto Motivar"}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-brand-blue/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-4">
                <span className="text-white text-sm font-semibold text-left inline-flex items-center gap-2">
                  <Camera size={15} /> {foto.legenda || "Ver foto"}
                </span>
              </div>
            </motion.button>
          ))}
        </div>
      </div>

      <Dialog open={!!selecionada} onOpenChange={() => setSelecionada(null)}>
        <DialogContent className="max-w-3xl p-2 sm:p-3 bg-slate-900 border-none" data-testid="gallery-lightbox">
          {selecionada && (
            <div>
              <img src={selecionada.url} alt={selecionada.legenda} className="w-full max-h-[75vh] object-contain rounded-xl" />
              {selecionada.legenda && (
                <p className="text-white/80 text-sm font-medium text-center py-3">{selecionada.legenda}</p>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
