import { Response } from 'express';
import prisma from '../config/db';

export const getEnquiries = async (req: any, res: Response) => {
  const role = req.user.role;
  try {
    if (role === 'admin') {
      const enquiries = await prisma.enquiry.findMany({
        include: {
          customer: { select: { fullName: true, email: true, mobile: true } },
          property: true
        }
      });
      const mapped = enquiries.map((e: any) => ({
        ...e,
        customer: e.customer ? {
          name: e.customer.fullName,
          email: e.customer.email,
          phone: e.customer.mobile
        } : null
      }));
      res.json(mapped);
    } else {
      const customerId = req.user.id;
      const enquiries = await prisma.enquiry.findMany({
        where: { customerId },
        include: { property: true }
      });
      res.json(enquiries);
    }
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const getEnquiry = async (req: any, res: Response) => {
  const { id } = req.params;
  try {
    const enquiry = await prisma.enquiry.findUnique({
      where: { id: parseInt(id) },
      include: { property: true }
    });
    if (!enquiry) return res.status(404).json({ message: 'Enquiry not found.' });
    res.json(enquiry);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const createEnquiry = async (req: any, res: Response) => {
  try {
    const { name, email, phone, mobile, property, type, notes, message, remarks, status, propertyId } = req.body;
    const customerId = req.user.role === 'customer' ? req.user.id : null;

    let propId = propertyId ? parseInt(propertyId) : null;
    let propTitle = property || type || 'General Inquiry';

    if (propId) {
      const p = await prisma.property.findUnique({ where: { id: propId } });
      if (p) {
        propTitle = p.title;
      }
    }

    const enquiry = await prisma.enquiry.create({
      data: {
        customerId,
        name: name || req.user.name || '',
        email: email || req.user.email || '',
        phone: phone || mobile || req.user.phone || '',
        propertyId: propId,
        propertyName: propTitle,
        notes: notes || message || remarks || '',
        status: status || 'New'
      }
    });
    res.status(201).json(enquiry);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateEnquiryStatus = async (req: any, res: Response) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const enquiry = await prisma.enquiry.update({
      where: { id: parseInt(id) },
      data: { status }
    });
    res.json(enquiry);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const updateEnquiry = async (req: any, res: Response) => {
  const { id } = req.params;
  try {
    const { name, email, phone, mobile, property, type, notes, message, remarks, status } = req.body;
    const enquiry = await prisma.enquiry.update({
      where: { id: parseInt(id) },
      data: {
        name,
        email,
        phone: phone || mobile,
        propertyName: property || type,
        notes: notes || message || remarks,
        status
      }
    });
    res.json(enquiry);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteEnquiry = async (req: any, res: Response) => {
  const { id } = req.params;
  try {
    await prisma.enquiry.delete({ where: { id: parseInt(id) } });
    res.json({ message: 'Enquiry deleted successfully.' });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
};
