import type {

  Answers,

  BusinessType,

  EstimatedLosses,

  LeakScores,

} from "./types";

import { LEAK_CATEGORIES } from "./types";

import { resolveNumericAnswer, resolveStringAnswer } from "./answer-resolver";



function emptyLosses(): EstimatedLosses {

  return {

    acquisition: 0,

    response: 0,

    conversion: 0,

    retention: 0,

    billing: 0,

    expansion: 0,

  };

}



function num(

  businessType: BusinessType,

  answers: Answers,

  key: string,

  fallback = 0

): number {

  return resolveNumericAnswer(businessType, answers, key, fallback);

}



function str(answers: Answers, key: string): string {

  return resolveStringAnswer(answers, key);

}



function severityFactor(severity: number): number {

  if (severity <= 0) return 0;

  return 0.3 + (severity / 100) * 0.7;

}



function finalizeCategoryLoss(raw: number, severity: number): number {

  if (severity <= 0) return 0;

  return Math.round(raw);

}



export function estimateMonthlyLosses(

  businessType: BusinessType,

  answers: Answers,

  scores: LeakScores

): EstimatedLosses {

  switch (businessType) {

    case "saas":

      return estimateSaasLosses(businessType, answers, scores);

    case "ecommerce":

      return estimateEcommerceLosses(businessType, answers, scores);

    case "agency":

      return estimateAgencyLosses(businessType, answers, scores);

    case "service":

      return estimateServiceLosses(businessType, answers, scores);

    default:

      return emptyLosses();

  }

}



function estimateSaasLosses(

  businessType: BusinessType,

  answers: Answers,

  scores: LeakScores

): EstimatedLosses {

  const visitors = num(businessType, answers, "monthly_visitors");

  const signupsBand = num(businessType, answers, "monthly_signups");

  const visitorSignupRate = num(businessType, answers, "visitor_signup_rate", 0);

  const signups =

    visitorSignupRate > 0 && visitors > 0

      ? visitors * (visitorSignupRate / 100)

      : signupsBand;

  const trialConv = num(businessType, answers, "trial_conversion_rate", 8);

  const churn = num(businessType, answers, "monthly_churn_rate", 5);

  const failedPay = num(businessType, answers, "failed_payment_rate", 3);

  const arpu = num(businessType, answers, "arpu", 99);



  const benchmarkSignupRate = 0.03;

  const actualSignupRate = visitors > 0 ? signups / visitors : visitorSignupRate / 100;

  const signupGap = Math.max(0, benchmarkSignupRate - actualSignupRate);

  const acquisitionLoss =

    visitors * signupGap * (trialConv / 100) * arpu * severityFactor(scores.acquisition);



  const benchmarkTrialConv = 12;

  const trialGap = Math.max(0, benchmarkTrialConv - trialConv) / 100;

  const conversionLoss =

    signups * trialGap * arpu * severityFactor(scores.conversion);



  const activeCustomers = signups * 3;

  const benchmarkChurn = 3;

  const churnGap = Math.max(0, churn - benchmarkChurn) / 100;

  const retentionLoss =

    activeCustomers * churnGap * arpu * severityFactor(scores.retention);



  const mrr = activeCustomers * arpu;

  const billingLoss =

    mrr * (failedPay / 100) * 0.6 * severityFactor(scores.billing);



  const expansionLoss =

    activeCustomers * arpu * 0.15 * (scores.expansion / 100) * severityFactor(scores.expansion);



  const demoSla = str(answers, "demo_response_sla");

  const slaRisk =

    demoSla === "over_24h" ? 1 : demoSla === "4_24h" ? 0.7 : demoSla === "1_4h" ? 0.4 : 0.15;

  const responseLoss =

    visitors * 0.001 * arpu * slaRisk * severityFactor(scores.response);



  return {

    acquisition: finalizeCategoryLoss(acquisitionLoss, scores.acquisition),

    response: finalizeCategoryLoss(responseLoss, scores.response),

    conversion: finalizeCategoryLoss(conversionLoss, scores.conversion),

    retention: finalizeCategoryLoss(retentionLoss, scores.retention),

    billing: finalizeCategoryLoss(billingLoss, scores.billing),

    expansion: finalizeCategoryLoss(expansionLoss, scores.expansion),

  };

}



