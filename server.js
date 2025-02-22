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
mongoose.connect(process.env.MONGO_URI, {
    dbName: 'Users',
    serverSelectionTimeoutMS: 5000, // Wait 5 seconds for server response
}).then(() => {
    console.log('MongoDB connected to Users database');
    startServer(); // Start the server only after successful connection
}).catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1); // Exit if the connection fails
});

// User Schema & Model
const userSchema = new mongoose.Schema({
    name: String,
    email: String
});
const User = mongoose.model('users', userSchema); // Ensuring collection name is 'users'

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

// Backup Directory
const backupDir = './backups';
if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);

// Database Backup Function
const backupDatabase = () => {
    const fileName = `${backupDir}/backup_${Date.now()}.gz`;
    const command = `mongodump --uri=${process.env.MONGO_URI} --db=Users --archive=${fileName} --gzip`;
    exec(command, (err, stdout, stderr) => {
        if (err) console.error('Backup failed:', err);
        else console.log('Backup successful:', fileName);
    });
};

// Schedule Backup Every Day at Midnight
cron.schedule('0 0 * * *', backupDatabase);

// Backup Route to manually trigger backup
app.get('/backup', (req, res) => {
    try {
        backupDatabase();
        res.json({ message: 'Database backup initiated successfully' });
    } catch (err) {
        res.status(500).json({ error: 'Backup failed', details: err.message });
    }
});

// Restore Route to restore the latest backup
app.get('/restore', (req, res) => {
    try {
        const files = fs.readdirSync(backupDir);
        // Filter for backup files (e.g., backup_*.gz)
        const backups = files.filter(f => f.startsWith('backup_') && f.endsWith('.gz'));
        if (backups.length === 0) {
            return res.status(404).json({ error: 'No backup files found' });
        }
        // Sort backup files by the timestamp embedded in the filename (descending order)
        backups.sort((a, b) => {
            const timeA = parseInt(a.split('_')[1]);
            const timeB = parseInt(b.split('_')[1]);
            return timeB - timeA;
        });
        const latestBackup = backups[0];
        const backupPath = `${backupDir}/${latestBackup}`;
        // Restore command with --drop to replace existing data
        const command = `mongorestore --uri=${process.env.MONGO_URI} --db=Users --archive=${backupPath} --gzip --drop`;
        exec(command, (err, stdout, stderr) => {
            if (err) {
                console.error('Restore failed:', err);
                return res.status(500).json({ error: 'Restore failed', details: err.message });
            }
            console.log('Restore successful:', latestBackup);
            res.json({ message: 'Database restore successful', backup: latestBackup });
        });
    } catch (err) {
        res.status(500).json({ error: 'Restore failed', details: err.message });
    }
});

// Function to Start Server after DB Connection
function startServer() {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
}
