/**
 * Converte string em notação de engenharia para número float
 * Exemplos: "1k" -> 1000, "2.5M" -> 2500000, "100m" -> 0.1, "47µ" -> 0.000047
 */
function parseEngNotation(value) {
  // Remove espaços em branco
  const str = value.toString().trim();
  
  // Se for vazio, retorna NaN
  if (!str) return NaN;
  
  // Mapeamento dos sufixos de engenharia
  const suffixes = {
    'T': 1e12,   // Tera
    'G': 1e9,    // Giga
    'M': 1e6,    // Mega
    'k': 1e3,    // kilo
    'K': 1e3,    // kilo (alternativo)
    '': 1,       // unidade
    'm': 1e-3,   // mili
    'u': 1e-6,   // micro (u como substituto)
    'µ': 1e-6,   // micro
    'n': 1e-9,   // nano
    'p': 1e-12,  // pico
    'f': 1e-15   // femto
  };
  
  // Verifica se é infinito usando regex
  // Aceita: inf, infinity, infnty, ifty, ∞ (com sinal opcional)
  const infRegex = /^([+-]?)(?:inf(?:inity|nty)?|ifty|∞)$/i;
  const infMatch = str.match(infRegex);
  
  if (infMatch) {
    return infMatch[1] === '-' ? -Infinity : Infinity;
  }
  
  // Regex para capturar número e sufixo
  // Aceita: 1.5k, 1,5k, -2.3M, +100m, etc
  const regex = /^([+-]?\d+[.,]?\d*)\s*([TGMkKmuµnpf]?)$/;
  const match = str.match(regex);
  
  if (!match) {
    // Se não corresponder ao padrão, tenta converter diretamente
    const num = parseFloat(str.replace(',', '.'));
    return isNaN(num) ? NaN : num;
  }
  
  // Normaliza o número (substitui vírgula por ponto)
  const number = parseFloat(match[1].replace(',', '.'));
  const suffix = match[2];
  
  // Multiplica pelo fator correspondente
  const multiplier = suffixes[suffix] || 1;
  
  return number * multiplier;
}