function estimateEcommerceLosses(

  businessType: BusinessType,

  answers: Answers,

  scores: LeakScores

): EstimatedLosses {

  const sessions = num(businessType, answers, "monthly_sessions");

  const atcRate = num(businessType, answers, "add_to_cart_rate", 8);

  const checkoutRate = num(businessType, answers, "checkout_completion_rate", 45);

  const aov = num(businessType, answers, "average_order_value", 75);

  const abandonRate = num(businessType, answers, "cart_abandonment_rate", 70);

  const refundRate = num(businessType, answers, "refund_rate", 4);

  const repeatRate = num(businessType, answers, "repeat_purchase_rate", 20);

  const shipping = str(answers, "shipping_cost_visibility");



  const carts = sessions * (atcRate / 100);

  const orders = carts * (checkoutRate / 100);

  const benchmarkCheckout = 60;

  const checkoutGap = Math.max(0, benchmarkCheckout - checkoutRate) / 100;

  const shippingPenalty = shipping === "late" ? 0.15 : shipping === "checkout" ? 0.08 : 0;

  const conversionLoss =

    carts * checkoutGap * aov * severityFactor(scores.conversion) +

    carts * (abandonRate / 100) * 0.3 * aov * severityFactor(scores.conversion) +

    carts * shippingPenalty * aov * severityFactor(scores.conversion);



  const benchmarkAtc = 10;

  const atcGap = Math.max(0, benchmarkAtc - atcRate) / 100;

  const acquisitionLoss = sessions * atcGap * (checkoutRate / 100) * aov * severityFactor(scores.acquisition);



  const monthlyRevenue = orders * aov;

  const benchmarkRepeat = 30;

  const repeatGap = Math.max(0, benchmarkRepeat - repeatRate) / 100;

  const retentionLoss = monthlyRevenue * repeatGap * severityFactor(scores.retention);



  const billingLoss = monthlyRevenue * (refundRate / 100) * 0.5 * severityFactor(scores.billing);



  const expansionLoss = orders * aov * 0.2 * (scores.expansion / 100) * severityFactor(scores.expansion);



  const responseLoss = sessions * 0.001 * aov * (scores.response / 100) * severityFactor(scores.response);



  return {

    acquisition: finalizeCategoryLoss(acquisitionLoss, scores.acquisition),

    response: finalizeCategoryLoss(responseLoss, scores.response),

    conversion: finalizeCategoryLoss(conversionLoss, scores.conversion),

    retention: finalizeCategoryLoss(retentionLoss, scores.retention),

    billing: finalizeCategoryLoss(billingLoss, scores.billing),

    expansion: finalizeCategoryLoss(expansionLoss, scores.expansion),

  };

}



function estimateAgencyLosses(

  businessType: BusinessType,

  answers: Answers,

  scores: LeakScores

): EstimatedLosses {

  const leads = num(businessType, answers, "monthly_leads");

  const discoveryRate = num(businessType, answers, "discovery_booking_rate", 30);

  const proposalRate = num(businessType, answers, "proposal_send_rate", 70);

  const closeRate = num(businessType, answers, "proposal_close_rate", 25);

  const clientValue = num(businessType, answers, "avg_client_value", 15000);

  const overdue = str(answers, "overdue_invoices");

  const responseTime = str(answers, "response_time");

  const responseTimeRisk =

    responseTime === "over_24h" ? 1 : responseTime === "4_24h" ? 0.75 : responseTime === "1_4h" ? 0.4 : 0.15;



  const qualified = leads * 0.6;

  const benchmarkResponse = 0.15;

  const responseLoss =

    leads * benchmarkResponse * (discoveryRate / 100) * (closeRate / 100) * clientValue *

    severityFactor(scores.response) * responseTimeRisk;



  const benchmarkClose = 30;

  const closeGap = Math.max(0, benchmarkClose - closeRate) / 100;

  const proposals = qualified * (proposalRate / 100);

  const conversionLoss = proposals * closeGap * clientValue * severityFactor(scores.conversion);



  const benchmarkDiscovery = 40;

  const discoveryGap = Math.max(0, benchmarkDiscovery - discoveryRate) / 100;

  const acquisitionLoss = leads * discoveryGap * (closeRate / 100) * clientValue * 0.3 * severityFactor(scores.acquisition);



  const lifetime = str(answers, "client_lifetime");

  const lifetimeMultiplier = lifetime === "short" ? 0.4 : lifetime === "medium" ? 0.2 : 0.05;

  const retentionLoss = leads * (closeRate / 100) * clientValue * lifetimeMultiplier * severityFactor(scores.retention);



  const expansionLoss = leads * (closeRate / 100) * clientValue * 0.25 * (scores.expansion / 100) * severityFactor(scores.expansion);



  const billingLoss =

    overdue === "yes"

      ? clientValue * 0.08 * severityFactor(scores.billing)

      : clientValue * 0.02 * (scores.billing / 100);



  return {

    acquisition: finalizeCategoryLoss(acquisitionLoss, scores.acquisition),

    response: finalizeCategoryLoss(responseLoss, scores.response),

    conversion: finalizeCategoryLoss(conversionLoss, scores.conversion),

    retention: finalizeCategoryLoss(retentionLoss, scores.retention),

    billing: finalizeCategoryLoss(billingLoss, scores.billing),

    expansion: finalizeCategoryLoss(expansionLoss, scores.expansion),

  };

}



