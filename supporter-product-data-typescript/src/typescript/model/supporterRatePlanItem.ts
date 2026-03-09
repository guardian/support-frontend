export interface ContributionAmount {
  amount: string;
  currency: string;
}

export interface SupporterRatePlanItem {
  subscriptionName: string;
  identityId: string;
  productRatePlanId: string;
  productRatePlanName: string;
  termEndDate: string;
  contractEffectiveDate: string;
  contributionAmount?: ContributionAmount;
}

const toIsoDate = (value: string): string => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toISOString().slice(0, 10);
};

const csvValue = (
  row: Record<string, string>,
  key: string,
  lineNumber: number
): string => {
  const value = row[key];
  if (value === undefined || value === "") {
    throw new Error(`Missing required column ${key} on line ${lineNumber}`);
  }
  return value;
};

export const supporterRatePlanItemFromCsvRow = (
  row: Record<string, string>,
  lineNumber: number
): SupporterRatePlanItem => ({
  subscriptionName: csvValue(row, "Subscription.Name", lineNumber),
  identityId: csvValue(row, "Account.IdentityId__c", lineNumber),
  productRatePlanId: csvValue(row, "ProductRatePlan.Id", lineNumber),
  productRatePlanName: csvValue(row, "ProductRatePlan.Name", lineNumber),
  termEndDate: toIsoDate(csvValue(row, "Subscription.TermEndDate", lineNumber)),
  contractEffectiveDate: toIsoDate(
    csvValue(row, "Subscription.ContractEffectiveDate", lineNumber)
  ),
});
