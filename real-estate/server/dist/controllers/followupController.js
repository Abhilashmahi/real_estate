"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.toggleFollowup = exports.createFollowup = exports.getFollowups = void 0;
const db_1 = __importDefault(require("../config/db"));
const getFollowups = async (req, res) => {
    try {
        const followups = await db_1.default.followUp.findMany();
        res.json(followups);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.getFollowups = getFollowups;
const createFollowup = async (req, res) => {
    try {
        const followup = await db_1.default.followUp.create({ data: req.body });
        res.status(201).json(followup);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.createFollowup = createFollowup;
const toggleFollowup = async (req, res) => {
    const { id } = req.params;
    try {
        const check = await db_1.default.followUp.findUnique({ where: { id: parseInt(id) } });
        if (!check)
            return res.status(404).json({ message: 'Follow up not found.' });
        const followup = await db_1.default.followUp.update({
            where: { id: parseInt(id) },
            data: { completed: !check.completed }
        });
        res.json(followup);
    }
    catch (error) {
        res.status(500).json({ error: error.message });
    }
};
exports.toggleFollowup = toggleFollowup;
