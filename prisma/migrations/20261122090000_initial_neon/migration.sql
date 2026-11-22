-- CreateTable
CREATE TABLE "Child" (
    "id" TEXT NOT NULL,
    "createdById" TEXT,
    "patientId" TEXT,
    "name" TEXT NOT NULL,
    "dateOfBirth" TEXT,
    "assessmentDate" TEXT,
    "age" DOUBLE PRECISION NOT NULL,
    "sex" TEXT NOT NULL,
    "measurementType" TEXT,
    "assessmentSetting" TEXT,
    "religion" TEXT,
    "continent" TEXT,
    "country" TEXT,
    "countryCode" TEXT,
    "countryIso3" TEXT,
    "region" TEXT,
    "regionCode" TEXT,
    "zone" TEXT,
    "woreda" TEXT,
    "kebele" TEXT,
    "pmh" TEXT,
    "fatherAge" DOUBLE PRECISION,
    "fatherHealthStatus" TEXT,
    "fatherCauseOfDeath" TEXT,
    "motherAge" DOUBLE PRECISION,
    "motherHealthStatus" TEXT,
    "motherCauseOfDeath" TEXT,
    "siblingsHistory" TEXT,
    "familialDiseases" TEXT,
    "earlyDevelopment" TEXT,
    "educationalBackground" TEXT,
    "socialActivities" TEXT,
    "workRecordIncome" TEXT,
    "dietHabits" TEXT,
    "alcoholUse" TEXT,
    "tobaccoUse" TEXT,
    "drugUse" TEXT,
    "herbUse" TEXT,
    "addictions" TEXT,
    "bpSystolic" DOUBLE PRECISION,
    "bpDiastolic" DOUBLE PRECISION,
    "bpArterySite" TEXT,
    "bpPosition" TEXT,
    "bpGrade" TEXT,
    "pulseRate" DOUBLE PRECISION,
    "pulseSite" TEXT,
    "pulseRhythm" TEXT,
    "pulseVolume" TEXT,
    "rrRate" DOUBLE PRECISION,
    "rrPattern" TEXT,
    "temperature" DOUBLE PRECISION,
    "temperatureSite" TEXT,
    "temperatureTime" TEXT,
    "spo2" DOUBLE PRECISION,
    "oxygenSupport" TEXT,
    "weight" DOUBLE PRECISION,
    "height" DOUBLE PRECISION,
    "muac" DOUBLE PRECISION,
    "heightSource" TEXT,
    "weightSource" TEXT,
    "headCircumference" DOUBLE PRECISION,
    "chestCircumference" DOUBLE PRECISION,
    "edema" BOOLEAN,
    "edemaDetails" TEXT,
    "skinChanges" TEXT,
    "hairChanges" TEXT,
    "eyeSigns" TEXT,
    "oralSigns" TEXT,
    "hearingLossDevelopmentalDelay" TEXT,
    "generalAppearance" TEXT,
    "bmi" DOUBLE PRECISION,
    "nutritionStatus" TEXT,
    "riskLevel" TEXT,
    "classification" TEXT,
    "recommendation" TEXT,
    "referralSuggestion" TEXT,
    "reportSummary" TEXT,
    "physicalSignAlerts" TEXT,
    "vitalSignAlerts" TEXT,
    "weightForAgeZ" DOUBLE PRECISION,
    "heightForAgeZ" DOUBLE PRECISION,
    "weightForHeightZ" DOUBLE PRECISION,
    "bmiForAgeZ" DOUBLE PRECISION,
    "muacZ" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Child_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnalysisLog" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "analysis" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AnalysisLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'family',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ChildImage" (
    "id" TEXT NOT NULL,
    "childId" TEXT NOT NULL,
    "uploadedById" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "data" TEXT NOT NULL,
    "consent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ChildImage_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Child_patientId_key" ON "Child"("patientId");

-- CreateIndex
CREATE INDEX "Child_nutritionStatus_idx" ON "Child"("nutritionStatus");

-- CreateIndex
CREATE INDEX "Child_riskLevel_idx" ON "Child"("riskLevel");

-- CreateIndex
CREATE INDEX "Child_createdAt_idx" ON "Child"("createdAt");

-- CreateIndex
CREATE INDEX "Child_createdById_idx" ON "Child"("createdById");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_email_idx" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE INDEX "ChildImage_childId_idx" ON "ChildImage"("childId");

-- CreateIndex
CREATE INDEX "ChildImage_uploadedById_idx" ON "ChildImage"("uploadedById");

-- CreateIndex
CREATE INDEX "ChildImage_createdAt_idx" ON "ChildImage"("createdAt");

-- AddForeignKey
ALTER TABLE "Child" ADD CONSTRAINT "Child_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChildImage" ADD CONSTRAINT "ChildImage_childId_fkey" FOREIGN KEY ("childId") REFERENCES "Child"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ChildImage" ADD CONSTRAINT "ChildImage_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
