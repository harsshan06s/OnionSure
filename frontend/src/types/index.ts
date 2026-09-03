export type OnionCondition = 
  | 'healthy' 
  | 'damaged' 
  | 'sprouted' 
  | 'rotten' 
  | 'undersized' 
  | 'oversized' 
  | 'blemished';

export type GradingDecision = 
  | 'GRADE A' 
  | 'URS' 
  | 'REJECT' 
  | 'MANUAL REVIEW';

export type OutputGrade = 'GOOD' | 'MEDIUM' | 'REJECT';

export interface Onion {
  id: number;
  batchId?: string;
  diameterMm: number;
  condition: OnionCondition;
  confidence: number;
  decision: GradingDecision;
  outputGrade: OutputGrade;
  reason: string;
  surfaceScore: number; // 0 - 100
  colorProfile: {
    hue: string;
    rgbHex: string;
    uniformity: number; // %
  };
  defectAreaPercent: number;
  detectedAt?: string;
  actuatorTarget?: 'BIN_1_GOOD' | 'BIN_2_MEDIUM' | 'BIN_3_REJECT';
  servoAngle?: number;
  imageUrl?: string;
}

export interface Inspection {
  id: string;
  batchId: string;
  centre: string;
  farmerName?: string;
  variety?: string;
  createdAt: string;
  gradeA: number; // %
  urs: number; // %
  reject: number; // %
  manual: number; // %
  status: 'Completed' | 'In Progress' | 'Flagged' | 'Export Certified';
  onions: Onion[];
  sha256Hash?: string;
  reportPdfUrl?: string;
}

export interface HardwareTelemetry {
  fps: number;
  edgeDevice: string;
  deviceTempC: number;
  npuLoadPercent: number;
  ramUsagePercent: number;
  inferenceLatencyMs: number;
  actuatorLatencyMs: number;
  cameraStatus: 'LOCKED' | 'CAPTURING' | 'CALIBRATING' | 'STANDBY';
  conveyorRunning: boolean;
  conveyorSpeedUnitsPerMin: number;
  offlineEdgeMode: boolean;
  totalSortedToday: number;
  bins: {
    good: number;
    medium: number;
    reject: number;
  };
  actuator: {
    servoAngle: number;
    activeGate: 1 | 2 | 3 | null;
    pulseWidthUs: number;
    cycleCount: number;
  };
}

export interface JudgePreset {
  id: string;
  name: string;
  subtitle: string;
  grade: OutputGrade;
  decision: GradingDecision;
  condition: OnionCondition;
  diameterMm: number;
  confidence: number;
  reason: string;
  defectPercent: number;
  colorHex: string;
  accentBadge: string;
  tagline: string;
  actuatorGate: 1 | 2 | 3;
  imageUrl?: string;
}

export type CropCategory = 'onion' | 'potato' | 'tomato';

export interface CropProfile {
  id: CropCategory;
  name: string;
  botanicalName: string;
  status: 'ACTIVE' | 'EXPERIMENTAL' | 'UPCOMING';
  targetDefects: string[];
  gradingStandards: string;
  sensorCalibration: string;
  icon: string;
}

export interface RoiSimulationParams {
  dailyVolumeQuintals: number;
  mandiBasePricePerKg: number;
  premiumGradePriceBonusPerKg: number;
  spoilageRateWithoutSortingPercent: number;
  manualSortingLaborCostPerDay: number;
  prototypeBOMCost: number;
}
