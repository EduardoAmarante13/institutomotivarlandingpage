import { createContext, useContext, useEffect, useState, useCallback } from "react";
import api from "@/lib/api";

const SiteContext = createContext(null);

export function SiteProvider({ children }) {
  const [content, setContent] = useState({});
  const [acoes, setAcoes] = useState([]);
  const [galeria, setGaleria] = useState([]);
  const [loading, setLoading] = useState(true);

  const refresh = useCallback(async () => {
    try {
      const [c, a, g] = await Promise.all([
        api.get("/content"),
        api.get("/acoes"),
        api.get("/galeria"),
      ]);
      setContent(c.data);
      setAcoes(a.data);
      setGaleria(g.data);
    } catch (e) {
      console.error("Erro ao carregar conteúdo do site", e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return (
    <SiteContext.Provider value={{ content, acoes, galeria, loading, refresh }}>
      {children}
    </SiteContext.Provider>
  );
}

export const useSite = () => useContext(SiteContext);
