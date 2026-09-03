const mongoose = require('mongoose');
const Equipment = require('../models/Equipment');

exports.getAllEquipment = async (request, response) => {
    try {
        const { category, labName, status, condition, search } = request.query;
        let searchFilter = {};

        if (category) {
            searchFilter.category = category;
        }

        if (labName) {
            searchFilter.labName = labName;
        }

        if (status) {
            searchFilter.status = status;
        }

        if (condition) {
            searchFilter.condition = condition;
        }

        if (search) {
            searchFilter.equipmentName = { $regex: search, $options: 'i' };
        }

        const equipmentCatalog = await Equipment.find(searchFilter).sort({ createdAt: -1 });

        return response.status(200).json({
            success: true,
            count: equipmentCatalog.length,
            data: equipmentCatalog
        });
    } catch (serverError) {
        return response.status(500).json({
            success: false,
            message: `Server Error: ${serverError.message}`
        });
    }
};

exports.getEquipmentById = async (request, response) => {
    try {
        const { id: equipmentId } = request.params;

        if (!mongoose.Types.ObjectId.isValid(equipmentId)) {
            return response.status(400).json({
                success: false,
                message: 'Invalid Equipment ID format'
            });
        }

        const foundEquipment = await Equipment.findById(equipmentId);

        if (!foundEquipment) {
            return response.status(404).json({
                success: false,
                message: 'Equipment not found'
            });
        }

        return response.status(200).json({
            success: true,
            data: foundEquipment
        });
    } catch (serverError) {
        return response.status(500).json({
            success: false,
            message: `Server Error: ${serverError.message}`
        });
    }
};

exports.createEquipment = async (request, response) => {
    try {
        const {
            equipmentName,
            category,
            labName,
            quantity,
            availableQuantity,
            condition,
            status,
            issuedTo,
            purchaseYear,
            tags
        } = request.body;

        if (!equipmentName || !category || !labName || quantity === undefined || availableQuantity === undefined) {
            return response.status(400).json({
                success: false,
                message: 'Please provide all required fields: equipmentName, category, labName, quantity, availableQuantity'
            });
        }

        if (availableQuantity > quantity) {
            return response.status(400).json({
                success: false,
                message: 'Available quantity cannot exceed total quantity'
            });
        }

        const createdEquipment = await Equipment.create({
            equipmentName,
            category,
            labName,
            quantity,
            availableQuantity,
            condition,
            status,
            issuedTo,
            purchaseYear,
            tags
        });

        return response.status(201).json({
            success: true,
            message: 'Equipment created successfully',
            data: createdEquipment
        });
    } catch (serverError) {
        if (serverError.name === 'ValidationError') {
            const validationMessages = Object.values(serverError.errors).map(validationItem => validationItem.message);
            return response.status(400).json({
                success: false,
                message: validationMessages.join(', ')
            });
        }
        return response.status(500).json({
            success: false,
            message: `Server Error: ${serverError.message}`
        });
    }
};

exports.updateEquipment = async (request, response) => {
    try {
        const { id: equipmentId } = request.params;

        if (!mongoose.Types.ObjectId.isValid(equipmentId)) {
            return response.status(400).json({
                success: false,
                message: 'Invalid Equipment ID format'
            });
        }

        const foundEquipment = await Equipment.findById(equipmentId);

        if (!foundEquipment) {
            return response.status(404).json({
                success: false,
                message: 'Equipment not found'
            });
        }

        const desiredQuantity = request.body.quantity !== undefined ? request.body.quantity : foundEquipment.quantity;
        const desiredAvailable = request.body.availableQuantity !== undefined ? request.body.availableQuantity : foundEquipment.availableQuantity;

        if (desiredAvailable > desiredQuantity) {
            return response.status(400).json({
                success: false,
                message: 'Available quantity cannot exceed total quantity'
            });
        }

        const savedEquipment = await Equipment.findByIdAndUpdate(
            equipmentId,
            request.body,
            { new: true, runValidators: true }
        );

        return response.status(200).json({
            success: true,
            message: 'Equipment updated successfully',
            data: savedEquipment
        });
    } catch (serverError) {
        if (serverError.name === 'ValidationError') {
            const validationMessages = Object.values(serverError.errors).map(validationItem => validationItem.message);
            return response.status(400).json({
                success: false,
                message: validationMessages.join(', ')
            });
        }
        return response.status(500).json({
            success: false,
            message: `Server Error: ${serverError.message}`
        });
    }
};

exports.deleteEquipment = async (request, response) => {
    try {
        const { id: equipmentId } = request.params;

        if (!mongoose.Types.ObjectId.isValid(equipmentId)) {
            return response.status(400).json({
                success: false,
                message: 'Invalid Equipment ID format'
            });
        }

        const foundEquipment = await Equipment.findByIdAndDelete(equipmentId);

        if (!foundEquipment) {
            return response.status(404).json({
                success: false,
                message: 'Equipment not found'
            });
        }

        return response.status(200).json({
            success: true,
            message: 'Equipment deleted successfully',
            data: {}
        });
    } catch (serverError) {
        return response.status(500).json({
            success: false,
            message: `Server Error: ${serverError.message}`
        });
    }
};

exports.getHighQuantity = async (request, response) => {
    try {
        const equipmentCatalog = await Equipment.find({
            quantity: { $gt: 10 }
        });

        return response.status(200).json({
            success: true,
            operator: '$gt',
            description: 'Find equipment with total quantity greater than 10',
            count: equipmentCatalog.length,
            data: equipmentCatalog
        });
    } catch (serverError) {
        return response.status(500).json({
            success: false,
            message: `Server Error: ${serverError.message}`
        });
    }
};

