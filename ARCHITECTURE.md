# AI-PNAS Development Roadmap & Architecture

## System Architecture

```
┌─────────────────────────────────────────┐
│          Frontend (React/Next.js)       │
│  - Dashboard, Registration, Details     │
│  - Multilingual UI (EN/AM)              │
│  - Tailwind CSS Responsive Design       │
└─────────────────────────────────────────┘
           │
           ↓ (API Calls)
┌─────────────────────────────────────────┐
│     Next.js API Routes (Backend)        │
│  - /api/register-child                  │
│  - /api/analyze-nutrition               │
│  - /api/children                        │
│  - /api/child/[id]                      │
└─────────────────────────────────────────┘
           │
           ↓ (ORM)
┌─────────────────────────────────────────┐
│    Prisma ORM                           │
│  - Schema definition                    │
│  - Database client                      │
│  - Migrations                           │
└─────────────────────────────────────────┘
           │
           ↓ (SQL)
┌─────────────────────────────────────────┐
│    SQLite Database                      │
│  - Child data                           │
│  - Analysis logs                        │
│  - Assessment history                   │
└─────────────────────────────────────────┘
```

## Core Business Logic

### Nutrition Analysis Engine

**Location**: `/lib/nutrition/analyzer.ts`

The engine performs the following steps:

1. **BMI Calculation**
   - Formula: weight (kg) / height² (m)
   - Example: 10.5 kg / (0.85 m)² = 14.5 BMI

2. **MUAC Classification**
   - Primary indicator for acute malnutrition
   - Overrides BMI classification for SAM/MAM
   - Used for children 6-59 months

3. **Risk Assessment**
   - Combines MUAC and BMI
   - Identifies stunting and wasting
   - Generates risk factors list

4. **Medical Recommendation**
   - Context-specific nutrition guidance
   - Referral level determination
   - Follow-up schedule

5. **Referral Suggestion**
   - Hospital for SAM cases
   - Community programs for MAM
   - Health center for moderate issues
   - Routine follow-up for normal

## Data Flow

### Registration & Analysis Flow

```
1. User Input
   ↓
2. Form Validation (Zod)
   ↓
3. POST /api/register-child
   ↓
4. Create Child Record (Prisma)
   ↓
5. Calculate Nutrition Analysis
   ↓
6. Store Results + Create Log
   ↓
7. Return Analysis to Frontend
   ↓
8. Display Results (AnalysisResult Component)
```

### Dashboard Flow

```
1. Page Load
   ↓
2. GET /api/children (with optional risk filter)
   ↓
3. Fetch from Database
   ↓
4. Calculate Statistics
   ↓
5. Display in ChildList Component
   ↓
6. User Filters by Risk Level
```

### Child Details Flow

```
1. User Clicks Child
   ↓
2. GET /api/child/[id]
   ↓
3. Fetch Child + History
   ↓
4. Display Current Analysis (AnalysisResult)
   ↓
5. Display Assessment History (Timeline)
```

## Component Hierarchy

```
App
├── Header
│   ├── Logo/Title
│   ├── Language Selector
│   └── Navigation
├── Dashboard Page
│   ├── Filter Buttons
│   └── ChildList
│       ├── Stats Dashboard
│       └── Children Table
├── Register Page
│   ├── RegistrationForm
│   └── AnalysisResult
│       ├── Child Info
│       ├── Metrics
│       ├── Classification
│       ├── Recommendations
│       └── Referral
└── Child Details Page
    ├── AnalysisResult (Current)
    └── History Timeline
```

## WHO Standards Implementation

### MUAC Thresholds
```typescript
const MUAC_THRESHOLDS = {
  SAM: 11.5,      // < 11.5 cm
  MAM: 12.5,      // 11.5-12.5 cm
  NORMAL: 12.5    // > 12.5 cm
};
```

### BMI Thresholds
```typescript
const BMI_THRESHOLDS = {
  UNDERWEIGHT: 18.5,
  NORMAL_MIN: 18.5,
  NORMAL_MAX: 25,
  OVERWEIGHT: 30
};
```

### Expected Values by Age
```typescript
// Approximate values for reference
const EXPECTED_BY_AGE = {
  "6m": { height: 65, weight: 7.3 },
  "12m": { height: 75, weight: 9.6 },
  "24m": { height: 87, weight: 12.9 },
  "36m": { height: 95, weight: 14.6 },
  "48m": { height: 103, weight: 16.3 },
  "59m": { height: 110, weight: 18.2 }
};
```

