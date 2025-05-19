
# 📊 CSV to JSON Converter API (Kelp Global Backend Challenge)

This Node.js (Express.js) application reads a CSV file from a configurable location, converts each row into a nested JSON object, and inserts it into a PostgreSQL database. It also prints an age group distribution report to the console after data upload.

---

## 📁 Project Structure

```
cvstojson/
├── config/db.js           # PostgreSQL connection setup (db.js)
├── controllers/uploadController.js     # Upload controller logic
├── services/csvParser.js/ageDistribution.js         # CSV parser and age group logic
├── utils/jsonBuilder.js            # JSON builder (dot notation to nested)
├── data/             # CSV file(s)
├── .env              # Environment variables
├── index.js          # Entry point
└── README.md
```

---

## ⚙️ Tech Stack

- Node.js
- Express.js
- PostgreSQL
- Custom CSV parsing (no csv-to-json packages)

---

## 🔧 Setup Instructions

### 1. Clone and Install

```bash
git clone https://github.com/whatshisusername/csvtojson-kelp.git
cd csvtojson
npm install
```

### 2. Create `.env` File

Create a `.env` file in the root of your project:

```env
PORT=3000
CSV_FILE_PATH=./data/sample.csv
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=your__databasename
```



### 3. Run the App

```bash
node index.js
```

Visit:

```bash
http://localhost:3000/api/process-csv
```

✅ This will:

- Parse and insert the CSV records into the database
- Print the age distribution report in the terminal

---

## 📊 Console Output

### JSON Object

![image](https://github.com/user-attachments/assets/ad3cbd4f-5494-4222-a6e0-86b485e96ed3)



### Age Distribution Report
![image](https://github.com/user-attachments/assets/1d702291-c302-4a38-8889-9af89bba20fa)

### Postman
![image](https://github.com/user-attachments/assets/b3e439f0-b584-4804-8126-00f7fa94d462)

### Browser
![image](https://github.com/user-attachments/assets/e98acc85-d4a8-4167-9a21-4ba0e0a9117f)

### Database
![image](https://github.com/user-attachments/assets/0930f94b-0c33-4daf-92ca-f23140efa5eb)







## ✅ Assumptions

- The first line in the CSV file is always the header.
- Required fields: `name.firstName`, `name.lastName`, `age`
- Nested properties are handled using dot notation.
- Additional fields go into `additional_info` column as JSONB.
