const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

// CORS
app.use(cors());

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use(express.static(path.join(__dirname)));

// Serve admin files
app.use('/admin', express.static(path.join(__dirname, 'admin')));

// API routes
const authRoutes = require('./backend/routes/auth');
const courseRoutes = require('./backend/routes/courses');
const dashboardRoutes = require('./backend/routes/dashboard');
const demoRoutes = require('./backend/routes/demo');
const enquiryRoutes = require('./backend/routes/enquiries');
const studentRoutes = require('./backend/routes/students');

app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/demo', demoRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/students', studentRoutes);

// Serve index.html for root
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
