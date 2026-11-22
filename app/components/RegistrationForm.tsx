'use client';

import { useEffect, useMemo, useState } from 'react';
import { RegisterChildInput } from '@/lib/validation';
import {
  AdministrativeDivision,
  CountryOption,
  readCountryCache,
  readRegionCache,
  writeCountryCache,
  writeRegionCache,
} from '@/lib/geography';
import { SUPPORTED_SCREENING_LANGUAGES, ScreeningLanguage, bilingualLabel } from '@/lib/i18n/screening';

type FormState = Record<string, string>;

interface RegistrationFormProps {
  onSubmit: (data: RegisterChildInput) => void;
  isLoading: boolean;
}

const initialForm: FormState = {
  patientId: '',
  name: '',
  dateOfBirth: '',
  assessmentDate: new Date().toISOString().slice(0, 10),
  age: '',
  sex: '',
  country: 'Ethiopia',
  countryCode: 'ET',
  countryIso3: 'ETH',
  region: '',
  regionCode: '',
  city: '',
  measurementMethod: 'manual',
  weight: '',
  height: '',
  measurementType: 'height',
  muac: '',
  edema: 'Not assessed',
  severeWasting: 'Not assessed',
  visibleRibs: 'Not assessed',
  thinArms: 'Not assessed',
  muscleFatLoss: 'Not assessed',
  poorAppetite: 'Not assessed',
  poorFeeding: 'Not assessed',
  recentWeightLoss: 'Not assessed',
  growthFaltering: 'Not assessed',
};

const yesNoOptions = [
  { value: 'Yes', label: 'Yes' },
  { value: 'No', label: 'No' },
  { value: 'Not assessed', label: 'Not assessed' },
];

function calculateAge(dateOfBirth: string, assessmentDate: string): string {
  if (!dateOfBirth) return '';
  const birth = new Date(`${dateOfBirth}T00:00:00`);
  const assessment = new Date(`${assessmentDate || new Date().toISOString().slice(0, 10)}T00:00:00`);
  if (Number.isNaN(birth.getTime()) || Number.isNaN(assessment.getTime()) || assessment < birth) return '';
  let months = (assessment.getFullYear() - birth.getFullYear()) * 12 +
    assessment.getMonth() - birth.getMonth();
  if (assessment.getDate() < birth.getDate()) months -= 1;
  return String(Math.max(0, months));
}

function numberOrUndefined(value: string): number | undefined {
  if (!value.trim()) return undefined;
  const number = Number(value);
  return Number.isFinite(number) ? number : undefined;
}

