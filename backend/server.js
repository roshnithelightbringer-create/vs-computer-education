const express = require('express');
const path = require('path');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join(__dirname, '..')));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/courses', require('./routes/courses'));
app.use('/api/enquiries', require('./routes/enquiries'));
app.use('/api/demo', require('./routes/demo'));
app.use('/api/dashboard', require('./routes/dashboard'));

// Serve admin static files
app.use('/admin', express.static(path.join(__dirname, '..', 'admin')));
// Fallback for SPA routing within admin
app.get('/admin/*', (req, res) {
  res.sendFile(path.join(__dirname, '..', 'admin', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`VS Computer Education server running on port ${PORT}`);
});