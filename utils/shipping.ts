import { CartItem } from '../types';

/**
 * Calculates shipping cost based on the strict Two-Tier Logic for T.S. & A.P.
 * 
 * Tier 1: Weight < 1kg (1000g) -> Flat ₹80
 * Tier 2: Weight >= 1kg -> ₹80 base + ₹50 for every additional kg (or part thereof)
 * 
 * Note: The prompt formula cutoff was interpreted as standard courier logic:
 * Base Rate + (Ceiling((TotalWeight - BaseWeight)/1000) * AdditionalRate)
 */
export const calculateShipping = (items: CartItem[]): { totalWeight: number, cost: number } => {
  const totalWeight = items.reduce((sum, item) => sum + (item.weight * item.quantity), 0);
  
  let cost = 0;

  if (totalWeight < 1000) {
    // Tier 1
    cost = 80;
  } else {
    // Tier 2
    const baseRate = 80;
    const additionalWeight = totalWeight - 1000;
    // Assuming ₹50 per additional kg or part thereof (standard courier practice for this region)
    const additionalCharges = Math.ceil(additionalWeight / 1000) * 50;
    cost = baseRate + additionalCharges;
  }

  return { totalWeight, cost };
};

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
};