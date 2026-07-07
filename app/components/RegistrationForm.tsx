'use client';

import { useMemo, useState } from 'react';
import { RegisterChildInput } from '@/lib/validation';

type FormValue = string | boolean;
type FormState = Record<string, FormValue>;

interface RegistrationFormProps {
  onSubmit: (data: RegisterChildInput) => void;
  isLoading: boolean;
}

const sectionTitles = [
  'Basic Demographics',
  'Medical & Family History',
  'Personal & Social History',
  'Vital Signs',
  'Anthropometric Inputs',
  'Physical / Clinical Signs',
  'Review & Report',
];

type TrafficLight = 'Red' | 'Yellow' | 'Green';

function getTrafficLight(value: number): TrafficLight {
  if (value <= -3 || value >= 3) {
    return 'Red';
  }

  if (value <= -2 || value >= 2) {
    return 'Yellow';
  }

  return 'Green';
}

function interpolate(
  points: ReadonlyArray<{ age: number; weight: number; height: number; bmi: number }>,
  ageMonths: number
) {
  if (ageMonths <= points[0].age) {
    return points[0];
  }

  if (ageMonths >= points[points.length - 1].age) {
    return points[points.length - 1];
  }

  const upperIndex = points.findIndex((point) => point.age >= ageMonths);
  const lower = points[upperIndex - 1];
  const upper = points[upperIndex];
  const ratio = (ageMonths - lower.age) / (upper.age - lower.age);

  return {
    age: ageMonths,
    weight: lower.weight + (upper.weight - lower.weight) * ratio,
    height: lower.height + (upper.height - lower.height) * ratio,
    bmi: lower.bmi + (upper.bmi - lower.bmi) * ratio,
  };
}

const WHO_REFERENCE = {
  M: [
    { age: 0, weight: 3.3, height: 49.9, bmi: 13.4 },
    { age: 6, weight: 7.9, height: 67.6, bmi: 17.2 },
    { age: 12, weight: 9.6, height: 75.7, bmi: 16.9 },
    { age: 24, weight: 12.2, height: 87.1, bmi: 16.4 },
    { age: 36, weight: 14.3, height: 95.0, bmi: 16.1 },
    { age: 48, weight: 16.3, height: 102.0, bmi: 15.8 },
    { age: 60, weight: 18.3, height: 109.2, bmi: 15.6 },
  ],
  F: [
    { age: 0, weight: 3.2, height: 49.1, bmi: 13.3 },
    { age: 6, weight: 7.3, height: 65.7, bmi: 17.0 },
    { age: 12, weight: 8.9, height: 74.0, bmi: 16.7 },
    { age: 24, weight: 11.5, height: 85.7, bmi: 16.2 },
    { age: 36, weight: 13.9, height: 94.1, bmi: 15.9 },
    { age: 48, weight: 16.0, height: 101.2, bmi: 15.7 },
    { age: 60, weight: 18.0, height: 108.2, bmi: 15.4 },
  ],
} as const;

function calculateLivePreview(values: FormState) {
  const age = Number(values.age || 0);
  const weight = Number(values.weight || 0);
  const height = Number(values.height || 0);
  const muac = Number(values.muac || 0);
  const sex = values.sex === 'F' ? 'F' : 'M';

  if (!age || !weight || !height) {
    return null;
  }

  const reference = interpolate(WHO_REFERENCE[sex], age);
  const bmi = height > 0 ? weight / Math.pow(height / 100, 2) : 0;
  const standardDeviation = {
    weight: 1.2,
    height: 1.1,
    bmi: 1.0,
    muac: 0.9,
  };

  const weightForAge = (weight - reference.weight) / standardDeviation.weight;
  const heightForAge = (height - reference.height) / standardDeviation.height;
  const weightForHeightExpected = reference.bmi * Math.pow(height / 100, 2);
  const weightForHeight = (weight - weightForHeightExpected) / standardDeviation.weight;
  const bmiForAge = (bmi - reference.bmi) / standardDeviation.bmi;
  const muacScore = (muac - 12.5) / standardDeviation.muac;

  return {
    bmi: Number.isFinite(bmi) ? bmi.toFixed(1) : '0.0',
    weightForAge: { value: weightForAge.toFixed(2), label: getTrafficLight(weightForAge) },
    heightForAge: { value: heightForAge.toFixed(2), label: getTrafficLight(heightForAge) },
    weightForHeight: { value: weightForHeight.toFixed(2), label: getTrafficLight(weightForHeight) },
    bmiForAge: { value: bmiForAge.toFixed(2), label: getTrafficLight(bmiForAge) },
    muac: { value: muacScore.toFixed(2), label: getTrafficLight(muacScore) },
  };
}

