# College Lab Equipment Management System

A beginner-friendly **Node.js + Express.js + Mongoose + MongoDB** REST API backend for managing college laboratory equipment assets. This project extends fundamental MongoDB Shell practice into a production-patterned web API featuring full CRUD functionality, operator filtering (`$gt`, `$lt`, `$in`, `$and`, `$or`, `$exists`), issue/return borrowing workflows, and input validation.

---

## 1. Objective

The primary objective of this course project is to demonstrate:
- Database connection management using **Mongoose** and **dotenv**.
- Structured backend architecture following the **MVC (Model-Controller-Route)** design pattern.
- Complete **RESTful CRUD operations** (Create, Read, Update, Delete).
- MongoDB query operators (`$gt`, `$lt`, `$in`, `$and`, `$or`, `$exists`) implemented as dedicated API endpoints.
- Academic laboratory equipment borrowing and return workflows with real-time stock validation.

---

## 2. Problem Statement

College laboratories store valuable hardware across multiple specialized labs (Electronics, Computer, Robotics, Electrical, Mechanical). Manual equipment tracking on paper registers leads to:
- **Missing Stock Visibility:** Inability to instantly verify whether items like Oscilloscopes or Arduinos are available or currently issued.
- **Quantity Discrepancies:** Unrecorded borrowing leading to negative or inaccurate stock counts.
- **Maintenance Neglect:** Equipment needing repair remaining marked as active stock.

This REST API provides a centralized MongoDB database system to track item quantities, location, condition, and student borrow logs accurately.

---

## 3. Key Features

- **Standard RESTful CRUD:** Create new equipment, read single/all items, update equipment details, and delete retired items.
- **Search & Dynamic Filters:** Search by name (case-insensitive regex) and filter by category, lab, availability status, or condition via query parameters (`?category=Electronics&search=Arduino`).
- **MongoDB Query Operator Endpoints:** Dedicated REST routes demonstrating `$gt`, `$lt`, `$in`, `$and`, `$or`, `$exists: true`, and `$exists: false`.
- **Equipment Issue & Return Logic:** `POST /api/equipment/:id/issue` (attaches student name & decrements available quantity) and `POST /api/equipment/:id/return` (increments available quantity & clears student name).
- **Validation & Error Handling:** Proper HTTP status codes (`200`, `201`, `400`, `404`, `500`), invalid ObjectId checks, and validation error messages.

---

## 4. Technology Stack

- **Runtime:** Node.js
- **Web Framework:** Express.js
- **Database:** MongoDB
- **ODM (Object Data Modeling):** Mongoose
- **Environment Management:** dotenv
- **Cross-Origin Resource Sharing:** cors
- **Development Tool:** nodemon

---

## 5. MongoDB Database Name

`collegeLabDB`

---

## 6. Collection Name

`equipment`

---

## 7. Mongoose Schema

Located at `backend/models/Equipment.js`:

```javascript
const equipmentSchema = new mongoose.Schema(
    {
        equipmentName: { type: String, required: true, trim: true },
        category: { type: String, required: true, trim: true },
        labName: { type: String, required: true, trim: true },
        quantity: { type: Number, required: true, min: 0 },
        availableQuantity: { type: Number, required: true, min: 0 },
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
        issuedTo: { type: String, trim: true }, // Optional field (omitted when unissued)
        purchaseYear: { type: Number },
        tags: [{ type: String, trim: true }]
    },
    { timestamps: true, collection: 'equipment' }
);
```

---

## 8. Project Folder Structure

```
college-lab-equipment/
│
├── backend/
│   ├── config/
│   │   └── db.js                 # Mongoose connection configuration
│   ├── models/
│   │   └── Equipment.js          # Mongoose Equipment schema
│   ├── controllers/
│   │   └── equipmentController.js # API business logic & query functions
│   ├── routes/
│   │   └── equipmentRoutes.js    # Express router endpoint definitions
│   ├── server.js                 # Main Express server entry point
│   └── .env                      # Environment variables (port, db uri)
│
├── mongodb/
│   ├── mongodb-commands.js       # MongoDB shell practice script
│   └── seed.js                   # Node.js database seeding script
│
├── README.md                     # Academic documentation & API guide
└── package.json                  # Dependencies & start scripts
```

---

## 9. API Endpoints Reference

