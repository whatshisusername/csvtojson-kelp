
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

Send a **POST** request to:

```bash
http://localhost:3000/api/process-csv
```

✅ This will:

- Parse and insert the CSV records into the database
- Print the age distribution report in the terminal

---

## 📊 Console Output
## for sample.csv
```csv
name.firstName,name.lastName,age,address.line1,address.line2,address.city,address.state,gender
Rohit,Prasad,35,A-563 Rakshak Society,New Pune Road,Pune,Maharashtra,male
```

### JSON Object
![image](https://github.com/user-attachments/assets/1e172440-0f29-4149-9de9-561a68bbd05e)





### Age Distribution Report
![image](https://github.com/user-attachments/assets/7b91ee51-ca09-46ed-8b8a-95eb182d70cf)


### Postman
![image](https://github.com/user-attachments/assets/6ae118ab-0033-4e4f-9bb0-2393804d0923)




### Database
![image](https://github.com/user-attachments/assets/11abb15a-e998-4180-a298-9442d3b322d8)


## for sample_users_1000_extended.csv
```csv
name.firstName,name.lastName,age,address.line1,address.line2,address.city,address.state,gender,company.name,company.position.title,contact.email,contact.phone,preferences.language,preferences.newsletter
Danielle,Ferguson,65,566 Osborne Lakes Suite 469,Suite 841,Port Matthewside,Texas,male,Li and Sons,"Geologist, wellsite",russellrichard@gmail.com,1283003780,Spanish,unsubscribed
```

### JSON Object

![image](https://github.com/user-attachments/assets/ad3cbd4f-5494-4222-a6e0-86b485e96ed3)



### Age Distribution Report
![image](https://github.com/user-attachments/assets/1d702291-c302-4a38-8889-9af89bba20fa)

### Postman
![image](https://github.com/user-attachments/assets/e22b11cb-5d40-4faa-b362-c6d5b0c62b8a)



### Database
![image](https://github.com/user-attachments/assets/0930f94b-0c33-4daf-92ca-f23140efa5eb)






## ✅ Assumptions

- The first line in the CSV file is always the header.
- Required fields: `name.firstName`, `name.lastName`, `age`
- Nested properties are handled using dot notation.
- Additional fields go into `additional_info` column as JSONB.
