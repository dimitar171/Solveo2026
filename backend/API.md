# API Documentation

Base URL: `http://localhost:5000/api`

## Health & Test

### GET /api/health
Check server status

**Response:**
```json
{
  "status": "ok",
  "message": "Backend server is running",
  "timestamp": "2025-01-27T10:00:00.000Z"
}
```

### GET /api/test
Test endpoint

**Response:**
```json
{
  "message": "This is a test endpoint",
  "data": {
    "users": 100,
    "revenue": 50000
  }
}
```

---

## Metrics

### GET /api/metrics/summary
Get executive summary with key metrics

**Response:**
```json
{
  "success": true,
  "data": {
    "currentMonth": "2025-12",
    "mrr": {
      "current": 26957,
      "growth": -15.7,
      "previous": 31980
    },
    "signups": {
      "current": 2783,
      "growth": -14.2,
      "previous": 3242
    },
    "churnRate": 0.0489,
    "conversionRates": {
      "signupToTrial": 57.02,
      "trialToPaid": 20.42
    },
    "topRegions": [
      { "region": "NA", "mrr": 150000, "conversions": 500 }
    ],
    "totals": {
      "keywords": 250,
      "regions": 4
    }
  }
}
```

### GET /api/metrics/trends
Get trend data for charts

**Query Parameters:**
- `metric` - Metric to track: `mrr`, `signups`, `traffic`, `churn`, `conversions` (default: `mrr`)
- `period` - Number of months (default: `12`)

**Example:** `/api/metrics/trends?metric=mrr&period=12`

**Response:**
```json
{
  "success": true,
  "data": [
    { "month": "2024-01", "value": 33305 },
    { "month": "2024-02", "value": 25652 },
    ...
  ]
}
```

### GET /api/metrics/funnel
Get funnel visualization data

**Query Parameters:**
- `month` - Specific month (optional, defaults to latest)

**Example:** `/api/metrics/funnel?month=2025-01`

**Response:**
```json
{
  "success": true,
  "data": {
    "month": "2025-01",
    "stages": [
      {
        "name": "Traffic",
        "value": 51607,
        "percentage": 100,
        "dropoff": null,
        "conversionFromPrevious": null
      },
      {
        "name": "Signup",
        "value": 3377,
        "percentage": 6.54,
        "dropoff": 48230,
        "conversionFromPrevious": 6.54
      },
      {
        "name": "Trial",
        "value": 2171,
        "percentage": 4.21,
        "dropoff": 1206,
        "conversionFromPrevious": 64.29
      },
      {
        "name": "Paid",
        "value": 503,
        "percentage": 0.97,
        "dropoff": 1668,
        "conversionFromPrevious": 23.17
      }
    ],
    "overallConversion": 0.97
  }
}
```

### GET /api/metrics/months
Get list of available months

**Response:**
```json
{
  "success": true,
  "data": ["2025-12", "2025-11", "2025-10", ...]
}
```

---

## Keywords

### GET /api/keywords
Get all keywords with optional filtering

**Query Parameters:**
- `category` - Filter by category
- `minTraffic` - Minimum traffic threshold
- `maxConversion` - Maximum conversion rate
- `aiOverview` - Filter by AI Overview (true/false)

**Example:** `/api/keywords?category=High Intent Product&minTraffic=5000`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "keyword": "ai coding assistant",
      "category": "High Intent Product",
      "traffic2025": 2030,
      "conversionRate2025": 3.64,
      "aiOverviewTriggered": false,
      ...
    }
  ]
}
```

### GET /api/keywords/categories
Get all keyword categories

**Response:**
```json
{
  "success": true,
  "data": [
    { "category": "High Intent Product", "count": 28 },
    { "category": "Competitor Comparison", "count": 20 },
    ...
  ]
}
```

### GET /api/keywords/problems
Get problem keywords (high traffic, low conversion)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "keyword": "how to use ai for coding",
      "traffic2025": 6327,
      "conversionRate2025": 0.57,
      ...
    }
  ]
}
```

