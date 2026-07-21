export type FuelCategory = 'gasoline' | 'diesel' | 'ev' | 'alternative';

export type FuelGradeKey = 
  | 'regular'
  | 'midgrade'
  | 'premium'
  | 'diesel'
  | 'e85'
  | 'ev_fast'
  | 'ev_level2'
  | 'cng';

export interface FuelGradePrice {
  key: FuelGradeKey;
  name: string;
  price: number; // in preferred currency per unit (e.g. $/gal or €/L)
  category: FuelCategory;
  available: boolean;
  unit: string;
}

export type Amenity = 
  | 'car_wash'
  | 'restroom'
  | 'open_247'
  | 'convenience_store'
  | 'hot_food'
  | 'atm'
  | 'air_water'
  | 'coffee'
  | 'ev_charger'
  | 'loyalty_discount';

export interface StationReview {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

export interface FuelStation {
  id: string;
  name: string;
  brand: string;
  logoColor: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  lat: number;
  lng: number;
  distanceMiles: number;
  rating: number;
  reviewCount: number;
  isOpen24Hours: boolean;
  prices: FuelGradePrice[];
  amenities: Amenity[];
  verifiedAt: string; // ISO time or relative time string
  isTopDeal?: boolean;
  reviews?: StationReview[];
  phone?: string;
}

export interface Vehicle {
  id: string;
  make: string;
  model: string;
  year: number;
  fuelType: FuelCategory;
  tankCapacity: number; // Gal or L
  avgMpg: number; // Miles per gallon or L/100km
  currentFuelLevelPercent: number; // 0 to 100
  plateOrNickname: string;
  imageIcon: string;
  isPrimary?: boolean;
}

export interface FillUpRecord {
  id: string;
  vehicleId: string;
  date: string; // YYYY-MM-DD
  odometer: number; // miles or km
  fuelAmount: number; // gallons or liters
  pricePerUnit: number; // $ or €
  totalCost: number;
  stationName: string;
  stationBrand: string;
  fuelGrade: FuelGradeKey;
  calculatedMpg?: number;
  isFullTank: boolean;
  notes?: string;
}

export interface RouteWaypoint {
  name: string;
  lat: number;
  lng: number;
  distanceFromStartMiles: number;
  isStation?: boolean;
  stationId?: string;
  refuelAmountGal?: number;
  estimatedCost?: number;
  savingsVsAvg?: number;
}

export interface RoutePlan {
  origin: string;
  destination: string;
  totalDistanceMiles: number;
  estimatedDurationMinutes: number;
  suggestedStops: RouteWaypoint[];
  estimatedTotalFuelCost: number;
  potentialSavings: number;
}

export interface PriceForecast {
  fuelGrade: string;
  currentAvg: number;
  forecast7Days: {
    day: string;
    predictedPrice: number;
    trend: 'up' | 'down' | 'stable';
  }[];
  recommendation: 'fill_now' | 'wait' | 'fill_partial';
  recommendationReason: string;
  priceDropExpectedAmount?: number;
}

export interface UserPreferences {
  currencySymbol: string; // '₦' or '$' or '€' or '£'
  distanceUnit: 'miles' | 'km';
  volumeUnit: 'gallons' | 'liters';
  efficiencyUnit: 'MPG' | 'L/100km' | 'km/L';
  selectedFuelGrade: FuelGradeKey;
}
