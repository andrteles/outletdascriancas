import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Menu, X } from "lucide-react";

import heroGaveta from "@/assets/hero-gaveta.jpg";
import vestidoCanelado from "@/assets/vestido-canelado.jpg";
import conjuntinhoMalha from "@/assets/conjuntinho-malha.jpg";
import moletomCapuz from "@/assets/moletom-capuz.jpg";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Gaveta · Roupas infantis de algodão orgânico" },
      {
        name: "description",
        content:
          "Peças de algodão orgânico para crianças de 0 a 12 anos. Coleções por idade, cores de tintura suave e troca fácil em 30 dias.",
      },
      { property: "og:title", content: "Gaveta · Roupas infantis de algodão orgânico" },
      {
        property: "og:description",
        content:
          "Algodão orgânico, cortes generosos e cores que envelhecem bem. Do recém-nascido aos 12 anos.",
      },
      { property: "og:type", content: "website" },
      { property: "og:locale", content: "pt_BR" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
    links: [{ rel: "canonical", href: "https://gaveta.com.br/" }],
  }),
  component: Home,
});

const navegacao = [
  { rotulo: "Recém-nascido", href: "#idades" },
  { rotulo: "1–3 anos", href: "#idades" },
  { rotulo: "4–7 anos", href: "#idades" },
  { rotulo: "8–12 anos", href: "#idades" },
  { rotulo: "Coleções", href: "#vitrine" },
];

const faixas = [
  { faixa: "0–6 meses", titulo: "Recém-nascido", quantidade: "42 peças" },
  { faixa: "1–3 anos", titulo: "Primeiros passos", quantidade: "68 peças" },
  { faixa: "4–7 anos", titulo: "Escola & brincar", quantidade: "94 peças" },
  { faixa: "8–12 anos", titulo: "Pré-adolescente", quantidade: "51 peças" },
];

const tintas = [
  { nome: "Sálvia", cor: "bg-swatch-salvia" },
  { nome: "Creme", cor: "bg-swatch-creme" },
  { nome: "Terra", cor: "bg-swatch-terra" },
  { nome: "Céu", cor: "bg-swatch-ceu" },
];

const promessas = [
  {
    rotulo: "Trocas",
    titulo: "30 dias, sem burocracia",
    texto: "Troque ou devolva em qualquer loja física ou pelo correio.",
  },
  {
    rotulo: "Parcelamento",
    titulo: "Até 6x sem juros",
    texto: "Cartão, PIX com 5% de desconto ou boleto.",
  },
  {
    rotulo: "Depoimento",
    titulo: "“Cada peça dura anos.”",
    texto: "— Marina, mãe de dois, São Paulo",
  },
];

