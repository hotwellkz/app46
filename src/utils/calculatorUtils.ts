import { CalculatorState, CostBreakdown } from '../types/calculator';

const getPricePerSqm = (area: number): number => {
  if (area >= 10 && area <= 24) return 131772;
  if (area >= 25 && area <= 49) return 109586;
  if (area >= 50 && area <= 74) return 89981;
  if (area >= 75 && area <= 99) return 86163;
  if (area >= 100 && area <= 149) return 75352;
  if (area >= 150 && area <= 199) return 65361;
  if (area >= 200 && area <= 249) return 61000;
  if (area >= 250 && area <= 299) return 56641;
  if (area >= 300 && area <= 349) return 56091;
  if (area >= 350 && area <= 399) return 54991;
  if (area >= 400 && area <= 499) return 53891;
  if (area >= 500 && area <= 1500) return 52791;
  return 0;
};

const getFloorAddition = (floors: string): number => {
  return floors === '1 этаж' ? 7295 : 1619;
};

const getFirstFloorHeightAddition = (height: string): number => {
  switch (height) {
    case '2,8 метра': return 3798;
    case '3,0 метра': return 5290;
    default: return 0;
  }
};

const getSecondFloorHeightAddition = (height: string): number => {
  switch (height) {
    case '2,8 метра': return 3798;
    case '3,0 метра': return 5290;
    default: return 0;
  }
};

const getRoofAddition = (roofType: string, floors: string): number => {
  if (roofType === '1-скатная') return 0;
  if (roofType === '2-скатная') return 1616;
  if (roofType === '4-скатная') {
    return floors === '1 этаж' ? 7085 : 4723;
  }
  return 0;
};

const getShapeAddition = (shape: string): number => {
  return shape === 'Сложная форма' ? 4676 : 0;
};

export const calculatePrice = (formData: CalculatorState) => {
  const area = parseFloat(formData.area) || 0;
  if (area < 10 || area > 1500) return { pricePerSqm: 0, totalPrice: 0 };

  const basePrice = getPricePerSqm(area);
  const floorAddition = getFloorAddition(formData.floors);
  const firstFloorHeightAddition = getFirstFloorHeightAddition(formData.firstFloorHeight);
  const secondFloorHeightAddition = formData.floors === '2 этажа' ? 
    getSecondFloorHeightAddition(formData.secondFloorHeight) : 0;
  const roofAddition = getRoofAddition(formData.roofType, formData.floors);
  const shapeAddition = getShapeAddition(formData.houseShape);

  const pricePerSqm = basePrice + floorAddition + firstFloorHeightAddition + 
    secondFloorHeightAddition + roofAddition + shapeAddition;

  const totalPrice = Math.round(pricePerSqm * area);

  return { pricePerSqm, totalPrice };
};

export const calculateCostBreakdown = (totalPrice: number): CostBreakdown => {
  return {
    foundation: Math.round(totalPrice * 0.14), // 14% на фундамент
    houseKit: Math.round(totalPrice * 0.71),   // 71% на домокомплект
    assembly: Math.round(totalPrice * 0.15)    // 15% на монтаж
  };
};