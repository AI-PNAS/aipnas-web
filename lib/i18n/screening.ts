export type ScreeningLanguage = 'en' | 'am';

type Translation = {
  en: string;
  am: string;
};

const translations: Record<string, Translation> = {
  'Child Profile': { en: 'Child Profile', am: 'የልጅ መገለጫ' },
  Anthropometry: { en: 'Anthropometry', am: 'የሰውነት መለኪያ' },
  'Clinical Signs & Symptoms': { en: 'Clinical Signs & Symptoms', am: 'የሕመም ምልክቶች' },
  'Vital Signs & Risk': { en: 'Vital Signs & Risk', am: 'የሕይወት ምልክቶችና ስጋት' },
  'AI Assessment & Report': { en: 'AI Assessment & Report', am: 'የAI ግምገማና ሪፖርት' },
  'Child name': { en: 'Child name', am: 'የልጅ ስም' },
  'Date of birth': { en: 'Date of birth', am: 'የትውልድ ቀን' },
  'Calculated age': { en: 'Calculated age', am: 'የተሰላ ዕድሜ' },
  Sex: { en: 'Sex', am: 'ጾታ' },
  Country: { en: 'Country', am: 'አገር' },
  'Region / state': { en: 'Region / state', am: 'ክልል' },
  'Zone / province': { en: 'Zone / province', am: 'ዞን' },
  'District / woreda': { en: 'District / woreda', am: 'ወረዳ' },
  'Kebele / locality': { en: 'Kebele / locality', am: 'ቀበሌ / አካባቢ' },
  'Assessment setting': { en: 'Assessment setting', am: 'የግምገማ ቦታ' },
  'Weight (kg)': { en: 'Weight (kg)', am: 'ክብደት (ኪ.ግ)' },
  'Length / height (cm)': { en: 'Length / height (cm)', am: 'ርዝመት / ቁመት (ሴ.ሜ)' },
  'Measurement type': { en: 'Measurement type', am: 'የመለኪያ ዓይነት' },
  'MUAC (cm)': { en: 'MUAC (cm)', am: 'የክንድ ዙሪያ (ሴ.ሜ)' },
  'Bilateral pitting oedema': { en: 'Bilateral pitting oedema', am: 'በሁለቱም እግሮች የሚታይ እብጠት' },
  'Oedema severity': { en: 'Oedema severity', am: 'የእብጠት መጠን' },
  'Head circumference (cm)': { en: 'Head circumference (cm)', am: 'የራስ ዙሪያ (ሴ.ሜ)' },
  Appetite: { en: 'Appetite', am: 'የምግብ ፍላጎት' },
  Breastfeeding: { en: 'Breastfeeding', am: 'ጡት ማጥባት' },
  'Feeding difficulty': { en: 'Feeding difficulty', am: 'የመመገብ ችግር' },
  Vomiting: { en: 'Vomiting', am: 'ማስታወክ' },
  'Vomiting duration': { en: 'Vomiting duration', am: 'የማስታወክ ቆይታ' },
  Diarrhea: { en: 'Diarrhea', am: 'ተቅማጥ' },
  'Diarrhea duration': { en: 'Diarrhea duration', am: 'የተቅማጥ ቆይታ' },
  Fever: { en: 'Fever', am: 'ትኩሳት' },
  Cough: { en: 'Cough', am: 'ሳል' },
  'Difficulty breathing': { en: 'Difficulty breathing', am: 'የመተንፈስ ችግር' },
  'Visible wasting': { en: 'Visible wasting', am: 'የሚታይ መክሳት' },
  Pallor: { en: 'Pallor', am: 'የፊት መገርጣት' },
  'Skin changes': { en: 'Skin changes', am: 'የቆዳ ለውጦች' },
  'Hair changes': { en: 'Hair changes', am: 'የፀጉር ለውጦች' },
  Lethargy: { en: 'Lethargy', am: 'ድካም / ንቃት ማጣት' },
  Convulsions: { en: 'Convulsions', am: 'መንቀጥቀጥ' },
  'Altered consciousness': { en: 'Altered consciousness', am: 'የንቃተ ህሊና ለውጥ' },
  Dehydration: { en: 'Dehydration', am: 'የሰውነት ውሃ ማነስ' },
  'Temperature (°C)': { en: 'Temperature (°C)', am: 'ሙቀት (°C)' },
  'Heart rate (/min)': { en: 'Heart rate (/min)', am: 'የልብ ምት (/ደቂቃ)' },
  'Respiratory rate (/min)': { en: 'Respiratory rate (/min)', am: 'የመተንፈሻ ብዛት (/ደቂቃ)' },
  'SpO₂ (%)': { en: 'SpO₂ (%)', am: 'የኦክሲጅን መጠን (%)' },
  'Blood pressure systolic (mmHg)': { en: 'Blood pressure systolic (mmHg)', am: 'የደም ግፊት ላይኛው (mmHg)' },
  'Blood pressure diastolic (mmHg)': { en: 'Blood pressure diastolic (mmHg)', am: 'የደም ግፊት ታችኛው (mmHg)' },
  'Unable to drink / breastfeed': { en: 'Unable to drink / breastfeed', am: 'መጠጣት / ጡት መጥባት አልቻለም' },
  'Persistent vomiting': { en: 'Persistent vomiting', am: 'የማያቋርጥ ማስታወክ' },
  'Lethargic / unconscious': { en: 'Lethargic / unconscious', am: 'የደከመ / ንቃተ ህሊና የሌለው' },
  'Severe respiratory distress': { en: 'Severe respiratory distress', am: 'ከባድ የመተንፈስ ችግር' },
  'Other danger sign': { en: 'Other danger sign', am: 'ሌላ አደገኛ ምልክት' },
  None: { en: 'None', am: 'የለም' },
  Present: { en: 'Present', am: 'አለ' },
  Absent: { en: 'Absent', am: 'የለም' },
  Yes: { en: 'Yes', am: 'አዎ' },
  No: { en: 'No', am: 'አይ' },
  Unknown: { en: 'Unknown', am: 'አይታወቅም' },
  Normal: { en: 'Normal', am: 'መደበኛ' },
  Reduced: { en: 'Reduced', am: 'የቀነሰ' },
  Poor: { en: 'Poor', am: 'ደካማ' },
  'Refuses food': { en: 'Refuses food', am: 'ምግብ አይቀበልም' },
  'Unable to feed': { en: 'Unable to feed', am: 'መመገብ አይችልም' },
  'Not assessed': { en: 'Not assessed', am: 'አልተገመገመም' },
  'Exclusively breastfeeding': { en: 'Exclusively breastfeeding', am: 'ብቻውን ጡት የሚጠባ' },
  'Breastfeeding + complementary feeding': { en: 'Breastfeeding + complementary feeding', am: 'ጡት እና ተጨማሪ ምግብ' },
  'Not breastfeeding': { en: 'Not breastfeeding', am: 'ጡት አይጠባም' },
  'Not applicable': { en: 'Not applicable', am: 'አይመለከትም' },
  'No signs': { en: 'No signs', am: 'ምልክት የለም' },
  'Some dehydration': { en: 'Some dehydration', am: 'መጠነኛ የውሃ ማነስ' },
  'Severe dehydration': { en: 'Severe dehydration', am: 'ከባድ የውሃ ማነስ' },
  'Unable to assess': { en: 'Unable to assess', am: 'መገምገም አልተቻለም' },
  'Mild (-)': { en: 'Mild (-)', am: 'ቀላል (-)' },
  'Moderate (++)': { en: 'Moderate (++)', am: 'መካከለኛ (++)' },
  'Severe/generalized (+++)': { en: 'Severe/generalized (+++)', am: 'ከባድ / አጠቃላይ (+++)' },
  'None identified': { en: 'None identified', am: 'ምንም አልተገኘም' },
};

export function bilingualLabel(value: string, language: ScreeningLanguage): string {
  const translation = translations[value] || { en: value, am: value };
  return language === 'am'
    ? `${translation.am} / ${translation.en}`
    : `${translation.en} / ${translation.am}`;
}

export const SUPPORTED_SCREENING_LANGUAGES: { code: ScreeningLanguage; label: string }[] = [
  { code: 'en', label: 'English / እንግሊዝኛ' },
  { code: 'am', label: 'አማርኛ / Amharic' },
];
