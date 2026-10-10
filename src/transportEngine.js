import { MOCK_BUS_SERVICES, MOCK_STOPS } from './mockData.js';

// Feasibility engine and search algorithms
export function parseIntentFromInput(text, language = 'en') {
  const isTelugu = language === 'te' || /[\u0C00-\u0C7F]/.test(text);
  
  // Default values extracted from user conversational intake
  return {
    origin: 'Visakhapatnam',
    destination: 'Hyderabad',
    travelDate: '2026-10-11',
    arrivalDeadline: '09:00', // Must reach before 9 AM
    travelers: 1,
    maxBudgetINR: 1500,
    coachPreference: 'AC sleeper',
    berthPreference: 'single',
    minimumTransferMinutes: 45,
    language: isTelugu ? 'te' : 'en',
    status: 'DRAFT',
    rawInput: text
  };
}

export function validateTripIntent(intent) {
  const missingFields = [];
  if (!intent.origin) missingFields.push('origin');
  if (!intent.destination) missingFields.push('destination');
  if (!intent.travelDate) missingFields.push('travelDate');
  if (!intent.arrivalDeadline) missingFields.push('arrivalDeadline');
  if (!intent.maxBudgetINR) missingFields.push('maxBudgetINR');
  if (!intent.minimumTransferMinutes) missingFields.push('minimumTransferMinutes');
  
  return {
    isValid: missingFields.length === 0,
    missingFields
  };
}

