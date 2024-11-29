export interface EstimateValue {
  value: number;
  isChecked: boolean;
}

export interface EstimateValues {
  [key: string]: EstimateValue;
}

export interface EstimateRow {
  label: string;
  value: number | string;
  unit?: string;
  isHeader?: boolean;
  isRed?: boolean;
  isChecked?: boolean;
  onChange?: (value: number) => void;
  onCheckChange?: (checked: boolean) => void;
}