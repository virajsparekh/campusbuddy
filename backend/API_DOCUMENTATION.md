# CampusBuddy API Documentation

## Overview
This document provides comprehensive documentation for all APIs in the CampusBuddy platform. The platform includes multiple modules: Authentication, Study Hub, Community Q&A, Marketplace, Events, and Admin management.

## Base URLs
```
Authentication: http://localhost:5001/api/auth
Study Hub: http://localhost:5001/api/studyhub
Community Q&A: http://localhost:5001/api/qa
Marketplace: http://localhost:5001/api/marketplace
Events: http://localhost:5001/api/events
Admin: http://localhost:5001/api/admin
```

## Authentication
Most endpoints require authentication using the `x-auth-token` header:
```
x-auth-token: <your_jwt_token>
```

---

# 🔐 Authentication API

## Base URL
```
http://localhost:5001/api/auth
```

### 1. User Registration
**POST** `/register`

**Request Body:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securepassword123",
  "studentId": "S12345",
  "college": {
    "name": "University of Toronto",
    "province": "Ontario",
    "type": "University"
  }
}
```

**Response (201):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "isPremium": false
  }
}
```

### 2. User Login
**POST** `/login`

**Request Body:**
```json
{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "isPremium": false
  }
}
```

### 3. Get Current User
**GET** `/me`

**Headers:**
```
x-auth-token: <token>
```

**Response (200):**
```json
{
  "user": {
    "_id": "user_id",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "student",
    "isPremium": false
  }
}
```

---

# 📚 Study Hub API

## Base URL
```
http://localhost:5001/api/studyhub
```

## Materials Management

### 1. Get All Materials
**GET** `/materials`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `search` (optional): Search in title and subject
- `subject` (optional): Filter by subject
- `semester` (optional): Filter by semester
- `tags` (optional): Filter by tags (comma-separated)
- `sortBy` (optional): Sort field (default: 'uploadDate')
- `sortOrder` (optional): Sort order - 'asc' or 'desc' (default: 'desc')

