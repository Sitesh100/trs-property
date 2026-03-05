# API Migration Summary - Property Management

## Overview
Successfully migrated from old property API to new API with base URL `http://localhost:8000`.

## Changes Made

### 1. Base URL Configuration
**File:** `src/libs/based-url.js`
- Updated `newBasedUrl` to `http://localhost:8000`
- Old base URL marked as deprecated

### 2. Property API Endpoints
**File:** `src/service/propertyApi.js`
- **Removed old API endpoints:**
  - `getProperty`
  - `getCustomerProperty`
  - `getSingleProperty`
  - `addAndEditBothProperty`
  - `uploadPropertyImage`
  - `uploadPropertyDocument`
  - `deleteProperty`

- **Implemented new API endpoints:**
  - `POST /property-images/upload` - Upload multiple property images, returns image_ids
  - `POST /createproperty` - Create new property with all details including image_ids
  - `GET /properties` - List all properties with image_ids
  - `POST /property-images/download` - Download images for given image_ids
  - `GET /properties/{id}` - Get single property details (for compatibility)

### 3. Property Form Updates
**File:** `src/components/(property)/(post-property)/residential-form.jsx`

**Added new fields to match API requirements:**
- `builder_logo` - URL for builder's logo
- `floor_number` - Floor number of the property
- `total_floors` - Total floors in the building
- `property_age` - Age of property in years
- `facing` - Direction property faces (NORTH, SOUTH, EAST, WEST)
- `furnished_status` - Furnishing status (UNFURNISHED, SEMI_FURNISHED, FURNISHED)
- `parking_spaces` - Number of parking spaces
- `latitude` - Geographical latitude
- `longitude` - Geographical longitude
- `map_address` - Full map address
- `property_features` - Array of features (e.g., "Modular Kitchen", "Wooden Flooring")
- `facilities` - Array of facilities (e.g., "Swimming Pool", "Gym")

**Updated field values to match API enums:**
- `possession_status`: Changed from "ready-to-move"/"under_construction" to "READY_TO_MOVE"/"UNDER_CONSTRUCTION"
- `property_post_status`: Changed from "buy"/"rent"/"project" to "ACTIVE"/"INACTIVE"/"SOLD"
- Changed bedrooms, bathrooms, balconies from string select to number input

**New submission flow:**
1. Upload images first using `POST /property-images/upload`
2. Receive `image_ids` array from response
3. Create property using `POST /createproperty` with all data including `image_ids`

**Removed:**
- Document upload functionality (not supported in new API)
- Old edit mode functionality (to be implemented later if needed)

### 4. Image Handling Updates

**File:** `src/utils/getImageUrl.js`
- Added support for numeric image IDs
- Constructs URL as `http://localhost:8000/property-images/{id}` for numeric IDs
- Maintains backward compatibility with old string paths

**File:** `src/components/ui/detail-search-card.jsx`
- Updated to support both `image_ids` (new API) and `images` (old API)

**File:** `src/components/(property)/property-detail/property-detail-images.jsx`
- Updated to support both `image_ids` and `images` arrays

**File:** `src/components/ui/home-card.jsx`
- Updated to support both `image_ids` and `images` arrays

### 5. My Properties Component
**File:** `src/components/(property)/my-property/my-property-card.jsx`
- Updated to use `getAllProperties` endpoint
- Added note: API spec doesn't include separate "my properties" endpoint

## API Field Mapping

| Frontend Field | API Field | Type | Required |
|----------------|-----------|------|----------|
| title | title | string | Yes |
| property_type | property_type | string | Yes |
| city | city | string | Yes |
| project_name | project_name | string | Yes |
| possession_status | possession_status | enum | Yes |
| property_post_status | property_post_status | enum | Yes |
| expected_price | expected_price | decimal | Yes |
| booking_amount | booking_amount | decimal | No |
| is_price_negotiable | is_price_negotiable | boolean | No |
| carpet_area | carpet_area | decimal | Yes |
| super_area | super_area | decimal | No |
| bedrooms | bedrooms | integer | Yes |
| bathrooms | bathrooms | integer | Yes |
| balconies | balconies | integer | Yes |
| rera_id | rera_id | string | No |
| builder_name | builder_name | string | No |
| builder_logo | builder_logo | string (URL) | No |
| nearby_landmarks | nearby_landmarks | string | No |
| latitude | latitude | decimal | No |
| longitude | longitude | decimal | No |
| map_address | map_address | string | No |
| property_features | property_features | array | No |
| facilities | facilities | array | No |
| property_age | property_age | integer | No |
| floor_number | floor_number | integer | No |
| total_floors | total_floors | integer | No |
| facing | facing | enum | No |
| furnished_status | furnished_status | enum | No |
| parking_spaces | parking_spaces | integer | No |

