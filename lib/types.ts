// Core types for AI-PNAS application

export type Sex = 'M' | 'F';

export interface ChildData {
  id?: string;
  name: string;
  age: number; // months
  sex: Sex;
  weight: number; // kg
  height: number; // cm
  muac: number; // cm
  headCircumference?: number;
  chestCircumference?: number;
}

export type NutritionStatus = 'SAM' | 'MAM' | 'Underweight' | 'Normal' | 'Overweight' | 'Obesity';
export type RiskLevel = 'Low' | 'Medium' | 'High';

export interface NutritionAnalysisResult {
  childId: string;
  name: string;
  age: number;
  sex: Sex;
  weight: number;
  height: number;
  muac: number;
  bmi: number;
  nutritionStatus: NutritionStatus;
  riskLevel: RiskLevel;
  classification: string;
  recommendation: string;
  referralSuggestion: string;
  timestamp: Date;
}

export interface ClassificationDetails {
  muacStatus: string;
  bmiStatus: string;
  wasting: boolean;
  stunting: boolean;
  underweight: boolean;
  riskFactors: string[];
}

export interface MedicalRecommendation {
  nutrition: string;
  followUp: string;
  referral: string;
  priority: 'urgent' | 'high' | 'medium' | 'low';
}
