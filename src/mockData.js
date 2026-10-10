export const MOCK_STOPS = {
  VISAKHAPATNAM: {
    id: 'STOP_VIZAG_RTC',
    name: 'Visakhapatnam RTC Complex',
    city: 'Visakhapatnam',
    lat: 17.7231,
    lng: 83.3012,
    aliases: ['Vizag', 'Visakhapatnam', 'Vizag RTC', 'Dwaraka Nagar']
  },
  VIJAYAWADA_RTC: {
    id: 'STOP_VIJAYAWADA_RTC',
    name: 'Vijayawada Pandit Nehru Bus Station',
    city: 'Vijayawada',
    lat: 16.5062,
    lng: 80.6480,
    aliases: ['Vijayawada', 'Vijayawada PNBS', 'Vijayawada Bus Stand']
  },
  VIJAYAWADA_BYPASS: {
    id: 'STOP_VIJAYAWADA_BYPASS',
    name: 'Vijayawada Bypass Boarding Point',
    city: 'Vijayawada',
    lat: 16.5200,
    lng: 80.6200,
    aliases: ['Vijayawada Bypass', 'Benz Circle Bypass']
  },
  HYDERABAD_MGBS: {
    id: 'STOP_HYD_MGBS',
    name: 'Hyderabad MGBS (Mahatma Gandhi Bus Station)',
    city: 'Hyderabad',
    lat: 17.3783,
    lng: 78.4820,
    aliases: ['Hyderabad', 'Hyderabad MGBS', 'MGBS', 'Koti']
  },
  HYDERABAD_AMBERPET: {
    id: 'STOP_HYD_AMBERPET',
    name: 'Hyderabad Amberpet Drop Point',
    city: 'Hyderabad',
    lat: 17.3912,
    lng: 78.5189,
    aliases: ['Amberpet', 'Hyderabad Amberpet']
  }
};

export const MOCK_OPERATORS = {
  APSRTC: { id: 'OP_APSRTC', name: 'APSRTC (State Express)', rating: 4.6, totalReviews: 1420 },
  KAveri: { id: 'OP_KAVERI', name: 'Kaveri Travels Multi-Axle', rating: 4.8, totalReviews: 890 },
  ORANGE: { id: 'OP_ORANGE', name: 'Orange Tours & Travels', rating: 4.7, totalReviews: 1120 },
  GARUDA: { id: 'OP_GARUDA', name: 'Garuda Plus AC Sleeper', rating: 4.5, totalReviews: 650 },
};

export const MOCK_VEHICLES = {
  VEH_01: {
    id: 'VEH_01',
    model: 'Volvo B11R Multi-Axle AC Sleeper (2+1)',
    ageYears: 2,
    serviceHistory: 'Routine maintenance passed 5 days ago. Excellent alignment & suspension rating.',
    reviews: [
      { user: 'Srinivas R.', rating: 5, comment: 'Punctual departure, clean berths, good charging ports.' },
      { user: 'Anitha K.', rating: 4.5, comment: 'Smooth suspension on National Highway.' }
    ]
  },
  VEH_02: {
    id: 'VEH_02',
    model: 'Scania Metrolink AC Semi-Sleeper (2+2)',
    ageYears: 4,
    serviceHistory: 'AC serviced last month. Recorded minor delay last week due to tyre pressure check.',
    reviews: [
      { user: 'Ramesh B.', rating: 4.2, comment: 'Decent speed and driving, air conditioning was powerful.' }
    ]
  },
  VEH_03: {
    id: 'VEH_03',
    model: 'Mercedes-Benz Multi-Axle Super Luxury AC Sleeper',
    ageYears: 1,
    serviceHistory: 'Brand new fleet addition. Zero mechanical faults recorded.',
    reviews: [
      { user: 'Karthik V.', rating: 4.9, comment: 'Extremely silent cabin, spotless bedding.' }
    ]
  },
  VEH_04: {
    id: 'VEH_04',
    model: 'Eicher Non-AC Seater Express',
    ageYears: 6,
    serviceHistory: 'Older vehicle fleet. Mixed passenger feedback on suspension comfort.',
    reviews: [
      { user: 'Praveen T.', rating: 3.2, comment: 'Reached destination, but bumpy ride.' }
    ]
  }
};

