## Setup & Run Instructions

### Installation

1. Clone the repository:
```bash
TODO
```

2. Install dependencies:
```bash
npm i
```

3. Create environment variables:
```bash
themoviedb=your_tmdb_bearer_token_here
NEXT_PUBLIC_BASE_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000) in your browser


## Hosted Application

**Live Demo**: [movies.mrmarmo.com](https://movies.mrmarmo.com)

## Technical Decisions & Tradeoffs

### API Proxy Pattern

**Decision**: Implemented Next.js API routes as a proxy layer between the client and TMDb API.

**Rationale**:
- Secures API keys by keeping them server-side only
- Provides a consistent API interface even if external API changes
- Enables request/response transformation and validation
- Allows for caching strategies and rate limiting

**Tradeoff**: Adds slight latency compared to direct API calls, but security and flexibility benefits outweigh this cost.

### State Management - React Query

**Decision**: Used TanStack React Query (formerly React Query) for server state management instead of Redux or Context API.

**Rationale**:
- **Automatic Caching**: Built-in intelligent caching reduces unnecessary API calls
- **Optimistic Updates**: Instant UI feedback for better UX
- **Background Refetching**: Keeps data fresh without user intervention
- **Infinite Queries**: First-class support for pagination/infinite scrolling
- **Developer Experience**: Less boilerplate than Redux, more powerful than Context for async data

**Tradeoff**: Adds a library dependency, but eliminates the need to build custom caching and loading state logic.

### Persistence Choice - SQLite

**Decision**: Used SQLite for storing user comments and guest accounts.

**Rationale**:
- **Zero Configuration**: No separate database server needed
- **Serverless Friendly**: Works well in serverless environments
- **Sufficient for Scale**: Handles hundreds of thousands of comments easily
- **File-Based**: Simple backup and portability
- **SQL Support**: Full relational database features

**Tradeoff**: 
- Not ideal for high-concurrency write scenarios (using sqlite)
- DB stored in `/tmp` 
- **Production Alternative**: Would use PostgreSQL, MySQL, or a cloud database (Supabase, PlanetScale) for persistent storage

### Guest User System

**Decision**: Automatically created guest accounts with token-based authentication stored in HTTP-only cookies.

**Rationale**:
- **Frictionless UX**: No signup required to leave reviews
- **Speed**: App was created faster

**Tradeoff**: Users lose access if cookies are cleared, and can't delete reviews.

## Known Limitations & Future Improvements

### Current Limitations

1. **Database Persistence**
   - SQLite database stored in `/tmp` directory

2. **Authentication**
   - Guest-only system, no real user accounts
   - No email verification or password recovery
   - Lost cookie means lost access to reviews

3. **Search**
   - No search history or suggestions
   - No filtering by genre, year, or rating
   - No advanced search operators

4. **Reviews**
   - No edit history tracking
   - No ability to report inappropriate content

### Future Improvements

Given more time, I would implement:

#### High Priority
- **Persistent Database**: Migrate to PostgreSQL/Supabase for production
- **Search Enhancements**: 
  - Add filters (genre, year, rating range)
  - Implement search suggestions/autocomplete
  - Add sorting options (relevance, date, rating)


## Project Structure

```
MovieExplorer/
├── app/                      # Next.js App Router
│   ├── api/                  # API routes (proxy layer)
│   ├── movies/               # Movie pages
│   └── page.tsx              # Home page
├── components/               # React components
├── middleware/               # Custom middleware for api routes
├── model/                    # TS Interfaces and database queries
├── helpers/                  # Utility functions
└── public/                   # Static assets
```