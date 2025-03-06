# Database-Backup-Utility
npm install express mongoose dotenv node-cron

MongoDB Command Line Database Tools Download
https://www.mongodb.com/try/download/database-tools
Paste the Tools folder in mongodb folder [path -> program files/mongodb/tools/]
add the bin path to environment variable in advance system settings 
paste tools/bin path to the environment variables 

Mongodb Database
use Users;
db.users.insertMany([
    { name: "Alice", email: "alice@example.com", username: "alice01", password: "password123" },
    { name: "Bob", email: "bob@example.com", username: "bob01", password: "password456" },
    { name: "Charlie", email: "charlie@example.com", username: "charlie01", password: "password789" }
]);

netstat -ano | findstr :3000
taskkill /PID <PID> /F
replace <PID> with process id
taskkill /PID <PID> /F
