import { CropProfile, Inspection, JudgePreset, Onion } from '../types';

export const JUDGE_PRESETS: JudgePreset[] = [
  {
    id: 'preset-good-1',
    name: 'Premium Bellary Red',
    subtitle: 'Export Grade A • Flawless Bulb',
    grade: 'GOOD',
    decision: 'GRADE A',
    condition: 'healthy',
    diameterMm: 56.4,
    confidence: 98.6,
    reason: 'Meets Grade A export specification: tight dry outer tunic, firm neck, diameter (56.4mm) within 45–65 mm range, zero fungal or sprout indicators.',
    defectPercent: 0.8,
    colorHex: '#8b263e',
    accentBadge: '🟢 GRADE A (EXPORT)',
    tagline: 'Uniform globe, intact papery scales, dry closed neck.',
    actuatorGate: 1,
    imageUrl: '/dataset/healthy_red.jpg'
  },
  {
    id: 'preset-medium-1',
    name: 'Skin Peeling / Minor Blemish',
    subtitle: 'Domestic Grade B • Culinary & Processing',
    grade: 'MEDIUM',
    decision: 'URS',
    condition: 'blemished',
    diameterMm: 52.8,
    confidence: 94.2,
    reason: 'Medium (Grade B / URS): Superficial dry scale loss and surface abrasion (8.2% area). Bulb interior firm and intact; diverted to domestic kitchen/food processing.',
    defectPercent: 8.2,
    colorHex: '#b24c3d',
    accentBadge: '🟠 MEDIUM (GRADE B)',
    tagline: 'Sound flesh with minor cosmetic dry skin abrasions.',
    actuatorGate: 2,
    imageUrl: '/dataset/peeled_blemished.jpg'
  },
  {
    id: 'preset-reject-1',
    name: 'Neck Sprouting Specimen',
    subtitle: 'Storage Spoilage • Growth Termination',
    grade: 'REJECT',
    decision: 'REJECT',
    condition: 'sprouted',
    diameterMm: 58.2,
    confidence: 97.4,
    reason: 'Rejected: Active internal dormancy break detected with external green apical shoot at neck. Unsuitable for warehouse storage or commercial sale.',
    defectPercent: 24.5,
    colorHex: '#9c3826',
    accentBadge: '🔴 REJECTED (SPROUT)',
    tagline: 'Apical green shoot visible at neck; bulb softens rapidly.',
    actuatorGate: 3,
    imageUrl: '/dataset/sprouted_onion.jpg'
  },
  {
    id: 'preset-reject-2',
    name: 'Aspergillus Black Mold & Rot',
    subtitle: 'Pathogen Contamination • High Risk',
    grade: 'REJECT',
    decision: 'REJECT',
    condition: 'rotten',
    diameterMm: 51.5,
    confidence: 99.2,
    reason: 'Critical Rejection: Black mold (*Aspergillus niger*) fungal necrosis and bacterial soft neck detected. Must be segregated immediately to prevent contagion.',
    defectPercent: 38.6,
    colorHex: '#3d1d1f',
    accentBadge: '🔴 REJECTED (BLACK MOLD)',
    tagline: 'Fungal spore clusters and soft sunken lesions on scales.',
    actuatorGate: 3,
    imageUrl: '/dataset/black_mold_rot.jpg'
  },
  {
    id: 'preset-medium-2',
    name: 'Undersized Pearl Bulb',
    subtitle: 'Sub-gauge • Pickling / Sambar Grade',
    grade: 'MEDIUM',
    decision: 'URS',
    condition: 'undersized',
    diameterMm: 38.4,
    confidence: 96.8,
    reason: 'Medium (Grade B / URS): Diameter (38.4 mm) falls below 45 mm minimum Grade A procurement threshold. Clean bulb routed for specialized sambar/pickling.',
    defectPercent: 1.8,
    colorHex: '#992d47',
    accentBadge: '🟠 MEDIUM (UNDERSIZED)',
    tagline: 'Healthy firm bulb under 45 mm diameter threshold.',
    actuatorGate: 2,
    imageUrl: '/dataset/healthy_red.jpg'
  },
  {
    id: 'preset-good-2',
    name: 'Nashik Dark Red Champion',
    subtitle: 'Export Grade A • Heavy Density',
    grade: 'GOOD',
    decision: 'GRADE A',
    condition: 'healthy',
    diameterMm: 62.1,
    confidence: 98.9,
    reason: 'Meets Grade A export specification: 62.1 mm diameter, saturated deep ruby coloration, thick papery layers, complete neck closure.',
    defectPercent: 0.4,
    colorHex: '#781c30',
    accentBadge: '🟢 GRADE A (PREMIUM)',
    tagline: 'High dry-matter bulb with multi-layer protective skin.',
    actuatorGate: 1,
    imageUrl: '/dataset/healthy_red.jpg'
  }
];

