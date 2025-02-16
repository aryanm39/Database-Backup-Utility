# Database Backup Utility

A utility for automating the backup process of MySQL and MongoDB databases. It supports exporting data to cloud storage services like AWS S3 and Google Cloud.

---

## Features
- Backup MySQL and MongoDB databases
- Schedule periodic backups using cron jobs
- Export backups to AWS S3 or Google Cloud
- Compress backups into `.zip` files
- Manage configuration using environment variables

---

## Table of Contents

1. [Installation](#installation)
2. [Dependencies](#dependencies)
3. [Configuration](#configuration)
4. [Usage](#usage)
5. [License](#license)

---

## Installation

To set up the project, clone this repository and install the required dependencies.

npm install express mysql2 mysqldump fs-extra dotenv node-cron archiver aws-sdk googleapis

### Clone the repository:
```bash
git clone <repository-url>
cd <project-directory>


