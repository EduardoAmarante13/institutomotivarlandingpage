import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api, { apiError } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { toast } from "sonner";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LogOut, Plus, Pencil, Trash2, Upload, ExternalLink, Star } from "lucide-react";

const CATEGORIAS = ["Reabilitação", "Jurídico", "Assistência", "Eventos", "Educação", "Geral"];
const STATUS = ["Em Andamento", "Recorrente", "Concluído"];

const TEXT_GROUPS = [
  {
    title: "Hero (topo do site)",
    fields: [
      { key: "hero_eyebrow", label: "Selo acima do título" },
      { key: "hero_title", label: "Título principal" },
      { key: "hero_subtitle", label: "Subtítulo", textarea: true },
      { key: "hero_image", label: "Imagem principal", image: true },
      { key: "stat_familias", label: "Número de famílias (ex.: 50+ famílias)" },
      { key: "stat_anos", label: "Tempo de atuação (ex.: desde 2022)" },
      { key: "stat_voluntario", label: "Selo voluntário (ex.: 100% voluntário)" },
    ],
  },
  {
    title: "Quem Somos & Presidente",
    fields: [
      { key: "about_title", label: "Título da seção" },
      { key: "about_text", label: "Texto sobre o instituto", textarea: true },
      { key: "president_name", label: "Nome da presidente" },
      { key: "president_role", label: "Cargo" },
      { key: "president_bio", label: "Biografia", textarea: true },
      { key: "president_photo", label: "Foto da presidente", image: true },
    ],
  },
  {
    title: "Doações, Contato & Transparência",
    fields: [
      { key: "pix_key", label: "Chave PIX" },
      { key: "pix_name", label: "Nome do favorecido PIX" },
      { key: "donate_text", label: "Texto de doação", textarea: true },
      { key: "volunteer_text", label: "Texto de voluntariado", textarea: true },
      { key: "whatsapp", label: "WhatsApp (só números, com DDD e 55)" },
      { key: "email", label: "E-mail" },
      { key: "instagram", label: "Link do Instagram" },
      { key: "endereco", label: "Endereço" },
      { key: "cnpj", label: "CNPJ" },
    ],
  },
];

function ImageField({ value, onChange, testid }) {
  const [busy, setBusy] = useState(false);
  const upload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const r = await api.post("/admin/upload", fd);
      onChange(r.data.url);
      toast.success("Imagem enviada!");
    } catch (err) {
      toast.error(apiError(err, "Falha no envio da imagem"));
    } finally {
      setBusy(false);
    }
  };
  return (
    <div className="space-y-2">
      {value && <img src={value} alt="Prévia" className="h-24 w-40 object-cover rounded-xl border border-slate-200" data-testid={`${testid}-preview`} />}
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Cole a URL da imagem ou envie um arquivo"
        data-testid={testid}
        className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan/50"
      />
      <label className="inline-flex items-center gap-2 text-xs font-bold text-brand-blue cursor-pointer hover:text-brand-cyan transition-colors" data-testid={`${testid}-upload-btn`}>
        <Upload size={14} />
        {busy ? "Enviando…" : "Enviar arquivo (máx. 2 MB)"}
        <input type="file" accept="image/*" className="hidden" onChange={upload} />
      </label>
    </div>
  );
}

