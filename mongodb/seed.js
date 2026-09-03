const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '../backend/.env') });

const Equipment = require('../backend/models/Equipment');

const seedEquipmentCatalog = [
    {
        equipmentName: "Digital Multimeter",
        category: "Electrical",
        labName: "Electrical Lab",
        quantity: 15,
        availableQuantity: 12,
        condition: "Good",
        status: "Available",
        purchaseYear: 2022,
        tags: ["measuring", "voltage", "current"]
    },
    {
        equipmentName: "Oscilloscope",
        category: "Electronics",
        labName: "Electronics Lab",
        quantity: 8,
        availableQuantity: 3,
        condition: "Needs Maintenance",
        status: "Partially Available",
        issuedTo: "Prof. Sharma (ECE Dept)",
        purchaseYear: 2021,
        tags: ["waveform", "signals", "ece"]
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
        purchaseYear: 2020,
        tags: ["frequency", "signal-generator"]
    },
    {
        equipmentName: "Soldering Kit",
        category: "Electronics",
        labName: "Electronics Lab",
        quantity: 20,
        availableQuantity: 18,
        condition: "Good",
        status: "Available",
        purchaseYear: 2023,
        tags: ["soldering", "hardware", "pcb"]
    },
    {
        equipmentName: "Arduino Uno",
        category: "Robotics",
        labName: "Robotics Lab",
        quantity: 25,
        availableQuantity: 4,
        condition: "Good",
        status: "Partially Available",
        issuedTo: "Dharshini",
        purchaseYear: 2023,
        tags: ["microcontroller", "embedded", "iot"]
    },
    {
        equipmentName: "Raspberry Pi",
        category: "Computer",
        labName: "Computer Lab",
        quantity: 12,
        availableQuantity: 10,
        condition: "Good",
        status: "Available",
        purchaseYear: 2024,
        tags: ["linux", "single-board-computer", "python"]
    },
    {
        equipmentName: "Robotic Arm",
        category: "Robotics",
        labName: "Robotics Lab",
        quantity: 5,
        availableQuantity: 1,
        condition: "Needs Maintenance",
        status: "Partially Available",
        issuedTo: "Project Group 4",
        purchaseYear: 2022,
        tags: ["automation", "servo", "mechatronics"]
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
        purchaseYear: 2021,
        tags: ["additive-manufacturing", "prototype", "pla"]
    },
    {
        equipmentName: "Desktop Computer",
        category: "Computer",
        labName: "Computer Lab",
        quantity: 30,
        availableQuantity: 28,
        condition: "Good",
        status: "Available",
        purchaseYear: 2023,
        tags: ["workstation", "programming", "pc"]
    },
    {
        equipmentName: "Projector",
        category: "Computer",
        labName: "Computer Lab",
        quantity: 4,
        availableQuantity: 4,
        condition: "Good",
        status: "Available",
        purchaseYear: 2022,
        tags: ["display", "presentation", "av"]
    }
];

const seedDatabase = async () => {
    try {
        const databaseConnectionString = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/collegeLabDB';
        await mongoose.connect(databaseConnectionString);
        console.log(`Connected to MongoDB for seeding: ${databaseConnectionString}`);

        await Equipment.deleteMany({});
        console.log('Cleared existing equipment documents.');

        const insertedEquipmentList = await Equipment.insertMany(seedEquipmentCatalog);
        console.log(`Successfully seeded ${insertedEquipmentList.length} equipment documents into 'collegeLabDB.equipment'.`);

        mongoose.connection.close();
        console.log('Database connection closed.');
        process.exit(0);
    } catch (seedingError) {
        console.error(`Error seeding database: ${seedingError.message}`);
        process.exit(1);
    }
};

seedDatabase();