### Standard CRUD & Filtering
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/equipment` | Get all equipment (Supports `?category=`, `?labName=`, `?status=`, `?condition=`, `?search=`) |
| `GET` | `/api/equipment/:id` | Get single equipment item by MongoDB ObjectId |
| `POST` | `/api/equipment` | Create a new equipment document |
| `PUT` | `/api/equipment/:id` | Update an existing equipment document |
| `DELETE` | `/api/equipment/:id` | Delete an equipment document |

### MongoDB Query Operator Endpoints
| Method | Endpoint | Operator | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/equipment/filter/high-quantity` | `$gt` | Find items with `quantity > 10` |
| `GET` | `/api/equipment/filter/low-availability` | `$lt` | Find items with `availableQuantity < 5` |
| `GET` | `/api/equipment/filter/categories` | `$in` | Find items in Electrical or Electronics categories |
| `GET` | `/api/equipment/filter/available-electronics` | `$and` | Find items in `Electronics Lab` AND status `Available` |
| `GET` | `/api/equipment/filter/multiple-labs` | `$or` | Find items in `Computer Lab` OR `Robotics Lab` |
| `GET` | `/api/equipment/filter/issued` | `$exists: true` | Find equipment documents where `issuedTo` exists |
| `GET` | `/api/equipment/filter/not-issued` | `$exists: false` | Find equipment documents where `issuedTo` does NOT exist |

### Issue & Return Business Logic
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/equipment/:id/issue` | Decrement `availableQuantity`, assign `issuedTo`, update status |
| `POST` | `/api/equipment/:id/return` | Increment `availableQuantity`, clear `issuedTo`, update status |

---

## 10. CRUD Explanation

- **Create (`POST /api/equipment`):** Inserts a new document into `collegeLabDB.equipment`. Validates that required fields are present and `availableQuantity <= quantity`.
- **Read (`GET /api/equipment` & `GET /api/equipment/:id`):** Retrieves all documents or a specific document matching the `_id`. Supports text regex search and field filters.
- **Update (`PUT /api/equipment/:id`):** Updates specific fields of an existing document using `findByIdAndUpdate()`.
- **Delete (`DELETE /api/equipment/:id`):** Permanently removes a document from the database using `findByIdAndDelete()`.

---

## 11. MongoDB Query Operators Explanation

1. **`$gt` (Greater Than):** `Equipment.find({ quantity: { $gt: 10 } })` returns high-stock inventory items.
2. **`$lt` (Less Than):** `Equipment.find({ availableQuantity: { $lt: 5 } })` alerts lab assistants to low-stock items needing restock.
3. **`$in` (In Array):** `Equipment.find({ category: { $in: ["Electrical", "Electronics"] } })` filters by multiple category values.
4. **`$and` (Logical AND):** `Equipment.find({ $and: [{ labName: "Electronics Lab" }, { status: "Available" }] })` enforces both conditions simultaneously.
5. **`$or` (Logical OR):** `Equipment.find({ $or: [{ labName: "Computer Lab" }, { labName: "Robotics Lab" }] })` matches items in either laboratory.
6. **`$exists` (Field Existence):**
   - `{ issuedTo: { $exists: true } }`: Retrieves equipment currently borrowed by students.
   - `{ issuedTo: { $exists: false } }`: Retrieves equipment currently unassigned in stock.

---

## 12. Issue / Return Workflow

```
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

## 13. Installation Steps

1. Clone or download the repository into your project directory.
2. Open terminal in the project root:
   ```bash
   cd college-lab-equipment
   ```
3. Install dependencies:
   ```bash
   npm install
   ```

---

## 14. How to Start MongoDB

Make sure your MongoDB server daemon is running on your machine:
```bash
# Verify MongoDB status or start daemon (Windows/Linux/macOS)
mongod
```

To seed sample data into MongoDB:
```bash
npm run seed
```

---

## 15. How to Start the Backend Server

### Development Mode (with automatic reload via nodemon):
```bash
npm run dev
```

### Production Mode:
```bash
npm start
```

The console will display:
```
Server running on port 5000
MongoDB connected successfully: 127.0.0.1
```

---

## 16. API Testing Examples

### 1. GET All Equipment (Browser / Postman / cURL)
`GET http://localhost:5000/api/equipment`

### 2. Search Equipment by Name
`GET http://localhost:5000/api/equipment?search=Arduino`

### 3. Filter Equipment by Category & Lab
`GET http://localhost:5000/api/equipment?category=Electronics&labName=Electronics%20Lab`

### 4. POST Create Equipment (Postman / Thunder Client)
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

### 5. PUT Update Equipment
`PUT http://localhost:5000/api/equipment/<OBJECT_ID>`  
**Body:**
```json
{
  "condition": "Needs Maintenance",
  "availableQuantity": 5
}
```

### 6. POST Issue Equipment
`POST http://localhost:5000/api/equipment/<OBJECT_ID>/issue`  
**Body:**
```json
{
  "studentName": "Dharshini"
}
```

### 7. POST Return Equipment
`POST http://localhost:5000/api/equipment/<OBJECT_ID>/return`

---

## 17. Future Enhancements

- Add JWT-based User Authentication (Admin vs Student roles).
- Implement QR code scanning for quick equipment checkout.
- Add borrowing history log with timestamped checkout/return history.
- Integrate email notifications for overdue equipment returns.