function estimateServiceLosses(

  businessType: BusinessType,

  answers: Answers,

  scores: LeakScores

): EstimatedLosses {

  const leads = num(businessType, answers, "monthly_leads");

  const missedRate = num(businessType, answers, "missed_call_rate", 15);

  const bookingRate = num(businessType, answers, "booking_rate", 40);

  const noShowRate = num(businessType, answers, "no_show_rate", 12);

  const closeRate = num(businessType, answers, "quote_close_rate", 35);

  const jobValue = num(businessType, answers, "avg_job_value", 450);

  const onlineBooking = str(answers, "online_booking");



  const missedLoss =

    leads * (missedRate / 100) * (bookingRate / 100) * (closeRate / 100) * jobValue *

    severityFactor(scores.response);



  const responseTime = str(answers, "inquiry_response_time");

  const responseMultiplier =

    responseTime === "over_4h" ? 0.25 : responseTime === "1_4h" ? 0.15 : responseTime === "15_60m" ? 0.08 : 0.02;

  const slowResponseLoss = leads * responseMultiplier * (closeRate / 100) * jobValue * severityFactor(scores.response);



  const bookingFriction =

    onlineBooking === "phone_only" ? 0.12 : onlineBooking === "online_business" ? 0.05 : 0;

  const bookingFrictionLoss = leads * bookingFriction * jobValue * severityFactor(scores.response);



  const benchmarkBooking = 50;

  const bookingGap = Math.max(0, benchmarkBooking - bookingRate) / 100;

  const conversionLoss =

    leads * bookingGap * (closeRate / 100) * jobValue * severityFactor(scores.conversion) +

    leads * (bookingRate / 100) * (noShowRate / 100) * jobValue * 0.5 * severityFactor(scores.conversion);



  const benchmarkClose = 45;

  const closeGap = Math.max(0, benchmarkClose - closeRate) / 100;

  const quoteLoss = leads * (bookingRate / 100) * closeGap * jobValue * severityFactor(scores.conversion);



  const acquisitionLoss = leads * 0.1 * (closeRate / 100) * jobValue * severityFactor(scores.acquisition);



  const reactivate = str(answers, "reactivate_customers");

  const reactivateFactor = reactivate === "never" ? 0.15 : reactivate === "sometimes" ? 0.08 : 0.02;

  const retentionLoss = leads * reactivateFactor * jobValue * severityFactor(scores.retention);



  const expansionLoss = leads * (closeRate / 100) * jobValue * 0.2 * (scores.expansion / 100) * severityFactor(scores.expansion);



  const billingLoss = leads * (noShowRate / 100) * jobValue * 0.1 * severityFactor(scores.billing);



  return {

    acquisition: finalizeCategoryLoss(acquisitionLoss, scores.acquisition),

    response: finalizeCategoryLoss(missedLoss + slowResponseLoss + bookingFrictionLoss, scores.response),

    conversion: finalizeCategoryLoss(conversionLoss + quoteLoss, scores.conversion),

    retention: finalizeCategoryLoss(retentionLoss, scores.retention),

    billing: finalizeCategoryLoss(billingLoss, scores.billing),

    expansion: finalizeCategoryLoss(expansionLoss, scores.expansion),

  };

}



export function sumEstimatedLosses(losses: EstimatedLosses): number {

  return LEAK_CATEGORIES.reduce((sum, cat) => sum + losses[cat], 0);

}


