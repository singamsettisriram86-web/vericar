// lib/costEstimatorService.ts
import OpenAI from 'openai';

export interface MaintenanceItem {
  name: string;
  category: 'Routine' | 'Wear & Tear' | 'Fluids & Filters' | 'Labour';
  frequency: string;
  estimatedCostInr: number;
  urgency: 'HIGH' | 'MEDIUM' | 'LOW';
  notes: string;
}

export interface MaintenanceEstimateResult {
  annualMaintenanceCostINR: number;
  monthlyEstimateINR: number;
  costPerKmINR: number;
  maintenanceRiskTier: 'LOW' | 'MODERATE' | 'HIGH';
  summaryInsight: string;
  breakdown: string[];
  detailedItems: MaintenanceItem[];
  modelRecommendation: string;
}

export async function estimateMaintenanceCost(params: {
  make: string;
  model: string;
  year: number;
  odometer: number;
  fuelType: string;
}): Promise<MaintenanceEstimateResult> {
  const deepseekKey = process.env.DEEPSEEK_API_KEY;
  const openaiKey = process.env.OPENAI_API_KEY;

  const apiKey = deepseekKey || openaiKey;
  const isDeepSeek = Boolean(deepseekKey && deepseekKey.startsWith('sk-'));
  const baseURL = isDeepSeek
    ? (process.env.DEEPSEEK_BASE_URL || 'https://api.deepseek.com')
    : undefined;
  const model = isDeepSeek ? 'deepseek-chat' : 'gpt-4o-mini';

  if (apiKey && apiKey.trim().length > 10 && !apiKey.includes('your_key')) {
    try {
      const client = new OpenAI({ apiKey, baseURL });
      const prompt = `You are a veteran Indian automotive service consultant.
Given vehicle:
- Make: ${params.make}
- Model: ${params.model}
- Year: ${params.year}
- Current Odometer: ${params.odometer} km
- Fuel Type: ${params.fuelType}

Estimate the realistic annual maintenance cost in Indian Rupees (INR) for driving approx 10,000 to 12,000 km/year in Indian city and highway conditions.
Respond strictly in valid JSON matching this schema:
{
  "annualMaintenanceCostINR": number,
  "monthlyEstimateINR": number,
  "costPerKmINR": number,
  "maintenanceRiskTier": "LOW" | "MODERATE" | "HIGH",
  "summaryInsight": "Short editorial sentence on parts availability, reliability, and service network in India",
  "breakdown": ["Item 1: ₹X", "Item 2: ₹Y", ...],
  "detailedItems": [
    {
      "name": "Engine Oil & Filter Service",
      "category": "Routine",
      "frequency": "Every 10,000 km or 1 year",
      "estimatedCostInr": 3500,
      "urgency": "HIGH",
      "notes": "Full synthetic 5W-30 + OEM filter"
    }
  ],
  "modelRecommendation": "Tip for used car buyers inspecting this specific model"
}`;

      const response = await client.chat.completions.create({
        model,
        messages: [
          { role: 'system', content: 'You are an Indian car maintenance expert. Output only valid JSON.' },
          { role: 'user', content: prompt }
        ],
        response_format: { type: 'json_object' },
      });

      const parsed = JSON.parse(response.choices[0].message.content || '{}');
      if (parsed.annualMaintenanceCostINR) {
        return parsed as MaintenanceEstimateResult;
      }
    } catch (err) {
      console.warn('AI maintenance estimator error, using heuristic model:', err);
    }
  }

  // Realistic heuristic engine tailored for Indian automotive landscape
  const currentYear = new Date().getFullYear();
  const vehicleAge = Math.max(1, currentYear - params.year);
  const isDiesel = params.fuelType.toLowerCase().includes('diesel');
  const isLuxury = ['bmw', 'mercedes', 'audi', 'jaguar', 'volvo'].includes(params.make.toLowerCase());
  const isMarutiOrHyundai = ['maruti', 'maruti suzuki', 'hyundai', 'tata'].includes(params.make.toLowerCase());

  let baseAnnual = isMarutiOrHyundai ? 8500 : 12500;
  if (isDiesel) baseAnnual *= 1.25; // Diesel injector, DPF, fuel filter overhead
  if (isLuxury) baseAnnual *= 3.2;

  // Age multiplier
  if (vehicleAge >= 7) baseAnnual *= 1.35;
  else if (vehicleAge >= 4) baseAnnual *= 1.15;

  // Odometer wear adjustment
  if (params.odometer > 80000) baseAnnual += 4500; // Timing belt, suspension bushings, clutch wear
  else if (params.odometer > 50000) baseAnnual += 2500;

  const annualRounded = Math.round(baseAnnual / 500) * 500;
  const monthly = Math.round(annualRounded / 12);
  const costPerKm = Number((annualRounded / 10000).toFixed(2));

  const routineOilCost = isLuxury ? 12000 : (isDiesel ? 4800 : 3600);
  const brakeCost = isLuxury ? 16000 : 3800;
  const tyreAmortisation = isLuxury ? 22000 : (params.odometer > 45000 ? 5000 : 3000);
  const periodicLabour = isLuxury ? 10000 : 2800;
  const bufferWear = annualRounded - (routineOilCost + brakeCost + tyreAmortisation + periodicLabour);

  const detailedItems: MaintenanceItem[] = [
    {
      name: 'Full Synthetic Engine Oil & Filter Change',
      category: 'Fluids & Filters',
      frequency: 'Every 10,000 km / 1 Year',
      estimatedCostInr: routineOilCost,
      urgency: 'HIGH',
      notes: `${params.fuelType} compatible grade (API SN/SP or ACEA C3) with OEM oil filter`,
    },
    {
      name: 'Brake Pads & Fluid Servicing',
      category: 'Wear & Tear',
      frequency: 'Every 20,000 km inspection',
      estimatedCostInr: brakeCost,
      urgency: params.odometer > 40000 ? 'HIGH' : 'MEDIUM',
      notes: 'Front ceramic/semi-metallic disc pads + DOT 4 brake bleeding',
    },
    {
      name: 'Tyre Amortisation & Wheel Alignment',
      category: 'Routine',
      frequency: 'Every 5,000 km alignment + replacement reserve',
      estimatedCostInr: Math.max(2500, tyreAmortisation),
      urgency: 'MEDIUM',
      notes: '3D laser alignment, wheel balancing & tread life wear reserve',
    },
    {
      name: 'Annual Scheduled Labour & Multipoint Check',
      category: 'Labour',
      frequency: 'Annual General Service',
      estimatedCostInr: periodicLabour,
      urgency: 'HIGH',
      notes: 'Throttle body cleaning, AC condenser blowout, OBD-II scanner diagnostics',
    },
    {
      name: 'Wear & Tear Contingency Reserve',
      category: 'Wear & Tear',
      frequency: 'As needed',
      estimatedCostInr: Math.max(1500, bufferWear),
      urgency: 'LOW',
      notes: 'Wiper blades, suspension rubber boots, battery health upkeep',
    },
  ];

  const riskTier: 'LOW' | 'MODERATE' | 'HIGH' =
    vehicleAge > 7 || params.odometer > 90000 ? 'HIGH' : (vehicleAge > 4 || params.odometer > 60000 ? 'MODERATE' : 'LOW');

  return {
    annualMaintenanceCostINR: annualRounded,
    monthlyEstimateINR: monthly,
    costPerKmINR: costPerKm,
    maintenanceRiskTier: riskTier,
    summaryInsight: `${params.make} ${params.model} features ${isMarutiOrHyundai ? 'widely accessible spares and economical aftermarket parts' : 'moderate service costs with good multi-brand workshop support'} across Tier 1 and Tier 2 Indian cities.`,
    breakdown: detailedItems.map(item => `${item.name}: ₹${item.estimatedCostInr.toLocaleString('en-IN')}`),
    detailedItems,
    modelRecommendation: `Inspect ${isDiesel ? 'turbocharger boost pipes and EGR valve' : 'throttle body, spark plugs, and clutch bite point'} during the pre-purchase physical inspection.`,
  };
}