// Scheduled bus legs available in mock database
export const MOCK_BUS_SERVICES = [
  // Direct Vizag -> Hyd (Fastest sleeper, slightly higher fare)
  {
    id: 'SRV_DIRECT_01',
    operator: MOCK_OPERATORS.KAveri,
    vehicle: MOCK_VEHICLES.VEH_03,
    originStop: MOCK_STOPS.VISAKHAPATNAM,
    destStop: MOCK_STOPS.HYDERABAD_MGBS,
    departureTime: '21:00', // 9:00 PM
    arrivalTime: '07:30',   // 7:30 AM (Next Day)
    duration: '10h 30m',
    fare: 1450,
    coachType: 'AC sleeper',
    availableSeats: 12,
    isDirect: true,
  },
  // Connecting Vizag -> Vijayawada (Leg 1)
  {
    id: 'SRV_CONN_LEG1_SAFE',
    operator: MOCK_OPERATORS.APSRTC,
    vehicle: MOCK_VEHICLES.VEH_01,
    originStop: MOCK_STOPS.VISAKHAPATNAM,
    destStop: MOCK_STOPS.VIJAYAWADA_RTC,
    departureTime: '21:15',
    arrivalTime: '02:40', // 2:40 AM
    duration: '5h 25m',
    fare: 720,
    coachType: 'AC sleeper',
    availableSeats: 18,
    isDirect: false,
  },
  // Connecting Vijayawada -> Hyd (Leg 2 - Safe connection departure at 03:35 AM = 55m buffer)
  {
    id: 'SRV_CONN_LEG2_SAFE',
    operator: MOCK_OPERATORS.ORANGE,
    vehicle: MOCK_VEHICLES.VEH_02,
    originStop: MOCK_STOPS.VIJAYAWADA_RTC,
    destStop: MOCK_STOPS.HYDERABAD_MGBS,
    departureTime: '03:35', // 3:35 AM
    arrivalTime: '08:00',   // 8:00 AM (Meets 9:00 AM deadline!)
    duration: '4h 25m',
    fare: 530,
    coachType: 'AC sleeper',
    availableSeats: 8,
    isDirect: false,
  },
  // Connecting Vijayawada Bypass -> Hyd (Recovery Option Leg 2 - Departs 04:15 AM)
  {
    id: 'SRV_CONN_RECOVERY_01',
    operator: MOCK_OPERATORS.GARUDA,
    vehicle: MOCK_VEHICLES.VEH_03,
    originStop: MOCK_STOPS.VIJAYAWADA_BYPASS,
    destStop: MOCK_STOPS.HYDERABAD_MGBS,
    departureTime: '04:15', // 4:15 AM
    arrivalTime: '08:25',   // 8:25 AM (Meets 9:00 AM deadline!)
    duration: '4h 10m',
    fare: 780,
    coachType: 'AC sleeper',
    availableSeats: 6,
    isDirect: false,
  },
  // Infeasible Direct (Arrives past deadline at 10:15 AM)
  {
    id: 'SRV_INFEASIBLE_LATE',
    operator: MOCK_OPERATORS.APSRTC,
    vehicle: MOCK_VEHICLES.VEH_04,
    originStop: MOCK_STOPS.VISAKHAPATNAM,
    destStop: MOCK_STOPS.HYDERABAD_MGBS,
    departureTime: '23:30',
    arrivalTime: '10:15', // Exceeds 09:00 AM deadline
    duration: '10h 45m',
    fare: 980,
    coachType: 'Non-AC Seater',
    availableSeats: 24,
    isDirect: true,
  },
  // Infeasible Budget Direct (Exceeds ₹1500 budget = ₹1850)
  {
    id: 'SRV_INFEASIBLE_BUDGET',
    operator: MOCK_OPERATORS.KAveri,
    vehicle: MOCK_VEHICLES.VEH_03,
    originStop: MOCK_STOPS.VISAKHAPATNAM,
    destStop: MOCK_STOPS.HYDERABAD_MGBS,
    departureTime: '22:00',
    arrivalTime: '08:00',
    duration: '10h 00m',
    fare: 1850, // Exceeds ₹1500 max budget
    coachType: 'AC sleeper',
    availableSeats: 4,
    isDirect: true,
  }
];
