const express = require('express');
const equipmentRouter = express.Router();
const {
    getAllEquipment,
    getEquipmentById,
    createEquipment,
    updateEquipment,
    deleteEquipment,
    getHighQuantity,
    getLowAvailability,
    getElectricalAndElectronics,
    getAvailableElectronics,
    getMultipleLabs,
    getIssuedEquipment,
    getNotIssuedEquipment,
    issueEquipment,
    returnEquipment
} = require('../controllers/equipmentController');

equipmentRouter.get('/filter/high-quantity', getHighQuantity);
equipmentRouter.get('/filter/low-availability', getLowAvailability);
equipmentRouter.get('/filter/categories', getElectricalAndElectronics);
equipmentRouter.get('/filter/available-electronics', getAvailableElectronics);
equipmentRouter.get('/filter/multiple-labs', getMultipleLabs);
equipmentRouter.get('/filter/issued', getIssuedEquipment);
equipmentRouter.get('/filter/not-issued', getNotIssuedEquipment);

equipmentRouter.post('/:id/issue', issueEquipment);
equipmentRouter.post('/:id/return', returnEquipment);

equipmentRouter.get('/', getAllEquipment);
equipmentRouter.get('/:id', getEquipmentById);
equipmentRouter.post('/', createEquipment);
equipmentRouter.put('/:id', updateEquipment);
equipmentRouter.delete('/:id', deleteEquipment);

module.exports = equipmentRouter;
