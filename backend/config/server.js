import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import initializeConnection from './db.js';

dotenv.config();

const app = express();

const allowedOrigins = ['http://localhost:3000', 'http://localhost:5173'];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json());

const startServer = async () => {
  try {
    const db = await initializeConnection();

    app.get("/", (req, res) => {
      res.send("Server is running!");
    });

    app.post('/api/addData', async (req, res) => {
      const { formType, formData } = req.body;
    
      console.log("🔍 Received formType:", formType);
      console.log("📦 Received formData:", formData);
    
      try {
        if (!formType || !formData) {
          return res.status(400).json({ success: false, message: "Invalid request data" });
        }
    
        if (formType === 'hte') {
          await db.execute(
            `INSERT INTO hte (company_name, office_address, business_type, with_moa_date_notarized, expiry_date)
             VALUES (?, ?, ?, ?, ?)`,
            [
              formData.company || null,
              formData.companyAddress || null,
              formData.natureOfBusiness || null,
              formData.dateOfValidation || null,
              formData.dateOfExpiration || null
            ]
          );
        } else if (formType === 'moas') {
          await db.execute(
            `INSERT INTO moa (company_name, address, business_type, year_moa_started, expiration_date, contact_person, contact_no, email, remarks)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?);`,
            [
              formData.company, 
              formData.companyAddress, 
              formData.natureOfBusiness, 
              formData.dateOfValidation,
              formData.dateOfExpiration, 
              `${formData.contactPerson.firstName} ${formData.contactPerson.middleName} ${formData.contactPerson.lastName}`,
              formData.contactPerson.contactNumber,
              formData.contactPerson.emailAddress,
              formData.remarks || null
            ]
          );      
        } else if (formType === 'industryPartner') {
          await db.execute(
            `INSERT INTO industry_partner (company_name, office_address, business_type, with_moa_date_notarized, expiry_date)
             VALUES (?, ?, ?, ?, ?)`,
            [
              formData.company || null,
              formData.companyAddress || null,
              ormData.natureOfBusiness || null,
              formData.dateOfValidation || null,
              formData.dateOfExpiration || null
            ]
          );
        } else if (formType === 'ojtCoordinator') {
          await db.execute(
            `INSERT INTO ojt_coordinator (name, campus, college, email, assigned_student, office, status)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              `${formData.ojtCoordinator.firstName || ''} ${formData.ojtCoordinator.middleName || ''} ${formData.ojtCoordinator.lastName || ''}`,
              formData.ojtCoordinator.campus || null,
              formData.ojtCoordinator.college || "Unknown", // Set default value if null
              formData.ojtCoordinator.emailAddress || null,
              formData.ojtCoordinator.contactNumber || 0, // Set default if empty
              formData.ojtCoordinator.officeLocation || null,
              "Active"
            ]
          );
        } else {
          console.log("❌ Invalid formType received:", formType);
          return res.status(400).json({ success: false, message: "Invalid form type" });
        }
    
        res.json({ success: true, message: "Data added successfully" });
      } catch (error) {
        console.error("❌ Error inserting data:", error);
        res.status(500).json({ success: false, message: "Database error", error: error.message });
      }
    });
    
    
    // ✅ Added better error handling for /api/hte
    app.get('/api/hte', async (req, res) => {
      try {
        console.log("Fetching data from database for /api/hte...");
        const [rows] = await db.execute('SELECT id, company_name AS company, office_address AS address, expiry_date AS date, business_type AS business, moa_status AS validity FROM hte');
        console.log("✅ Data fetched:", rows);
        res.json(rows);
      } catch (error) {
        console.error("❌ Error fetching HTES data:", error);
        res.status(500).json({ error: 'Failed to fetch HTES data' });
      }
    });
    
    // ✅ Updated: Fix query for /api/moa (was using wrong table)
    app.get('/api/moa', async (req, res) => {
      try {
        console.log("Fetching data from database for /api/moa...");
        const [rows] = await db.execute('SELECT id, company_name AS company, address AS address, expiration_date AS date, business_type AS business, moa_status AS validity FROM moa');
        console.log("✅ Data fetched:", rows);
        res.json(rows);
      } catch (error) {
        console.error("❌ Error fetching MOAS data:", error);
        res.status(500).json({ error: 'Failed to fetch MOAS data' });
      }
    });
    
    
    // ✅ Server starts on correct port
    const PORT = process.env.PORT || 3001;
    app.listen(PORT, () => {
      console.log(`🚀 Server is running on http://localhost:${PORT}`);
    });

  } catch (error) {
    console.error("❌ Failed to connect to the database:", error);
    app.get('/api/hte', async (req, res) => {
      try {
        const [rows] = await db.execute('SELECT id, company_name AS company, office_address AS address, expiry_date AS date, business_type AS business, moa_status AS validity FROM hte');
        console.log("Fetched Data from Database:", rows); // Debugging: Check database response
        res.json(rows);
      } catch (error) {
        console.error("Error fetching HTES data:", error);
        res.status(500).json({ error: 'Failed to fetch HTES data' });
      }
    });

    app.get('/api/moa', async (req, res) => {
      try {
        const [rows] = await db.execute('SELECT id, company_name AS company, office_address AS address, expiry_date AS date, business_type AS business, moa_status AS validity FROM hte');
        console.log("Fetched Data from Database:", rows); // Debugging: Check database response
        res.json(rows);
      } catch (error) {
        console.error("Error fetching MOAS data:", error);
        res.status(500).json({ error: 'Failed to fetch MOAS data' });
      }
    });

    app.get('/api/ojt_coordinator', async (req, res) => {
      try {
        const [rows] = await db.execute('SELECT id, name, campus, email, office, assigned_student FROM ojt_coordinator');
        console.log("Fetched Data from Database:", rows); // Debugging: Check database response
        res.json(rows);
      } catch (error) {
        console.error("Error fetching OJT Coordinators data:", error);
        res.status(500).json({ error: 'Failed to fetch OJT Coordinators data' });
      }
    });

    app.get('/api/industry_partner', async (req, res) => {
      try {
        const [rows] = await db.execute('SELECT id, company_name AS company, office_address AS address, expiry_date AS date, business_type AS business, moa_status AS validity FROM industry_partner');
        console.log("Fetched Data from Database:", rows); // Debugging: Check database response
        res.json(rows);
      } catch (error) {
        console.error("Error fetching Industry Partners data:", error);
        res.status(500).json({ error: 'Failed to fetch Industry Partners data' });
      }
    });

    app.get('/api/business-counts', async (req, res) => {
      try {
        const [rows] = await db.execute(`
          SELECT business_type, COUNT(*) as count 
          FROM hte 
          GROUP BY business_type 
          ORDER BY count DESC 
          LIMIT 6
        `);
        res.json(rows);
      } catch (error) {
        console.error("Error fetching business counts:", error);
        res.status(500).json({ error: 'Failed to fetch business counts' });
      }
    });
    
    app.get('/api/moa-status', async (req, res) => {
      try {
        const [rows] = await db.execute(`
          SELECT moa_status as STATUS, 
          COUNT(*) * 100.0 / (SELECT COUNT(*) FROM moa) as percentage 
          FROM moa 
          GROUP BY moa_status
        `);
        res.json(rows);
      } catch (error) {
        console.error("Error fetching MOA status:", error);
        res.status(500).json({ error: 'Failed to fetch MOA status' });
      }
    });
    
    app.get('/api/summary-counts', async (req, res) => {
      try {
        const [hteCount] = await db.execute('SELECT COUNT(*) as count FROM hte');
        const [moaCount] = await db.execute('SELECT COUNT(*) as count FROM moa');
        const [ojtCount] = await db.execute('SELECT COUNT(*) as count FROM ojt_coordinator');
        const [industryCount] = await db.execute('SELECT COUNT(*) as count FROM industry_partner');
        
        res.json({
          hte: hteCount[0].count,
          moa: moaCount[0].count,
          ojt: ojtCount[0].count,
          industry: industryCount[0].count
        });
      } catch (error) {
        console.error("Error fetching summary counts:", error);
        res.status(500).json({ error: 'Failed to fetch summary counts' });
      }
    });

    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  }
};

startServer();