export function generateRandomSample(idCounter: number): Onion {
  const rand = Math.random();
  if (rand < 0.58) {
    // 58% Grade A Good
    const d = 46 + Math.floor(Math.random() * 18);
    const conf = 93 + Math.random() * 6;
    return {
      id: idCounter,
      diameterMm: d + Math.round(Math.random() * 10) / 10,
      condition: 'healthy',
      confidence: Math.round(conf * 10) / 10,
      decision: 'GRADE A',
      outputGrade: 'GOOD',
      reason: 'Compliant with Grade A: Size in range (45-65mm), clean dry tunic, 0% fungal or rot markers.',
      surfaceScore: 92 + Math.floor(Math.random() * 7),
      colorProfile: {
        hue: 'Ruby Red',
        rgbHex: '#8b263e',
        uniformity: 92 + Math.floor(Math.random() * 7)
      },
      defectAreaPercent: Math.round(Math.random() * 15) / 10,
      actuatorTarget: 'BIN_1_GOOD',
      servoAngle: 45,
      imageUrl: '/dataset/healthy_red.jpg'
    };
  } else if (rand < 0.84) {
    // 26% Medium / URS
    const isUndersize = Math.random() > 0.5;
    const d = isUndersize ? 36 + Math.floor(Math.random() * 8) : 52 + Math.floor(Math.random() * 10);
    const cond = isUndersize ? 'undersized' : 'blemished';
    return {
      id: idCounter,
      diameterMm: d + Math.round(Math.random() * 10) / 10,
      condition: cond,
      confidence: 91 + Math.round(Math.random() * 60) / 10,
      decision: 'URS',
      outputGrade: 'MEDIUM',
      reason: isUndersize ? 'Diameter under 45mm Grade A threshold. Diverted to domestic/processing channel.' : 'Superficial skin flaking / dry scale blemish. Flesh intact; suitable for domestic use.',
      surfaceScore: 78 + Math.floor(Math.random() * 8),
      colorProfile: {
        hue: 'Copper Red',
        rgbHex: '#b24c3d',
        uniformity: 78 + Math.floor(Math.random() * 10)
      },
      defectAreaPercent: 6 + Math.round(Math.random() * 40) / 10,
      actuatorTarget: 'BIN_2_MEDIUM',
      servoAngle: 0,
      imageUrl: isUndersize ? '/dataset/healthy_red.jpg' : '/dataset/peeled_blemished.jpg'
    };
  } else {
    // 16% Reject (Rot or Sprout)
    const isSprout = Math.random() > 0.45;
    const cond = isSprout ? 'sprouted' : 'rotten';
    const d = 48 + Math.floor(Math.random() * 14);
    return {
      id: idCounter,
      diameterMm: d + Math.round(Math.random() * 10) / 10,
      condition: cond,
      confidence: 95 + Math.round(Math.random() * 45) / 10,
      decision: 'REJECT',
      outputGrade: 'REJECT',
      reason: isSprout ? 'Active neck sprouting detected. Rapid softening imminent; rejected from batch.' : 'Fungal decay / soft rot detected on outer scales. Ejected to isolate contagion.',
      surfaceScore: 42 + Math.floor(Math.random() * 18),
      colorProfile: {
        hue: isSprout ? 'Sprouted Olive' : 'Rotten Dark Umber',
        rgbHex: isSprout ? '#7c3f25' : '#3d1d1f',
        uniformity: 52 + Math.floor(Math.random() * 15)
      },
      defectAreaPercent: 22 + Math.round(Math.random() * 250) / 10,
      actuatorTarget: 'BIN_3_REJECT',
      servoAngle: -45,
      imageUrl: isSprout ? '/dataset/sprouted_onion.jpg' : '/dataset/black_mold_rot.jpg'
    };
  }
}