function Home() {
  const [menuAberto, setMenuAberto] = useState(false);
  const [assinado, setAssinado] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-background font-body text-foreground antialiased">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute -top-40 -left-40 size-[600px] rounded-full bg-primary/15 blur-[120px]" />
        <div className="absolute top-1/3 -right-40 size-[500px] rounded-full bg-accent/15 blur-[120px]" />
        <div className="absolute bottom-0 left-1/3 size-[400px] rounded-full bg-primary/10 blur-[100px]" />
      </div>

      <div className="bg-foreground py-2.5 text-center text-[11px] font-mono tracking-[0.15em] text-background uppercase">
        Frete grátis acima de R$ 299 · Troca em até 30 dias
      </div>

      <header className="glass-strong sticky top-0 z-40">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
          <div className="flex items-center gap-10">
            <a href="#" className="font-display text-2xl font-semibold tracking-tight">
              gaveta
            </a>
            <nav className="hidden items-center gap-6 text-sm md:flex">
              {navegacao.map((item) => (
                <a
                  key={item.rotulo}
                  href={item.href}
                  className="text-muted-foreground transition-colors hover:text-primary"
                >
                  {item.rotulo}
                </a>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <div className="glass hidden items-center gap-2 rounded-full px-4 py-2 text-sm text-muted-foreground lg:flex">
              <span>Buscar</span>
              <span className="font-medium text-foreground">body de algodão</span>
            </div>
            <button
              type="button"
              className="glass rounded-full px-4 py-2 text-sm transition-colors hover:bg-foreground hover:text-background"
            >
              Sacola
            </button>
            <button
              type="button"
              aria-label={menuAberto ? "Fechar menu" : "Abrir menu"}
              onClick={() => setMenuAberto((aberto) => !aberto)}
              className="glass grid size-9 place-items-center rounded-full transition-colors hover:bg-foreground hover:text-background md:hidden"
            >
              {menuAberto ? <X className="size-4" /> : <Menu className="size-4" />}
            </button>
          </div>
        </div>

        {menuAberto ? (
          <nav className="border-t border-border px-6 py-3 md:hidden">
            <ul className="flex flex-col gap-1 text-sm">
              {navegacao.map((item) => (
                <li key={item.rotulo}>
                  <a
                    href={item.href}
                    onClick={() => setMenuAberto(false)}
                    className="block py-2 text-muted-foreground transition-colors hover:text-primary"
                  >
                    {item.rotulo}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </header>

      <section className="mx-auto max-w-7xl px-6 pt-12 pb-20">
        <div className="grid grid-cols-12 items-end gap-6">
          <div className="col-span-12 animate-rise lg:col-span-5">
            <p className="eyebrow mb-6 animate-fade text-primary [animation-delay:100ms]">
              Coleção outono 2026
            </p>
            <h1 className="animate-rise text-6xl leading-[0.95] font-medium text-balance tracking-tight [animation-delay:150ms] md:text-7xl font-display">
              Peças que
              <br />
              <em className="font-semibold text-primary italic">dobram</em> bem
              <br />
              na gaveta.
            </h1>
            <p className="mt-6 max-w-[42ch] text-base text-pretty text-muted-foreground animate-rise [animation-delay:250ms]">
              Algodão orgânico, cortes generosos e cores que envelhecem bem. Feito para o quarto da
              criança, não para a vitrine.
            </p>
            <div className="mt-8 flex animate-rise items-center gap-3 [animation-delay:350ms]">
              <a
                href="#vitrine"
                className="rounded-full bg-foreground px-6 py-3 text-sm font-medium text-background transition-colors hover:bg-primary"
              >
                Ver coleção
              </a>
              <a
                href="#tecidos"
                className="glass rounded-full px-6 py-3 text-sm font-medium transition-colors hover:bg-foreground hover:text-background"
              >
                Nossas tecelagens
              </a>
            </div>
          </div>

          <div className="col-span-12 animate-rise [animation-delay:200ms] lg:col-span-7">
            <div className="relative">
              <img
                src={heroGaveta}
                alt="Body de algodão orgânico dobrados em uma gaveta de carvalho"
                width={1408}
                height={1008}
                className="aspect-[4/3] w-full rounded-[28px] bg-surface object-cover outline-1 -outline-offset-1 outline-black/5"
              />
              <div className="glass-strong absolute -bottom-6 -left-6 max-w-[240px] rounded-2xl px-5 py-4">
                <p className="font-mono text-[10px] tracking-[0.15em] text-muted-foreground uppercase">
                  Peça da semana
                </p>
                <p className="mt-1 text-lg font-medium font-display">Body de malha fina</p>
                <p className="mt-0.5 text-sm text-muted-foreground">R$ 89,00 · 0–24 meses</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="idades" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="eyebrow mb-2 text-muted-foreground">(a) Por idade</p>
            <h2 className="text-4xl font-medium text-balance tracking-tight font-display">
              Comece pela idade
            </h2>
          </div>
          <a
            href="#vitrine"
            className="hidden text-sm text-muted-foreground transition-colors hover:text-foreground md:inline-flex"
          >
            Ver todas as faixas →
          </a>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {faixas.map((item) => (
            <a
              key={item.titulo}
              href="#vitrine"
              className="glass lift rounded-2xl p-5 transition-colors hover:bg-surface"
            >
              <p className="font-mono text-[10px] tracking-[0.15em] text-muted-foreground uppercase">
                {item.faixa}
              </p>
              <p className="mt-2 text-2xl font-medium font-display">{item.titulo}</p>
              <p className="mt-1 text-sm text-muted-foreground">{item.quantidade}</p>
            </a>
          ))}
        </div>
      </section>

      <section id="vitrine" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="eyebrow mb-2 text-muted-foreground">(b) Em destaque</p>
            <h2 className="text-4xl font-medium text-balance tracking-tight font-display">
              O que está na vitrine
            </h2>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-4">
          <article className="glass lift col-span-12 overflow-hidden rounded-[28px] md:col-span-7">
            <div className="relative">
              <img
                src={vestidoCanelado}
                alt="Vestido de malha canelada em terracotta em cabide de madeira"
                width={1200}
                height={912}
                loading="lazy"
                className="aspect-[4/3] w-full bg-surface object-cover outline-1 -outline-offset-1 outline-black/5"
              />
              <span className="absolute top-4 left-4 rounded-full bg-accent px-3 py-1.5 font-mono text-[10px] tracking-[0.15em] text-foreground uppercase">
                Novidade
              </span>
            </div>
            <div className="p-6">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-2xl font-medium font-display">Vestido de malha canelada</p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    4–7 anos · algodão orgânico
                  </p>
                </div>
                <p className="text-2xl font-medium whitespace-nowrap font-display">R$ 189,00</p>
              </div>
              <p className="mt-3 text-sm text-muted-foreground">Em 6x de R$ 31,50 sem juros</p>
            </div>
          </article>

          <div className="col-span-12 flex flex-col gap-4 md:col-span-5">
            <article className="glass lift flex items-center gap-4 rounded-2xl p-5">
              <img
                src={conjuntinhoMalha}
                alt="Conjuntinho de malha creme dobrado sobre madeira clara"
                width={816}
                height={816}
                loading="lazy"
                className="size-24 shrink-0 rounded-xl bg-surface object-cover outline-1 -outline-offset-1 outline-black/5"
              />
              <div className="min-w-0 flex-1">
                <p className="text-lg leading-tight font-medium font-display">
                  Conjuntinho de malha
                </p>
                <p className="mt-0.5 text-sm text-muted-foreground">1–3 anos</p>
                <p className="mt-2 text-sm font-medium">R$ 129,00</p>
              </div>
              <span className="shrink-0 rounded-full bg-primary/10 px-2.5 py-1 font-mono text-[10px] tracking-[0.15em] text-primary uppercase">
                Esgotando
              </span>
            </article>

            <article className="glass lift flex items-center gap-4 rounded-2xl p-5">
              <img
                src={moletomCapuz}
                alt="Moletom com capuz verde sálvia em cabide de madeira"
                width={816}
                height={816}
                loading="lazy"
                className="size-24 shrink-0 rounded-xl bg-surface object-cover outline-1 -outline-offset-1 outline-black/5"
              />
              <div className="min-w-0 flex-1">
                <p className="text-lg leading-tight font-medium font-display">Moletom com capuz</p>
                <p className="mt-0.5 text-sm text-muted-foreground">4–7 anos</p>
                <p className="mt-2 text-sm font-medium">R$ 159,00</p>
              </div>
              <span className="shrink-0 rounded-full bg-accent/15 px-2.5 py-1 font-mono text-[10px] tracking-[0.15em] text-accent uppercase">
                Novidade
              </span>
            </article>
          </div>
        </div>
      </section>

      <section id="tecidos" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-16">
        <div className="glass-strong grid grid-cols-12 items-center gap-8 rounded-[32px] p-8 md:p-12">
          <div className="col-span-12 md:col-span-5">
            <p className="eyebrow mb-3 text-muted-foreground">(c) Tecidos</p>
            <h2 className="text-4xl leading-[1.05] font-medium text-balance tracking-tight md:text-5xl font-display">
              Algodão orgânico,
              <br />
              <em className="italic">tintura</em> suave.
            </h2>
            <p className="mt-5 max-w-[40ch] text-pretty text-muted-foreground">
              Fios certificados GOTS, tingidos com pigmentos de baixo impacto. Cada cor da coleção é
              uma amostra da nossa paleta de gaveta.
            </p>
          </div>
          <div className="col-span-12 md:col-span-7">
            <div className="grid grid-cols-4 gap-3">
              {tintas.map((tinta) => (
                <div key={tinta.nome} className="swatch">
                  <div
                    className={`aspect-square rounded-2xl ${tinta.cor} outline-1 -outline-offset-1 outline-black/5`}
                  />
                  <p className="mt-2 font-mono text-[10px] tracking-[0.1em] text-muted-foreground uppercase">
                    {tinta.nome}
                  </p>
                </div>
              ))}
            </div>
            <p className="mt-4 font-mono text-xs tracking-wide text-muted-foreground">
              GOTS · OEKO-TEX · feito no Brasil
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {promessas.map((promessa) => (
            <div key={promessa.rotulo} className="glass rounded-2xl p-6">
              <p className="font-mono text-[10px] tracking-[0.15em] text-muted-foreground uppercase">
                {promessa.rotulo}
              </p>
              <p className="mt-2 text-xl font-medium font-display">{promessa.titulo}</p>
              <p className="mt-2 text-sm text-muted-foreground">{promessa.texto}</p>
            </div>
          ))}
        </div>
      </section>

      <footer className="glass-strong mt-12 border-t border-border">
        <div className="mx-auto grid max-w-7xl grid-cols-12 gap-8 px-6 py-14">
          <div className="col-span-12 md:col-span-5">
            <p className="text-3xl font-semibold tracking-tight font-display">gaveta</p>
            <p className="mt-3 max-w-[36ch] text-sm text-muted-foreground">
              Roupas infantis de algodão orgânico, feitas para durar e para serem herdadas.
            </p>
            <form
              className="mt-6 flex max-w-sm gap-2"
              onSubmit={(evento) => {
                evento.preventDefault();
                if (email.trim()) setAssinado(true);
              }}
            >
              <input
                type="email"
                required
                value={email}
                onChange={(evento) => {
                  setEmail(evento.target.value);
                  setAssinado(false);
                }}
                placeholder="seu@email.com"
                aria-label="Seu e-mail para receber novidades"
                className="glass min-w-0 flex-1 rounded-full px-4 py-2.5 text-sm placeholder:text-muted-foreground focus:ring-1 focus:ring-primary focus:outline-none"
              />
              <button
                type="submit"
                className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-primary"
              >
                Assinar
              </button>
            </form>
            <p
              className={`mt-3 text-sm text-primary transition-opacity ${assinado ? "opacity-100" : "opacity-0"}`}
            >
              Pronto — novidades da coleção a caminho.
            </p>
          </div>

          <div className="col-span-6 md:col-span-2">
            <p className="mb-3 font-mono text-[10px] tracking-[0.15em] text-muted-foreground uppercase">
              Loja
            </p>
            <ul className="space-y-2 text-sm">
              {faixas.map((item) => (
                <li key={item.titulo}>
                  <a href="#idades" className="transition-colors hover:text-primary">
                    {item.titulo}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-span-6 md:col-span-2">
            <p className="mb-3 font-mono text-[10px] tracking-[0.15em] text-muted-foreground uppercase">
              Ajuda
            </p>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="transition-colors hover:text-primary">
                  Trocas
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-primary">
                  Frete
                </a>
              </li>
              <li>
                <a href="#" className="transition-colors hover:text-primary">
                  Guia de tamanhos
                </a>
              </li>
            </ul>
          </div>

          <div className="col-span-12 md:col-span-3">
            <p className="mb-3 font-mono text-[10px] tracking-[0.15em] text-muted-foreground uppercase">
              Contato
            </p>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>ola@gaveta.com.br</li>
              <li>(11) 90000-0000</li>
              <li>Seg–Sex, 9h–18h</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border">
          <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-5 font-mono text-xs tracking-wide text-muted-foreground md:flex-row">
            <p>© 2026 Gaveta · CNPJ 00.000.000/0001-00</p>
            <p>Feito no Brasil · Algodão orgânico</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