function TextosTab() {
  const [content, setContent] = useState({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("/content").then((r) => setContent(r.data)).catch(() => toast.error("Erro ao carregar textos"));
  }, []);

  const save = async () => {
    setSaving(true);
    try {
      const keys = TEXT_GROUPS.flatMap((g) => g.fields.map((f) => f.key));
      await Promise.all(keys.map((key) => api.put("/admin/content", { key, value: content[key] ?? "" })));
      toast.success("Textos atualizados no site!");
    } catch (err) {
      toast.error(apiError(err, "Erro ao salvar"));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-10">
      {TEXT_GROUPS.map((group) => (
        <div key={group.title} className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8">
          <h3 className="font-display font-bold text-lg text-slate-900 mb-6">{group.title}</h3>
          <div className="grid md:grid-cols-2 gap-5">
            {group.fields.map((f) => (
              <div key={f.key} className={f.textarea || f.image ? "md:col-span-2" : ""}>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">{f.label}</label>
                {f.image ? (
                  <ImageField
                    value={content[f.key] || ""}
                    onChange={(v) => setContent((c) => ({ ...c, [f.key]: v }))}
                    testid={`field-${f.key}`}
                  />
                ) : f.textarea ? (
                  <textarea
                    rows={4}
                    value={content[f.key] || ""}
                    onChange={(e) => setContent((c) => ({ ...c, [f.key]: e.target.value }))}
                    data-testid={`field-${f.key}`}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan/50"
                  />
                ) : (
                  <input
                    type="text"
                    value={content[f.key] || ""}
                    onChange={(e) => setContent((c) => ({ ...c, [f.key]: e.target.value }))}
                    data-testid={`field-${f.key}`}
                    className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan/50"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      ))}
      <button
        onClick={save}
        disabled={saving}
        data-testid="save-texts-btn"
        className="bg-brand-blue hover:bg-brand-cyan disabled:opacity-60 text-white font-bold px-8 py-3.5 rounded-full transition-colors"
      >
        {saving ? "Salvando…" : "Salvar todos os textos"}
      </button>
    </div>
  );
}

const EMPTY_ACAO = { titulo: "", descricao: "", categoria: "Geral", status: "Em Andamento", imagem: "", data: "", destaque: false };

function AcoesTab() {
  const [acoes, setAcoes] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_ACAO);
  const [editId, setEditId] = useState(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    api.get("/acoes").then((r) => setAcoes(r.data)).catch(() => toast.error("Erro ao carregar ações"));
  }, []);
  useEffect(load, [load]);

  const openNew = () => { setForm(EMPTY_ACAO); setEditId(null); setOpen(true); };
  const openEdit = (a) => {
    setForm({ titulo: a.titulo, descricao: a.descricao, categoria: a.categoria, status: a.status, imagem: a.imagem, data: a.data, destaque: a.destaque });
    setEditId(a.id);
    setOpen(true);
  };

  const save = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      if (editId) {
        await api.put(`/admin/acoes/${editId}`, form);
        toast.success("Ação atualizada!");
      } else {
        await api.post("/admin/acoes", form);
        toast.success("Ação criada!");
      }
      setOpen(false);
      load();
    } catch (err) {
      toast.error(apiError(err, "Erro ao salvar ação"));
    } finally {
      setBusy(false);
    }
  };

  const remove = async (a) => {
    if (!window.confirm(`Excluir a ação "${a.titulo}"?`)) return;
    try {
      await api.delete(`/admin/acoes/${a.id}`);
      toast.success("Ação excluída");
      load();
    } catch (err) {
      toast.error(apiError(err, "Erro ao excluir"));
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <p className="text-sm text-slate-500">{acoes.length} ação(ões) cadastrada(s)</p>
        <button onClick={openNew} data-testid="new-action-btn" className="inline-flex items-center gap-2 bg-brand-blue hover:bg-brand-cyan text-white font-bold px-5 py-2.5 rounded-full text-sm transition-colors">
          <Plus size={16} /> Nova ação
        </button>
      </div>

      <div className="grid gap-4">
        {acoes.map((a, i) => (
          <div key={a.id} className="rounded-2xl border border-slate-100 bg-white p-4 sm:p-5 flex items-center gap-4" data-testid={`admin-action-${i}`}>
            {a.imagem && <img src={a.imagem} alt="" className="w-16 h-16 rounded-xl object-cover shrink-0 hidden sm:block" />}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h4 className="font-display font-bold text-slate-900">{a.titulo}</h4>
                {a.destaque && <Star size={14} className="text-brand-yellow fill-current" />}
              </div>
              <p className="text-xs text-slate-400 font-semibold mt-0.5">{a.categoria} · {a.status}{a.data ? ` · ${a.data}` : ""}</p>
            </div>
            <button onClick={() => openEdit(a)} data-testid={`edit-action-${i}`} className="p-2.5 rounded-xl text-slate-400 hover:text-brand-blue hover:bg-brand-cyan/10 transition-colors">
              <Pencil size={17} />
            </button>
            <button onClick={() => remove(a)} data-testid={`delete-action-${i}`} className="p-2.5 rounded-xl text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
              <Trash2 size={17} />
            </button>
          </div>
        ))}
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto" data-testid="action-form-dialog">
          <DialogHeader>
            <DialogTitle className="font-display">{editId ? "Editar ação" : "Nova ação social"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={save} className="space-y-4 mt-2">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Título</label>
              <input required value={form.titulo} onChange={(e) => setForm({ ...form, titulo: e.target.value })} data-testid="action-title-input" className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan/50" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Descrição</label>
              <textarea rows={3} value={form.descricao} onChange={(e) => setForm({ ...form, descricao: e.target.value })} data-testid="action-desc-input" className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan/50" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Categoria</label>
                <select value={form.categoria} onChange={(e) => setForm({ ...form, categoria: e.target.value })} data-testid="action-category-select" className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-cyan/50">
                  {CATEGORIAS.map((c) => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Status</label>
                <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} data-testid="action-status-select" className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-cyan/50">
                  {STATUS.map((s) => <option key={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Quando (ex.: Toda semana)</label>
              <input value={form.data} onChange={(e) => setForm({ ...form, data: e.target.value })} data-testid="action-date-input" className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan/50" />
            </div>
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Imagem</label>
              <ImageField value={form.imagem} onChange={(v) => setForm({ ...form, imagem: v })} testid="action-image-input" />
            </div>
            <label className="flex items-center gap-2.5 text-sm font-semibold text-slate-600 cursor-pointer">
              <input type="checkbox" checked={form.destaque} onChange={(e) => setForm({ ...form, destaque: e.target.checked })} data-testid="action-featured-check" className="w-4 h-4 accent-brand-blue" />
              Marcar como destaque
            </label>
            <button type="submit" disabled={busy} data-testid="action-save-btn" className="w-full bg-brand-blue hover:bg-brand-cyan disabled:opacity-60 text-white font-bold px-6 py-3 rounded-full transition-colors">
              {busy ? "Salvando…" : "Salvar ação"}
            </button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function GaleriaTab() {
  const [fotos, setFotos] = useState([]);
  const [url, setUrl] = useState("");
  const [legenda, setLegenda] = useState("");
  const [busy, setBusy] = useState(false);

  const load = useCallback(() => {
    api.get("/galeria").then((r) => setFotos(r.data)).catch(() => toast.error("Erro ao carregar galeria"));
  }, []);
  useEffect(load, [load]);

  const add = async (e) => {
    e.preventDefault();
    if (!url) return toast.error("Envie ou cole a URL de uma imagem");
    setBusy(true);
    try {
      await api.post("/admin/galeria", { url, legenda, ordem: fotos.length + 1 });
      toast.success("Foto adicionada à galeria!");
      setUrl("");
      setLegenda("");
      load();
    } catch (err) {
      toast.error(apiError(err, "Erro ao adicionar foto"));
    } finally {
      setBusy(false);
    }
  };

  const remove = async (f) => {
    if (!window.confirm("Excluir esta foto?")) return;
    try {
      await api.delete(`/admin/galeria/${f.id}`);
      toast.success("Foto excluída");
      load();
    } catch (err) {
      toast.error(apiError(err, "Erro ao excluir"));
    }
  };

  return (
    <div>
      <form onSubmit={add} className="rounded-3xl border border-slate-100 bg-white p-6 sm:p-8 mb-8" data-testid="gallery-add-form">
        <h3 className="font-display font-bold text-lg text-slate-900 mb-5">Adicionar foto</h3>
        <div className="grid md:grid-cols-[1fr_240px_auto] gap-4 items-end">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Imagem</label>
            <ImageField value={url} onChange={setUrl} testid="gallery-url-input" />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">Legenda</label>
            <input value={legenda} onChange={(e) => setLegenda(e.target.value)} data-testid="gallery-caption-input" className="w-full rounded-xl border border-slate-200 px-3.5 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-cyan/50" placeholder="Ex.: Ação de Natal 2025" />
          </div>
          <button type="submit" disabled={busy} data-testid="gallery-add-btn" className="inline-flex items-center gap-2 bg-brand-blue hover:bg-brand-cyan disabled:opacity-60 text-white font-bold px-6 py-3 rounded-full text-sm transition-colors">
            <Plus size={16} /> Adicionar
          </button>
        </div>
      </form>

      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {fotos.map((f, i) => (
          <div key={f.id} className="group relative rounded-2xl overflow-hidden aspect-square border border-slate-100" data-testid={`admin-photo-${i}`}>
            <img src={f.url} alt={f.legenda} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-3">
              <p className="text-white text-xs font-semibold text-center">{f.legenda || "Sem legenda"}</p>
              <button onClick={() => remove(f)} data-testid={`delete-photo-${i}`} className="inline-flex items-center gap-1.5 bg-red-500 hover:bg-red-600 text-white text-xs font-bold px-3.5 py-2 rounded-full transition-colors">
                <Trash2 size={13} /> Excluir
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50" data-testid="admin-dashboard">
      <header className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
          <p className="font-display font-extrabold text-lg tracking-tight">
            <span className="text-brand-cyan">instituto</span> <span className="text-brand-blue">motivar</span>
            <span className="ml-3 text-xs font-sans font-bold uppercase tracking-wider text-slate-400">Painel</span>
          </p>
          <div className="flex items-center gap-3">
            <Link to="/" data-testid="view-site-link" className="hidden sm:inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-brand-blue transition-colors">
              <ExternalLink size={14} /> Ver site
            </Link>
            <span className="text-xs text-slate-400 hidden md:block">{user?.email}</span>
            <button onClick={logout} data-testid="admin-logout-btn" className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-red-500 transition-colors">
              <LogOut size={14} /> Sair
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 sm:px-6 py-10">
        <Tabs defaultValue="acoes" data-testid="admin-tabs">
          <TabsList className="bg-white border border-slate-100 p-1 rounded-full mb-8">
            <TabsTrigger value="acoes" data-testid="tab-acoes" className="rounded-full">Ações Sociais</TabsTrigger>
            <TabsTrigger value="galeria" data-testid="tab-galeria" className="rounded-full">Galeria de Fotos</TabsTrigger>
            <TabsTrigger value="textos" data-testid="tab-textos" className="rounded-full">Textos do Site</TabsTrigger>
          </TabsList>
          <TabsContent value="acoes"><AcoesTab /></TabsContent>
          <TabsContent value="galeria"><GaleriaTab /></TabsContent>
          <TabsContent value="textos"><TextosTab /></TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