export function searchRoutes(intent) {
  // Candidate Itineraries construction
  const candidates = [];
  
  // 1. Direct Option 1: Kaveri Travels Multi-Axle
  const direct1 = MOCK_BUS_SERVICES.find(s => s.id === 'SRV_DIRECT_01');
  if (direct1) {
    candidates.push({
      id: 'ITIN_DIRECT_RECOMMENDED',
      type: 'DIRECT',
      legs: [direct1],
      totalFare: direct1.fare,
      departureTime: direct1.departureTime,
      arrivalTime: direct1.arrivalTime,
      duration: direct1.duration,
      transfers: [],
      operator: direct1.operator.name,
      coachType: direct1.coachType,
      vehicle: direct1.vehicle,
      rating: direct1.operator.rating,
      feasibility: {
        isFeasible: direct1.fare <= intent.maxBudgetINR && direct1.arrivalTime <= intent.arrivalDeadline,
        violations: []
      },
      score: 95,
      recommendationReason: intent.language === 'te'
        ? 'సూచించబడినది: నాన్-స్టాప్ డైరెక్ట్ ప్రయాణం, సమయపాలన 100%, బడ్జెట్ పరిమితిలో ఉంది.'
        : 'Recommended: Non-stop direct sleeper journey within budget, guaranteed arrival before 9:00 AM.'
    });
  }

  // 2. Connecting Option 2: APSRTC + Orange Travels via Vijayawada
  const connLeg1 = MOCK_BUS_SERVICES.find(s => s.id === 'SRV_CONN_LEG1_SAFE');
  const connLeg2 = MOCK_BUS_SERVICES.find(s => s.id === 'SRV_CONN_LEG2_SAFE');
  if (connLeg1 && connLeg2) {
    // ₹720 + ₹530 = ₹1,250
    const totalFare = connLeg1.fare + connLeg2.fare; // 1250
    candidates.push({
      id: 'ITIN_CONNECTING_VALUE',
      type: 'CONNECTING',
      legs: [connLeg1, connLeg2],
      totalFare: totalFare, // ₹1,250
      departureTime: connLeg1.departureTime, // 21:15
      arrivalTime: connLeg2.arrivalTime,   // 08:00 AM
      duration: '10h 45m',
      transfers: [
        {
          stop: MOCK_STOPS.VIJAYAWADA_RTC,
          bufferMinutes: 55, // Scheduled 02:40 AM arrival -> 03:35 AM departure = 55m
          requiredBuffer: intent.minimumTransferMinutes, // 45m
          isSafe: true
        }
      ],
      operator: 'APSRTC + Orange Travels',
      coachType: 'AC Sleeper Multi-Transfer',
      vehicle: connLeg1.vehicle,
      rating: 4.7,
      feasibility: {
        isFeasible: totalFare <= intent.maxBudgetINR && connLeg2.arrivalTime <= intent.arrivalDeadline,
        violations: []
      },
      score: 92,
      recommendationReason: intent.language === 'te'
        ? 'ఉత్తమ పొదుపు: విజయవాడ ట్రాన్స్‌ఫర్‌తో బడ్జెట్‌లో ₹250 మిగులుతుంది. 55 నిమిషాల భద్రతా బఫర్ కలదు.'
        : 'Best Value: Connecting journey saving ₹250 under max budget with comfortable 55m transfer buffer at Vijayawada.'
    });
  }

  // 3. Near-Miss Option 3: Exceeds Deadline (Arrives 10:15 AM)
  const lateOption = MOCK_BUS_SERVICES.find(s => s.id === 'SRV_INFEASIBLE_LATE');
  if (lateOption) {
    candidates.push({
      id: 'ITIN_LATE_NEAR_MISS',
      type: 'DIRECT',
      legs: [lateOption],
      totalFare: lateOption.fare,
      departureTime: lateOption.departureTime,
      arrivalTime: lateOption.arrivalTime,
      duration: lateOption.duration,
      transfers: [],
      operator: lateOption.operator.name,
      coachType: lateOption.coachType,
      vehicle: lateOption.vehicle,
      rating: lateOption.operator.rating,
      feasibility: {
        isFeasible: false,
        violations: [
          intent.language === 'te' 
            ? 'గడువు సమయం దాటిపోతుంది: ఉదయం 10:15 కి చేరుకుంటుంది (గడువు: 09:00 AM)'
            : 'Deadline Violation: Arrives at 10:15 AM (Required before 09:00 AM)'
        ]
      },
      score: 60,
      recommendationReason: intent.language === 'te'
        ? 'సమయ పరిమితి ఉల్లంఘన: గడువు కంటే 1 గంట 15 నిమిషాలు ఆలస్యంగా చేరుతుంది.'
        : 'Constraint Violation: Exceeds specified 09:00 AM arrival deadline.'
    });
  }

  // 4. Near-Miss Option 4: Premium Bus Exceeds Budget (₹1,850 > ₹1,500)
  const budgetOption = MOCK_BUS_SERVICES.find(s => s.id === 'SRV_INFEASIBLE_BUDGET');
  if (budgetOption) {
    candidates.push({
      id: 'ITIN_BUDGET_NEAR_MISS',
      type: 'DIRECT',
      legs: [budgetOption],
      totalFare: budgetOption.fare, // ₹1,850
      departureTime: budgetOption.departureTime,
      arrivalTime: budgetOption.arrivalTime,
      duration: budgetOption.duration,
      transfers: [],
      operator: budgetOption.operator.name,
      coachType: budgetOption.coachType,
      vehicle: budgetOption.vehicle,
      rating: budgetOption.operator.rating,
      feasibility: {
        isFeasible: false,
        violations: [
          intent.language === 'te'
            ? 'బడ్జెట్ పరిమితి దాటింది: ₹1,850 (గరిష్ట బడ్జెట్: ₹1,500)'
            : 'Budget Exceeded: ₹1,850 (Max Budget limit: ₹1,500)'
        ]
      },
      score: 55,
      recommendationReason: intent.language === 'te'
        ? 'బడ్జెట్ ఉల్లంఘన: వినియోగదారు గరిష్ట పరిమితి ₹1,500 కంటే ₹350 ఎక్కువ.'
        : 'Budget Violation: Exceeds specified ₹1,500 budget limit by ₹350.'
    });
  }

  return candidates;
}

