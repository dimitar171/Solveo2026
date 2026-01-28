Planing:

1. Analyse the DATA - what are trying the show? - From reach to payment
- Keyword Performance - which keyword is working and which isnt
- Regional Performance - which region is performing well
- Monthly Metric - historical data
- Channel Performance - from where are the clients comming
- Problem Keywords - low performance keywords


2. Think of a general architecture for the application 
2.1.   Technology - I will use techonologies that i am most familiar and experienced with (if there are no constraints)
- React with Vite/Node with Express/SQLite for initial development. Shadcn for UI because is uniqly customizable and works well with AI.
- Why React with Vite - I dont see a need for a server side rendering to use NEXTJS. React with Vite and react-query should be enough.
- Why Express - its a non opinioted framework. Easy to work with, and easy to migrate it to serverless BE if we want more scalability in the future. 
- Why SQLite - simplicity. We can switch with Postgres for production.
2.2. Create a diagram of the flow (Data Injection > DB > BE > FE)

2.3. BE:
- Importing the data/Pipeline for data injection in the future/ real time data source
- APIs (BE filtering, pagination, agreagation)

2.3.3. Incident detection calculations, the whole logic done here: 
- High Trafic Low Conversion - ProblemsKeyword - (how to use ai for coding,ai coding tutorial)
- AI Overview connibalization - ai_overview_triggered 
- APAC Region underperformance - Regaional Performance
- Q3 Dip - Mountly Metrics
- Social channels waste - Channel Performance

2.4. What we want on to show on the FE:
- Executive summary - just fetch main metrics
- Funnel Mounthly Metrics website_traffic > unique_signups > trials_started > paid_conversion
- Section for displaying the alerts - Just fetch from BE the calculations 
- Geographic breakdown - a table with filtering by region,country, city

- Page for importing, schelduling data

- Just some future improvment notes, random order
3. Deployment and CICD pipeline
4. Tests
5. Scalability/Performance
6.  Admin panel. User authentication. Roles

Implementation 
Step 1: Scafold the FE and BE apps.
Step 2: Build the data ingestion part
Step 3: BE APIs for fetching data/agregating etc
Step 4: Build the component on the FE functionality wise
Step 5: Style them a bit and refactor


### How to run the app:

- Node.js (v16 or higher)
- npm


### Running the Application

You need to run both the backend and frontend servers:

#### 1. Start the Backend Server (TypeScript)

Open a terminal and run:

```bash
cd backend
npm i
npm run dev
```

The backend server will start on **http://localhost:8080**

You should see:
```
🚀 Server running on http://localhost:8080
📊 API available at http://localhost:8080/api
📥 Upload endpoint: POST http://localhost:8080/api/data/import
```

#### 2. Start the Frontend Server

Open a **new terminal** (keep the backend running) and run:

```bash
cd frontend
npm i
npm run dev
```

The frontend will start on **http://localhost:5173**

You should see:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

#### 3. Open the Application

Open your browser and go to **http://localhost:5173**