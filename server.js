const express = require('express');
const mongoose = require('mongoose');
//const cron = require('node-cron');
const fs = require('fs');
const { exec } = require('child_process');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, { dbName: 'Users' }).then(() => {
    console.log('MongoDB connected');
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
});

const User = mongoose.model('users', new mongoose.Schema({ 
    name: String, 
    email: String, 
    username: String, 
    password: String 
},{ versionKey: false }));

app.set('json spaces', 2);
app.post('/users', async (req, res) => res.json(await new User(req.body).save()));
app.get('/users', async (req, res) => res.json(await User.find()));
app.get('/users/:id', async (req, res) => res.json(await User.findById(req.params.id)));
app.put('/users/:id', async (req, res) => res.json(await User.findByIdAndUpdate(req.params.id, req.body, { new: true })));
app.delete('/users/:id', async (req, res) => res.json(await User.findByIdAndDelete(req.params.id)));


const backupDir = './backups';
if (!fs.existsSync(backupDir)) fs.mkdirSync(backupDir);

const backupDatabase = () => {
    const fileName = `${backupDir}/backup_${Date.now()}.gz`;
    exec(`mongodump --uri=${process.env.MONGO_URI} --db=Users --archive=${fileName} --gzip`);
};

//cron.schedule('0 0 * * *', backupDatabase);
app.get('/backup', (req, res) => (backupDatabase(), res.json({ message: 'Backup started' })));

app.get('/restore', (req, res) => {
    const backups = fs.readdirSync(backupDir).filter(f => f.startsWith('backup_') && f.endsWith('.gz')).sort((a, b) => b.split('_')[1] - a.split('_')[1]);
    if (backups.length) exec(`mongorestore --uri=${process.env.MONGO_URI} --db=Users --archive=${backupDir}/${backups[0]} --gzip --drop`);
    res.json({ message: 'Restore started' });
});