**Response:**
```json
{
  "materials": [
    {
      "_id": "material_id",
      "materialId": "M005",
      "title": "Calculus Notes Chapter 1",
      "subject": "Mathematics",
      "semester": "Fall 2024",
      "fileURL": "https://example.com/file.pdf",
      "tags": ["calculus", "notes"],
      "uploadDate": "2025-01-25T10:30:00.000Z",
      "votes": 4,
      "uploadedBy": {
        "userId": "U013",
        "name": "Robert Walters",
        "email": "robert@example.com"
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 3,
    "totalMaterials": 25,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### 2. Upload Material
**POST** `/materials`

**Request:** Multipart form data
- `file`: File to upload (required)
- `title`: Material title (required)
- `subject`: Subject (required)
- `semester`: Semester (required)
- `tags`: Comma-separated tags (optional)

**Supported File Types:**
- Documents: PDF, DOC, DOCX, XLS, XLSX, PPT, PPTX, TXT
- Images: JPEG, PNG, GIF
- Videos: MP4, AVI
- Audio: MP3, WAV

**File Size Limit:** 10MB

**Response:**
```json
{
  "msg": "Material uploaded successfully",
  "material": {
    "_id": "new-material-id",
    "materialId": "M1234567890",
    "title": "Calculus Notes",
    "subject": "Mathematics",
    "semester": "Fall 2024",
    "fileURL": "/uploads/materials/material-1234567890.pdf",
    "tags": ["calculus", "notes"],
    "uploadDate": "2025-01-25T10:30:00.000Z",
    "votes": 0,
    "uploadedBy": {
      "userId": "U001",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### 3. Get User's Uploads
**GET** `/materials/my-uploads`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

**Response:** Same format as "Get All Materials"

### 4. Vote on Material
**POST** `/materials/:id/vote`

**Request Body:**
```json
{
  "voteType": "up"  // or "down"
}
```

**Response:**
```json
{
  "message": "Vote recorded",
  "votes": 5
}
```

### 5. Update Material
**PUT** `/materials/:id`

**Request Body:**
```json
{
  "title": "Updated material title",
  "subject": "Updated subject",
  "semester": "Spring 2025",
  "tags": "updated,tags"
}
```

### 6. Delete Material
**DELETE** `/materials/:id`

**Response:**
```json
{
  "msg": "Material deleted successfully"
}
```

---

# 💬 Community Q&A API

## Base URL
```
http://localhost:5001/api/qa
```

## Questions Management

### 1. Create a Question
**POST** `/questions`

**Request Body:**
```json
{
  "title": "How do I prepare for final exams effectively?",
  "description": "I struggle with time management and want to know the best strategies for revision.",
  "tags": ["study", "exam", "time-management"]
}
```

**Response (201):**
```json
{
  "message": "Question created successfully",
  "question": {
    "_id": "question_id",
    "questionId": "Q1234",
    "title": "How do I prepare for final exams effectively?",
    "description": "I struggle with time management...",
    "tags": ["study", "exam", "time-management"],
    "createdAt": "2025-01-05T10:30:00.000Z",
    "askedBy": {
      "userId": "U9643",
      "name": "Viraj Parekh",
      "email": "viraj@example.com"
    },
    "views": 0,
    "votes": 0,
    "answers": 0,
    "status": "Open"
  }
}
```

### 2. Get All Questions
**GET** `/questions`

**Query Parameters:**
- `page` (number, default: 1): Page number for pagination
- `limit` (number, default: 10): Number of questions per page
- `search` (string): Search in title and description
- `tags` (string): Comma-separated list of tags to filter by
- `status` (string): Filter by status ("Open", "Answered", "Closed")
- `sort` (string): Sort order
  - `newest` (default): Sort by creation date (newest first)
  - `oldest`: Sort by creation date (oldest first)
  - `most_answers`: Sort by number of answers (descending)
  - `most_views`: Sort by number of views (descending)
  - `most_votes`: Sort by number of votes (descending)
  - `unanswered`: Show only questions with no answers

**Response:**
```json
{
  "questions": [
    {
      "_id": "question_id",
      "questionId": "Q1234",
      "title": "How do I prepare for final exams effectively?",
      "description": "I struggle with time management...",
      "tags": ["study", "exam"],
      "createdAt": "2025-01-05T10:30:00.000Z",
      "askedBy": {
        "userId": "U9643",
        "name": "Viraj Parekh",
        "email": "viraj@example.com"
      },
      "views": 45,
      "votes": 3,
      "answers": 2,
      "status": "Answered"
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10
  }
}
```

### 3. Get Single Question
**GET** `/questions/:id`

Retrieves a specific question by ID and increments the view count.

**Response:**
```json
{
  "question": {
    "_id": "question_id",
    "questionId": "Q1234",
    "title": "How do I prepare for final exams effectively?",
    "description": "I struggle with time management...",
    "tags": ["study", "exam"],
    "createdAt": "2025-01-05T10:30:00.000Z",
    "askedBy": {
      "userId": "U9643",
      "name": "Viraj Parekh",
      "email": "viraj@example.com"
    },
    "views": 46,
    "votes": 3,
    "answers": 2,
    "status": "Answered",
    "userVotes": [
      {
        "userId": "U9643",
        "voteType": "up"
      }
    ]
  }
}
```

### 4. Get User's Questions
**GET** `/my-questions`

**Query Parameters:**
- `page` (number, default: 1): Page number
- `limit` (number, default: 10): Items per page

### 5. Vote on Question
**POST** `/questions/:id/vote`

**Request Body:**
```json
{
  "voteType": "up"  // or "down"
}
```

**Response:**
```json
{
  "message": "Vote recorded",
  "votes": 4
}
```

## Answers Management

### 1. Create Answer
**POST** `/questions/:id/answers`

**Request Body:**
```json
{
  "answerText": "Here's my detailed answer to your question..."
}
```

**Response (201):**
```json
{
  "message": "Answer posted successfully",
  "answer": {
    "_id": "answer_id",
    "answerId": "A5678",
    "questionId": "Q1234",
    "answerText": "Here's my detailed answer...",
    "votes": 0,
    "createdAt": "2025-01-05T11:00:00.000Z",
    "answeredBy": {
      "userId": "U9644",
      "name": "Jane Doe",
      "email": "jane@example.com"
    },
    "isAccepted": false
  }
}
```

### 2. Get Answers for Question
**GET** `/questions/:id/answers`

**Response:**
```json
{
  "answers": [
    {
      "_id": "answer_id",
      "answerId": "A5678",
      "questionId": "Q1234",
      "answerText": "Here's my detailed answer...",
      "votes": 5,
      "createdAt": "2025-01-05T11:00:00.000Z",
      "answeredBy": {
        "userId": "U9644",
        "name": "Jane Doe",
        "email": "jane@example.com"
      },
      "isAccepted": true,
      "userVotes": [
        {
          "userId": "U9643",
          "voteType": "up"
        }
      ]
    }
  ]
}
```

### 3. Get User's Answers
**GET** `/my-answers`

**Query Parameters:**
- `page` (number, default: 1): Page number
- `limit` (number, default: 10): Items per page

### 4. Vote on Answer
**POST** `/answers/:id/vote`

**Request Body:**
```json
{
  "voteType": "up"  // or "down"
}
```

### 5. Accept Answer
**POST** `/answers/:id/accept`

Marks an answer as accepted (only by the question author).

**Response:**
```json
{
  "message": "Answer accepted successfully",
  "answer": { ... }
}
```

---

# 🛒 Marketplace API

## Base URL
```
http://localhost:5001/api/marketplace
```

## Listings Management

### 1. Get All Listings
**GET** `/listings`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 12)
- `search` (optional): Search in title and description
- `category` (optional): Filter by category
- `minPrice` (optional): Minimum price filter
- `maxPrice` (optional): Maximum price filter

**Response:**
```json
{
  "listings": [
    {
      "_id": "listing_id",
      "title": "Calculus Textbook",
      "description": "Used calculus textbook in good condition",
      "price": 25,
      "priceUnit": "CAD",
      "category": "Books",
      "condition": "Good",
      "location": "Toronto, ON",
      "contactInfo": "john@example.com",
      "imageUrl": "https://example.com/image.jpg",
      "createdAt": "2025-01-25T10:30:00.000Z",
      "createdBy": {
        "userId": "U001",
        "name": "John Doe",
        "email": "john@example.com"
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 12
  }
}
```

### 2. Get Single Listing
**GET** `/listings/:id`

**Response:**
```json
{
  "listing": {
    "_id": "listing_id",
    "title": "Calculus Textbook",
    "description": "Used calculus textbook in good condition",
    "price": 25,
    "priceUnit": "CAD",
    "category": "Books",
    "condition": "Good",
    "location": "Toronto, ON",
    "contactInfo": "john@example.com",
    "imageUrl": "https://example.com/image.jpg",
    "createdAt": "2025-01-25T10:30:00.000Z",
    "createdBy": {
      "userId": "U001",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### 3. Create Listing
**POST** `/listings`

**Request Body:**
```json
{
  "title": "Calculus Textbook",
  "description": "Used calculus textbook in good condition",
  "price": 25,
  "priceUnit": "CAD",
  "category": "Books",
  "condition": "Good",
  "location": "Toronto, ON",
  "contactInfo": "john@example.com",
  "imageUrl": "https://example.com/image.jpg"
}
```

**Response:**
```json
{
  "message": "Listing created successfully",
  "listing": {
    "_id": "new_listing_id",
    "title": "Calculus Textbook",
    "description": "Used calculus textbook in good condition",
    "price": 25,
    "priceUnit": "CAD",
    "category": "Books",
    "condition": "Good",
    "location": "Toronto, ON",
    "contactInfo": "john@example.com",
    "imageUrl": "https://example.com/image.jpg",
    "createdAt": "2025-01-25T10:30:00.000Z",
    "createdBy": {
      "userId": "U001",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
}
```

### 4. Get User's Listings
**GET** `/my-listings`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)

### 5. Update Listing
**PUT** `/listings/:id`

**Request Body:** Same as Create Listing

### 6. Delete Listing
**DELETE** `/listings/:id`

**Response:**
```json
{
  "message": "Listing deleted successfully"
}
```

## Accommodations Management

### 1. Create Accommodation
**POST** `/accommodations`

**Request Body:**
```json
{
  "title": "Student Apartment for Rent",
  "description": "2-bedroom apartment near campus",
  "rent": 1200,
  "rentUnit": "CAD",
  "location": "Toronto, ON",
  "contactInfo": "landlord@example.com",
  "imageUrl": "https://example.com/apartment.jpg"
}
```

### 2. Get All Accommodations
**GET** `/accommodations`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 12)
- `search` (optional): Search in title and description
- `minRent` (optional): Minimum rent filter
- `maxRent` (optional): Maximum rent filter

---

# 🎉 Events API

## Base URL
```
http://localhost:5001/api/events
```

### 1. Get All Events
**GET** `/api/events`

**Query Parameters:**
- `category` (optional): Filter by event category
- `search` (optional): Search in title, description, or location
- `page` (optional): Page number for pagination (default: 1)
- `limit` (optional): Number of events per page (default: 12)
- `premiumOnly` (optional): Filter premium-only events (true/false)

**Response:**
```json
{
  "events": [
    {
      "_id": "event_id",
      "eventId": "E002",
      "title": "History Seminar",
      "description": "Benefit major friend through.",
      "date": "2025-05-01T01:01:57.945Z",
      "location": "979 Davis Manor, Lake Rebeccaberg, UT 35328",
      "isPremiumOnly": false,
      "createdAt": "2025-03-14T01:01:57.945Z",
      "createdBy": {
        "userId": "U099",
        "name": "Thomas Marsh",
        "email": "thomas@example.com"
      },
      "imageUrl": ""
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 12
  }
}
```

### 2. Get Single Event
**GET** `/api/events/:id`

**Response:**
```json
{
  "event": {
    "_id": "event_id",
    "eventId": "E002",
    "title": "History Seminar",
    "description": "Benefit major friend through.",
    "date": "2025-05-01T01:01:57.945Z",
    "location": "979 Davis Manor, Lake Rebeccaberg, UT 35328",
    "isPremiumOnly": false,
    "createdAt": "2025-03-14T01:01:57.945Z",
    "createdBy": {
      "userId": "U099",
      "name": "Thomas Marsh",
      "email": "thomas@example.com"
    },
    "imageUrl": ""
  }
}
```

### 3. Create Event
**POST** `/api/events`

**Request Body:**
```json
{
  "title": "Event Title",
  "description": "Event Description",
  "date": "2025-05-01T01:01:57.945Z",
  "location": "Event Location",
  "isPremiumOnly": false,
  "imageUrl": "https://example.com/image.jpg"
}
```

### 4. Update Event
**PUT** `/api/events/:id`

**Request Body:** Same as Create Event

### 5. Delete Event
**DELETE** `/api/events/:id`

**Response:**
```json
{
  "message": "Event deleted successfully"
}
```

---

# 👨‍💼 Admin API

## Base URL
```
http://localhost:5001/api/admin
```

## Dashboard Statistics

### 1. Get Dashboard Stats
**GET** `/dashboard`

**Response:**
```json
{
  "stats": {
    "totalUsers": 1245,
    "premiumUsers": 210,
    "blockedUsers": 15,
    "totalEvents": 32,
    "premiumEvents": 8,
    "activeUsers": 1230
  },
  "recentUsers": [
    {
      "_id": "user_id",
      "name": "Mrs. Elizabeth Carter MD",
      "email": "elizabeth@example.com",
      "role": "student",
      "isPremium": false,
      "isBlocked": true,
      "createdAt": "2025-01-25T01:01:57.913687"
    }
  ],
  "recentEvents": [
    {
      "_id": "event_id",
      "title": "Road Seminar",
      "date": "2025-03-27T01:01:57.948166",
      "location": "810 Ralph Via, Georgefurt, TN 42292",
      "isPremiumOnly": false,
      "createdAt": "2025-04-26T01:01:57.948393"
    }
  ]
}
```

## User Management

### 1. Get All Users
**GET** `/users`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of users per page (default: 10)
- `search` (optional): Search in name, email, or studentId
- `role` (optional): Filter by role (student, admin)
- `isPremium` (optional): Filter by premium status (true/false)
- `isBlocked` (optional): Filter by blocked status (true/false)
- `college` (optional): Filter by college name

**Response:**
```json
{
  "users": [
    {
      "_id": "user_id",
      "userId": "U007",
      "studentId": "S1007",
      "name": "Mrs. Elizabeth Carter MD",
      "email": "elizabeth@example.com",
      "role": "student",
      "isPremium": false,
      "premiumExpiry": null,
      "isBlocked": true,
      "createdAt": "2025-01-25T01:01:57.913687",
      "college": {
        "name": "Seneca College",
        "province": "Ontario",
        "type": "College",
        "_id": "college_id"
      }
    }
  ],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalUsers": 50,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

### 2. Get User by ID
**GET** `/users/:id`

### 3. Update User
**PUT** `/users/:id`

**Request Body:**
```json
{
  "name": "Updated Name",
  "role": "admin",
  "isPremium": true,
  "premiumExpiry": "2025-12-31T23:59:59.999Z",
  "isBlocked": false
}
```

### 4. Block User
**PATCH** `/users/:id/block`

### 5. Unblock User
**PATCH** `/users/:id/unblock`

### 6. Delete User
**DELETE** `/users/:id`

## Event Management

### 1. Get All Events (Admin)
**GET** `/events`

**Query Parameters:**
- `page` (optional): Page number (default: 1)
- `limit` (optional): Number of events per page (default: 10)
- `search` (optional): Search in title, description, or location
- `isPremiumOnly` (optional): Filter by premium status (true/false)
- `dateFrom` (optional): Filter events from this date
- `dateTo` (optional): Filter events until this date

### 2. Create Event (Admin)
**POST** `/events`

**Request Body:**
```json
{
  "title": "New Workshop",
  "description": "This is a new workshop description",
  "date": "2025-02-15",
  "time": "14:00",
  "location": "Room 101, Building A",
  "category": "Workshop",
  "isPremiumOnly": false
}
```

### 3. Update Event (Admin)
**PUT** `/events/:id`

### 4. Delete Event (Admin)
**DELETE** `/events/:id`

---

# 🚨 Error Responses

All APIs return error responses in the following format:

## 400 Bad Request
```json
{
  "message": "Validation error message"
}
```

## 401 Unauthorized
```json
{
  "message": "Token is not valid"
}
```

## 403 Forbidden
```json
{
  "message": "Not authorized to perform this action"
}
```

## 404 Not Found
```json
{
  "message": "Resource not found"
}
```

## 500 Internal Server Error
```json
{
  "message": "Server error"
}
```

---

# 📊 Data Models

## User Model
```javascript
{
  _id: ObjectId,
  userId: String,
  studentId: String,
  name: String,
  email: String,
  password: String (hashed),
  role: String, // "student" or "admin"
  isPremium: Boolean,
  premiumExpiry: Date,
  isBlocked: Boolean,
  createdAt: Date,
  college: {
    name: String,
    province: String,
    type: String,
    _id: ObjectId
  }
}
```

## Question Model
```javascript
{
  _id: ObjectId,
  questionId: String,
  title: String,
  description: String,
  tags: [String],
  createdAt: Date,
  askedBy: {
    userId: String,
    name: String,
    email: String
  },
  views: Number,
  votes: Number,
  answers: Number,
  status: String, // "Open", "Answered", "Closed"
  userVotes: [{
    userId: String,
    voteType: String // "up" or "down"
  }]
}
```

## Answer Model
```javascript
{
  _id: ObjectId,
  answerId: String,
  questionId: String,
  answerText: String,
  votes: Number,
  createdAt: Date,
  answeredBy: {
    userId: String,
    name: String,
    email: String
  },
  isAccepted: Boolean,
  userVotes: [{
    userId: String,
    voteType: String // "up" or "down"
  }]
}
```

## Material Model
```javascript
{
  _id: ObjectId,
  materialId: String,
  title: String,
  subject: String,
  semester: String,
  fileURL: String,
  tags: [String],
  uploadDate: Date,
  votes: Number,
  uploadedBy: {
    userId: String,
    name: String,
    email: String
  }
}
```

## Listing Model
```javascript
{
  _id: ObjectId,
  title: String,
  description: String,
  price: Number,
  priceUnit: String,
  category: String,
  condition: String,
  location: String,
  contactInfo: String,
  imageUrl: String,
  createdAt: Date,
  createdBy: {
    userId: String,
    name: String,
    email: String
  }
}
```

## Event Model
```javascript
{
  _id: ObjectId,
  eventId: String,
  title: String,
  description: String,
  date: Date,
  location: String,
  isPremiumOnly: Boolean,
  createdAt: Date,
  createdBy: {
    userId: String,
    name: String,
    email: String
  },
  imageUrl: String
}
```

---

# 🔐 Authorization Rules

## General Rules
- **Authentication Required**: Most endpoints require a valid JWT token
- **Role-Based Access**: Admin endpoints require admin role
- **Ownership**: Users can only modify their own content
- **Premium Features**: Some features require premium subscription

## Specific Rules

### Questions & Answers
- **Create**: Any authenticated, non-blocked user
- **Read**: Any authenticated, non-blocked user
- **Update**: Only the author
- **Delete**: Only the author

### Materials
- **Create**: Any authenticated, non-blocked user
- **Read**: Any authenticated, non-blocked user
- **Update**: Only the author
- **Delete**: Only the author (also deletes the file)

### Marketplace Listings
- **Create**: Any authenticated, non-blocked user
- **Read**: Any authenticated, non-blocked user
- **Update**: Only the author
- **Delete**: Only the author

### Events
- **Create**: Admin users only
- **Read**: Any authenticated, non-blocked user
- **Update**: Admin users only
- **Delete**: Admin users only

### Voting
- **Vote**: Any authenticated, non-blocked user (one vote per item)

---

# 📝 Example Usage

## Creating a Question with Answers
```bash
# 1. Create a question
curl -X POST http://localhost:5001/api/qa/questions \
  -H "Content-Type: application/json" \
  -H "x-auth-token: YOUR_TOKEN" \
  -d '{
    "title": "How to solve this calculus problem?",
    "description": "I need help with this integration problem...",
    "tags": ["calculus", "integration", "math"]
  }'

# 2. Add an answer
curl -X POST http://localhost:5001/api/qa/questions/Q1234567890/answers \
  -H "Content-Type: application/json" \
  -H "x-auth-token: YOUR_TOKEN" \
  -d '{
    "answerText": "Here\'s the step-by-step solution..."
  }'

# 3. Vote for the answer
curl -X POST http://localhost:5001/api/qa/answers/ANSWER_ID/vote \
  -H "Content-Type: application/json" \
  -H "x-auth-token: YOUR_TOKEN" \
  -d '{
    "voteType": "up"
  }'
```

## Uploading Study Materials
```bash
# Upload a PDF file
curl -X POST http://localhost:5001/api/studyhub/materials \
  -H "x-auth-token: YOUR_TOKEN" \
  -F "file=@/path/to/your/file.pdf" \
  -F "title=Calculus Notes Chapter 1" \
  -F "subject=Mathematics" \
  -F "semester=Fall 2024" \
  -F "tags=calculus,notes,chapter1"
```

## Creating a Marketplace Listing
```bash
curl -X POST http://localhost:5001/api/marketplace/listings \
  -H "Content-Type: application/json" \
  -H "x-auth-token: YOUR_TOKEN" \
  -d '{
    "title": "Calculus Textbook",
    "description": "Used calculus textbook in good condition",
    "price": 25,
    "priceUnit": "CAD",
    "category": "Books",
    "condition": "Good",
    "location": "Toronto, ON",
    "contactInfo": "john@example.com"
  }'
```

---

# 🧪 Testing

## Prerequisites
1. Backend server running on port 5001
2. MongoDB database connected
3. Valid JWT token for authentication

## Test Scripts
The project includes test scripts for each API module:
- `test-admin-apis.js` - Admin API testing
- `test-qa-api.js` - Q&A API testing
- `test-marketplace-api.js` - Marketplace API testing

## Running Tests
```bash
cd backend
node test-admin-apis.js
```

---

# 📚 Collection Names

- **Users**: `users`
- **Questions**: `questions`
- **Answers**: `answers`
- **Materials**: `materials`
- **Marketplace Listings**: `marketplace`
- **Accommodations**: `accommodations`
- **Events**: `events`

---

# 🔄 API Versioning

Current API Version: **v1**

All endpoints are currently under version 1. Future versions will be prefixed with `/v2`, `/v3`, etc.

---

# 📞 Support

For API support and questions:
- Check the error responses for specific issues
- Ensure all required headers are included
- Verify authentication tokens are valid
- Check request body formats match the examples

---

*Last Updated: January 2025*
*CampusBuddy API Documentation v1.0* 