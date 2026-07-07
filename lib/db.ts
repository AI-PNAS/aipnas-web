// Database utilities and Prisma client

import { PrismaClient } from '@prisma/client';
import { ChildData } from './types';
import { analyzeChildNutrition } from './nutrition/analyzer';

process.env.DATABASE_URL = process.env.DATABASE_URL || 'file:./prisma/dev.db';

// Singleton pattern for Prisma Client
const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

/**
 * Register a new child
 */
export async function registerChild(childData: ChildData) {
  try {
    const data = { ...childData };
    delete data.id;

    const child = await prisma.child.create({
      data,
    });
    return child;
  } catch (error) {
    console.error('Error registering child:', error);
    throw error;
  }
}

/**
 * Analyze nutrition status and save results
 */
export async function analyzeAndSaveNutrition(childId: string) {
  try {
    const child = await prisma.child.findUnique({
      where: { id: childId },
    });

    if (!child) throw new Error('Child not found');

    const childData = {
      ...child,
      sex: child.sex as 'M' | 'F',
    } as unknown as ChildData;

    const analysis = analyzeChildNutrition(childData);

    // Update child record with analysis results
    await prisma.child.update({
      where: { id: childId },
      data: {
        bmi: analysis.bmi,
        nutritionStatus: analysis.nutritionStatus,
        riskLevel: analysis.riskLevel,
        classification: analysis.classification,
        recommendation: analysis.recommendation,
        referralSuggestion: analysis.referralSuggestion,
        reportSummary: analysis.reportSummary,
        physicalSignAlerts: analysis.physicalSignAlerts.join(' | '),
        vitalSignAlerts: analysis.vitalSignAlerts.join(' | '),
        weightForAgeZ: analysis.zScores.weightForAge.value,
        heightForAgeZ: analysis.zScores.heightForAge.value,
        weightForHeightZ: analysis.zScores.weightForHeight.value,
        bmiForAgeZ: analysis.zScores.bmiForAge.value,
        muacZ: analysis.zScores.muac.value,
      },
    });

    // Log the analysis
    await prisma.analysisLog.create({
      data: {
        childId,
        analysis: JSON.stringify(analysis),
      },
    });

    return analysis;
  } catch (error) {
    console.error('Error analyzing nutrition:', error);
    throw error;
  }
}

/**
 * Get all children
 */
export async function getAllChildren() {
  try {
    return await prisma.child.findMany({
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Error fetching children:', error);
    throw error;
  }
}

/**
 * Get children by risk level
 */
export async function getChildrenByRiskLevel(riskLevel: string) {
  try {
    return await prisma.child.findMany({
      where: { riskLevel },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Error fetching children by risk level:', error);
    throw error;
  }
}

/**
 * Get single child by ID
 */
export async function getChildById(id: string) {
  try {
    return await prisma.child.findUnique({
      where: { id },
    });
  } catch (error) {
    console.error('Error fetching child:', error);
    throw error;
  }
}

/**
 * Update child data
 */
export async function updateChild(id: string, data: Partial<ChildData>) {
  try {
    return await prisma.child.update({
      where: { id },
      data,
    });
  } catch (error) {
    console.error('Error updating child:', error);
    throw error;
  }
}

/**
 * Delete child record
 */
export async function deleteChild(id: string) {
  try {
    await prisma.analysisLog.deleteMany({
      where: { childId: id },
    });
    return await prisma.child.delete({
      where: { id },
    });
  } catch (error) {
    console.error('Error deleting child:', error);
    throw error;
  }
}

/**
 * Get analysis history for a child
 */
export async function getAnalysisHistory(childId: string) {
  try {
    return await prisma.analysisLog.findMany({
      where: { childId },
      orderBy: { createdAt: 'desc' },
    });
  } catch (error) {
    console.error('Error fetching analysis history:', error);
    throw error;
  }
}
