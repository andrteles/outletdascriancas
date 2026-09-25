#!/usr/bin/env node
// Vincula src/data/products.json aos produtos já importados na Zedy via integração Shopify.
// Só faz leitura na API da Zedy (GET /products paginado) — não cria nada, sem risco de escrita em produção.
//
// A Zedy gera seu próprio "handle" a partir do título (não é o handle original da Shopify), então
// não dá pra buscar produto por handle. Em vez disso casamos pelo SKU de cada variante: a Zedy
// importa o sku igual ao id de variante da Shopify, que está salvo em scripts/shopify-skus.json
// (gerado por scripts/extract-shopify-skus.py a partir do products_export_1.csv).
//
// Pré-requisitos:
//   1. Integração Shopify -> Zedy feita e o import concluído
//      (https://help.zedy.com.br/pt-BR/articles/13275143-como-integrar-a-zedy-na-shopify-atualizado-2026).
//   2. python3 scripts/extract-shopify-skus.py já rodado (gera scripts/shopify-skus.json).
//
// Uso:
//   node --env-file=.env scripts/link-zedy-products.mjs --limit 3
//   node --env-file=.env scripts/link-zedy-products.mjs
//
// É idempotente/retomável: pula produtos que já têm zedyVariantIds para todos os tamanhos.

import { writeFile, appendFile, readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";

const PRODUCTS_PATH = fileURLToPath(new URL("../src/data/products.json", import.meta.url));
const SHOPIFY_SKUS_PATH = fileURLToPath(new URL("../scripts/shopify-skus.json", import.meta.url));
const LOG_PATH = fileURLToPath(new URL("../scripts/link-zedy-products.log", import.meta.url));
const ZEDY_API_BASE = "https://app.zedy.com.br/api/loja/v1";
const PER_PAGE = 50;

const token = process.env.ZEDY_API_TOKEN;
const storeId = process.env.ZEDY_STORE_ID;
if (!token || !storeId) {
  console.error("ZEDY_API_TOKEN / ZEDY_STORE_ID não configurados (rode com --env-file=.env)");
  process.exit(1);
}

const limitArg = process.argv.find((arg) => arg.startsWith("--limit"));
const limit = limitArg
  ? Number(limitArg.split("=")[1] ?? process.argv[process.argv.indexOf(limitArg) + 1])
  : Infinity;

const headers = {
  Authorization: `Bearer ${token}`,
  "X-Store-Id": storeId,
  "Content-Type": "application/json",
};

async function log(line) {
  const entry = `[${new Date().toISOString()}] ${line}\n`;
  process.stdout.write(entry);
  await appendFile(LOG_PATH, entry);
}

function isFullySynced(product) {
  if (!product.zedyVariantIds) return false;
  return product.sizes.every((size) => Boolean(product.zedyVariantIds[size]));
}

async function saveProducts(products) {
  await writeFile(PRODUCTS_PATH, `${JSON.stringify(products, null, 2)}\n`, "utf8");
}

/** Busca todas as páginas de /products na Zedy e monta um mapa sku -> variantId. */
async function buildSkuToVariantIdMap() {
  const skuToVariantId = new Map();
  let page = 1;
  for (;;) {
    const response = await fetch(`${ZEDY_API_BASE}/products?page=${page}&per_page=${PER_PAGE}`, {
      headers,
    });
    if (!response.ok) {
      throw new Error(
        `HTTP ${response.status} ao listar produtos (página ${page}): ${await response.text()}`,
      );
    }
    const { products } = await response.json();
    if (!products || products.length === 0) break;

    for (const product of products) {
      for (const variant of product.variants ?? []) {
        if (variant.sku) skuToVariantId.set(variant.sku, variant.id);
      }
    }

    await log(
      `Página ${page}: ${products.length} produtos da Zedy lidos (total variantes mapeadas até agora: ${skuToVariantId.size})`,
    );
    if (products.length < PER_PAGE) break;
    page += 1;
  }
  return skuToVariantId;
}

async function main() {
  const raw = await import(PRODUCTS_PATH, { with: { type: "json" } });
  const products = raw.default;
  const shopifySkus = JSON.parse(await readFile(SHOPIFY_SKUS_PATH, "utf8"));

  const pending = products.filter((p) => !isFullySynced(p));
  await log(
    `${products.length} produtos no total, ${pending.length} pendentes, limite desta execução: ${limit === Infinity ? "sem limite" : limit}`,
  );

  await log("Buscando catálogo completo da Zedy pra montar o mapa sku -> variantId...");
  const skuToVariantId = await buildSkuToVariantIdMap();
  await log(`Mapa pronto: ${skuToVariantId.size} variantes na Zedy.`);

  let linked = 0;
  for (const product of pending) {
    if (linked >= limit) break;

    const sizeSkus = shopifySkus[product.handle];
    if (!sizeSkus) {
      await log(
        `PULADO ${product.slug}: handle "${product.handle}" não encontrado em shopify-skus.json`,
      );
      continue;
    }

    const variantIds = {};
    let missing = null;
    for (const size of product.sizes) {
      const sku = sizeSkus[size];
      const variantId = sku ? skuToVariantId.get(sku) : undefined;
      if (!variantId) {
        missing = { size, sku };
        break;
      }
      variantIds[size] = variantId;
    }

    if (missing) {
      await log(
        `ERRO ${product.slug}: sem variantId na Zedy pro tamanho "${missing.size}" (sku esperado: ${missing.sku ?? "desconhecido"})`,
      );
      continue;
    }

    product.zedyVariantIds = variantIds;
    linked += 1;
    await log(`OK  ${product.slug} -> ${JSON.stringify(variantIds)}`);
  }

  await saveProducts(products);
  await log(`Finalizado: ${linked} produtos vinculados nesta execução.`);
}

main().catch(async (err) => {
  await log(`FALHA GERAL: ${err.stack ?? err.message}`);
  process.exit(1);
});
