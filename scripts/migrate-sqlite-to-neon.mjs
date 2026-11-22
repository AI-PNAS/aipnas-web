import { execFileSync } from 'node:child_process';
import { PrismaClient } from '@prisma/client';

const sourceDb = process.argv[2] || 'prisma/prisma/dev.db';

if (!process.env.DATABASE_URL || !process.env.DATABASE_URL_UNPOOLED) {
  throw new Error('Set DATABASE_URL and DATABASE_URL_UNPOOLED before importing existing data.');
}

function readTable(table) {
  const output = execFileSync('sqlite3', [sourceDb, '-json', `SELECT * FROM "${table}"`], {
    encoding: 'utf8',
  });
  return output.trim() ? JSON.parse(output) : [];
}

function optionalNumber(value) {
  if (value === null || value === undefined || value === '') return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

function optionalDate(value) {
  return value ? new Date(value) : null;
}

function booleanValue(value) {
  if (value === null || value === undefined) return null;
  return Boolean(Number(value));
}

const prisma = new PrismaClient();

try {
  const users = readTable('User');
  if (users.length) {
    await prisma.user.createMany({
      skipDuplicates: true,
      data: users.map((row) => ({
        id: row.id,
        fullName: row.fullName,
        email: row.email,
        passwordHash: row.passwordHash,
        role: row.role || 'family',
        createdAt: optionalDate(row.createdAt) || new Date(),
        updatedAt: optionalDate(row.updatedAt) || new Date(),
      })),
    });
  }

  const children = readTable('Child');
  if (children.length) {
    await prisma.child.createMany({
      skipDuplicates: true,
      data: children.map((row) => ({
        id: row.id,
        createdById: row.createdById || null,
        patientId: row.patientId || null,
        name: row.name,
        dateOfBirth: row.dateOfBirth || null,
        assessmentDate: row.assessmentDate || null,
        age: optionalNumber(row.age) || 0,
        sex: row.sex || 'M',
        measurementType: row.measurementType || null,
        assessmentSetting: row.assessmentSetting || null,
        country: row.country || null,
        countryCode: row.countryCode || null,
        countryIso3: row.countryIso3 || null,
        region: row.region || null,
        regionCode: row.regionCode || null,
        zone: row.zone || null,
        woreda: row.woreda || null,
        kebele: row.kebele || null,
        weight: optionalNumber(row.weight),
        height: optionalNumber(row.height),
        muac: optionalNumber(row.muac),
        edema: booleanValue(row.edema),
        edemaDetails: row.edemaDetails || null,
        skinChanges: row.skinChanges || null,
        hairChanges: row.hairChanges || null,
        generalAppearance: row.generalAppearance || null,
        bmi: optionalNumber(row.bmi),
        nutritionStatus: row.nutritionStatus || null,
        riskLevel: row.riskLevel || null,
        classification: row.classification || null,
        recommendation: row.recommendation || null,
        referralSuggestion: row.referralSuggestion || null,
        reportSummary: row.reportSummary || null,
        physicalSignAlerts: row.physicalSignAlerts || null,
        vitalSignAlerts: row.vitalSignAlerts || null,
        weightForAgeZ: optionalNumber(row.weightForAgeZ),
        heightForAgeZ: optionalNumber(row.heightForAgeZ),
        weightForHeightZ: optionalNumber(row.weightForHeightZ),
        bmiForAgeZ: optionalNumber(row.bmiForAgeZ),
        muacZ: optionalNumber(row.muacZ),
        createdAt: optionalDate(row.createdAt) || new Date(),
        updatedAt: optionalDate(row.updatedAt) || new Date(),
      })),
    });
  }

  const logs = readTable('AnalysisLog');
  if (logs.length) {
    await prisma.analysisLog.createMany({
      skipDuplicates: true,
      data: logs.map((row) => ({
        id: row.id,
        childId: row.childId,
        analysis: row.analysis,
        createdAt: optionalDate(row.createdAt) || new Date(),
      })),
    });
  }

  try {
    const images = readTable('ChildImage');
    if (images.length) {
      await prisma.childImage.createMany({
        skipDuplicates: true,
        data: images.map((row) => ({
          id: row.id,
          childId: row.childId,
          uploadedById: row.uploadedById,
          mimeType: row.mimeType,
          data: row.data,
          consent: Boolean(row.consent),
          createdAt: optionalDate(row.createdAt) || new Date(),
        })),
      });
    }
  } catch {
    // ChildImage is optional in older SQLite databases.
  }

  console.log(`Imported ${users.length} users, ${children.length} children, ${logs.length} analysis logs.`);
} finally {
  await prisma.$disconnect();
}