// Stage 10 & 11: Disruption risk analysis and deterministic recovery planner
export function evaluateDisruptionRisk(activeItinerary, delayMinutes = 50) {
  if (!activeItinerary || activeItinerary.transfers.length === 0) return null;

  // Initial transfer buffer was 55 minutes.
  // 50 minutes delay reduces buffer to 5 minutes!
  const originalBuffer = activeItinerary.transfers[0].bufferMinutes; // 55
  const remainingBuffer = originalBuffer - delayMinutes; // 5m
  const requiredBuffer = activeItinerary.transfers[0].requiredBuffer; // 45m

  const isAtRisk = remainingBuffer < requiredBuffer; // 5 < 45 = TRUE

  // Projected new ETA at Vijayawada PNBS is 03:30 AM instead of 02:40 AM
  const updatedLeg1Arrival = '03:30'; 
  const leg2Departure = '03:35';

  return {
    isAtRisk,
    scenarioId: 'SCENARIO_CONNECTION_DELAY_01',
    delayMinutes,
    affectedLeg: activeItinerary.legs[0],
    updatedLeg1Arrival,
    nextLegDeparture: leg2Departure,
    remainingBufferMinutes: remainingBuffer, // 5m
    requiredBufferMinutes: requiredBuffer,   // 45m
    severity: 'HIGH',
    impactSummaryEn: `Connecting Bus A delayed by 50m. Remaining Vijayawada interchange buffer is only 5 mins (Minimum safety required: 45m). Connection is unsafe!`,
    impactSummaryTe: `కనెక్టింగ్ బస్సు A 50 నిమిషాలు ఆలస్యమైంది. విజయవాడ వద్ద కేవలం 5 నిమిషాల సమయం మాత్రమే మిగిలి ఉంది (కనీస బఫర్: 45 నిమిషాలు). కనెక్షన్ ప్రమాదంలో ఉంది!`
  };
}

export function calculateRecoveryOptions(activeItinerary, disruption, intent) {
  // Finds viable replacement leg departing from Vijayawada Bypass at 04:15 AM
  const recoveryLeg = MOCK_BUS_SERVICES.find(s => s.id === 'SRV_CONN_RECOVERY_01');
  const leg1 = activeItinerary.legs[0]; // Completed or delayed Leg 1

  const newTotalFare = leg1.fare + recoveryLeg.fare; // 720 + 780 = ₹1,500
  const fareDifference = newTotalFare - activeItinerary.totalFare; // 1500 - 1250 = +₹250

  const proposal = {
    proposalId: 'RECOVERY_PROP_01',
    type: 'REASSIGN_LEG_2',
    originalItineraryId: activeItinerary.id,
    previousRevision: 1,
    newRevision: 2,
    replacementLeg: recoveryLeg,
    newTotalFare: newTotalFare, // ₹1,500
    fareDifference: fareDifference, // +₹250
    oldEta: activeItinerary.arrivalTime, // 08:00 AM
    newEta: recoveryLeg.arrivalTime,     // 08:25 AM
    deadlineStatus: 'MEETS_DEADLINE', // 08:25 AM <= 09:00 AM deadline
    deadlineMarginMinutes: 35, // 35 minutes before 09:00 AM
    interchangeLocation: MOCK_STOPS.VIJAYAWADA_BYPASS.name,
    newTransferBufferMinutes: 45, // Arrives PNBS/Bypass ~03:30 AM -> Departs 04:15 AM = 45m
    recommendationReasonEn: `Garuda Plus AC Sleeper departing from Vijayawada Bypass at 04:15 AM. Arrives Hyderabad at 08:25 AM (35m before your 09:00 AM deadline). Total fare ₹1,500 (+₹250 fare difference).`,
    recommendationReasonTe: `విజయవాడ బైపాస్ నుండి ఉదయం 04:15 కి గరుడ ప్లస్ ఏసీ స్లీపర్ బస్సు. హైదరాబాద్‌కి ఉదయం 08:25 కి చేరుకుంటుంది (మీ 09:00 AM గడువు కంటే 35 నిమిషాల ముందే). ఛార్జి వ్యత్యాసం: +₹250.`
  };

  return [proposal];
}
