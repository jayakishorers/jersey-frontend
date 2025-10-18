export const calculateDeliveryCharges = (itemCount: number): number => {
  if (itemCount === 0) return 0;
  if (itemCount === 1) return 50;
  return 50 + (itemCount - 1) * 10;
};