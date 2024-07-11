type LanguageProps = 'pt-BR' | 'en-US'
type StringNumericLiteral = `${number}` | "Infinity" | "-Infinity" | "+Infinity";

export function currencyFormat(price: number | StringNumericLiteral, language: LanguageProps = 'pt-BR', addSufix = true) {
  const currency = language === 'pt-BR' ? "BRL" : "USD"

  if (addSufix) {
    return new Intl.NumberFormat(language, { currency, style: 'currency' }).format(price)
  }

  return new Intl.NumberFormat(language, { currency, style: 'currency', currencyDisplay: 'code' }).format(price).replace(currency, '').trim()
}