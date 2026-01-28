-- CreateTable
CREATE TABLE "Keyword" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "keyword" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "traffic2024" INTEGER NOT NULL,
    "traffic2025" INTEGER NOT NULL,
    "trafficChangePct" REAL NOT NULL,
    "position2024" INTEGER NOT NULL,
    "position2025" INTEGER NOT NULL,
    "positionChange" INTEGER NOT NULL,
    "signups2024" INTEGER NOT NULL,
    "signups2025" INTEGER NOT NULL,
    "conversionRate2024" REAL NOT NULL,
    "conversionRate2025" REAL NOT NULL,
    "aiOverviewTriggered" BOOLEAN NOT NULL,
    "difficultyScore" INTEGER NOT NULL,
    "cpcUsd" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "RegionalPerformance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "region" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "month" TEXT NOT NULL,
    "organicTraffic" INTEGER NOT NULL,
    "paidTraffic" INTEGER NOT NULL,
    "totalTraffic" INTEGER NOT NULL,
    "trialsStarted" INTEGER NOT NULL,
    "paidConversions" INTEGER NOT NULL,
    "trialToPaidRate" REAL NOT NULL,
    "mrrUsd" REAL NOT NULL,
    "cacUsd" REAL NOT NULL,
    "ltvUsd" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "MonthlyMetric" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "month" TEXT NOT NULL,
    "websiteTraffic" INTEGER NOT NULL,
    "uniqueSignups" INTEGER NOT NULL,
    "trialsStarted" INTEGER NOT NULL,
    "paidConversions" INTEGER NOT NULL,
    "mrrUsd" REAL NOT NULL,
    "churnRate" REAL NOT NULL,
    "signupToTrialRate" REAL NOT NULL,
    "trialToPaidRate" REAL NOT NULL,
    "netNewMrr" REAL NOT NULL,
    "expansionMrr" REAL NOT NULL,
    "churnedMrr" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "ChannelPerformance" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "month" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "sessions" INTEGER NOT NULL,
    "signups" INTEGER NOT NULL,
    "conversionRate" REAL NOT NULL,
    "avgSessionDurationSec" INTEGER NOT NULL,
    "bounceRate" REAL NOT NULL,
    "pagesPerSession" REAL NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "DataImport" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "filename" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "recordCount" INTEGER,
    "errorMsg" TEXT,
    "importedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE UNIQUE INDEX "RegionalPerformance_region_country_city_month_key" ON "RegionalPerformance"("region", "country", "city", "month");

-- CreateIndex
CREATE UNIQUE INDEX "MonthlyMetric_month_key" ON "MonthlyMetric"("month");

-- CreateIndex
CREATE UNIQUE INDEX "ChannelPerformance_month_channel_key" ON "ChannelPerformance"("month", "channel");
