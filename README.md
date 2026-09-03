# College Lab Equipment Management System

A beginner-friendly **Node.js + Express.js + Mongoose + MongoDB** REST API backend for managing college laboratory equipment assets. This project extends fundamental MongoDB Shell practice into a production-patterned web API featuring full CRUD functionality, query operator filters (`$gt`, `$lt`, `$in`, `$and`, `$or`, `$exists`), equipment borrowing workflows (issue & return), and input validation.

---

## 1. Objective

The primary objective of this project is to demonstrate:
- **Database Connectivity:** Establishing robust Mongoose connection routines with environment variable separation (`dotenv`).
- **Clean Architecture:** Organizing code following the **MVC (Model-Controller-Route)** architectural design pattern.
- **Full RESTful CRUD Operations:** Building Create, Read, Update, and Delete endpoints for hardware inventory.
- **MongoDB Query Operators:** Implementing dedicated API routes demonstrating `$gt`, `$lt`, `$in`, `$and`, `$or`, and `$exists` operators.
- **Academic Borrowing Workflow:** Handling real-time student checkouts and returns while maintaining stock validation.

---

## 2. Problem Statement

College laboratories store valuable hardware across multiple specialized labs (Electronics, Computer, Robotics, Electrical, and Mechanical). Manual paper registers lead to:
- **Missing Stock Visibility:** Inability to instantly verify whether items like Oscilloscopes or Arduinos are available or currently issued.
- **Quantity Discrepancies:** Unrecorded borrowing leading to negative stock counts.
- **Maintenance Neglect:** Equipment needing repair remaining listed as active stock.

This REST API provides a centralized MongoDB database system to track item quantities, laboratory locations, physical condition, and borrowing logs accurately.

---

## 3. Key Features

- **Standard RESTful CRUD:** Create new equipment, retrieve single or all items, update equipment details, and delete retired hardware.
- **Search & Dynamic Filters:** Search equipment by name (case-insensitive regex) and filter by category, lab name, availability status, or condition via query parameters (`?category=Electronics&search=Arduino`).
- **MongoDB Query Operator Routes:** Dedicated endpoints for `$gt`, `$lt`, `$in`, `$and`, `$or`, `$exists: true`, and `$exists: false`.
- **Equipment Issue & Return Logic:** `POST /api/equipment/:id/issue` (assigns student name and decrements available quantity) and `POST /api/equipment/:id/return` (increments available quantity and clears student name).
- **Practical Lab Documentation:** Includes a full practical lab record document (`crud-operations-with-college-lab-equipment.docx`) in the repository root.

---

## 4. Technology Stack

- **Runtime:** Node.js (v20+)
- **Web Framework:** Express.js (v4.19.2)
- **Database:** MongoDB (v8.3.8) & MongoDB Shell (`mongosh` v2.10.0)
- **ODM (Object Data Modeling):** Mongoose (v8.5.1)
- **Environment Management:** dotenv
- **Cross-Origin Resource Sharing:** cors
- **Development Tool:** nodemon

---

## 5. Database & Collection Details

- **Database Name:** `collegeLabDB`
- **Collection Name:** `equipment`
- **MongoDB URI:** `mongodb://127.0.0.1:27017/collegeLabDB`
- **Server Port:** `5000`

---

## 6. Mongoose Schema

Located at `backend/models/Equipment.js`:

```javascript
const mongoose = require('mongoose');

const labEquipmentSchema = new mongoose.Schema(
    {
        equipmentName: { type: String, required: [true, 'Equipment name is required'], trim: true },
        category: { type: String, required: [true, 'Category is required'], trim: true },
        labName: { type: String, required: [true, 'Lab name is required'], trim: true },
        quantity: { type: Number, required: [true, 'Quantity is required'], min: 0 },
        availableQuantity: { type: Number, required: [true, 'Available quantity is required'], min: 0 },
        condition: { 
            type: String, 
            enum: ['Good', 'Needs Maintenance', 'Damaged'], 
            default: 'Good' 
        },
        status: { 
            type: String, 
            enum: ['Available', 'Partially Available', 'Unavailable'], 
            default: 'Available' 
        },
        issuedTo: { type: String, trim: true },
        purchaseYear: { type: Number },
        tags: [{ type: String, trim: true }]
    },
    { timestamps: true, collection: 'equipment' }
);

module.exports = mongoose.model('Equipment', labEquipmentSchema);
```

---

## 7. Project Folder Structure

