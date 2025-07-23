# Automated Test Cases for CampusBuddy Marketplace

## Overview
I've created two comprehensive test suites for your marketplace functionality using Jest and React Testing Library. These tests cover the core functionality of posting listings and viewing listing details.

## Test Files Created

### 1. PostListing.test.jsx
**Location:** `src/components/marketplace/PostListing.test.jsx`

**Test Cases:**
1. **Component Rendering Test**
   - Verifies all form elements are rendered correctly
   - Checks for presence of title, description, image upload, and submit button
   - Validates listing type radio buttons (Sell Item vs Rent Place)

2. **Successful Item Listing Creation**
   - Tests complete form submission for an item listing
   - Validates API call with correct data structure
   - Checks success message display
   - Verifies navigation to marketplace page after successful submission

3. **Form Type Switching**
   - Tests switching between "Sell Item" and "Rent Place" modes
   - Verifies correct fields appear/disappear based on listing type
   - Ensures form resets when switching types

4. **Validation Error Handling**
   - Tests validation for missing required fields
   - Verifies item-specific validation (price, category, location)
   - Ensures error messages are displayed correctly

5. **API Error Handling**
   - Tests graceful handling of server errors
   - Verifies error messages are shown to user
   - Ensures navigation doesn't occur on error

6. **Premium User Features**
   - Tests priority listing toggle for premium users
   - Verifies priority flag is included in API call

7. **Image Upload Functionality**
   - Tests image file selection and preview
   - Validates file reader integration

### 2. ListingDetails.test.jsx
**Location:** `src/components/marketplace/ListingDetails.test.jsx`

**Test Cases:**
1. **Loading State**
   - Verifies loading spinner is shown while fetching data
   - Tests loading state UI components

2. **Item Listing Display**
   - Tests complete item listing information display
   - Verifies price, category, location, and description rendering
   - Checks priority listing badge display

3. **Accommodation Listing Display**
   - Tests accommodation-specific fields (rent, address, amenities)
   - Verifies amenities chips are rendered correctly
   - Ensures accommodation-specific data is displayed properly

4. **Owner vs Non-Owner Views**
   - Tests different UI for listing owners vs other users
   - Verifies "Contact Seller" button for non-owners
   - Checks "This is your listing" message for owners
   - Tests "View All My Listings" button for owners

5. **Error Handling**
   - Tests API error handling and error message display
   - Verifies "Listing not found" scenario
   - Ensures graceful degradation on errors

6. **Image Display**
   - Tests image rendering when available
   - Verifies "No Image Available" placeholder when image is missing

7. **Navigation Functionality**
   - Tests back button navigation
   - Verifies correct API calls with listing ID

8. **Listing Stats and Metadata**
   - Tests display of creation/update dates
   - Verifies active/inactive status display
   - Checks listing type information

## Key Features Tested

### Form Validation
- ✅ Required field validation
- ✅ Type-specific field requirements
- ✅ User-friendly error messages

### API Integration
- ✅ Correct API endpoint calls
- ✅ Proper data structure formatting
- ✅ Error handling and user feedback

### User Experience
- ✅ Loading states and feedback
- ✅ Success/error message display
- ✅ Navigation flow
- ✅ Responsive design considerations

### Business Logic
- ✅ Premium user features (priority listings)
- ✅ Owner vs visitor permissions
- ✅ Listing type differences (item vs accommodation)

## Running the Tests

To run these tests, use the following commands:

```bash
# Run all tests
npm test

# Run specific test file
npm test PostListing.test.jsx
npm test ListingDetails.test.jsx

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm test -- --coverage
```

## Test Dependencies

The tests use the following libraries:
- **Jest**: Testing framework
- **@testing-library/react**: React component testing utilities  
- **@testing-library/jest-dom**: Custom Jest matchers
- **React Router**: Mocked for navigation testing

## Mock Setup

The tests include comprehensive mocking for:
- API calls (`marketplaceAPI`)
- React Router (`useNavigate`, `useParams`)
- Authentication context (`AuthContext`)
- File operations (`FileReader`)
- Canvas operations (for image compression)

## Benefits

These automated tests provide:
1. **Regression Prevention**: Catch bugs before deployment
2. **Documentation**: Living documentation of expected behavior
3. **Confidence**: Safe refactoring and feature additions
4. **Quality Assurance**: Consistent user experience validation

## Future Enhancements

Consider adding tests for:
- Integration tests with real API endpoints
- E2E tests with Cypress or Playwright
- Performance testing for image upload/compression
- Accessibility testing with jest-axe
- Visual regression testing with Percy or Chromatic

These test cases provide comprehensive coverage of your marketplace functionality and will help ensure reliability as your application grows.
