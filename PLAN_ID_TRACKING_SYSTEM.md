# Plan ID Tracking System Documentation

## Overview
A complete system to track user plan IDs, allowing admins to update plans and automatically sync changes to all users who have purchased those plans.

## Database Schema Updates

### New Model: `UserPlan`
Tracks the relationship between users and plans with plan IDs:

```prisma
model UserPlan {
  id          String   @id @default(cuid())
  userId      String
  planId      String
  amount      Float          // Amount user invested in this plan
  roi         Float          // ROI percentage at time of purchase
  duration    String         // Plan duration
  status      PlanStatus @default(ACTIVE)  // ACTIVE, COMPLETED, CANCELLED
  startDate   DateTime @default(now())
  endDate     DateTime?
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  user        User     @relation("UserPlans", fields: [userId], references: [id], onDelete: Cascade)
  plan        Plan     @relation("UserPlans", fields: [planId], references: [id], onDelete: Cascade)
  
  @@unique([userId, planId])
  @@index([userId])
  @@index([planId])
}
```

### Updated Models
- **User**: Now includes `userPlans` relationship
- **Plan**: Now includes `userPlans` relationship

### Plan Status Enum
```prisma
enum PlanStatus {
  ACTIVE      // Plan is currently active
  COMPLETED   // Plan has completed
  CANCELLED   // Plan was cancelled
}
```

## API Endpoints

### 1. User Endpoints

#### GET `/api/user/active-plans`
Fetch all active plans for the current user with plan IDs.

**Response:**
```json
{
  "userPlans": [
    {
      "id": "user-plan-id",
      "planId": "plan-id",
      "userId": "user-id",
      "planName": "Premium Plan",
      "amount": 1000,
      "roi": 2.5,
      "duration": "24 Hours",
      "status": "ACTIVE",
      "startDate": "2026-02-26T00:00:00Z",
      "endDate": null,
      "createdAt": "2026-02-26T00:00:00Z",
      "updatedAt": "2026-02-26T00:00:00Z",
      "plan": { /* full plan object */ }
    }
  ],
  "legacyPlans": [],  // Backward compatible old deposits
  "total": 1
}
```

#### POST `/api/plans/purchase` (Enhanced)
User purchases a plan - now creates UserPlan record with plan ID.

**Request:**
```json
{
  "planName": "Premium Plan",
  "amount": 1000
}
```

**Response:**
```json
{
  "success": true,
  "message": "Plan activated successfully",
  "planId": "plan-id",
  "userPlanId": "user-plan-id"
}
```

### 2. Admin Endpoints

#### GET `/api/admin/user-plans`
List all user plans with plan IDs (admin only).

**Query Parameters:**
- `userId`: Filter by specific user
- `planId`: Filter by specific plan
- `status`: Filter by status (ACTIVE, COMPLETED, CANCELLED)

**Response:**
```json
{
  "total": 15,
  "data": [
    {
      "id": "user-plan-id",
      "userId": "user-id",
      "planId": "plan-id",
      "amount": 1000,
      "roi": 2.5,
      "duration": "24 Hours",
      "status": "ACTIVE",
      "startDate": "2026-02-26T00:00:00Z",
      "user": {
        "id": "user-id",
        "email": "user@example.com",
        "name": "John Doe",
        "balance": 5000
      },
      "plan": { /* full plan object */ }
    }
  ]
}
```

#### POST `/api/admin/user-plans`
Get all plans for a specific user (admin only).

**Request:**
```json
{
  "userId": "user-id"
}
```

**Response:**
```json
{
  "user": {
    "id": "user-id",
    "email": "user@example.com",
    "name": "John Doe",
    "balance": 5000,
    "createdAt": "2026-01-15T00:00:00Z",
    "role": "USER"
  },
  "plans": [ /* array of UserPlan objects */ ],
  "totalPlans": 5
}
```

#### GET `/api/admin/user-plans/[id]`
Get details of a specific user plan (admin only).

**Response:**
```json
{
  "id": "user-plan-id",
  "userId": "user-id",
  "planId": "plan-id",
  "amount": 1000,
  "roi": 2.5,
  "duration": "24 Hours",
  "status": "ACTIVE",
  "startDate": "2026-02-26T00:00:00Z",
  "user": { /* user details */ },
  "plan": { /* plan details */ }
}
```