```text
college-lab-equipment/
├── crud-operations-with-college-lab-equipment.docx  # Practical MongoDB lab record document
│
├── backend/
│   ├── config/
│   │   └── db.js                 # Mongoose database connection module
│   ├── models/
│   │   └── Equipment.js          # Mongoose Equipment schema definition
│   ├── controllers/
│   │   └── equipmentController.js # Business logic & query operator handlers
│   ├── routes/
│   │   └── equipmentRoutes.js    # Express router endpoint definitions
│   ├── server.js                 # Express application entry point
│   └── .env                      # Environment variables (PORT, MONGODB_URI)
│
├── mongodb/
│   ├── mongodb-commands.js       # Interactive MongoDB Shell (mongosh) practice script
│   └── seed.js                   # Node.js database seeding script (npm run seed)
│
├── README.md                     # Academic documentation & API guide
└── package.json                  # Project manifests and execution scripts
```

---

## 8. API Endpoints Reference

### Standard CRUD & Searching
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/equipment` | Retrieve all equipment (Supports `?category=`, `?labName=`, `?status=`, `?condition=`, `?search=`) |
| `GET` | `/api/equipment/:id` | Retrieve single equipment item by ObjectId |
| `POST` | `/api/equipment` | Create a new equipment document |
| `PUT` | `/api/equipment/:id` | Update an existing equipment document |
| `DELETE` | `/api/equipment/:id` | Delete an equipment document |

### MongoDB Query Operator Routes
| Method | Endpoint | Operator | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/equipment/filter/high-quantity` | `$gt` | Find items with `quantity > 10` |
| `GET` | `/api/equipment/filter/low-availability` | `$lt` | Find items with `availableQuantity < 5` |
| `GET` | `/api/equipment/filter/categories` | `$in` | Find items in Electrical or Electronics categories |
| `GET` | `/api/equipment/filter/available-electronics` | `$and` | Find items in `Electronics Lab` AND status `Available` |
| `GET` | `/api/equipment/filter/multiple-labs` | `$or` | Find items in `Computer Lab` OR `Robotics Lab` |
| `GET` | `/api/equipment/filter/issued` | `$exists: true` | Find equipment currently borrowed (`issuedTo` exists) |
| `GET` | `/api/equipment/filter/not-issued` | `$exists: false` | Find equipment currently in stock (`issuedTo` omitted) |

### Issue & Return Business Logic
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/equipment/:id/issue` | Decrement `availableQuantity`, assign `issuedTo`, update status |
| `POST` | `/api/equipment/:id/return` | Increment `availableQuantity`, clear `issuedTo`, update status |

---

## 9. Issue & Return Workflow

```text
                        [ STUDENT BORROW REQUEST ]
                                    │
                                    ▼
                      POST /api/equipment/:id/issue
                          { "studentName": "Dharshini" }
                                    │
               ┌────────────────────┴────────────────────┐
               │ Check availableQuantity > 0             │
               │ Decrement availableQuantity by 1         │
               │ Set issuedTo = "Dharshini"               │
               │ Set status = "Unavailable" (if 0)        │
               │         else "Partially Available"      │
               └────────────────────┬────────────────────┘
                                    │
                                    ▼
                          [ STUDENT RETURN ITEM ]
                                    │
                                    ▼
                      POST /api/equipment/:id/return
                                    │
               ┌────────────────────┴────────────────────┐
               │ Check availableQuantity < quantity      │
               │ Increment availableQuantity by 1        │
               │ Unset/Remove issuedTo field             │
               │ Set status = "Available" (if equal)     │
               │         else "Partially Available"      │
               └─────────────────────────────────────────┘
```

---

## 10. Quick Start Guide

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Seed Sample Data
Make sure your MongoDB server is running on `127.0.0.1:27017`, then run:
```bash
npm run seed
```

### Step 3: Run Native MongoDB Shell Commands (Optional Practice)
To execute all MongoDB Shell queries natively:
```bash
mongosh mongodb/mongodb-commands.js
```

### Step 4: Start Backend API Server
Development Mode (with auto-reload):
```bash
npm run dev
```

Production Mode:
```bash
npm start
```

---

## 11. API Testing Examples

### 1. GET All Equipment
`GET http://localhost:5000/api/equipment`

### 2. Search Equipment by Name
`GET http://localhost:5000/api/equipment?search=Arduino`

### 3. Filter Equipment by Category & Lab
`GET http://localhost:5000/api/equipment?category=Electronics&labName=Electronics%20Lab`

### 4. Create New Equipment (`POST`)
`POST http://localhost:5000/api/equipment`  
**Headers:** `Content-Type: application/json`  
**Body:**
```json
{
  "equipmentName": "Logic Analyzer",
  "category": "Electronics",
  "labName": "Electronics Lab",
  "quantity": 10,
  "availableQuantity": 10,
  "condition": "Good",
  "status": "Available",
  "purchaseYear": 2024,
  "tags": ["testing", "digital", "signals"]
}
```

### 5. Issue Equipment to Student (`POST`)
`POST http://localhost:5000/api/equipment/<OBJECT_ID>/issue`  
**Body:**
```json
{
  "studentName": "Dharshini"
}
```

### 6. Return Borrowed Equipment (`POST`)
`POST http://localhost:5000/api/equipment/<OBJECT_ID>/return`
