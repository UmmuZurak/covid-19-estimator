/* eslint-disable no-restricted-properties */
/* eslint-disable linebreak-style */
const input = {
  region: {
    name: 'Africa',
    avgAge: 19.7,
    avgDailyIncomeInUSD: 5,
    avgDailyIncomePopulation: 0.71
  },
  periodType: 'days',
  timeToElapse: 58,
  reportedCases: 674,
  population: 66622705,
  totalHospitalBeds: 1380614
};

const impact = {};
const severeImpact = {};

const impactCalc = ({
  periodType,
  timeToElapse,
  reportedCases,
  totalHospitalBeds,
  region
}) => {
  let casesDuration;
  if (periodType === 'weeks') {
    casesDuration = timeToElapse * 7;
  } else if (periodType === 'months') {
    casesDuration = timeToElapse * 30;
  } else {
    casesDuration = timeToElapse;
  }

  const daysEstimate = Math.floor(casesDuration / 3);

  const bedsAvailableForSevereCases = Math.floor(totalHospitalBeds * 0.35);

  const { avgDailyIncomeInUSD, avgDailyIncomePopulation } = region;

  impact.currentlyInfected = reportedCases * 10;

  impact.infectionsByRequestedTime = impact.currentlyInfected * Math.pow(2, daysEstimate);

  impact.severeCasesByRequestedTime = Math.floor(impact.infectionsByRequestedTime * 0.15);

  impact.hospitalBedsByRequestedTime = (
    bedsAvailableForSevereCases - impact.severeCasesByRequestedTime);

  impact.casesForICUByRequestedTime = Math.floor(
    impact.infectionsByRequestedTime * 0.05
  );

  impact.casesForVentilatorsByRequestedTime = Math.floor(
    impact.infectionsByRequestedTime * 0.02
  );

  const dailyEconomicLoss = (
    impact.infectionsByRequestedTime * avgDailyIncomePopulation * avgDailyIncomeInUSD)
    / casesDuration;

  impact.dollarsInFlight = Math.floor(dailyEconomicLoss);

  return impact;
};

const severeImpactCalc = ({
  periodType,
  timeToElapse,
  reportedCases,
  totalHospitalBeds,
  region
}) => {
  let casesDuration;
  if (periodType === 'weeks') {
    casesDuration = timeToElapse * 7;
  } else if (periodType === 'months') {
    casesDuration = timeToElapse * 30;
  } else {
    casesDuration = timeToElapse;
  }

  const daysEstimate = Math.floor(casesDuration / 3);
  const bedsAvailableForSevereCases = Math.floor(totalHospitalBeds * 0.35);

  const { avgDailyIncomeInUSD, avgDailyIncomePopulation } = region;

  severeImpact.currentlyInfected = reportedCases * 50;

  severeImpact.infectionsByRequestedTime = (
    severeImpact.currentlyInfected * Math.pow(2, daysEstimate));

  severeImpact.severeCasesByRequestedTime = (
    Math.floor(severeImpact.infectionsByRequestedTime * 0.15));

  severeImpact.hospitalBedsByRequestedTime = (
    bedsAvailableForSevereCases - severeImpact.severeCasesByRequestedTime);

  severeImpact.casesForICUByRequestedTime = (
    Math.floor(severeImpact.infectionsByRequestedTime * 0.05));

  severeImpact.casesForVentilatorsByRequestedTime = (
    Math.floor(severeImpact.infectionsByRequestedTime * 0.02));

  const dailyEconomicLoss = (
    severeImpact.infectionsByRequestedTime * avgDailyIncomePopulation * avgDailyIncomeInUSD)
     / casesDuration;

  severeImpact.dollarsInFlight = Math.floor(dailyEconomicLoss);

  return severeImpact;
};

const covid19ImpactEstimator = (data) => {
  const inputObject = data;
  impactCalc(inputObject);
  severeImpactCalc(inputObject);

  const output = {
    data: inputObject,
    estimate: {
      impact,
      severeImpact
    }
  };

  return output;
};

covid19ImpactEstimator(input);

export default covid19ImpactEstimator;