export const SEED_INSPECTIONS: Inspection[] = [
  {
    id: 'IVX-2026-089',
    batchId: 'BATCH-TN-7821',
    centre: 'Trichy APMC Market Yard, TN',
    farmerName: 'K. Murugesan (Pudukkottai)',
    variety: 'Bellary Crimson Red',
    createdAt: new Date(Date.now() - 3600000 * 3).toISOString(),
    gradeA: 68.5,
    urs: 21.0,
    reject: 8.5,
    manual: 2.0,
    status: 'Export Certified',
    sha256Hash: 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
    onions: Array.from({ length: 12 }, (_, i) => {
      const p = JUDGE_PRESETS[i % JUDGE_PRESETS.length];
      return {
        id: i + 1,
        diameterMm: p.diameterMm + (i % 3) * 1.2,
        condition: p.condition,
        confidence: p.confidence,
        decision: p.decision,
        outputGrade: p.grade,
        reason: p.reason,
        surfaceScore: p.grade === 'GOOD' ? 95 : p.grade === 'MEDIUM' ? 82 : 45,
        colorProfile: {
          hue: 'Red',
          rgbHex: p.colorHex,
          uniformity: 88
        },
        defectAreaPercent: p.defectPercent,
        actuatorTarget: p.actuatorGate === 1 ? 'BIN_1_GOOD' : p.actuatorGate === 2 ? 'BIN_2_MEDIUM' : 'BIN_3_REJECT',
        servoAngle: p.actuatorGate === 1 ? 45 : p.actuatorGate === 2 ? 0 : -45
      };
    })
  },
  {
    id: 'IVX-2026-088',
    batchId: 'BATCH-MH-4412',
    centre: 'Lasalgaon Mandi Yard, Nashik, MH',
    farmerName: 'Ramesh Patil (Niphad)',
    variety: 'Nashik Dark Red',
    createdAt: new Date(Date.now() - 3600000 * 8).toISOString(),
    gradeA: 74.2,
    urs: 17.8,
    reject: 6.4,
    manual: 1.6,
    status: 'Completed',
    sha256Hash: '4a6b2c89f13e70d4b29c98a5ef12b07f8921dc80c3298150ea81f9b30c12a76f',
    onions: Array.from({ length: 8 }, (_, i) => ({
      id: i + 1,
      diameterMm: 52 + i * 1.5,
      condition: i === 3 ? 'blemished' : i === 6 ? 'rotten' : 'healthy',
      confidence: 96.2,
      decision: i === 3 ? 'URS' : i === 6 ? 'REJECT' : 'GRADE A',
      outputGrade: i === 3 ? 'MEDIUM' : i === 6 ? 'REJECT' : 'GOOD',
      reason: i === 3 ? 'Superficial skin loss' : i === 6 ? 'Neck rot detected' : 'Grade A standard',
      surfaceScore: i === 6 ? 40 : 92,
      colorProfile: { hue: 'Dark Red', rgbHex: '#781c30', uniformity: 90 },
      defectAreaPercent: i === 6 ? 28 : 2,
      actuatorTarget: i === 6 ? 'BIN_3_REJECT' : i === 3 ? 'BIN_2_MEDIUM' : 'BIN_1_GOOD',
      servoAngle: i === 6 ? -45 : i === 3 ? 0 : 45
    }))
  },
  {
    id: 'IVX-2026-087',
    batchId: 'BATCH-KA-3190',
    centre: 'Hubballi Agriculture Mandi, KA',
    farmerName: 'Basavaraj Gowda (Dharwad)',
    variety: 'Gulbarga Rose Onion',
    createdAt: new Date(Date.now() - 3600000 * 24).toISOString(),
    gradeA: 62.0,
    urs: 25.5,
    reject: 10.5,
    manual: 2.0,
    status: 'Completed',
    sha256Hash: '8b7a6c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2c3d4e5f6a7b',
    onions: []
  }
];