### GET /api/keywords/ai-overview-impact
Get keywords affected by AI Overview

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "keyword": "how to use ai for coding",
      "trafficChangePct": -28.5,
      "aiOverviewTriggered": true,
      ...
    }
  ]
}
```

### GET /api/keywords/stats
Get keyword statistics

**Response:**
```json
{
  "success": true,
  "data": {
    "total": 250,
    "avgConversion": 3.45,
    "totalTraffic": 850000,
    "aiOverviewCount": 120
  }
}
```

---

## Regions

### GET /api/regions
Get regional performance data

**Query Parameters:**
- `region` - Filter by region (NA, EMEA, APAC, LATAM)
- `country` - Filter by country
- `city` - Filter by city
- `month` - Filter by month

**Example:** `/api/regions?region=APAC&month=2025-01`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "region": "APAC",
      "country": "India",
      "city": "Bangalore",
      "month": "2025-01",
      "totalTraffic": 4325,
      "paidConversions": 7,
      "trialToPaidRate": 7.82,
      "mrrUsd": 414.13,
      ...
    }
  ]
}
```

### GET /api/regions/breakdown
Get regional breakdown (aggregated by region)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "region": "NA",
      "totalTraffic": 500000,
      "trialsStarted": 25000,
      "paidConversions": 5000,
      "mrr": 250000,
      "avgTrialToPaidRate": 20.5,
      "avgCAC": 95.5,
      "avgLTV": 850.3
    }
  ]
}
```

### GET /api/regions/countries
Get country breakdown for a region

**Query Parameters:**
- `region` - Region name (required)

**Example:** `/api/regions/countries?region=APAC`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "country": "India",
      "totalTraffic": 50000,
      "paidConversions": 500,
      "mrr": 25000,
      "avgConversion": 8.5
    }
  ]
}
```

### GET /api/regions/cities
Get city breakdown for a country

**Query Parameters:**
- `country` - Country name (required)

**Example:** `/api/regions/cities?country=India`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "city": "Bangalore",
      "totalTraffic": 20000,
      "paidConversions": 200,
      "mrr": 10000,
      "avgConversion": 8.2,
      "avgCAC": 105.5
    }
  ]
}
```

### GET /api/regions/underperforming
Get underperforming regions

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "region": "APAC",
      "avgConversion": 8.5,
      "avgCAC": 155.2,
      "issues": ["Low conversion", "High CAC"]
    }
  ]
}
```

### GET /api/regions/list
Get list of all regions

**Response:**
```json
{
  "success": true,
  "data": ["NA", "EMEA", "APAC", "LATAM"]
}
```

### GET /api/regions/countries-list
Get list of countries

**Query Parameters:**
- `region` - Filter by region (optional)

**Response:**
```json
{
  "success": true,
  "data": ["United States", "Canada", "India", ...]
}
```

### GET /api/regions/cities-list
Get list of cities

**Query Parameters:**
- `country` - Filter by country (optional)

**Response:**
```json
{
  "success": true,
  "data": ["San Francisco", "New York", "Bangalore", ...]
}
```

---

## Channels

### GET /api/channels
Get channel performance data

**Query Parameters:**
- `channel` - Filter by channel name
- `month` - Filter by month

**Example:** `/api/channels?channel=Organic Search`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "month": "2025-01",
      "channel": "Organic Search",
      "sessions": 22029,
      "signups": 847,
      "conversionRate": 3.85,
      "avgSessionDurationSec": 286,
      "bounceRate": 0.58,
      "pagesPerSession": 5.4
    }
  ]
}
```

### GET /api/channels/comparison
Get channel comparison (aggregated)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "channel": "Developer Communities",
      "totalSessions": 50000,
      "totalSignups": 4500,
      "avgConversion": 8.5,
      "avgBounceRate": 0.45,
      "avgSessionDuration": 250
    }
  ]
}
```

### GET /api/channels/low-performing
Get low-performing channels (<2% conversion)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "channel": "Social (Organic)",
      "avgConversion": 1.2,
      "totalSessions": 45000
    }
  ]
}
```

### GET /api/channels/list
Get list of all channels

**Response:**
```json
{
  "success": true,
  "data": [
    "Organic Search",
    "Paid Search",
    "Developer Communities",
    ...
  ]
}
```

### GET /api/channels/trends
Get channel trends over time

**Query Parameters:**
- `channel` - Channel name (required)

**Example:** `/api/channels/trends?channel=Organic Search`

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "month": "2024-01",
      "sessions": 18626,
      "signups": 575,
      "conversionRate": 3.09
    },
    ...
  ]
}
```

