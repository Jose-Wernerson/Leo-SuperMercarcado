/**
 * Formata um valor numérico para o padrão monetário brasileiro
 * @param {number|string} valor - O valor a ser formatado
 * @returns {string} - Valor formatado como R$ 1.234,56
 */
export function formatarMoeda(valor) {
  const numero = typeof valor === 'string' ? parseFloat(valor) : valor;
  
  if (isNaN(numero)) {
    return 'R$ 0,00';
  }
  
  return numero.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

/**
 * Formata um valor numérico sem o símbolo R$
 * @param {number|string} valor - O valor a ser formatado
 * @returns {string} - Valor formatado como 1.234,56
 */
export function formatarNumero(valor) {
  const numero = typeof valor === 'string' ? parseFloat(valor) : valor;
  
  if (isNaN(numero)) {
    return '0,00';
  }
  
  return numero.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  });
}

export default formatarMoeda;
