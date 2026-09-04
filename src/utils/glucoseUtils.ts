import { MeasurementType, GlucoseTargetRanges, GlucoseTargetRange } from '../types';

export type GlucoseStatusType = 'low' | 'in_range' | 'high' | 'not_set';

export interface GlucoseEvaluation {
  status: GlucoseStatusType;
  label: string;
  badgeClass: string;
  dotClass: string;
  textClass: string;
  rangeText: string;
  min?: number;
  max?: number;
  isConfigured: boolean;
}

export const DEFAULT_TARGET_RANGES: GlucoseTargetRanges = {
  fasting: { min: 70, max: 130 },
  before_meal: { min: 70, max: 130 },
  after_meal: { min: 70, max: 180 },
  random: { min: 70, max: 140 },
  before_bed: { min: 100, max: 140 },
};

/**
 * Returns the configured target range for a given measurement type,
 * or undefined if neither min nor max is configured.
 */
export function getGlucoseTargetRangeForType(
  type: MeasurementType,
  targetRanges?: GlucoseTargetRanges
): GlucoseTargetRange | undefined {
  if (!targetRanges) return undefined;
  const range = targetRanges[type];
  if (!range) return undefined;
  return range;
}

/**
 * Checks if a target range has at least one valid boundary (min or max).
 */
export function isRangeConfigured(range?: GlucoseTargetRange): boolean {
  if (!range) return false;
  const hasMin = typeof range.min === 'number' && !isNaN(range.min) && range.min > 0;
  const hasMax = typeof range.max === 'number' && !isNaN(range.max) && range.max > 0;
  return hasMin || hasMax;
}

/**
 * Evaluates a glucose reading against the user's configured range for its specific measurement type.
 *
 * Rules:
 * - "أقل من النطاق" if below the configured minimum.
 * - "ضمن النطاق" if within the configured range.
 * - "أعلى من النطاق" if above the configured maximum.
 * - "لم يتم تحديد النطاق المستهدف" if the target range is not configured.
 */
export function evaluateGlucoseReading(
  value: number,
  type: MeasurementType,
  targetRanges?: GlucoseTargetRanges,
  language: 'ar' | 'en' = 'ar'
): GlucoseEvaluation {
  const range = getGlucoseTargetRangeForType(type, targetRanges);

  const hasMin = typeof range?.min === 'number' && !isNaN(range.min) && range.min > 0;
  const hasMax = typeof range?.max === 'number' && !isNaN(range.max) && range.max > 0;

  // If no target range is configured for this type
  if (!hasMin && !hasMax) {
    return {
      status: 'not_set',
      label: language === 'ar' ? 'لم يتم تحديد النطاق المستهدف' : 'Target range not set',
      badgeClass: 'text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800/80 border-slate-300 dark:border-slate-700',
      dotClass: 'bg-slate-400',
      textClass: 'text-slate-600 dark:text-slate-400',
      rangeText: language === 'ar' ? 'غير محدد' : 'Not configured',
      isConfigured: false,
    };
  }

  const minVal = hasMin ? range!.min! : undefined;
  const maxVal = hasMax ? range!.max! : undefined;

  let rangeText = '';
  if (hasMin && hasMax) {
    rangeText = `${minVal} - ${maxVal} ${language === 'ar' ? 'ملغ/ديسيلتر' : 'mg/dL'}`;
  } else if (hasMin) {
    rangeText = `≥ ${minVal} ${language === 'ar' ? 'ملغ/ديسيلتر' : 'mg/dL'}`;
  } else if (hasMax) {
    rangeText = `≤ ${maxVal} ${language === 'ar' ? 'ملغ/ديسيلتر' : 'mg/dL'}`;
  }

  // Check if below minimum
  if (hasMin && value < minVal!) {
    return {
      status: 'low',
      label: language === 'ar' ? 'أقل من النطاق' : 'Below target range',
      badgeClass: 'text-amber-700 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/60 border-amber-200 dark:border-amber-800',
      dotClass: 'bg-amber-500',
      textClass: 'text-amber-600 dark:text-amber-400',
      rangeText,
      min: minVal,
      max: maxVal,
      isConfigured: true,
    };
  }

  // Check if above maximum
  if (hasMax && value > maxVal!) {
    return {
      status: 'high',
      label: language === 'ar' ? 'أعلى من النطاق' : 'Above target range',
      badgeClass: 'text-rose-700 dark:text-rose-300 bg-rose-50 dark:bg-rose-950/60 border-rose-200 dark:border-rose-800',
      dotClass: 'bg-rose-500',
      textClass: 'text-rose-600 dark:text-rose-400',
      rangeText,
      min: minVal,
      max: maxVal,
      isConfigured: true,
    };
  }

  // Within range
  return {
    status: 'in_range',
    label: language === 'ar' ? 'ضمن النطاق' : 'Within target range',
    badgeClass: 'text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/60 border-emerald-200 dark:border-emerald-800',
    dotClass: 'bg-emerald-500',
    textClass: 'text-emerald-600 dark:text-emerald-400',
    rangeText,
    min: minVal,
    max: maxVal,
    isConfigured: true,
  };
}

/**
 * Returns localized label for measurement types
 */
export function getMeasurementTypeLabel(type: MeasurementType, language: 'ar' | 'en' = 'ar'): string {
  const labels: Record<MeasurementType, { ar: string; en: string }> = {
    fasting: { ar: 'صائم (صباحاً)', en: 'Fasting (Morning)' },
    before_meal: { ar: 'قبل الوجبة', en: 'Before Meal' },
    after_meal: { ar: 'بعد الوجبة (ساعتين)', en: '2 Hours After Meal' },
    random: { ar: 'عشوائي', en: 'Random' },
    before_bed: { ar: 'قبل النوم', en: 'Before Bed' },
  };
  return labels[type]?.[language] || type;
}