---

## Data Import

### POST /api/data/import
Upload and import Excel file

**Request:**
- Content-Type: `multipart/form-data`
- Field: `file` (Excel file)

**Response:**
```json
{
  "success": true,
  "message": "Data imported successfully",
  "recordCount": 1222,
  "breakdown": {
    "keywords": 250,
    "regional": 708,
    "monthly": 24,
    "channels": 240
  }
}
```

### GET /api/data/import-history
Get import history

**Response:**
```json
{
  "success": true,
  "history": [
    {
      "id": 1,
      "filename": "uploads/file-123.xlsx",
      "status": "success",
      "recordCount": 1222,
      "errorMsg": null,
      "importedAt": "2025-01-27T10:00:00.000Z"
    }
  ]
}
```

---

## Scheduler

### GET /api/scheduler/status
Get scheduler status

**Response:**
```json
{
  "success": true,
  "enabled": false,
  "cronExpression": "0 2 * * *",
  "isRunning": false,
  "dataFilePath": "uploads/ai_coding_agent_dashboard_data.xlsx"
}
```

### POST /api/scheduler/start
Start the scheduler

**Response:**
```json
{
  "success": true,
  "message": "Scheduler started"
}
```

### POST /api/scheduler/stop
Stop the scheduler

**Response:**
```json
{
  "success": true,
  "message": "Scheduler stopped"
}
```

### POST /api/scheduler/trigger
Trigger manual import

**Response:**
```json
{
  "success": true,
  "message": "Manual import triggered",
  "recordCount": 1222,
  "breakdown": { ... }
}
```

### POST /api/scheduler/config
Update scheduler configuration

**Request Body:**
```json
{
  "cronExpression": "0 */6 * * *",
  "dataFilePath": "uploads/new_data.xlsx",
  "enabled": true
}
```

**Response:**
```json
{
  "success": true,
  "message": "Scheduler configuration updated"
}
```

---

## Complete API Endpoint List

```
Health & Test
├── GET  /api/health
└── GET  /api/test

Metrics
├── GET  /api/metrics/summary
├── GET  /api/metrics/trends
├── GET  /api/metrics/funnel
└── GET  /api/metrics/months

Keywords
├── GET  /api/keywords
├── GET  /api/keywords/categories
├── GET  /api/keywords/problems
├── GET  /api/keywords/ai-overview-impact
└── GET  /api/keywords/stats

Regions
├── GET  /api/regions
├── GET  /api/regions/breakdown
├── GET  /api/regions/countries
├── GET  /api/regions/cities
├── GET  /api/regions/underperforming
├── GET  /api/regions/list
├── GET  /api/regions/countries-list
└── GET  /api/regions/cities-list

Channels
├── GET  /api/channels
├── GET  /api/channels/comparison
├── GET  /api/channels/low-performing
├── GET  /api/channels/list
└── GET  /api/channels/trends

Data Import
├── POST /api/data/import
└── GET  /api/data/import-history

Scheduler
├── GET  /api/scheduler/status
├── POST /api/scheduler/start
├── POST /api/scheduler/stop
├── POST /api/scheduler/trigger
└── POST /api/scheduler/config
```

---

## Testing Endpoints

### Using curl

```bash
# Get executive summary
curl http://localhost:5000/api/metrics/summary

# Get MRR trends
curl http://localhost:5000/api/metrics/trends?metric=mrr&period=12

# Get funnel data
curl http://localhost:5000/api/metrics/funnel

# Get problem keywords
curl http://localhost:5000/api/keywords/problems

# Get regional breakdown
curl http://localhost:5000/api/regions/breakdown

# Get channel comparison
curl http://localhost:5000/api/channels/comparison
```

### Using Browser

Simply open in your browser:
- http://localhost:5000/api/metrics/summary
- http://localhost:5000/api/keywords/problems
- http://localhost:5000/api/regions/breakdown

---

## Error Responses

All endpoints return errors in this format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

Common HTTP status codes:
- `200` - Success
- `400` - Bad Request (invalid parameters)
- `500` - Internal Server Error