## API Response Patterns

### Success Response
```json
{
  "success": true,
  "message": "Operation completed",
  "data": { ... }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description",
  "errors": [ { ... } ]
}
```

### Validation Error
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "code": "too_small",
      "minimum": 0,
      "type": "number",
      "path": ["weight"],
      "message": "Weight must be positive"
    }
  ]
}
```

## Database Queries

### Find High-Risk Children
```typescript
const highRiskChildren = await prisma.child.findMany({
  where: {
    riskLevel: 'High'
  },
  orderBy: {
    createdAt: 'desc'
  }
});
```

### Get Analysis History
```typescript
const history = await prisma.analysisLog.findMany({
  where: {
    childId: 'child-id'
  },
  orderBy: {
    createdAt: 'desc'
  },
  take: 10
});
```

### Calculate Statistics
```typescript
const stats = {
  total: await prisma.child.count(),
  samCases: await prisma.child.count({
    where: { nutritionStatus: 'SAM' }
  }),
  highRisk: await prisma.child.count({
    where: { riskLevel: 'High' }
  })
};
```

## Testing Examples

### Test Child 1: Normal
```json
{
  "name": "Healthy Child",
  "age": 24,
  "sex": "M",
  "weight": 12.5,
  "height": 87,
  "muac": 14.0
}
// Expected: Normal status, Low risk
```

### Test Child 2: SAM
```json
{
  "name": "Malnourished Child",
  "age": 18,
  "sex": "F",
  "weight": 7.0,
  "height": 70,
  "muac": 11.0
}
// Expected: SAM status, High risk - URGENT REFERRAL
```

### Test Child 3: MAM
```json
{
  "name": "Moderate Child",
  "age": 30,
  "sex": "M",
  "weight": 9.0,
  "height": 80,
  "muac": 12.0
}
// Expected: MAM status, Medium risk - SUPPLEMENTARY FEEDING
```

## Multilingual System

### Current Support
- **English (en)**: Complete interface
- **Amharic (am)**: Complete interface

### Adding New Language

1. Create translation file: `public/locales/[code]/common.json`
2. Update `SUPPORTED_LANGUAGES` in `lib/i18n/config.ts`
3. Update language selector component

### Translation Keys
```json
{
  "common": {
    "appName": "AI-PNAS",
    "register": "Register",
    ...
  },
  "analysis": {
    "title": "Nutritional Analysis Result",
    ...
  }
}
```

## Performance Metrics

### Database Indexes
- `nutritionStatus`: For filtering
- `riskLevel`: For dashboards
- `createdAt`: For sorting/pagination

### Query Optimization
- Use `select` to fetch only needed fields
- Implement pagination for large result sets
- Add database connection pooling

### Frontend Optimization
- Component lazy loading
- Image optimization
- CSS purging
- Minification in production

## Error Handling

### Validation Errors
- Caught by Zod schemas
- Returned with field-specific messages
- Frontend displays user-friendly errors

### Database Errors
- Connection errors
- Constraint violations
- Transaction failures

### Business Logic Errors
- Invalid measurements
- Missing required fields
- Processing timeouts

## Security Checklist

- [x] Input validation with Zod
- [x] SQL injection prevention (Prisma)
- [x] Type safety (TypeScript)
- [ ] Authentication middleware
- [ ] Authorization checks
- [ ] Rate limiting
- [ ] HTTPS/TLS
- [ ] CORS configuration
- [ ] CSP headers
- [ ] Data encryption

## Monitoring & Logging

### Implementation Opportunities
1. **Application Logging**
   - Error logs
   - API request/response logs
   - User action logs

2. **Metrics**
   - API response times
   - Database query performance
   - Error rates

3. **Alerts**
   - High error rates
   - Slow queries
   - System failures

---

## Quick Reference

### Add a Child (Manual SQL)
```sql
INSERT INTO Child (name, age, sex, weight, height, muac, createdAt, updatedAt)
VALUES ('John', 24, 'M', 10.5, 85, 13.2, NOW(), NOW());
```

### Get All SAM Cases
```bash
curl http://localhost:3000/api/children?riskLevel=High
```

### Analyze a Specific Child
```bash
curl -X POST http://localhost:3000/api/analyze-nutrition \
  -H "Content-Type: application/json" \
  -d '{"childId": "clxx123"}'
```

---

**Last Updated**: 2026-07-03
**Version**: 1.0.0 (MVP Complete)