#### PUT `/api/admin/user-plans/[id]`
Update a specific user plan (admin only).

**Request:**
```json
{
  "status": "COMPLETED",
  "roi": 3.0,
  "duration": "30 Days",
  "endDate": "2026-02-27T00:00:00Z"
}
```

**Response:**
```json
{
  "success": true,
  "userPlan": { /* updated UserPlan object */ },
  "message": "User plan updated successfully"
}
```

#### DELETE `/api/admin/user-plans/[id]`
Cancel/delete a specific user plan (admin only).

**Response:**
```json
{
  "success": true,
  "message": "User plan cancelled for user@example.com",
  "deletedUserPlan": { /* deleted UserPlan object */ }
}
```

#### PUT `/api/admin/plans/[id]` (Enhanced)
Update a plan - automatically updates all user plans with this plan ID.

**Request:**
```json
{
  "name": "Updated Plan",
  "minAmount": 500,
  "maxAmount": 5000,
  "roi": 3.5,
  "duration": "30 Days",
  "popular": true,
  "active": true
}
```

**Response:**
```json
{
  "success": true,
  "plan": { /* updated plan object */ },
  "affectedUserPlans": 12,
  "message": "Plan updated and 12 user plans affected"
}
```

#### DELETE `/api/admin/plans/[id]` (Enhanced)
Delete a plan - removes plan from all user plans.

**Response:**
```json
{
  "success": true,
  "message": "Plan deleted. Removed from 8 users' plans."
}
```

## Features Implemented

### ✅ Plan ID Tracking
- Each user's purchased plan now has a unique plan ID reference
- `UserPlan` model stores the relationship with plan details at time of purchase
- Plan history is maintained even if plan is updated

### ✅ Admin Plan Updates
- When admin updates a plan's ROI or duration, all active user plans are synchronized
- Admin can see how many user plans are affected by each plan update
- Full audit trail via logging

### ✅ User Plan Management
- Users can view all their active plans with plan IDs
- Plans include plan details, ROI, duration, and status
- Backward compatible with legacy deposit-based plans

### ✅ Admin User Plan Management
- View all user plans across the system
- Filter by user, plan, or status
- Update individual user plans (status, ROI, duration, endDate)
- Cancel plans with full audit trail
- Get detailed user plan information

### ✅ Cascade Operations
- Deleting a plan automatically removes it from all user plans
- Deleting a user automatically removes all their plans
- Maintains referential integrity

## Usage Examples

### User Purchases a Plan
```
POST /api/plans/purchase
{
  "planName": "Premium Plan",
  "amount": 1000
}

Response:
{
  "success": true,
  "planId": "cln123abc",
  "userPlanId": "cln456def"
}
```

### Admin Updates Plan ROI
```
PUT /api/admin/plans/cln123abc
{
  "roi": 3.0,
  "duration": "30 Days"
}

Response:
{
  "success": true,
  "affectedUserPlans": 25,
  "message": "Plan updated and 25 user plans affected"
}
```

### Admin Updates User's Plan Status
```
PUT /api/admin/user-plans/cln456def
{
  "status": "COMPLETED"
}

Response:
{
  "success": true,
  "message": "User plan updated successfully"
}
```

### Admin Views Specific User's Plans
```
POST /api/admin/user-plans
{
  "userId": "user-id"
}

Response:
{
  "user": { /* user details */ },
  "plans": [ /* user's plans */ ],
  "totalPlans": 3
}
```

## Database Migration

To apply these changes to your database:

```bash
cd project-directory
npx prisma migrate dev --name add_user_plan_tracking
```

This will:
1. Create the `UserPlan` table
2. Add relationships to `User` and `Plan` tables
3. Create indexes for optimal performance
4. Generate Prisma Client types

## Backward Compatibility

- Legacy `Deposit` model continues to work
- User active plans endpoint returns both new `UserPlan` and legacy `Deposit` records
- No breaking changes to existing API endpoints
- Gradually migrate existing deposits to new system

## Performance Considerations

- `UserPlan` table has indexes on `userId` and `planId` for fast lookups
- Unique constraint on `(userId, planId)` prevents duplicate plan purchases
- Cascade deletes ensure data integrity
- Atomic transactions for plan purchases ensure consistency

## Security

- Admin-only endpoints require `ADMIN` role
- User can only see their own plans
- Audit logging on all plan modifications
- Proper error handling and validation
