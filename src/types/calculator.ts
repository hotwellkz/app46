export interface CalculatorState {
  area: string;
  floors: string;
  firstFloorHeight: string;
  secondFloorHeight: string;
  roofType: string;
  houseShape: string;
}

export interface CostBreakdown {
  foundation: number;
  houseKit: number;
  assembly: number;
}