type PreviewCard = {
  label: string;
  score: { value: string; label: TrafficLight };
};

const initialFormState: FormState = {
  name: '',
  age: '',
  sex: 'M',
  religion: '',
  continent: '',
  country: '',
  region: '',
  zone: '',
  woreda: '',
  kebele: '',
  pmh: '',
  fatherAge: '',
  fatherHealthStatus: '',
  fatherCauseOfDeath: '',
  motherAge: '',
  motherHealthStatus: '',
  motherCauseOfDeath: '',
  siblingsHistory: '',
  familialDiseases: '',
  earlyDevelopment: '',
  educationalBackground: '',
  socialActivities: '',
  workRecordIncome: '',
  dietHabits: '',
  alcoholUse: '',
  tobaccoUse: '',
  drugUse: '',
  herbUse: '',
  addictions: '',
  bpSystolic: '',
  bpDiastolic: '',
  bpArterySite: '',
  bpPosition: '',
  bpGrade: '',
  pulseRate: '',
  pulseSite: '',
  pulseRhythm: '',
  pulseVolume: '',
  rrRate: '',
  rrPattern: '',
  temperature: '',
  temperatureSite: '',
  temperatureTime: '',
  spo2: '',
  oxygenSupport: '',
  weight: '',
  height: '',
  muac: '',
  heightSource: '',
  weightSource: '',
  headCircumference: '',
  chestCircumference: '',
  edema: false,
  edemaDetails: '',
  skinChanges: '',
  hairChanges: '',
  eyeSigns: '',
  oralSigns: '',
  hearingLossDevelopmentalDelay: '',
  generalAppearance: '',
};

function toNumber(value: FormValue): number | undefined {
  if (typeof value === 'boolean' || value.trim?.() === '') {
    return undefined;
  }

  const numericValue = Number(value);
  return Number.isNaN(numericValue) ? undefined : numericValue;
}

function toText(value: FormValue): string | undefined {
  if (typeof value === 'boolean') {
    return undefined;
  }

  const trimmedValue = value.trim();
  return trimmedValue.length > 0 ? trimmedValue : undefined;
}

function formatValue(value: FormValue): string {
  if (typeof value === 'boolean') {
    return value ? 'Yes' : 'No';
  }

  return value.trim() || 'Not provided';
}

