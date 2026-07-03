// WHO Anthropometric Standards and Nutrition Analysis Engine

import {
  ChildData,
  NutritionStatus,
  RiskLevel,
  NutritionAnalysisResult,
  ClassificationDetails,
  MedicalRecommendation,
} from '../types';

/**
 * MUAC (Mid-Upper Arm Circumference) Classification
 * Based on WHO standards for children 6-59 months
 */
export function classifyMUAC(muac: number): { status: string; severity: RiskLevel } {
  if (muac < 11.5) {
    return {
      status: 'Severe Acute Malnutrition (SAM)',
      severity: 'High',
    };
  } else if (muac >= 11.5 && muac < 12.5) {
    return {
      status: 'Moderate Acute Malnutrition (MAM)',
      severity: 'Medium',
    };
  } else {
    return {
      status: 'Normal MUAC',
      severity: 'Low',
    };
  }
}

/**
 * Calculate BMI (Body Mass Index)
 * BMI = weight (kg) / (height (m))²
 */
export function calculateBMI(weight: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return parseFloat((weight / (heightM * heightM)).toFixed(1));
}

/**
 * BMI Classification
 * WHO standards for children adapted from adult categories
 */
export function classifyBMI(bmi: number): { status: string; severity: RiskLevel } {
  if (bmi < 18.5) {
    return {
      status: 'Underweight',
      severity: 'High',
    };
  } else if (bmi >= 18.5 && bmi < 25) {
    return {
      status: 'Normal',
      severity: 'Low',
    };
  } else if (bmi >= 25 && bmi < 30) {
    return {
      status: 'Overweight',
      severity: 'Medium',
    };
  } else {
    return {
      status: 'Obesity',
      severity: 'High',
    };
  }
}

/**
 * Determine Overall Nutrition Status
 * Priority: MUAC classification takes precedence
 */
export function determineNutritionStatus(muac: number, bmi: number): NutritionStatus {
  // MUAC takes priority for acute malnutrition detection
  if (muac < 11.5) return 'SAM';
  if (muac >= 11.5 && muac < 12.5) return 'MAM';

  // BMI-based classification for other statuses
  if (bmi < 18.5) return 'Underweight';
  if (bmi >= 25 && bmi < 30) return 'Overweight';
  if (bmi >= 30) return 'Obesity';

  return 'Normal';
}

/**
 * Determine Risk Level based on nutrition status
 */
export function determineRiskLevel(status: NutritionStatus): RiskLevel {
  switch (status) {
    case 'SAM':
      return 'High';
    case 'MAM':
    case 'Underweight':
    case 'Overweight':
      return 'Medium';
    case 'Obesity':
      return 'Medium';
    default:
      return 'Low';
  }
}

/**
 * Generate detailed classification based on multiple indicators
 */
export function generateClassificationDetails(
  muac: number,
  bmi: number,
  age: number,
  height: number
): ClassificationDetails {
  const muacStatus = classifyMUAC(muac).status;
  const bmiStatus = classifyBMI(bmi).status;

  // Simple stunting detection (height below expected for age)
  // WHO standards: ~75cm at 24 months
  const expectedHeightAt24m = 75;
  const stunting = age >= 24 && height < expectedHeightAt24m;

  const wasting = muac < 12.5;
  const underweight = bmi < 18.5;

  const riskFactors: string[] = [];
  if (wasting) riskFactors.push('Acute malnutrition (wasting)');
  if (stunting) riskFactors.push('Chronic malnutrition (stunting)');
  if (underweight) riskFactors.push('Low weight for height');
  if (muac < 11.5) riskFactors.push('Critical nutritional status');

  return {
    muacStatus,
    bmiStatus,
    wasting,
    stunting,
    underweight,
    riskFactors,
  };
}

/**
 * Generate WHO-based medical recommendations
 */
export function generateMedicalRecommendation(
  status: NutritionStatus,
  age: number,
  riskFactors: string[]
): MedicalRecommendation {
  let recommendation: MedicalRecommendation;

  switch (status) {
    case 'SAM':
      recommendation = {
        nutrition:
          'URGENT: Therapeutic feeding required. Start with therapeutic milk (F-100) with continuous care and monitoring',
        followUp: 'Daily monitoring for first week, then twice weekly',
        referral: 'Immediate hospitalization or intensive outpatient care (OTP)',
        priority: 'urgent',
      };
      break;

    case 'MAM':
      recommendation = {
        nutrition:
          'Supplementary feeding program recommended. Use fortified supplementary foods or RUSF (Ready-to-Use Supplementary Food)',
        followUp: 'Weekly monitoring for 8 weeks',
        referral: 'Community-based nutrition program or health center',
        priority: 'high',
      };
      break;

    case 'Underweight':
      recommendation = {
        nutrition:
          'Balanced diet with adequate calories and micronutrients. Increase protein intake and local nutrient-dense foods',
        followUp: 'Monthly monitoring',
        referral: 'Community health worker or nutrition counseling',
        priority: 'medium',
      };
      break;

    case 'Overweight':
      recommendation = {
        nutrition: 'Balanced diet with portion control. Increase physical activity and reduce energy-dense foods',
        followUp: 'Quarterly monitoring',
        referral: 'Health education and lifestyle counseling',
        priority: 'medium',
      };
      break;

    case 'Obesity':
      recommendation = {
        nutrition:
          'Structured weight management program with balanced diet and exercise plan. Monitor for metabolic complications',
        followUp: 'Bi-monthly monitoring',
        referral: 'Health center or pediatric clinic',
        priority: 'high',
      };
      break;

    default: // Normal
      recommendation = {
        nutrition: 'Maintain current diet with adequate micronutrients',
        followUp: 'Annual or scheduled child health checks',
        referral: 'Routine child health services',
        priority: 'low',
      };
  }

  return recommendation;
}

/**
 * Main Analysis Function
 * Performs complete nutrition analysis for a child
 */
export function analyzeChildNutrition(child: ChildData): NutritionAnalysisResult {
  const bmi = calculateBMI(child.weight, child.height);
  const nutritionStatus = determineNutritionStatus(child.muac, bmi);
  const riskLevel = determineRiskLevel(nutritionStatus);

  const classificationDetails = generateClassificationDetails(
    child.muac,
    bmi,
    child.age,
    child.height
  );

  const medicalRec = generateMedicalRecommendation(
    nutritionStatus,
    child.age,
    classificationDetails.riskFactors
  );

  const classification =
    `${nutritionStatus} - ${classificationDetails.muacStatus} / ${classificationDetails.bmiStatus}. ` +
    `Risk Factors: ${classificationDetails.riskFactors.length > 0 ? classificationDetails.riskFactors.join(', ') : 'None identified'}`;

  return {
    childId: child.id || '',
    name: child.name,
    age: child.age,
    sex: child.sex,
    weight: child.weight,
    height: child.height,
    muac: child.muac,
    bmi: parseFloat(bmi.toFixed(1)),
    nutritionStatus,
    riskLevel,
    classification,
    recommendation: medicalRec.nutrition,
    referralSuggestion: medicalRec.referral,
    timestamp: new Date(),
  };
}

/**
 * Batch analysis for multiple children
 */
export function analyzeMultipleChildren(children: ChildData[]): NutritionAnalysisResult[] {
  return children.map((child) => analyzeChildNutrition(child));
}
