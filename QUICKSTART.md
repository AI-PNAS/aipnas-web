# Quick Start Guide

## Getting Started

### 1. Setup

```bash
# Navigate to project
cd /workspaces/aipnas-web

# Install dependencies (already done)
npm install

# Environment is already configured
cat .env
```

### 2. Start Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Test the Application

#### Dashboard
- Visit http://localhost:3000
- See the dashboard with filters

#### Register a Child
- Click "Register Child"
- Fill in the form with sample data
- Submit to see instant analysis results

#### Sample Test Data

**Normal Child:**
```
Name: Ahmed Hassan
Age: 24 months
Sex: Male
Weight: 12.5 kg
Height: 87 cm
MUAC: 14.0 cm
```

**SAM Case (Emergency):**
```
Name: Fatima Ali
Age: 18 months
Sex: Female
Weight: 7.0 kg
Height: 70 cm
MUAC: 11.0 cm
```

**MAM Case (Moderate):**
```
Name: Karim Abdulla
Age: 30 months
Sex: Male
Weight: 9.0 kg
Height: 80 cm
MUAC: 12.0 cm
```

### 4. Build for Production

```bash
npm run build
npm start
```

## API Testing

### Using curl

```bash
# Register a child
curl -X POST http://localhost:3000/api/register-child \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Child",
    "age": 24,
    "sex": "M",
    "weight": 12.5,
    "height": 87,
    "muac": 14.0
  }'

# Get all children
curl http://localhost:3000/api/children

# Filter by risk level
curl "http://localhost:3000/api/children?riskLevel=High"

# Get specific child
curl http://localhost:3000/api/child/[child-id]
```

### Using Postman

1. Create new collection "AI-PNAS"
2. Create requests:
   - POST /api/register-child
   - GET /api/children
   - GET /api/child/:id
   - POST /api/analyze-nutrition

## Project Features

### ✅ Completed

- [x] Full-stack Next.js + React + TypeScript
- [x] Prisma ORM with SQLite database
- [x] WHO nutrition classification engine
- [x] REST API (4 endpoints)
- [x] Beautiful responsive UI
- [x] Dashboard with statistics
- [x] Child registration system
- [x] Analysis history tracking
- [x] Multilingual support (EN/AM)
- [x] Medical recommendations
- [x] Risk-based referrals
- [x] Form validation
- [x] Error handling

### 🚀 Future Phases

1. **Computer Vision**: Automatic measurement from images
2. **Mobile App**: React Native iOS/Android
3. **Analytics**: Growth tracking and reporting
4. **Integration**: EHR and FHIR compliance
5. **Offline**: PWA for rural areas
6. **Authentication**: User roles and permissions

## File Organization

### Key Files

| File | Purpose |
|------|---------|
| `lib/nutrition/analyzer.ts` | WHO nutrition logic |
| `lib/db.ts` | Database operations |
| `lib/types.ts` | TypeScript interfaces |
| `app/api/*/route.ts` | API endpoints |
| `app/components/*.tsx` | UI components |
| `prisma/schema.prisma` | Database schema |

### Important Directories

- `/app/api/` - Backend API routes
- `/app/components/` - React components
- `/lib/nutrition/` - Nutrition analysis logic
- `/public/locales/` - Translation files
- `/prisma/` - Database configuration

## Customization

### Change Database to PostgreSQL

1. Update `.env`:
```
DATABASE_URL="postgresql://user:password@localhost:5432/aipnas"
```

2. Install PostgreSQL driver:
```bash
npm install pg
```

3. Update `prisma/schema.prisma`:
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

4. Migrate:
```bash
npx prisma db push
```

### Add New Nutrition Rule

Edit `/lib/nutrition/analyzer.ts`:

```typescript
export function classifyMUAC(muac: number) {
  // Add your custom rule here
  if (muac < 11.0) return { status: 'Critical SAM', severity: 'High' };
  // ...
}
```

### Add New Language

1. Create `public/locales/[code]/common.json`
2. Add translations following English pattern
3. Update `lib/i18n/config.ts`

## Troubleshooting

### Database Issues
```bash
# Reset database
rm prisma/dev.db
npx prisma db push

# View database
sqlite3 prisma/dev.db
```

### Build Errors
```bash
# Clear cache
rm -rf .next node_modules
npm install
npm run build
```

### Port 3000 Already in Use
```bash
# Use different port
PORT=3001 npm run dev
```

## Environment Setup

The project uses these env vars:

```bash
# .env file
DATABASE_URL="file:./prisma/dev.db"
NEXT_PUBLIC_APP_NAME="AI-PNAS"
NEXT_PUBLIC_DEFAULT_LANGUAGE="en"
```

## Performance Tips

- Database queries are optimized with indexes
- Images are served statically
- API responses are minimal
- Components use React best practices
- Tailwind CSS is purged for production

## Security

The system includes:
- Input validation (Zod)
- Type safety (TypeScript)
- SQL injection prevention (Prisma)
- CORS headers (Next.js default)

For production:
- Set secure environment variables
- Use HTTPS
- Enable CORS properly
- Add rate limiting
- Implement authentication

## Support

For issues:
1. Check ARCHITECTURE.md for technical details
2. Review PROJECT_GUIDE.md for comprehensive guide
3. Check example API calls above
4. Review test data section

## Next Steps

1. **Deploy**: Push to Vercel or Docker
2. **Extend**: Add computer vision module
3. **Integrate**: Connect to EHR systems
4. **Scale**: Move to PostgreSQL + Redis
5. **Mobile**: Build React Native app

---

**Ready to assess child nutrition? Start the dev server and register your first child!**
