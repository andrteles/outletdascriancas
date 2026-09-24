export function formatPrice(value: number): string {
  return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
}

export function formatInstallments(value: number, installments = 6): string {
  const parcela = value / installments;
  return `${installments}x de ${formatPrice(parcela)} sem juros`;
}

export function formatInstallmentsComJuros(value: number, installments = 12, juros = 0.06): string {
  const parcela = (value * (1 + juros)) / installments;
  return `${installments}x de ${formatPrice(parcela)} com juros de ${Math.round(juros * 100)}%`;
}

export function formatPixPrice(value: number, discount = 0.05): string {
  return formatPrice(value * (1 - discount));
}
