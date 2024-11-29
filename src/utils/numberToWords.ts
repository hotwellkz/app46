export function numberToWords(number: number): string {
  const units = ['', 'один', 'два', 'три', 'четыре', 'пять', 'шесть', 'семь', 'восемь', 'девять'];
  const teens = ['десять', 'одиннадцать', 'двенадцать', 'тринадцать', 'четырнадцать', 'пятнадцать', 'шестнадцать', 'семнадцать', 'восемнадцать', 'девятнадцать'];
  const tens = ['', '', 'двадцать', 'тридцать', 'сорок', 'пятьдесят', 'шестьдесят', 'семьдесят', 'восемьдесят', 'девяносто'];
  const hundreds = ['', 'сто', 'двести', 'триста', 'четыреста', 'пятьсот', 'шестьсот', 'семьсот', 'восемьсот', 'девятьсот'];
  const orders = [
    ['', '', ''],
    ['тысяча', 'тысячи', 'тысяч'],
    ['миллион', 'миллиона', 'миллионов'],
    ['миллиард', 'миллиарда', 'миллиардов']
  ];

  function getCase(n: number): number {
    if (n % 10 === 1 && n % 100 !== 11) return 0;
    if ([2, 3, 4].includes(n % 10) && ![12, 13, 14].includes(n % 100)) return 1;
    return 2;
  }

  function processGroup(n: number, order: number): string {
    if (n === 0) return '';
    
    let result = '';
    
    // Hundreds
    result += hundreds[Math.floor(n / 100)] + ' ';
    n %= 100;
    
    // Tens and units
    if (n >= 10 && n < 20) {
      result += teens[n - 10] + ' ';
      n = 0;
    } else {
      result += tens[Math.floor(n / 10)] + ' ';
      n %= 10;
    }
    
    // Units
    if (n > 0) {
      result += units[n] + ' ';
    }
    
    // Add order name if needed
    if (order > 0 && result.trim() !== '') {
      result += orders[order][getCase(Math.floor((number % 1000000) / 1000))] + ' ';
    }
    
    return result;
  }

  if (number === 0) return 'ноль';

  let result = '';
  let orderIndex = 0;
  
  while (number > 0) {
    const group = number % 1000;
    if (group !== 0) {
      result = processGroup(group, orderIndex) + result;
    }
    number = Math.floor(number / 1000);
    orderIndex++;
  }

  return result.trim() + ' тенге';
}