# Database-Backup-Utility
MongoDB Command Line Database Tools Download
https://www.mongodb.com/try/download/database-tools
Paste the Tools folder in mongodb folder [path -> program files/mongodb/tools/]
add the bin path to environment variable in advance system settings 
paste tools/bin path to the environment variables 

POSTMAN
Create a User (POST)  "method": "POST" http://localhost:3000/users
Get All Users (GET)   "method": "GET"  http://localhost:3000/users
Get User by ID (GET)  "method": "GET"  http://localhost:3000/users/67b9d9d0bc3331e39f228fb5
Update User by ID     "method": "PUT"  http://localhost:3000/users/67b9d9d0bc3331e39f228fb5
Delete User (DELETE)  "method": "DELETE"  http://localhost:3000/users/67b9d9d0bc3331e39f228fb5
Backup Users Table    "method": "GET"   http://localhost:3000/backup
Restore Users Table     "method": "GET"  http://localhost:3000/restore


Mongodb Database db name -> Users , COllection name -> 
use Users;
db.users.insertMany([
    { name: "Alice", email: "alice@example.com", username: "alice01", password: "password123" },
    { name: "Bob", email: "bob@example.com", username: "bob01", password: "password456" },
    { name: "Charlie", email: "charlie@example.com", username: "charlie01", password: "password789" }
]);


