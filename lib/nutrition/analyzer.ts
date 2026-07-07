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

type WhoReferencePoint = {
  age: number;
  weight: number;
  height: number;
  bmi: number;
};

const WHO_REFERENCE: Record<'M' | 'F', WhoReferencePoint[]> = {
  M: [
    { age: 0, weight: 3.3, height: 49.9, bmi: 13.4 },
    { age: 6, weight: 7.9, height: 67.6, bmi: 17.2 },
    { age: 12, weight: 9.6, height: 75.7, bmi: 16.9 },
    { age: 24, weight: 12.2, height: 87.1, bmi: 16.4 },
    { age: 36, weight: 14.3, height: 95.0, bmi: 16.1 },
    { age: 48, weight: 16.3, height: 102.0, bmi: 15.8 },
    { age: 60, weight: 18.3, height: 109.2, bmi: 15.6 },
  ],
  F: [
    { age: 0, weight: 3.2, height: 49.1, bmi: 13.3 },
    { age: 6, weight: 7.3, height: 65.7, bmi: 17.0 },
    { age: 12, weight: 8.9, height: 74.0, bmi: 16.7 },
    { age: 24, weight: 11.5, height: 85.7, bmi: 16.2 },
    { age: 36, weight: 13.9, height: 94.1, bmi: 15.9 },
    { age: 48, weight: 16.0, height: 101.2, bmi: 15.7 },
    { age: 60, weight: 18.0, height: 108.2, bmi: 15.4 },
  ],
};

function interpolateReference(points: WhoReferencePoint[], ageMonths: number): WhoReferencePoint {
  if (ageMonths <= points[0].age) {
    return points[0];
  }

  if (ageMonths >= points[points.length - 1].age) {
    return points[points.length - 1];
  }

  const upperIndex = points.findIndex((point) => point.age >= ageMonths);
  const lower = points[upperIndex - 1];
  const upper = points[upperIndex];
  const span = upper.age - lower.age;
  const ratio = span === 0 ? 0 : (ageMonths - lower.age) / span;

  return {
    age: ageMonths,
    weight: lower.weight + (upper.weight - lower.weight) * ratio,
    height: lower.height + (upper.height - lower.height) * ratio,
    bmi: lower.bmi + (upper.bmi - lower.bmi) * ratio,
  };
}

function expectedWeight(ageMonths: number, sex: 'M' | 'F'): number {
  return interpolateReference(WHO_REFERENCE[sex], ageMonths).weight;
}

function expectedHeight(ageMonths: number, sex: 'M' | 'F'): number {
  return interpolateReference(WHO_REFERENCE[sex], ageMonths).height;
}

function expectedBmi(ageMonths: number, sex: 'M' | 'F'): number {
  return interpolateReference(WHO_REFERENCE[sex], ageMonths).bmi;
}

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
  child: ChildData,
  bmi: number
): ClassificationDetails {
  const muacStatus = classifyMUAC(child.muac).status;
  const bmiStatus = classifyBMI(bmi).status;

  const ageMonths = child.age;
  const weightForAge = buildZScore(child.weight, expectedWeight(ageMonths, child.sex), 'Weight-for-age');
  const heightForAge = buildZScore(child.height, expectedHeight(ageMonths, child.sex), 'Height-for-age');
  const expectedWeightForHeight = expectedBmi(ageMonths, child.sex) * Math.pow(child.height / 100, 2);
  const weightForHeight = buildZScore(child.weight, expectedWeightForHeight, 'Weight-for-height');
  const bmiForAge = buildZScore(bmi, expectedBmi(ageMonths, child.sex), 'BMI-for-age');
  const muacScore = buildZScore(child.muac, 12.5, 'MUAC');

  const stunting = heightForAge.value <= -2;
  const wasting = child.muac < 12.5 || bmiForAge.value <= -2;
  const underweight = weightForAge.value <= -2 || bmiForAge.value <= -2;

  const riskFactors: string[] = [];
  if (wasting) riskFactors.push('Acute malnutrition (wasting)');
  if (stunting) riskFactors.push('Chronic malnutrition (stunting)');
  if (underweight) riskFactors.push('Low weight for age');
  if (child.muac < 11.5) riskFactors.push('Critical nutritional status');

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
export function analyzeChildNutrition(child: ChildData): NutritionAnalysisResult {
  const bmi = calculateBMI(child.weight, child.height);
  const nutritionStatus = determineNutritionStatus(child.muac, bmi);
  const riskLevel = determineRiskLevel(nutritionStatus);

  const classificationDetails = generateClassificationDetails(child, bmi);

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
export function analyzeMultipleChildren(children: ChildData[]): NutritionAnalysisResult[] {
  return children.map((child) => analyzeChildNutrition(child));
}
