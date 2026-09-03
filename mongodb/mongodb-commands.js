print("\n==================================================");
print("SECTION 1 — Database and Collection Setup");
print("==================================================");

db = db.getSiblingDB("collegeLabDB");
db.equipment.drop();
db.createCollection("equipment");

print("Current Database: " + db.getName());
print("Collections in Database:");
printjson(db.getCollectionNames());

print("\n==================================================");
print("SECTION 2 — Insert One Document (insertOne)");
print("==================================================");

const singleInsertResult = db.equipment.insertOne({
    equipmentName: "Digital Multimeter",
    category: "Electrical",
    labName: "Electrical Lab",
    quantity: 15,
    availableQuantity: 12,
    condition: "Good",
    status: "Available",
    purchaseYear: 2022
});

print("insertOne Result:");
printjson(singleInsertResult);

print("\n==================================================");
print("SECTION 3 — Insert Multiple Documents (insertMany)");
print("==================================================");

const bulkInsertResult = db.equipment.insertMany([
    {
        equipmentName: "Oscilloscope",
        category: "Electronics",
        labName: "Electronics Lab",
        quantity: 8,
        availableQuantity: 3,
        condition: "Needs Maintenance",
        status: "Partially Available",
        issuedTo: "Prof. Sharma (ECE Dept)",
        purchaseYear: 2021
    },
    {
        equipmentName: "Function Generator",
        category: "Electronics",
        labName: "Electronics Lab",
        quantity: 6,
        availableQuantity: 2,
        condition: "Damaged",
        status: "Unavailable",
        issuedTo: "Robotics Team",
        purchaseYear: 2020
    },
    {
        equipmentName: "Soldering Kit",
        category: "Electronics",
        labName: "Electronics Lab",
        quantity: 20,
        availableQuantity: 18,
        condition: "Good",
        status: "Available",
        purchaseYear: 2023
    },
    {
        equipmentName: "Arduino Uno",
        category: "Robotics",
        labName: "Robotics Lab",
        quantity: 25,
        availableQuantity: 4,
        condition: "Good",
        status: "Partially Available",
        issuedTo: "Batch B Students",
        purchaseYear: 2023
    },
    {
        equipmentName: "Raspberry Pi",
        category: "Computer",
        labName: "Computer Lab",
        quantity: 12,
        availableQuantity: 10,
        condition: "Good",
        status: "Available",
        purchaseYear: 2024
    },
    {
        equipmentName: "Robotic Kit",
        category: "Robotics",
        labName: "Robotics Lab",
        quantity: 5,
        availableQuantity: 1,
        condition: "Needs Maintenance",
        status: "Partially Available",
        issuedTo: "Project Group 4",
        purchaseYear: 2022
    },
    {
        equipmentName: "3D Printer",
        category: "Mechanical",
        labName: "Mechanical Lab",
        quantity: 2,
        availableQuantity: 0,
        condition: "Needs Maintenance",
        status: "Unavailable",
        issuedTo: "CAD Lab Assistant",
        purchaseYear: 2021
    },
    {
        equipmentName: "Desktop Computer",
        category: "Computer",
        labName: "Computer Lab",
        quantity: 30,
        availableQuantity: 28,
        condition: "Good",
        status: "Available",
        purchaseYear: 2023
    },
    {
        equipmentName: "Projector",
        category: "Computer",
        labName: "Computer Lab",
        quantity: 4,
        availableQuantity: 4,
        condition: "Good",
        status: "Available",
        purchaseYear: 2022
    },
    {
        equipmentName: "Breadboard",
        category: "Electrical",
        labName: "Electrical Lab",
        quantity: 50,
        availableQuantity: 45,
        condition: "Good",
        status: "Available",
        purchaseYear: 2024
    },
    {
        equipmentName: "Power Supply",
        category: "Electrical",
        labName: "Electrical Lab",
        quantity: 10,
        availableQuantity: 7,
        condition: "Good",
        status: "Available",
        issuedTo: "Electrical Lab Assistant",
        purchaseYear: 2022
    }
]);

