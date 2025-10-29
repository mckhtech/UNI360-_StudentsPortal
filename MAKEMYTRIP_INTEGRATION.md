# MakeMyTrip Flight Booking Integration Guide

## 🎯 Overview

This document describes the integration of MakeMyTrip's Travel Request API into the Student Portal, allowing students to book flights directly from the Resources section.

---

## ✅ Completed Setup

### 1. Authentication Fix
- ✅ Updated `src/services/auth.js` to use new backend API at `/api/v1/auth/login`
- ✅ Added `X-Client-ID: uniflow` header
- ✅ Changed payload from `{ email, password }` to `{ usernameOrEmail, password }`
- ✅ Updated response parsing for new backend structure
- ✅ Using AWS-hosted backend: `http://34.230.50.74:8080`

### 2. MakeMyTrip API Integration Files Created
- ✅ `src/types/travel.ts` - TypeScript types for all MakeMyTrip API interfaces
- ✅ `src/services/makemytrip.js` - Complete API service layer with:
  - `createTravelRequest()` - Create flight/hotel booking requests
  - `recallTravelRequest()` - Cancel/recall travel requests
  - `createFlightBookingRequest()` - High-level flight booking from form data
- ✅ Environment variables added to `.env` and `.env.local`

---

## 📋 Remaining Tasks

### 3. Flight Booking UI Component
**File to create**: `src/components/resources/FlightBookingForm.tsx`

This component should include:
- **Trip Type**: Radio buttons for One-way / Round-trip / Multi-city
- **Travel Class**: Dropdown for Economy / Premium Economy / Business
- **Origin & Destination**: Autocomplete fields with airport codes
- **Dates**: Date pickers for departure (and return if round-trip)
- **Passengers**: Counters for Adults, Children (with age inputs), Infants
- **Travel Reason**: Text field or dropdown
- **Approval Section**: Optional manager/approver details if approval required
- **Submit Button**: Creates travel request via `createFlightBookingRequest()`

### 4. Update Resources Page
**File to modify**: `src/pages/resources/Resources.tsx` (or similar)

Update the "Flight Booking Assistance" card to:
- Open a modal/dialog with the `FlightBookingForm` component
- OR navigate to a dedicated flight booking page
- Remove external link to MakeMyTrip website

### 5. Travel Request Dashboard
**File to create**: `src/pages/resources/TravelRequests.tsx`

This page should display:
- List of all travel requests made by the student
- Status of each request (Pending, Approved, Rejected, Recalled)
- Travel request details (TRF ID, service ID, dates, destination, etc.)
- Action buttons:
  - View details
  - Recall/Cancel request (calls `recallTravelRequest()`)
  - Book now (if approved, opens MakeMyTrip booking URL)

---

## 🔧 Configuration Required

### Environment Variables

You need to obtain these credentials from MakeMyTrip:

```env
# .env (production)
VITE_API_BASE_URL=http://34.230.50.74:8080  # AWS-hosted backend

# MakeMyTrip API Configuration
VITE_MMT_API_BASE_URL=https://api.makemytrip.com  # Actual URL from MMT
VITE_MMT_PARTNER_API_KEY=your_actual_api_key       # Provided by MMT
VITE_MMT_CLIENT_CODE=your_actual_client_code       # Provided by MMT
```

### IP Whitelisting

According to MakeMyTrip documentation:
- Your client's IP needs to be whitelisted at MakeMyTrip's end
- Contact MakeMyTrip support to whitelist your production and development IPs

---

## 🚀 Testing the Auth Fix

1. **Restart your dev server** (important!):
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

2. **Test login** with these credentials:
   - Email: `mukund.student1@uniflow.com`
   - Password: `SecurePassword123!`

3. **Check browser DevTools**:
   - **Network tab** should show:
     - POST to `http://34.230.50.74:8080/api/v1/auth/login`
     - Request headers include `X-Client-ID: uniflow`
     - Request payload: `{ "usernameOrEmail": "...", "password": "..." }`
   - **Application → Local Storage** should contain:
     - `uni360_access_token`
     - `uni360_refresh_token`
     - `uni360_user` with uuid field

---

## 📡 API Usage Examples

### Example 1: Create Flight Booking

```javascript
import { createFlightBookingRequest } from '../services/makemytrip.js';

const flightData = {
  tripType: 'ONEWAY',
  travelClass: 'ECONOMY',
  from: {
    airportCode: 'BLR',
    cityName: 'Bangalore',
    countryCode: 'IN',
    countryName: 'India'
  },
  to: {
    airportCode: 'DEL',
    cityName: 'New Delhi',
    countryCode: 'IN',
    countryName: 'India'
  },
  departureDate: new Date('2025-12-15'),
  adults: 1,
  children: 0,
  childrenAges: [],
  infants: 0,
  reasonForTravel: 'Student Conference',
  requiresApproval: false
};

const response = await createFlightBookingRequest(flightData);
console.log('Travel Request URL:', response.travelRequestUrl);
console.log('TRF ID:', response.trfId);
```

