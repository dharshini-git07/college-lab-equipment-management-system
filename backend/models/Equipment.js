const mongoose = require('mongoose');

const labEquipmentSchema = new mongoose.Schema(
    {
        equipmentName: {
            type: String,
            required: [true, 'Equipment name is required'],
            trim: true
        },
        category: {
            type: String,
            required: [true, 'Category is required'],
            trim: true
        },
        labName: {
            type: String,
            required: [true, 'Lab name is required'],
            trim: true
        },
        quantity: {
            type: Number,
            required: [true, 'Quantity is required'],
            min: [0, 'Quantity cannot be negative']
        },
        availableQuantity: {
            type: Number,
            required: [true, 'Available quantity is required'],
            min: [0, 'Available quantity cannot be negative']
        },
        condition: {
            type: String,
            enum: {
                values: ['Good', 'Needs Maintenance', 'Damaged'],
                message: 'Condition must be Good, Needs Maintenance, or Damaged'
            },
            default: 'Good'
        },
        status: {
            type: String,
            enum: {
                values: ['Available', 'Partially Available', 'Unavailable'],
                message: 'Status must be Available, Partially Available, or Unavailable'
            },
            default: 'Available'
        },
        issuedTo: {
            type: String,
            trim: true
        },
        purchaseYear: {
            type: Number
        },
        tags: [
            {
                type: String,
                trim: true
            }
        ]
    },
    {
        timestamps: true,
        collection: 'equipment'
    }
);

module.exports = mongoose.model('Equipment', labEquipmentSchema);
