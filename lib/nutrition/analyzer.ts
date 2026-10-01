// WHO Anthropometric Standards and Nutrition Analysis Engine

import {
  ChildData,
  NutritionStatus,
  RiskLevel,
  NutritionAnalysisResult,
  ClassificationDetails,
  MedicalRecommendation,
  TrafficLight,
} from '../types';
import { calculateZScore } from '@pedi-growth/core';

function getTrafficLight(value: number): TrafficLight {
  if (value <= -3 || value >= 3) {
    return 'Red';
  }

  if (value <= -2 || value >= 2) {
    return 'Yellow';
  }

  return 'Green';
}

function buildZScore(
  observed: number,
  expected: number,
  metricName: string,
) {
  const standardDeviation: number = metricName.includes('Height')
    ? 1.1
    : metricName.includes('BMI')
      ? 1.0
      : metricName === 'MUAC'
        ? 0.9
        : 1.2;
  const normalizedScore = standardDeviation === 0 ? 0 : (observed - expected) / standardDeviation;
  const label = getTrafficLight(normalizedScore);

  return {
    value: parseFloat(normalizedScore.toFixed(2)),
    label,
    interpretation:
      label === 'Red'
        ? `${metricName} is critically outside the expected range`
        : label === 'Yellow'
          ? `${metricName} is moderately outside the expected range`
          : `${metricName} is within the expected range`,
  };
}

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
export function determineNutritionStatus(muac: number, bmi: number, bmiForAgeZ: number | null, ageMonths: number, edema = false): NutritionStatus {
  if (edema) return 'SAM';

  // MUAC takes priority for acute malnutrition detection
  if (ageMonths >= 6 && ageMonths < 60) {
    if (muac < 11.5) return 'SAM';
    if (muac < 12.5) return 'MAM';
  }

  // Use age-adjusted BMI when the WHO reference provides it.
  if (bmiForAgeZ !== null) {
    if (bmiForAgeZ < -2) return 'Underweight';
    if (bmiForAgeZ > 3) return 'Obesity';
    if (bmiForAgeZ > 2) return 'Overweight';
  }

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
export async function generateClassificationDetails(child: ChildData, bmi: number): Promise<ClassificationDetails> {
  const muacStatus = classifyMUAC(child.muac).status;
  const ageDays = Math.round(child.age * 365.25 / 12);
  const sex = child.sex === 'F' ? 'female' : 'male';
  const resultFor = async (indicator: Parameters<typeof calculateZScore>[0]['indicator'], measurement: number, lengthHeight?: number) => {
    try {
      return await calculateZScore({ indicator, sex, ageInDays: ageDays, measurement, lengthHeight });
    } catch (error) {
      console.warn(`WHO reference unavailable for ${indicator}:`, error);
      return null;
    }
  };
  const [weightForAgeResult, heightForAgeResult, weightForHeightResult, bmiForAgeResult] = await Promise.all([
    resultFor('weight-for-age', child.weight),
    resultFor('length-height-for-age', child.height),
    resultFor(child.measurementType === 'height' ? 'weight-for-height' : 'weight-for-length', child.weight, child.height),
    resultFor('bmi-for-age', bmi),
  ]);
  const unavailable = (interpretation: string): ClassificationDetails['zScores']['weightForAge'] => ({ value: null, label: 'Unavailable', interpretation });
  const score = (result: Awaited<ReturnType<typeof calculateZScore>>, name: string) => result
    ? { value: result.zScore, label: getTrafficLight(result.zScore), interpretation: `${name} z-score from WHO LMS reference` }
    : unavailable(`${name} cannot be calculated because the required WHO reference range is unavailable`);
  const weightForAge = score(weightForAgeResult, 'Weight-for-age');
  const heightForAge = score(heightForAgeResult, 'Length/height-for-age');
  const weightForHeight = score(weightForHeightResult, 'Weight-for-length/height');
  const bmiForAge = score(bmiForAgeResult, 'BMI-for-age');
  const muacScore = child.age >= 6 && child.age < 60
    ? buildZScore(child.muac, 12.5, 'MUAC')
    : unavailable('MUAC classification is intended for children aged 6-59 months');
  const bmiStatus = bmiForAge.value === null ? 'Unavailable' : bmiForAge.value < -2 ? 'Low BMI-for-age' : bmiForAge.value > 2 ? 'High BMI-for-age' : 'Normal BMI-for-age';

  const stunting = heightForAge.value !== null && heightForAge.value <= -2;
  const wasting = (weightForHeight.value !== null && weightForHeight.value <= -2) || (child.age >= 6 && child.age < 60 && child.muac < 12.5);
  const underweight = (weightForAge.value !== null && weightForAge.value <= -2) || (bmiForAge.value !== null && bmiForAge.value <= -2);

  const riskFactors: string[] = [];
  if (wasting) riskFactors.push('Acute malnutrition (wasting)');
  if (stunting) riskFactors.push('Chronic malnutrition (stunting)');
  if (underweight) riskFactors.push('Low weight for age');
  if (child.age >= 6 && child.age < 60 && child.muac < 11.5) riskFactors.push('Critical MUAC status');

  const physicalSignAlerts: string[] = [];
  if (child.edema) physicalSignAlerts.push('Edema observed, which can indicate kwashiorkor');
  if (child.skinChanges?.trim()) physicalSignAlerts.push(`Skin changes: ${child.skinChanges}`);
  if (child.hairChanges?.trim()) physicalSignAlerts.push(`Hair changes: ${child.hairChanges}`);
  if (child.eyeSigns?.trim()) physicalSignAlerts.push(`Eye signs: ${child.eyeSigns}`);
  if (child.oralSigns?.trim()) physicalSignAlerts.push(`Oral signs: ${child.oralSigns}`);
  if (child.hearingLossDevelopmentalDelay?.trim()) {
    physicalSignAlerts.push(`Developmental / hearing concern: ${child.hearingLossDevelopmentalDelay}`);
  }
  if (child.generalAppearance?.trim()) physicalSignAlerts.push(`General appearance: ${child.generalAppearance}`);

  const vitalSignAlerts: string[] = [];
  if (typeof child.bpSystolic === 'number' && typeof child.bpDiastolic === 'number') {
    if (child.bpSystolic >= 140 || child.bpDiastolic >= 90) {
      vitalSignAlerts.push('Blood pressure is elevated');
    }
    if (child.bpSystolic < 80 || child.bpDiastolic < 50) {
      vitalSignAlerts.push('Blood pressure is low');
    }
  }
  if (typeof child.pulseRate === 'number' && (child.pulseRate < 60 || child.pulseRate > 160)) {
    vitalSignAlerts.push('Pulse rate is outside the expected child range');
  }
  if (typeof child.rrRate === 'number' && (child.rrRate < 12 || child.rrRate > 40)) {
    vitalSignAlerts.push('Respiratory rate is outside the expected child range');
  }
  if (typeof child.temperature === 'number' && (child.temperature < 36 || child.temperature > 38.5)) {
    vitalSignAlerts.push('Temperature suggests hypo- or hyperthermia');
  }
  if (typeof child.spo2 === 'number' && child.spo2 < 94) {
    vitalSignAlerts.push('SpO2 is below the usual room-air target');
  }

  return {
    muacStatus,
    bmiStatus,
    wasting,
    stunting,
    underweight,
    riskFactors,
    physicalSignAlerts,
    vitalSignAlerts,
    zScores: {
      weightForAge,
      heightForAge,
      weightForHeight,
      bmiForAge,
      muac: muacScore,
    },
  };
}

/**
 * Generate WHO-based medical recommendations
 */
export function generateMedicalRecommendation(
  status: NutritionStatus,
  age: number,
  riskFactors: string[],
  physicalSignAlerts: string[],
  vitalSignAlerts: string[]
): MedicalRecommendation {
  let recommendation: MedicalRecommendation;
  const additionalFindings = [...physicalSignAlerts, ...vitalSignAlerts];
  const followUpNote =
    additionalFindings.length > 0
      ? ` Additional findings: ${additionalFindings.slice(0, 3).join('; ')}.`
      : '';

  switch (status) {
    case 'SAM':
      recommendation = {
        nutrition:
          'URGENT: Therapeutic feeding required. Start with therapeutic milk (F-100) with continuous care and monitoring' +
          followUpNote,
        followUp: 'Daily monitoring for the first week, then twice weekly',
        referral: 'Immediate hospitalization or intensive outpatient care (OTP)',
        priority: 'urgent',
      };
      break;

    case 'MAM':
      recommendation = {
        nutrition:
          'Supplementary feeding program recommended. Use fortified supplementary foods or RUSF (Ready-to-Use Supplementary Food)' +
          followUpNote,
        followUp: 'Weekly monitoring for 8 weeks',
        referral: 'Community-based nutrition program or health center',
        priority: 'high',
      };
      break;

    case 'Underweight':
      recommendation = {
        nutrition:
          'Balanced diet with adequate calories and micronutrients. Increase protein intake and local nutrient-dense foods' +
          followUpNote,
        followUp: 'Monthly monitoring',
        referral: 'Community health worker or nutrition counseling',
        priority: 'medium',
      };
      break;

    case 'Overweight':
      recommendation = {
        nutrition:
          'Balanced diet with portion control. Increase physical activity and reduce energy-dense foods' +
          followUpNote,
        followUp: 'Quarterly monitoring',
        referral: 'Health education and lifestyle counseling',
        priority: 'medium',
      };
      break;

    case 'Obesity':
      recommendation = {
        nutrition:
          'Structured weight management program with balanced diet and exercise plan. Monitor for metabolic complications' +
          followUpNote,
        followUp: 'Bi-monthly monitoring',
        referral: 'Health center or pediatric clinic',
        priority: 'high',
      };
      break;

    default: // Normal
      recommendation = {
        nutrition: 'Maintain current diet with adequate micronutrients' + followUpNote,
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
export async function analyzeChildNutrition(child: ChildData): Promise<NutritionAnalysisResult> {
  const bmi = calculateBMI(child.weight, child.height);
  const classificationDetails = await generateClassificationDetails(child, bmi);
  const nutritionStatus = determineNutritionStatus(
    child.muac,
    bmi,
    classificationDetails.zScores.bmiForAge.value,
    child.age,
    child.edema,
  );
  const riskLevel = determineRiskLevel(nutritionStatus);

  const medicalRec = generateMedicalRecommendation(
    nutritionStatus,
    child.age,
    classificationDetails.riskFactors,
    classificationDetails.physicalSignAlerts,
    classificationDetails.vitalSignAlerts
  );

  const classification =
    `${nutritionStatus} - ${classificationDetails.muacStatus} / ${classificationDetails.bmiStatus}. ` +
    `Risk Factors: ${classificationDetails.riskFactors.length > 0 ? classificationDetails.riskFactors.join(', ') : 'None identified'}. ` +
    `Physical Signs: ${classificationDetails.physicalSignAlerts.length > 0 ? classificationDetails.physicalSignAlerts.join(', ') : 'None reported'}. ` +
    `Vitals: ${classificationDetails.vitalSignAlerts.length > 0 ? classificationDetails.vitalSignAlerts.join(', ') : 'No concerning vital signs reported'}`;

  const reportSummary = [
    `Traffic lights: W/A ${classificationDetails.zScores.weightForAge.label}, H/A ${classificationDetails.zScores.heightForAge.label}, W/H ${classificationDetails.zScores.weightForHeight.label}, BMI/A ${classificationDetails.zScores.bmiForAge.label}, MUAC ${classificationDetails.zScores.muac.label}.`,
    classificationDetails.physicalSignAlerts.length > 0
      ? `Physical sign alerts: ${classificationDetails.physicalSignAlerts.join('; ')}`
      : 'No physical sign alerts reported.',
    classificationDetails.vitalSignAlerts.length > 0
      ? `Vital sign alerts: ${classificationDetails.vitalSignAlerts.join('; ')}`
      : 'No vital sign alerts reported.',
  ].join(' ');

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
    reportSummary,
    physicalSignAlerts: classificationDetails.physicalSignAlerts,
    vitalSignAlerts: classificationDetails.vitalSignAlerts,
    zScores: classificationDetails.zScores,
    timestamp: new Date(),
  };
}

/**
 * Batch analysis for multiple children
 */
export async function analyzeMultipleChildren(children: ChildData[]): Promise<NutritionAnalysisResult[]> {
  return Promise.all(children.map((child) => analyzeChildNutrition(child)));
}