export default function RegistrationForm({ onSubmit, isLoading }: RegistrationFormProps) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [language, setLanguage] = useState<ScreeningLanguage>('en');
  const [countries, setCountries] = useState<CountryOption[]>([]);
  const [regions, setRegions] = useState<AdministrativeDivision[]>([]);
  const [geographyLoading, setGeographyLoading] = useState(false);
  const [geographyError, setGeographyError] = useState<string | null>(null);
  const [draftSaved, setDraftSaved] = useState(false);

  useEffect(() => {
    const cachedCountries = readCountryCache();
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (cachedCountries.length) setCountries(cachedCountries);

    void (async () => {
      try {
        const response = await fetch('/api/geography/countries');
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.message);
        setCountries(data.countries);
        writeCountryCache(data.countries);
      } catch (error) {
        setGeographyError(error instanceof Error ? error.message : 'Country data is unavailable.');
      }
    })();

    try {
      const saved = window.localStorage.getItem('aipnas:nutrition-draft');
      const savedLanguage = window.localStorage.getItem('aipnas:nutrition-language');
      if (saved) {
        const parsed = JSON.parse(saved) as { form?: FormState };
        if (parsed.form) setForm({ ...initialForm, ...parsed.form });
      }
      if (savedLanguage === 'am') setLanguage('am');
    } catch (error) {
      console.warn('Unable to restore nutrition draft:', error);
    }
  }, []);

  useEffect(() => {
    const countryCode = form.countryCode;
    if (!countryCode) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRegions([]);
      return;
    }

    if (countryCode === 'ET') {
      const cached = readRegionCache();
      if (cached.length) setRegions(cached);
    } else {
      setRegions([]);
    }

    setGeographyLoading(true);
    setGeographyError(null);
    void (async () => {
      try {
        const response = await fetch(`/api/geography/regions?countryCode=${encodeURIComponent(countryCode)}`);
        const data = await response.json();
        if (!response.ok || !data.success) throw new Error(data.message);
        setRegions(data.divisions || []);
        if (countryCode === 'ET') writeRegionCache(data.divisions || []);
      } catch (error) {
        setGeographyError(error instanceof Error ? error.message : 'Region data is unavailable.');
        if (countryCode === 'ET') setRegions(readRegionCache());
      } finally {
        setGeographyLoading(false);
      }
    })();
  }, [form.countryCode]);

  useEffect(() => {
    const timer = window.setTimeout(() => {
      window.localStorage.setItem('aipnas:nutrition-draft', JSON.stringify({ form }));
      window.localStorage.setItem('aipnas:nutrition-language', language);
      setDraftSaved(true);
    }, 250);
    return () => window.clearTimeout(timer);
  }, [form, language]);

  const preview = useMemo(() => {
    const weight = numberOrUndefined(form.weight);
    const height = numberOrUndefined(form.height);
    const muacMm = numberOrUndefined(form.muac);
    const bmi = weight && height ? weight / ((height / 100) ** 2) : undefined;
    return {
      weight,
      height,
      muacMm,
      bmi,
    };
  }, [form.weight, form.height, form.muac]);

  const update = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setForm((previous) => {
      const next = { ...previous, [name]: value };
      if (name === 'dateOfBirth' || name === 'assessmentDate') {
        next.age = calculateAge(next.dateOfBirth, next.assessmentDate);
      }
      if (name === 'country') {
        const country = countries.find((item) =>
          item.name.toLowerCase() === value.toLowerCase() ||
          item.officialName.toLowerCase() === value.toLowerCase(),
        );
        next.countryCode = country?.iso2 || '';
        next.countryIso3 = country?.iso3 || '';
        next.region = '';
        next.regionCode = '';
      }
      if (name === 'region') {
        const region = regions.find((item) => item.name === value);
        next.regionCode = region?.id || '';
      }
      return next;
    });
  };

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const muacCm = numberOrUndefined(form.muac);

    onSubmit({
      patientId: form.patientId.trim() || undefined,
      name: form.name.trim(),
      dateOfBirth: form.dateOfBirth || undefined,
      assessmentDate: form.assessmentDate || undefined,
      age: Number(form.age || 0),
      sex: form.sex === 'F' ? 'F' : 'M',
      country: form.country || undefined,
      countryCode: form.countryCode || undefined,
      countryIso3: form.countryIso3 || undefined,
      region: form.region || undefined,
      regionCode: form.regionCode || undefined,
      woreda: undefined,
      kebele: undefined,
      assessmentSetting: form.city || undefined,
      measurementType: form.measurementType === 'length' ? 'length' : 'height',
      height: numberOrUndefined(form.height),
      weight: numberOrUndefined(form.weight),
      muac: muacCm ? muacCm / 10 : undefined,
      edema: form.edema === 'Yes',
      edemaDetails: form.edema === 'Not assessed' ? 'Not assessed' : form.edema,
      generalAppearance: [
        `Assessment date: ${form.assessmentDate}`,
        `Visible severe wasting: ${form.severeWasting}`,
        `Visible ribs: ${form.visibleRibs}`,
        `Very thin arms: ${form.thinArms}`,
        `Loss of muscle/subcutaneous fat: ${form.muscleFatLoss}`,
        `Poor appetite: ${form.poorAppetite}`,
        `Poor feeding: ${form.poorFeeding}`,
        `Recent weight loss: ${form.recentWeightLoss}`,
        `Growth faltering: ${form.growthFaltering}`,
      ].join(' | '),
    });
  };

  const fieldLabel = (label: string) => bilingualLabel(label, language);

  const renderSelect = (name: string, label: string, values: { value: string; label: string }[], required = false) => (
    <label className="block space-y-2 text-sm font-semibold text-slate-700" key={name}>
      <span>{fieldLabel(label)}{required && <span className="text-red-600"> *</span>}</span>
      <select
        name={name}
        value={form[name]}
        onChange={update}
        required={required}
        className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
      >
        <option value="">Select / ይምረጡ</option>
        {values.map((value) => (
          <option key={value.value} value={value.value}>{bilingualLabel(value.label, language)}</option>
        ))}
      </select>
    </label>
  );

  const renderInput = (name: string, label: string, type = 'text', required = false) => (
    <label className="block space-y-2 text-sm font-semibold text-slate-700" key={name}>
      <span>{fieldLabel(label)}{required && <span className="text-red-600"> *</span>}</span>
      <input
        name={name}
        type={type}
        value={form[name]}
        onChange={update}
        required={required}
        min={type === 'number' ? 0 : undefined}
        step={type === 'number' ? 'any' : undefined}
        className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
      />
    </label>
  );

  return (
    <form onSubmit={submit} className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-xl shadow-slate-200/50">
      <div className="bg-slate-950 px-5 py-6 text-white md:px-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-teal-300">Nutrition-only screening</p>
            <h2 className="mt-2 text-2xl font-semibold">Child Nutrition Assessment / የልጅ የአመጋገብ ግምገማ</h2>
          </div>
          <div className="flex gap-2">
            {SUPPORTED_SCREENING_LANGUAGES.map((option) => (
              <button
                type="button"
                key={option.code}
                onClick={() => setLanguage(option.code)}
                className={`rounded-lg px-3 py-2 text-xs font-semibold ${language === option.code ? 'bg-teal-400 text-slate-950' : 'border border-white/15 text-white'}`}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        {draftSaved && <p className="mt-3 text-xs text-slate-300">Progress saved on this device / እድገቱ በዚህ መሣሪያ ተቀምጧል</p>}
      </div>

      <div className="space-y-8 p-5 md:p-8">
        <section>
          <h3 className="text-lg font-semibold text-slate-900">1. Child profile / የልጅ መገለጫ</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2">
            {renderInput('patientId', 'Patient ID')}
            {renderInput('name', 'Child name', 'text', true)}
            {renderInput('dateOfBirth', 'Date of birth', 'date', true)}
            {renderInput('assessmentDate', 'Assessment date', 'date', true)}
            <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
              <p className="text-xs font-semibold text-slate-500">Age / ዕድሜ</p>
              <p className="mt-2 font-semibold text-slate-900">{form.age ? `${form.age} months / ወር` : 'Calculated from dates / ከቀናት ይሰላል'}</p>
            </div>
            {renderSelect('sex', 'Sex', [{ value: 'M', label: 'Male' }, { value: 'F', label: 'Female' }], true)}

            <label className="block space-y-2 text-sm font-semibold text-slate-700">
              <span>{fieldLabel('Country')} <span className="text-red-600">*</span></span>
              <input
                name="country"
                list="aipnas-country-options"
                value={form.country}
                onChange={update}
                required
                placeholder="Search country"
                className="min-h-12 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-slate-900 shadow-sm outline-none focus:border-teal-600 focus:ring-4 focus:ring-teal-100"
              />
              <datalist id="aipnas-country-options">
                {countries.map((country) => (
                  <option key={`${country.iso2}-${country.iso3}`} value={country.name}>
                    {country.officialName} ({country.iso2}/{country.iso3})
                  </option>
                ))}
              </datalist>
            </label>

            {geographyLoading && <p className="text-sm text-slate-500 md:col-span-2">Loading regions / ክልሎች በመጫን ላይ...</p>}
            {geographyError && <p className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900 md:col-span-2">{geographyError}</p>}
            {form.countryCode === 'ET' && regions.length > 0
              ? renderSelect('region', 'Region / state', regions.map((region) => ({ value: region.name, label: region.name })))
              : renderInput('region', 'Region / state')}
            {renderInput('city', 'City')}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-slate-900">2. Measurements / መለኪያዎች</h3>
          <p className="mt-1 text-sm text-slate-500">Anthropometry is optional here. Missing data is reported clearly. / መለኪያዎች አማራጭ ናቸው። የጎደሉ መረጃዎች ግልጽ ይታያሉ።</p>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-5">
            {renderSelect('measurementMethod', 'Measurement method', [{ value: 'manual', label: 'Manual measurement' }, { value: 'ai', label: 'AI-assisted prototype' }])}
            {renderInput('weight', 'Weight (kg)', 'number')}
            {renderInput('height', 'Height/length (cm)', 'number')}
            {renderSelect('measurementType', 'Measurement position', [{ value: 'length', label: 'Recumbent length' }, { value: 'height', label: 'Standing height' }])}
            {renderInput('muac', 'MUAC (mm)', 'number')}
          </div>
          {form.measurementMethod === 'ai' && (
            <p className="mt-4 rounded-xl border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
              AI-assisted measurement is currently in prototype mode. Please enter standardized manual measurements. / AI መለኪያ አሁን በሙከራ ደረጃ ነው። መደበኛ የተለካ መረጃ ያስገቡ።
            </p>
          )}
          <div className="mt-4">
            {renderSelect('edema', 'Bilateral pitting edema', yesNoOptions)}
          </div>
        </section>

        <section>
          <h3 className="text-lg font-semibold text-slate-900">3. Nutrition observations / የአመጋገብ ምልክቶች</h3>
          <div className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {renderSelect('severeWasting', 'Visible severe wasting', yesNoOptions)}
            {renderSelect('visibleRibs', 'Visible ribs', yesNoOptions)}
            {renderSelect('thinArms', 'Very thin arms', yesNoOptions)}
            {renderSelect('muscleFatLoss', 'Loss of muscle/subcutaneous fat', yesNoOptions)}
            {renderSelect('poorAppetite', 'Poor appetite', yesNoOptions)}
            {renderSelect('poorFeeding', 'Poor feeding', yesNoOptions)}
            {renderSelect('recentWeightLoss', 'Recent weight loss', yesNoOptions)}
            {renderSelect('growthFaltering', 'Growth faltering', yesNoOptions)}
          </div>
          <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
            Clinical observations do not confirm anthropometric malnutrition classifications. / ክሊኒካዊ ምልክቶች ብቻ የWHO መለኪያ ግምገማን አያረጋግጡም።
          </p>
        </section>

        {preview.weight || preview.height || preview.muacMm ? (
          <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
            <h3 className="font-semibold text-slate-900">Measurement summary / የመለኪያ ማጠቃለያ</h3>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <p className="text-sm text-slate-600">Weight: {preview.weight ? `${preview.weight} kg` : 'Missing'}</p>
              <p className="text-sm text-slate-600">Height/length: {preview.height ? `${preview.height} cm` : 'Missing'}</p>
              <p className="text-sm text-slate-600">MUAC: {preview.muacMm ? `${preview.muacMm} mm` : 'Missing'}</p>
            </div>
          </section>
        ) : null}

        <button
          type="submit"
          disabled={isLoading}
          className="min-h-12 w-full rounded-xl bg-teal-700 px-5 py-3 font-semibold text-white transition hover:bg-teal-600 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isLoading ? 'Saving assessment... / በመቀምጥ ላይ...' : 'Save nutrition assessment / የአመጋገብ ግምገማን አስቀምጥ'}
        </button>
      </div>
    </form>
  );
}