export const HARDWARE_BOM = [
  {
    component: 'Edge Computing Unit',
    model: 'Raspberry Pi 4B (4GB) or Jetson Nano',
    role: 'Local offline CNN inference, GPIO motor control, local SQLite storage',
    costInr: 4500,
    industrialAlt: 'Industrial Fanless PLC / IPC (₹1,50,000)'
  },
  {
    component: 'Optical Vision Sensor',
    model: 'Wide-angle 1080p 60FPS Macro USB/CSI Camera',
    role: 'Synchronized strobe frame capture inside enclosed illumination box',
    costInr: 1200,
    industrialAlt: 'High-speed line-scan CCD sensor (₹3,50,000)'
  },
  {
    component: 'Controlled Light Chamber',
    model: 'High-CRI 95+ 5500K Ring LED + Diffuser Housing',
    role: 'Eliminates ambient shadow/glare variability (Challenge 1 in PDF)',
    costInr: 750,
    industrialAlt: 'Custom optical tunnel & fiber strobe (₹1,30,000)'
  },
  {
    component: '3-Way Sorting Actuator',
    model: 'Dual Metal-Gear MG996R Servos / Solenoid Flippers',
    role: 'Physical divert mechanism to Good / Medium / Reject bins in <50ms',
    costInr: 950,
    industrialAlt: 'High-speed pneumatic air ejector matrix (₹6,00,000)'
  },
  {
    component: 'Optical Trigger / Encoder',
    model: 'TCRT5000 Infrared Breakbeam + Rotary Encoder',
    role: 'Detects onion entry and syncs servo deflection timing',
    costInr: 350,
    industrialAlt: 'Omron Laser Array Sensor (₹80,000)'
  },
  {
    component: 'Miniature Conveyor & Chutes',
    model: 'Food-grade PVC Mini Belt + 3D Printed Diverter Bins',
    role: 'Continuous single-layer singulation conveyor',
    costInr: 1500,
    industrialAlt: 'Stainless multi-lane sorting conveyor (₹7,50,000)'
  }
];

export const CROP_PROFILES: CropProfile[] = [
  {
    id: 'onion',
    name: 'Onion (Allium cepa)',
    botanicalName: 'Allium cepa L.',
    status: 'ACTIVE',
    targetDefects: ['Black mold (Aspergillus)', 'Apical sprouting', 'Bacterial soft rot', 'Double bulb', 'Mechanical cuts'],
    gradingStandards: 'Grade A: 45–65 mm, <5% blemish | Grade B (URS): 35–44 mm or 66–75 mm | Reject: Rot or sprout',
    sensorCalibration: '5500K Neutral daylight, dual cross-polarization to remove moisture reflection',
    icon: '🧅'
  },
  {
    id: 'potato',
    name: 'Potato (Solanum tuberosum)',
    botanicalName: 'Solanum tuberosum L.',
    status: 'EXPERIMENTAL',
    targetDefects: ['Greening (Solanine toxicity)', 'Late blight necrosis', 'Common scab', 'Hollow heart', 'Sprouts'],
    gradingStandards: 'Grade 1: >50mm, <3% skin greening | Grade 2: 35–49mm | Reject: Rotten / heavy green',
    sensorCalibration: 'Chlorophyll band (670nm optical filter) to detect invisible solanine greening early',
    icon: '🥔'
  },
  {
    id: 'tomato',
    name: 'Tomato (Solanum lycopersicum)',
    botanicalName: 'Solanum lycopersicum L.',
    status: 'UPCOMING',
    targetDefects: ['Blossom end rot', 'Radial cracking', 'Sunscald', 'Over-ripe softness', 'Catfacing'],
    gradingStandards: 'Export: Uniform breaker-to-turning stage, firm pericarp | Domestic: Full red firm | Reject: Split/rot',
    sensorCalibration: 'Lycopene index spectrum (650nm/550nm ratio) for 6-stage AGMARK / FSSAI ripeness grading',
    icon: '🍅'
  }
];
