import { Request, Response } from 'express';
import prisma from '../config/db';

export const getFollowups = async (req: Request, res: Response) => {
  try {
    const followups = await prisma.followUp.findMany();
    res.json(followups);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createFollowup = async (req: Request, res: Response) => {
  try {
    const followup = await prisma.followUp.create({ data: req.body });
    res.status(201).json(followup);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const toggleFollowup = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const check = await prisma.followUp.findUnique({ where: { id: parseInt(id) } });
    if (!check) return res.status(404).json({ message: 'Follow up not found.' });
    
    const followup = await prisma.followUp.update({
      where: { id: parseInt(id) },
      data: { completed: !check.completed }
    });
    res.json(followup);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
