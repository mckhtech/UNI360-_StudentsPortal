# Backend API Requirements for Universities Portal

## Current Status
The frontend is fully integrated and ready to consume the following APIs. All mock data has been removed - the application is now making real API calls to the backend.

## Base URL
`http://34.230.50.74:8080`

## Required API Endpoints

### 1. Universities APIs

#### GET /api/v1/universities
- **Purpose**: List all universities with optional filters
- **Query Parameters**:
  - `country` (optional): Filter by country (e.g., "DE", "UK")
  - `city` (optional): Filter by city name
  - `state` (optional): Filter by state/region
  - `subject_area` (optional): Filter by available subjects
  - `language` (optional): Filter by teaching language
- **Expected Response**: Array of university objects
```json
[
  {
    "id": "uuid",
    "name": "University Name",
    "city": "City",
    "state": "State",
    "country": "Country",
    "description": "Description",
    "image_url": "https://...",
    "ranking": 50,
    "match_score": 85,
    "acceptance_rate": 25,
    "total_courses": 150,
    "is_partner": true
  }
]
```

#### GET /api/v1/universities/{id}
- **Purpose**: Get single university by ID
- **Response**: Single university object

#### GET /api/v1/universities/code/{code}
- **Purpose**: Get university by code
- **Response**: Single university object

#### GET /api/v1/universities/filters
- **Purpose**: Get available filter options
- **Response**:
```json
{
  "cities": ["Munich", "Berlin", ...],
  "states": ["Bavaria", "Berlin", ...],
  "subjects": ["Computer Science", "Engineering", ...],
  "degreeTypes": ["bachelors", "masters", "phd"],
  "languages": ["English", "German"],
  "intakeSeasons": ["Winter", "Summer"]
}
```

#### POST /api/v1/universities/search
- **Purpose**: Search universities
- **Request Body**:
```json
{
  "query": "search text",
  "country": "DE",
  "city": "Munich",
  "subject_area": "Computer Science",
  "degree_type": "masters"
}
```
- **Response**: Array of matching universities

#### PUT /api/v1/universities/{id}
- **Purpose**: Update university details
- **Request Body**:
```json
{
  "name": "Updated Name",
  "city": "Updated City",
  "description": "Updated description"
}
```

#### DELETE /api/v1/universities/{id}?reason={reason}
- **Purpose**: Delete a university
- **Query Parameter**: `reason` (e.g., "TESTING")

#### POST /api/university/excel/universities/upload
- **Purpose**: Upload universities via Excel
- **Request**: Multipart form data with file

#### POST /api/university/excel/courses/upload
- **Purpose**: Upload courses via Excel
- **Request**: Multipart form data with file

### 2. Additional University Endpoints

#### GET /api/v1/universities/{id}/courses
- **Purpose**: Get all courses for a specific university
- **Response**: Array of course objects

#### GET /api/v1/universities/cities
- **Purpose**: Get list of all cities with universities
- **Response**: Array of city names

#### GET /api/v1/universities/states
- **Purpose**: Get list of all states/regions
- **Response**: Array of state names

#### GET /api/v1/universities/featured
- **Purpose**: Get featured universities
- **Response**: Array of featured university objects

### 3. Courses APIs

#### GET /api/v1/courses
- **Purpose**: List all courses with optional filters
- **Query Parameters**:
  - `degree_type`: Filter by degree (bachelors/masters/phd)
  - `subject_area`: Filter by subject
  - `language`: Filter by language
  - `intake_season`: Filter by intake season
- **Response**: Array of course objects
```json
[
  {
    "id": "uuid",
    "university": "university_id",
    "name": "Course Name",
    "degree_type": "masters",
    "subject_area": "Computer Science",
    "language": "English",
    "duration_months": 24,
    "intake_season": "Winter",
    "tuition_fee": "20000",
    "min_gpa": 3.0,
    "min_ielts": 6.5,
    "description": "Course description"
  }
]
```

#### GET /api/v1/courses/{id}
- **Purpose**: Get single course by ID
- **Response**: Single course object

#### GET /api/v1/courses/subject_areas
- **Purpose**: Get list of all subject areas
- **Response**: Array of subject area names

#### GET /api/v1/courses/degree_types
- **Purpose**: Get list of all degree types
- **Response**: Array of degree types ["bachelors", "masters", "phd"]

## Important Notes

1. **Authentication**: Currently getting 401 errors. If authentication is required, please provide:
   - Authentication method (JWT, API Key, etc.)
   - How to obtain tokens/keys
   - Where to include auth headers

2. **CORS**: Ensure CORS is configured to allow requests from frontend origin

3. **Error Handling**: The frontend gracefully handles errors by showing empty states, but proper API implementation is needed for full functionality

4. **Response Format**: All endpoints should return JSON responses

## Testing the Integration

The frontend is already making these API calls. You can:
1. Open the browser developer console
2. Navigate to the Universities page
3. Check the Network tab to see the actual API calls being made
4. Review any 401/404 errors to see which endpoints need implementation

## Priority Implementation Order

1. **HIGH PRIORITY** (Basic functionality):
   - GET /api/v1/universities
   - GET /api/v1/universities/{id}
   - GET /api/v1/universities/{id}/courses

2. **MEDIUM PRIORITY** (Enhanced features):
   - POST /api/v1/universities/search
   - GET /api/v1/universities/filters
   - GET /api/v1/courses

3. **LOW PRIORITY** (Admin operations):
   - PUT /api/v1/universities/{id}
   - DELETE /api/v1/universities/{id}
   - POST /api/university/excel/universities/upload
   - POST /api/university/excel/courses/upload

## Contact
If any clarification is needed on the API structure or expected responses, please refer to the `src/services/api.ts` file which contains all the API integration code.