print("insertMany Result Count: " + Object.keys(bulkInsertResult.insertedIds).length);
print("Total Documents in Collection: " + db.equipment.countDocuments());

print("\n==================================================");
print("SECTION 4 — Read Operations");
print("==================================================");

print("\n--- 4.1 All Equipment Documents ---");
printjson(db.equipment.find().toArray());

print("\n--- 4.2 findOne: Oscilloscope ---");
printjson(db.equipment.findOne({ equipmentName: "Oscilloscope" }));

print("\n--- 4.3 Equipment in Electronics Lab ---");
printjson(db.equipment.find({ labName: "Electronics Lab" }).toArray());

print("\n--- 4.4 Available Equipment ---");
printjson(db.equipment.find({ status: "Available" }).toArray());

print("\n--- 4.5 Equipment Needing Maintenance ---");
printjson(db.equipment.find({ condition: "Needs Maintenance" }).toArray());

print("\n==================================================");
print("SECTION 5 — Update One Document (updateOne)");
print("==================================================");

const singleUpdateResult = db.equipment.updateOne(
    { equipmentName: "Oscilloscope" },
    {
        $set: {
            condition: "Good",
            availableQuantity: 7,
            status: "Available"
        }
    }
);

print("updateOne Result:");
printjson(singleUpdateResult);

print("Updated Document (Oscilloscope):");
printjson(db.equipment.findOne({ equipmentName: "Oscilloscope" }));

print("\n==================================================");
print("SECTION 6 — Update Multiple Documents (updateMany)");
print("==================================================");

const bulkUpdateResult = db.equipment.updateMany(
    { availableQuantity: 0 },
    {
        $set: { status: "Unavailable" }
    }
);

print("updateMany Result:");
printjson(bulkUpdateResult);

print("Equipment marked Unavailable:");
printjson(db.equipment.find({ status: "Unavailable" }).toArray());

print("\n==================================================");
print("SECTION 7 — Delete One Document (deleteOne)");
print("==================================================");

const singleDeleteResult = db.equipment.deleteOne({ equipmentName: "Function Generator" });

print("deleteOne Result:");
printjson(singleDeleteResult);

print("Verify Deletion (Search Function Generator):");
printjson(db.equipment.findOne({ equipmentName: "Function Generator" }));

print("\n==================================================");
print("SECTION 8 — Delete All Documents (deleteMany)");
print("==================================================");

print("\n==================================================");
print("SECTION 9 — MongoDB Query Operators");
print("==================================================");

print("\n--- 9.1 $gt: Quantity > 10 ---");
printjson(db.equipment.find({
    quantity: { $gt: 10 }
}).toArray());

print("\n--- 9.2 $lt: Available Quantity < 5 ---");
printjson(db.equipment.find({
    availableQuantity: { $lt: 5 }
}).toArray());

print("\n--- 9.3 $in: Category in ['Electrical', 'Electronics'] ---");
printjson(db.equipment.find({
    category: { $in: ["Electrical", "Electronics"] }
}).toArray());

print("\n--- 9.4 $and: Available AND in Electronics Lab ---");
printjson(db.equipment.find({
    $and: [
        { status: "Available" },
        { labName: "Electronics Lab" }
    ]
}).toArray());

print("\n--- 9.5 $or: Lab is Electronics Lab OR Computer Lab ---");
printjson(db.equipment.find({
    $or: [
        { labName: "Electronics Lab" },
        { labName: "Computer Lab" }
    ]
}).toArray());

print("\n--- 9.6 $exists: true (issuedTo exists) ---");
printjson(db.equipment.find({
    issuedTo: { $exists: true }
}).toArray());

print("\n--- 9.7 $exists: false (issuedTo does not exist) ---");
printjson(db.equipment.find({
    issuedTo: { $exists: false }
}).toArray());

print("\n==================================================");
print("SECTION 10 — Real-World Academic Lab Workflow");
print("==================================================");

print("Workflow summary executed successfully.");