## Important Notes

### ⚠️ Backend Requirements
1. **Image Serving Endpoint:** The code assumes a `GET /property-images/{id}` endpoint exists to serve individual images. If this doesn't exist, you need to implement it on the backend.

2. **My Properties Endpoint:** The API spec provided doesn't include a "my properties" endpoint. Currently, the my-property page shows all properties. You should either:
   - Add a backend endpoint like `GET /properties/user/my-properties`
   - Add a filter parameter to `GET /properties` like `?user_id=current_user`
   - Filter properties on the frontend based on user ownership

3. **Property Edit/Update:** The new API spec doesn't include an update endpoint. You'll need to add `PUT /properties/{id}` or similar if you want users to edit their properties.

4. **Property Delete:** No delete endpoint in the spec. Add `DELETE /properties/{id}` if needed.

### 🔄 Backward Compatibility
All components now support both old and new API response formats:
- Old API: `property.images` (array of strings)
- New API: `property.image_ids` (array of numbers)

### 🚀 Testing Checklist
- [ ] Test property creation with images
- [ ] Verify image upload returns proper image_ids
- [ ] Test property listing displays correctly
- [ ] Verify property images load properly
- [ ] Test property detail page
- [ ] Test all form validations
- [ ] Test property features and facilities addition
- [ ] Verify all new fields are properly saved
- [ ] Test error handling for failed image uploads
- [ ] Test error handling for failed property creation

### 📝 Frontend Validation
All fields have proper validation:
- Required fields marked with *
- Number fields validated for positive/minimum values
- URL fields (builder_logo) validated for proper URL format
- Latitude/Longitude validated for proper ranges

## Next Steps

1. **Start the backend server** at `http://localhost:8000`
2. **Test image upload endpoint** - Ensure it returns `image_ids` array
3. **Test property creation** - Verify all fields are saved properly
4. **Implement missing endpoints** (if needed):
   - GET `/property-images/{id}` - Serve individual images
   - GET `/properties/user/my-properties` - Get user's properties
   - PUT `/properties/{id}` - Update property
   - DELETE `/properties/{id}` - Delete property

5. **Update environment variables** if needed:
   - Set API URL in `.env.local` if different from localhost:8000

## Sample API Request/Response

### Upload Images
```bash
POST http://localhost:8000/property-images/upload
Content-Type: multipart/form-data

files: [image1.jpg, image2.jpg]
```
**Response:**
```json
{
  "message": "Images uploaded successfully",
  "image_ids": [1, 2],
  "count": 2
}
```

### Create Property
```bash
POST http://localhost:8000/createproperty
Content-Type: application/json

{
  "title": "Luxury 3 BHK Apartment",
  "property_type": "APARTMENT",
  "city": "Mumbai",
  "project_name": "Skyline Residency",
  "possession_status": "READY_TO_MOVE",
  "property_post_status": "ACTIVE",
  "expected_price": 18500000,
  "booking_amount": 500000,
  "is_price_negotiable": true,
  "carpet_area": 1250.50,
  "super_area": 1600.75,
  "bedrooms": 3,
  "bathrooms": 2,
  "balconies": 2,
  "rera_id": "RERA123456",
  "builder_name": "ABC Builders",
  "builder_logo": "https://example.com/logo.png",
  "nearby_landmarks": "Metro Station, School, Mall",
  "latitude": 19.119677,
  "longitude": 72.846351,
  "map_address": "Andheri East, Mumbai, Maharashtra",
  "property_features": [
    "Modular Kitchen",
    "Wooden Flooring",
    "False Ceiling"
  ],
  "facilities": [
    "Swimming Pool",
    "Gym",
    "24x7 Security"
  ],
  "property_age": 2,
  "floor_number": 12,
  "total_floors": 25,
  "facing": "EAST",
  "furnished_status": "SEMI_FURNISHED",
  "parking_spaces": 2,
  "image_ids": [1, 2]
}
```
**Response:**
```json
{
  "property_id": 9,
  "message": "Property created successfully"
}
```

## Files Modified
1. `/src/libs/based-url.js` - Base URL configuration
2. `/src/service/propertyApi.js` - API endpoints
3. `/src/components/(property)/(post-property)/residential-form.jsx` - Property form
4. `/src/utils/getImageUrl.js` - Image URL utility
5. `/src/components/ui/detail-search-card.jsx` - Property card display
6. `/src/components/(property)/property-detail/property-detail-images.jsx` - Property images
7. `/src/components/ui/home-card.jsx` - Home page property card
8. `/src/components/(property)/my-property/my-property-card.jsx` - My properties page

---

**Migration completed on:** February 27, 2026  
**Status:** ✅ Ready for testing
