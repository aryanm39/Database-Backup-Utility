// Import necessary modules
const express = require('express');
const mongoose = require('mongoose');
const cron = require('node-cron');
const fs = require('fs');
const { exec } = require('child_process');
require('dotenv').config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI)
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err));

// User Schema & Model
const userSchema = new mongoose.Schema({
    name: String,
    email: String
});
const User = mongoose.model('User', userSchema);

// CRUD Routes
app.post('/users', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/users/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(user);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.delete('/users/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Root Route
app.get('/', (req, res) => {
    res.send('Welcome to the Database Backup Utility!');
});

// Backup Directory
const backupDir = './backups';
if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);

// Database Backup Function
const backupDatabase = () => {
    const fileName = `${backupDir}/backup_${Date.now()}.gz`;
    const command = `mongodump --uri=${process.env.MONGO_URI} --archive=${fileName} --gzip`;
    exec(command, (err, stdout, stderr) => {
        if (err) console.error('Backup failed:', err);
        else console.log('Backup successful:', fileName);
    });
};
/* 
// Schedule Backup Every Day at Midnight
cron.schedule('0 0 * * *', backupDatabase);
 */
// Start Server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
