"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getReportSummary = void 0;
const db_1 = __importDefault(require("../config/db"));
const getReportSummary = async (req, res) => {
    try {
        const totalProperties = await db_1.default.property.count();
        const totalEnquiries = await db_1.default.enquiry.count();
        const totalFollowUps = await db_1.default.followUp.count();
        const propertiesByStatus = await db_1.default.property.groupBy({
            by: ['status'],
            _count: true
        });
        res.json({
            summary: {
                totalProperties,
                totalEnquiries,
                totalFollowUps
            },
            propertiesByStatus
        });
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getReportSummary = getReportSummary;
