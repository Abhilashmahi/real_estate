import { Request, Response } from 'express';
import prisma from '../config/db';

export const getReportSummary = async (req: Request, res: Response) => {
  try {
    const totalProperties = await prisma.property.count();
    const totalEnquiries = await prisma.enquiry.count();
    const totalFollowUps = await prisma.followUp.count();
    const totalCustomers = await prisma.customer.count();
    
    const propertiesByStatus = await prisma.property.groupBy({
      by: ['status'],
      _count: true
    });
    
    res.json({
      summary: {
        totalProperties,
        totalEnquiries,
        totalFollowUps,
        totalCustomers
      },
      propertiesByStatus
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
