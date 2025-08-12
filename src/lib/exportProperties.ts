import type { Property } from "../types";

export const exportProperties = (p: Property) => ({
  ID: p.id,
  Title: p.title,
  Type: p.type,
  Location: p.location,
  Price: p.price,
  Description: p.description,
  Bedrooms: p.bedrooms,
  Bathrooms: p.bathrooms,
  Area: p.area,
  BuildYear: p.buildYear,
  Status: p.status,
  CreatedAt: p.createdAt || "",

  TransferTax: p.additionalFees.transferTax,
  LegalFees: p.additionalFees.legalFees,
  Inspection: p.additionalFees.inspection,
  Insurance: p.additionalFees.insurance,

  PropertyTaxesMonthly: p.monthlyCosts.propertyTaxes,
  HOA: p.monthlyCosts.hoa,

  ListingPrice: p.totalInitialCosts.listingPrice,
  AdditionalFeesTotal: p.totalInitialCosts.additionalFees,
  DownPayment: p.totalInitialCosts.downPayment,
  MortgageAmount: p.totalInitialCosts.mortgageAmount,

  PropertyTaxesExpenses: p.monthlyExpenses.propertyTaxes,
  HOAExpenses: p.monthlyExpenses.hoa,
  InsuranceExpenses: p.monthlyExpenses.insurance,
});
