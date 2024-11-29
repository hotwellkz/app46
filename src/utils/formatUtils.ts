export const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('ru-RU').format(Math.abs(amount)) + ' ₸';
};