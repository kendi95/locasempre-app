export function amountFormat(amount: string, currency: 'BRL' | 'USD' = 'BRL') {
  if (currency === 'BRL') {
    let v = amount.replace(/\D/g,'');
    v = (Number(v) / 100).toFixed(2) + '';
    v = v.replace(".", ",");

    return v.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  }

  let v = amount.replace(/\D/g,'');
  v = (Number(v) / 100).toFixed(2) + '';
  v = v.replace(",", ".");

  return v.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1');
}