exports.getLowAvailability = async (request, response) => {
    try {
        const equipmentCatalog = await Equipment.find({
            availableQuantity: { $lt: 5 }
        });

        return response.status(200).json({
            success: true,
            operator: '$lt',
            description: 'Find equipment where available quantity is less than 5',
            count: equipmentCatalog.length,
            data: equipmentCatalog
        });
    } catch (serverError) {
        return response.status(500).json({
            success: false,
            message: `Server Error: ${serverError.message}`
        });
    }
};

exports.getElectricalAndElectronics = async (request, response) => {
    try {
        const equipmentCatalog = await Equipment.find({
            category: { $in: ['Electrical', 'Electronics'] }
        });

        return response.status(200).json({
            success: true,
            operator: '$in',
            description: 'Find equipment belonging to Electrical or Electronics categories',
            count: equipmentCatalog.length,
            data: equipmentCatalog
        });
    } catch (serverError) {
        return response.status(500).json({
            success: false,
            message: `Server Error: ${serverError.message}`
        });
    }
};

exports.getAvailableElectronics = async (request, response) => {
    try {
        const equipmentCatalog = await Equipment.find({
            $and: [
                { labName: 'Electronics Lab' },
                { status: 'Available' }
            ]
        });

        return response.status(200).json({
            success: true,
            operator: '$and',
            description: 'Find equipment that is Available AND in Electronics Lab',
            count: equipmentCatalog.length,
            data: equipmentCatalog
        });
    } catch (serverError) {
        return response.status(500).json({
            success: false,
            message: `Server Error: ${serverError.message}`
        });
    }
};

exports.getMultipleLabs = async (request, response) => {
    try {
        const equipmentCatalog = await Equipment.find({
            $or: [
                { labName: 'Computer Lab' },
                { labName: 'Robotics Lab' }
            ]
        });

        return response.status(200).json({
            success: true,
            operator: '$or',
            description: 'Find equipment located in either Computer Lab OR Robotics Lab',
            count: equipmentCatalog.length,
            data: equipmentCatalog
        });
    } catch (serverError) {
        return response.status(500).json({
            success: false,
            message: `Server Error: ${serverError.message}`
        });
    }
};

exports.getIssuedEquipment = async (request, response) => {
    try {
        const equipmentCatalog = await Equipment.find({
            issuedTo: { $exists: true }
        });

        return response.status(200).json({
            success: true,
            operator: '$exists (true)',
            description: 'Find equipment documents where issuedTo exists (currently issued)',
            count: equipmentCatalog.length,
            data: equipmentCatalog
        });
    } catch (serverError) {
        return response.status(500).json({
            success: false,
            message: `Server Error: ${serverError.message}`
        });
    }
};

exports.getNotIssuedEquipment = async (request, response) => {
    try {
        const equipmentCatalog = await Equipment.find({
            issuedTo: { $exists: false }
        });

        return response.status(200).json({
            success: true,
            operator: '$exists (false)',
            description: 'Find equipment documents where issuedTo does not exist (in stock)',
            count: equipmentCatalog.length,
            data: equipmentCatalog
        });
    } catch (serverError) {
        return response.status(500).json({
            success: false,
            message: `Server Error: ${serverError.message}`
        });
    }
};

exports.issueEquipment = async (request, response) => {
    try {
        const { id: equipmentId } = request.params;
        const { studentName } = request.body;

        if (!mongoose.Types.ObjectId.isValid(equipmentId)) {
            return response.status(400).json({
                success: false,
                message: 'Invalid Equipment ID format'
            });
        }

        if (!studentName || studentName.trim() === '') {
            return response.status(400).json({
                success: false,
                message: 'Student name is required to issue equipment'
            });
        }

        const targetEquipment = await Equipment.findById(equipmentId);

        if (!targetEquipment) {
            return response.status(404).json({
                success: false,
                message: 'Equipment not found'
            });
        }

        if (targetEquipment.availableQuantity <= 0) {
            return response.status(400).json({
                success: false,
                message: 'Equipment is currently out of stock and cannot be issued'
            });
        }

        targetEquipment.availableQuantity -= 1;
        targetEquipment.issuedTo = studentName.trim();

        if (targetEquipment.availableQuantity === 0) {
            targetEquipment.status = 'Unavailable';
        } else {
            targetEquipment.status = 'Partially Available';
        }

        await targetEquipment.save();

        return response.status(200).json({
            success: true,
            message: `Equipment issued successfully to ${studentName}`,
            data: targetEquipment
        });
    } catch (serverError) {
        return response.status(500).json({
            success: false,
            message: `Server Error: ${serverError.message}`
        });
    }
};

exports.returnEquipment = async (request, response) => {
    try {
        const { id: equipmentId } = request.params;

        if (!mongoose.Types.ObjectId.isValid(equipmentId)) {
            return response.status(400).json({
                success: false,
                message: 'Invalid Equipment ID format'
            });
        }

        const targetEquipment = await Equipment.findById(equipmentId);

        if (!targetEquipment) {
            return response.status(404).json({
                success: false,
                message: 'Equipment not found'
            });
        }

        if (targetEquipment.availableQuantity >= targetEquipment.quantity) {
            return response.status(400).json({
                success: false,
                message: 'Equipment available quantity is already at maximum capacity'
            });
        }

        targetEquipment.availableQuantity += 1;
        targetEquipment.issuedTo = undefined;

        if (targetEquipment.availableQuantity === targetEquipment.quantity) {
            targetEquipment.status = 'Available';
        } else {
            targetEquipment.status = 'Partially Available';
        }

        await targetEquipment.save();

        return response.status(200).json({
            success: true,
            message: 'Equipment returned successfully',
            data: targetEquipment
        });
    } catch (serverError) {
        return response.status(500).json({
            success: false,
            message: `Server Error: ${serverError.message}`
        });
    }
};
