// Database utilities and Prisma client

import { PrismaClient } from '@prisma/client';
import { ChildData } from './types';
import { analyzeChildNutrition } from './nutrition/analyzer';
import { SessionUser } from './session';

const isNextBuild = process.env.NEXT_PHASE === 'phase-production-build';

if (!process.env.DATABASE_URL) {
  if (process.env.NODE_ENV === 'production' && !isNextBuild) {
    throw new Error('DATABASE_URL must be configured in the Vercel project environment.');
  }

  process.env.DATABASE_URL = 'file:./prisma/dev.db';
}

// Singleton pattern for Prisma Client
const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : [],
  });

globalForPrisma.prisma = prisma;

/**
 * Register a new child
 */
export async function registerChild(
  childData: Omit<ChildData, 'weight' | 'height' | 'muac'> &
    Partial<Pick<ChildData, 'weight' | 'height' | 'muac'>>,
  userId: string,
) {
  try {
    const data = { ...childData };
    delete data.id;
    const weight = data.weight;
    const height = data.height;
    const muac = data.muac;
    delete data.weight;
    delete data.height;
    delete data.muac;

    const child = await prisma.child.create({
      data: {
        ...data,
        createdById: userId,
        ...(typeof weight === 'number' ? { weight } : {}),
        ...(typeof height === 'number' ? { height } : {}),
        ...(typeof muac === 'number' ? { muac } : {}),
      },
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
    if (
      typeof child.weight !== 'number' ||
      typeof child.height !== 'number' ||
      typeof child.muac !== 'number'
    ) {
      return null;
    }

    const childData = {
      ...child,
      sex: child.sex as 'M' | 'F',
    } as unknown as ChildData;

    const analysis = await analyzeChildNutrition(childData);

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
export async function getAllChildren(user: SessionUser) {
  try {
    return await prisma.child.findMany({
      where: user.role === 'health_professional' ? undefined : { createdById: user.id },
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
export async function getChildrenByRiskLevel(riskLevel: string, user: SessionUser) {
  try {
    return await prisma.child.findMany({
      where: {
        riskLevel,
        ...(user.role === 'health_professional' ? {} : { createdById: user.id }),
      },
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
export async function getChildById(id: string, user?: SessionUser) {
  try {
    const child = await prisma.child.findUnique({
      where: { id },
    });
    if (!child || (user?.role !== 'health_professional' && child.createdById !== user?.id)) return null;
    return child;
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