### Example 2: Recall/Cancel Booking

```javascript
import { recallTravelRequest } from '../services/makemytrip.js';

await recallTravelRequest('TRF-123456', 'SVC-789012');
```

---

## 🔍 MakeMyTrip API Endpoints

### Create Travel Request
```
POST /corporate/v1/create/partner/travel-request

Headers:
  - partner-apikey: <your_key>
  - client-code: <your_code>
  - Content-Type: application/json

Response:
{
  "travelRequestUrl": "https://...",
  "status": "success",
  "statusCode": 200,
  "responseCode": "600",
  "message": "Operation executed successfully."
}
```

### Recall Travel Request
```
POST /internal/corporate/v1/update/partner/travel-request

Headers:
  - partner-apikey: <your_key>
  - client-code: <your_code>
  - Content-Type: application/json

Body:
{
  "trfId": "<trf_number>",
  "action": "recalled",
  "serviceId": "<service_id>"
}
```

---

## 🎨 UI/UX Recommendations

### Flight Booking Form Design
1. **Multi-step wizard** (recommended):
   - Step 1: Trip type & destinations
   - Step 2: Dates & passengers
   - Step 3: Travel reason & approval
   - Step 4: Review & submit

2. **Single page form** (simpler):
   - All fields visible at once
   - Progressive disclosure for optional fields
   - Real-time validation

### Airport Search
- Use autocomplete with common airports
- Show airport code + city name
- Popular destinations at top
- Consider integrating an airport API for comprehensive search

### Date Selection
- Disable past dates
- Highlight holidays/weekends
- Show price calendar (if MMT provides pricing API)
- For round-trip, ensure return date > departure date

---

## 🐛 Troubleshooting

### Auth Issues
If you see "401 Unauthorized" errors:
1. Ensure dev server was restarted after auth changes
2. Check `.env` has correct `VITE_API_BASE_URL` (should be `http://34.230.50.74:8080`)
3. Verify AWS backend is accessible and running
4. Check browser console for detailed error messages
5. Test the backend endpoint directly with curl to verify it's working

### MakeMyTrip API Issues
If travel requests fail:
1. Verify `VITE_MMT_PARTNER_API_KEY` and `VITE_MMT_CLIENT_CODE` are set
2. Check if IP is whitelisted by MakeMyTrip
3. Verify `VITE_MMT_API_BASE_URL` is correct
4. Check browser console for detailed error logs
5. Test API credentials with curl/Postman first

---

## 📚 Next Steps

1. **Complete remaining UI components** (see tasks above)
2. **Obtain MakeMyTrip credentials** and update `.env` files
3. **Request IP whitelisting** from MakeMyTrip
4. **Test end-to-end flow**:
   - Login → Navigate to Resources → Open Flight Booking → Submit Request
5. **Add error handling and loading states** to UI
6. **Implement travel request history** page
7. **Add notifications** for booking status updates

---

## 📞 Support

### MakeMyTrip Integration
- Contact MakeMyTrip's myBiz team for:
  - API credentials (`partner-apikey`, `client-code`)
  - IP whitelisting
  - API documentation updates
  - Technical support

### Authentication Issues
- Check AWS backend logs at `http://34.230.50.74:8080`
- Verify user credentials in database
- Review `src/services/auth.js` for any console errors
- Test backend API directly with curl/Postman

---

## 📝 API Payload Reference

<details>
<summary>Complete Flight Booking Request Payload</summary>

```json
{
  "deviceDetails": {
    "version": "10.15.7",
    "platform": "DESKTOP"
  },
  "travellerDetails": {
    "paxDetails": [
      {
        "name": "Student Name",
        "email": "student@uniflow.com",
        "isPrimaryPax": true
      }
    ]
  },
  "services": {
    "FLIGHT": [
      {
        "serviceId": "SVC-123456",
        "tripType": "ONEWAY",
        "travelClass": "ECONOMY",
        "paxDetails": {
          "adult": 1,
          "child": {
            "count": 0,
            "age": []
          },
          "infant": 0
        },
        "journeyDetails": [
          {
            "from": {
              "airportCode": "BLR",
              "cityName": "Bangalore",
              "countryCode": "IN",
              "countryName": "India"
            },
            "to": {
              "airportCode": "DEL",
              "cityName": "New Delhi",
              "countryCode": "IN",
              "countryName": "India"
            },
            "departureDate": 1734220800000,
            "arrivalDate": 1734235200000
          }
        ]
      }
    ]
  },
  "reasonForTravel": {
    "reason": "Student Travel"
  },
  "approvalDetails": {
    "approvalRequired": false,
    "approverDetails": []
  },
  "trfId": "TRF-123456"
}
```

</details>

---

**Last Updated**: 2025-10-08  
**Status**: Backend auth integration complete, MakeMyTrip API service layer ready, UI components pending