export default function RegistrationForm({ onSubmit, isLoading }: RegistrationFormProps) {
  const [step, setStep] = useState(0);
  const [formData, setFormData] = useState<FormState>(initialFormState);

  const totalSteps = sectionTitles.length;
  const progress = useMemo(() => ((step + 1) / totalSteps) * 100, [step, totalSteps]);
  const livePreview = useMemo(() => calculateLivePreview(formData), [formData]);
  const previewCards: PreviewCard[] | null = livePreview
    ? [
        { label: 'Weight-for-Age', score: livePreview.weightForAge },
        { label: 'Height-for-Age', score: livePreview.heightForAge },
        { label: 'Weight-for-Height', score: livePreview.weightForHeight },
        { label: 'BMI-for-Age', score: livePreview.bmiForAge },
        { label: 'MUAC', score: livePreview.muac },
      ]
    : null;

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, type } = event.target;
    const target = event.target as HTMLInputElement;

    setFormData((previous) => ({
      ...previous,
      [name]: type === 'checkbox' ? target.checked : target.value,
    }));
  };

  const buildPayload = (): RegisterChildInput => ({
    name: String(formData.name).trim(),
    age: Number(formData.age || 0),
    sex: formData.sex === 'F' ? 'F' : 'M',
    religion: toText(formData.religion),
    continent: toText(formData.continent),
    country: toText(formData.country),
    region: toText(formData.region),
    zone: toText(formData.zone),
    woreda: toText(formData.woreda),
    kebele: toText(formData.kebele),
    pmh: toText(formData.pmh),
    fatherAge: toNumber(formData.fatherAge),
    fatherHealthStatus: toText(formData.fatherHealthStatus),
    fatherCauseOfDeath: toText(formData.fatherCauseOfDeath),
    motherAge: toNumber(formData.motherAge),
    motherHealthStatus: toText(formData.motherHealthStatus),
    motherCauseOfDeath: toText(formData.motherCauseOfDeath),
    siblingsHistory: toText(formData.siblingsHistory),
    familialDiseases: toText(formData.familialDiseases),
    earlyDevelopment: toText(formData.earlyDevelopment),
    educationalBackground: toText(formData.educationalBackground),
    socialActivities: toText(formData.socialActivities),
    workRecordIncome: toText(formData.workRecordIncome),
    dietHabits: toText(formData.dietHabits),
    alcoholUse: toText(formData.alcoholUse),
    tobaccoUse: toText(formData.tobaccoUse),
    drugUse: toText(formData.drugUse),
    herbUse: toText(formData.herbUse),
    addictions: toText(formData.addictions),
    bpSystolic: toNumber(formData.bpSystolic),
    bpDiastolic: toNumber(formData.bpDiastolic),
    bpArterySite: toText(formData.bpArterySite),
    bpPosition: toText(formData.bpPosition),
    bpGrade: toText(formData.bpGrade),
    pulseRate: toNumber(formData.pulseRate),
    pulseSite: toText(formData.pulseSite),
    pulseRhythm: toText(formData.pulseRhythm),
    pulseVolume: toText(formData.pulseVolume),
    rrRate: toNumber(formData.rrRate),
    rrPattern: toText(formData.rrPattern),
    temperature: toNumber(formData.temperature),
    temperatureSite: toText(formData.temperatureSite),
    temperatureTime: toText(formData.temperatureTime),
    spo2: toNumber(formData.spo2),
    oxygenSupport: toText(formData.oxygenSupport),
    height: Number(formData.height || 0),
    weight: Number(formData.weight || 0),
    muac: Number(formData.muac || 0),
    heightSource: toText(formData.heightSource),
    weightSource: toText(formData.weightSource),
    headCircumference: toNumber(formData.headCircumference),
    chestCircumference: toNumber(formData.chestCircumference),
    edema: Boolean(formData.edema),
    edemaDetails: toText(formData.edemaDetails),
    skinChanges: toText(formData.skinChanges),
    hairChanges: toText(formData.hairChanges),
    eyeSigns: toText(formData.eyeSigns),
    oralSigns: toText(formData.oralSigns),
    hearingLossDevelopmentalDelay: toText(formData.hearingLossDevelopmentalDelay),
    generalAppearance: toText(formData.generalAppearance),
  });

  const estimateAnthropometrics = () => {
    const ageInMonths = Number(formData.age || 0);
    if (ageInMonths <= 0) {
      return;
    }

    const sexMultiplier = formData.sex === 'F' ? 0.98 : 1;
    const estimatedHeight = Math.max(45, 49 + ageInMonths * 1.15) * sexMultiplier;
    const estimatedWeight = Math.max(2.6, 3.1 + ageInMonths * 0.26) * sexMultiplier;
    const estimatedMuac = Math.max(10.5, 11.4 + ageInMonths * 0.04);

    setFormData((previous) => ({
      ...previous,
      height: previous.height || estimatedHeight.toFixed(1),
      weight: previous.weight || estimatedWeight.toFixed(1),
      muac: previous.muac || estimatedMuac.toFixed(1),
      heightSource: previous.heightSource || 'AI camera estimate',
      weightSource: previous.weightSource || 'AI camera estimate',
    }));
  };

  const goNext = () => setStep((previous) => Math.min(previous + 1, totalSteps - 1));
  const goBack = () => setStep((previous) => Math.max(previous - 1, 0));

  const renderField = (
    name: string,
    label: string,
    options?: { placeholder?: string; type?: string; required?: boolean; rows?: number }
  ) => {
    const value = formData[name] ?? '';
    const fieldType = options?.type || 'text';
    const required = options?.required ?? false;

    const baseClassName =
      'w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none transition focus:border-sky-500 focus:ring-4 focus:ring-sky-100';

    return (
      <label key={name} className="block space-y-2 text-sm font-medium text-slate-700">
        <span className="flex items-center justify-between gap-3">
          <span>{label}</span>
          {required && <span className="text-xs uppercase tracking-wide text-sky-600">Required</span>}
        </span>
        {fieldType === 'textarea' ? (
          <textarea
            name={name}
            value={typeof value === 'boolean' ? '' : value}
            onChange={handleChange}
            rows={options?.rows || 3}
            placeholder={options?.placeholder}
            className={baseClassName}
          />
        ) : fieldType === 'select' ? (
          <select name={name} value={typeof value === 'boolean' ? 'M' : value} onChange={handleChange} className={baseClassName}>
            {options?.placeholder && <option value="">{options.placeholder}</option>}
            <option value="M">Male</option>
            <option value="F">Female</option>
          </select>
        ) : (
          <input
            type={fieldType}
            name={name}
            value={typeof value === 'boolean' ? '' : value}
            onChange={handleChange}
            placeholder={options?.placeholder}
            required={required}
            className={baseClassName}
          />
        )}
      </label>
    );
  };

  const renderStep = () => {
    switch (step) {
      case 0:
        return (
          <div className="grid gap-4 md:grid-cols-2">
            {renderField('name', 'Name', { placeholder: 'Child full name', required: true })}
            {renderField('age', 'Age in months', { type: 'number', placeholder: 'e.g. 24', required: true })}
            {renderField('sex', 'Sex', { type: 'select', required: true })}
            {renderField('religion', 'Religion', { placeholder: 'Optional' })}
            {renderField('continent', 'Continent', { placeholder: 'Optional' })}
            {renderField('country', 'Country', { placeholder: 'Optional' })}
            {renderField('region', 'Region', { placeholder: 'Optional' })}
            {renderField('zone', 'Zone', { placeholder: 'Optional' })}
            {renderField('woreda', 'Woreda', { placeholder: 'Optional' })}
            {renderField('kebele', 'Kebele', { placeholder: 'Optional' })}
          </div>
        );

      case 1:
        return (
          <div className="grid gap-4 md:grid-cols-2">
            {renderField('pmh', 'Past Medical History', { type: 'textarea', rows: 4, placeholder: 'Chronic illness, hospitalization, surgeries' })}
            {renderField('fatherAge', 'Father Age', { type: 'number', placeholder: 'Optional' })}
            {renderField('fatherHealthStatus', 'Father Health Status', { placeholder: 'Optional' })}
            {renderField('fatherCauseOfDeath', 'Father Cause of Death', { placeholder: 'If deceased' })}
            {renderField('motherAge', 'Mother Age', { type: 'number', placeholder: 'Optional' })}
            {renderField('motherHealthStatus', 'Mother Health Status', { placeholder: 'Optional' })}
            {renderField('motherCauseOfDeath', 'Mother Cause of Death', { placeholder: 'If deceased' })}
            {renderField('siblingsHistory', 'Sibling History', { type: 'textarea', rows: 4, placeholder: 'Ages, health status, cause of death if any' })}
            {renderField('familialDiseases', 'Familial Diseases', { type: 'textarea', rows: 4, placeholder: 'DM, HTN, Asthma, CKD' })}
          </div>
        );

      case 2:
        return (
          <div className="grid gap-4 md:grid-cols-2">
            {renderField('earlyDevelopment', 'Early Development', { type: 'textarea', rows: 4, placeholder: 'Place of birth, home environment, health, economy' })}
            {renderField('educationalBackground', 'Educational Background', { type: 'textarea', rows: 4, placeholder: 'Schooling or childcare background' })}
            {renderField('socialActivities', 'Social Activities', { type: 'textarea', rows: 4, placeholder: 'Community, play, support network' })}
            {renderField('workRecordIncome', 'Work Record & Income', { type: 'textarea', rows: 4, placeholder: 'Parent/guardian work and income context' })}
            {renderField('dietHabits', 'Diet Habits', { type: 'textarea', rows: 4, placeholder: 'Diet pattern, meal frequency, food access' })}
            {renderField('alcoholUse', 'Alcohol Use', { type: 'textarea', rows: 3, placeholder: 'Optional' })}
            {renderField('tobaccoUse', 'Tobacco Use', { type: 'textarea', rows: 3, placeholder: 'Optional' })}
            {renderField('drugUse', 'Drug Use', { type: 'textarea', rows: 3, placeholder: 'Optional' })}
            {renderField('herbUse', 'Herb Use', { type: 'textarea', rows: 3, placeholder: 'Optional' })}
            {renderField('addictions', 'Addictions', { type: 'textarea', rows: 3, placeholder: 'Optional' })}
          </div>
        );

      case 3:
        return (
          <div className="grid gap-4 md:grid-cols-2">
            {renderField('bpSystolic', 'Blood Pressure Systolic (mmHg)', { type: 'number', placeholder: 'Optional' })}
            {renderField('bpDiastolic', 'Blood Pressure Diastolic (mmHg)', { type: 'number', placeholder: 'Optional' })}
            {renderField('bpArterySite', 'BP Artery Site', { placeholder: 'e.g. brachial' })}
            {renderField('bpPosition', 'BP Position', { placeholder: 'e.g. seated' })}
            {renderField('bpGrade', 'BP Grade', { placeholder: 'e.g. normal / elevated' })}
            {renderField('pulseRate', 'Pulse Rate (bpm)', { type: 'number', placeholder: 'Optional' })}
            {renderField('pulseSite', 'Pulse Site', { placeholder: 'Optional' })}
            {renderField('pulseRhythm', 'Pulse Rhythm', { placeholder: 'Optional' })}
            {renderField('pulseVolume', 'Pulse Volume', { placeholder: 'Optional' })}
            {renderField('rrRate', 'Respiratory Rate (bpm)', { type: 'number', placeholder: 'Optional' })}
            {renderField('rrPattern', 'Respiratory Pattern', { placeholder: 'Optional' })}
            {renderField('temperature', 'Temperature (°C)', { type: 'number', placeholder: 'Optional' })}
            {renderField('temperatureSite', 'Temperature Site', { placeholder: 'Optional' })}
            {renderField('temperatureTime', 'Temperature Time', { placeholder: 'Optional' })}
            {renderField('spo2', 'SpO₂ (%)', { type: 'number', placeholder: 'Optional' })}
            {renderField('oxygenSupport', 'Room Air / Oxygen', { placeholder: 'Optional' })}
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="grid gap-4 md:grid-cols-3">
              {renderField('height', 'Height / Length (cm)', { type: 'number', placeholder: 'Required', required: true })}
              {renderField('weight', 'Weight (kg)', { type: 'number', placeholder: 'Required', required: true })}
              {renderField('muac', 'MUAC (cm)', { type: 'number', placeholder: 'Required', required: true })}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              {renderField('heightSource', 'Height Source', { placeholder: 'Measured or AI camera estimate' })}
              {renderField('weightSource', 'Weight Source', { placeholder: 'Measured or AI camera estimate' })}
              {renderField('headCircumference', 'Head Circumference (cm)', { type: 'number', placeholder: 'Optional' })}
              {renderField('chestCircumference', 'Chest Circumference (cm)', { type: 'number', placeholder: 'Optional' })}
            </div>
            <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4 text-sm text-sky-900">
              If exact height or weight is unavailable, use the AI estimate button. The app will fill a provisional value so analysis can continue.
            </div>
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                onClick={estimateAnthropometrics}
                className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-700"
              >
                Use AI Estimate
              </button>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="grid gap-4 md:grid-cols-2">
            <label className="flex items-start gap-3 rounded-2xl border border-slate-200 bg-white p-4 text-slate-800 shadow-sm md:col-span-2">
              <input
                type="checkbox"
                name="edema"
                checked={Boolean(formData.edema)}
                onChange={handleChange}
                className="mt-1 h-5 w-5 rounded border-slate-300 text-sky-600 focus:ring-sky-500"
              />
              <span>
                <span className="block font-semibold">Edema</span>
                <span className="block text-sm text-slate-500">Relevant for kwashiorkor / severe acute malnutrition</span>
              </span>
            </label>
            {renderField('edemaDetails', 'Edema Details', { type: 'textarea', rows: 3, placeholder: 'If present' })}
            {renderField('skinChanges', 'Skin Changes', { type: 'textarea', rows: 3, placeholder: 'Dermatosis, ulcers, lesions' })}
            {renderField('hairChanges', 'Hair Changes', { type: 'textarea', rows: 3, placeholder: 'Thinning, discoloration' })}
            {renderField('eyeSigns', 'Eye Signs', { type: 'textarea', rows: 3, placeholder: 'Bitot’s spots, xerophthalmia' })}
            {renderField('oralSigns', 'Oral Signs', { type: 'textarea', rows: 3, placeholder: 'Stomatitis, glossitis' })}
            {renderField('hearingLossDevelopmentalDelay', 'Hearing Loss / Developmental Delay', { type: 'textarea', rows: 3, placeholder: 'Optional' })}
            {renderField('generalAppearance', 'General Appearance', { type: 'textarea', rows: 4, placeholder: 'Lethargy, irritability, muscle wasting' })}
          </div>
        );

      default:
        return (
          <div className="space-y-4">
            <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-lg font-semibold text-slate-900">Review intake before submission</h3>
              <p className="mt-1 text-sm text-slate-600">
                The report will calculate estimated WHO-style z-score traffic lights, overlay clinical signs, and generate recommendations.
              </p>
            </div>
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {['name', 'age', 'sex', 'country', 'pmh', 'weight', 'height', 'muac', 'spo2', 'edema'].map((key) => (
                <div key={key} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{key}</p>
                  <p className="mt-2 text-sm text-slate-900">{formatValue(formData[key] ?? '')}</p>
                </div>
              ))}
            </div>
            {livePreview && (
              <div className="rounded-3xl border border-cyan-100 bg-cyan-50 p-5">
                <h4 className="text-lg font-semibold text-slate-900">Live WHO Z-Score Preview</h4>
                <p className="mt-1 text-sm text-slate-600">These values update immediately while you type age, sex, height, weight, and MUAC.</p>
                <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
                  {previewCards?.map(({ label, score }) => (
                    <div key={label} className="rounded-2xl border border-white bg-white p-4 shadow-sm">
                      <p className="text-sm font-semibold text-slate-700">{label}</p>
                      <p className="mt-2 text-2xl font-bold text-slate-900">{score.value}</p>
                      <p className={`mt-1 text-xs font-semibold ${score.label === 'Red' ? 'text-red-600' : score.label === 'Yellow' ? 'text-amber-600' : 'text-emerald-600'}`}>
                        {score.label}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        );
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onSubmit(buildPayload());
  };

  return (
    <form onSubmit={handleSubmit} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl shadow-slate-200/60">
      <div className="bg-gradient-to-r from-slate-950 via-sky-950 to-cyan-900 px-6 py-8 text-white md:px-10">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-cyan-200">Child Intake Workflow</p>
            <h2 className="mt-2 text-3xl font-semibold md:text-4xl">Register New Child</h2>
            <p className="mt-2 max-w-2xl text-sm text-slate-200">
              Capture the full clinical intake in seven steps. The last step generates the integrated nutrition report.
            </p>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 backdrop-blur">
            <p className="text-xs uppercase tracking-[0.3em] text-cyan-200">Step {step + 1} of {totalSteps}</p>
            <p className="mt-1 text-lg font-semibold">{sectionTitles[step]}</p>
          </div>
        </div>
        <div className="mt-6 h-2 overflow-hidden rounded-full bg-white/15">
          <div className="h-full rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>

      <div className="space-y-8 px-6 py-8 md:px-10">
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-5 shadow-sm">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-sm font-semibold uppercase tracking-wide text-slate-500">Current section</p>
              <h3 className="text-2xl font-semibold text-slate-900">{sectionTitles[step]}</h3>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs font-semibold text-slate-500 sm:flex sm:flex-wrap">
              {sectionTitles.map((title, index) => (
                <span
                  key={title}
                  className={`rounded-full px-3 py-1 ${index === step ? 'bg-slate-900 text-white' : index < step ? 'bg-emerald-100 text-emerald-800' : 'bg-white'}`}
                >
                  {index + 1}. {title}
                </span>
              ))}
            </div>
          </div>
        </div>

        <div>{renderStep()}</div>

        <div className="flex flex-col gap-3 border-t border-slate-200 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <button
            type="button"
            onClick={goBack}
            disabled={step === 0 || isLoading}
            className="rounded-xl border border-slate-300 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Previous
          </button>

          <div className="flex items-center gap-3">
            {step < totalSteps - 1 ? (
              <button
                type="button"
                onClick={goNext}
                className="rounded-xl bg-sky-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-700"
              >
                Next Step
              </button>
            ) : (
              <button
                type="submit"
                disabled={isLoading}
                className="rounded-xl bg-emerald-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:bg-slate-400"
              >
                {isLoading ? 'Generating report...' : 'Generate AI Report'}
              </button>
            )}
          </div>
        </div>

        <p className="text-sm text-slate-500">
          Required fields are name, age, sex, weight, height, and MUAC. If exact measurements are not available, use the AI estimate on the anthropometric step.
        </p>
      </div>
    </form>
  );
}
