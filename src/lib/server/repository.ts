// Server-side Data Repository for Municipal Equipment Management System
// Acts as an abstraction layer ready to be connected with Prisma / PostgreSQL / MySQL / SQLite

import {
  User,
  Category,
  Material,
  ActivityLog,
  mockUsers,
  mockCategories,
  mockMaterials,
  mockApprovals,
  mockActivityLogs,
} from '@/app/data/mockData';
import {
  CreateUserDto,
  UpdateUserDto,
  CreateCategoryDto,
  UpdateCategoryDto,
  CreateMaterialDto,
  UpdateMaterialDto,
  CreateRequestDto,
  ProcessReturnDto,
  CreateActivityLogDto,
  RequestStatus,
  RequestType,
} from '../types/api';
import { EnhancedRequest, ReturnRecord } from '@/app/data/store';

// Global in-memory storage (persists across API calls in the Node.js process)
declare global {
  // eslint-disable-next-line no-var
  var __municipalServerDb:
    | {
        users: User[];
        categories: Category[];
        materials: Material[];
        requests: EnhancedRequest[];
        returnRecords: ReturnRecord[];
        activityLogs: ActivityLog[];
      }
    | undefined;
}

function initInitialRequests(): EnhancedRequest[] {
  return mockApprovals.map((a, index) => {
    const isBorrow = index % 2 === 1;
    const statusMap: Record<string, RequestStatus> = {
      'รออนุมัติ': 'รออนุมัติ',
      'อนุมัติแล้ว': isBorrow ? 'กำลังยืม' : 'อนุมัติแล้ว',
      'ไม่อนุมัติ': 'ไม่อนุมัติ',
    };

    return {
      id: a.id,
      requestCode: a.requestCode,
      requestType: isBorrow ? 'ยืมวัสดุ' : 'เบิกวัสดุ',
      requesterId: '2',
      requesterName: a.requesterName,
      department: a.department,
      materialId: String((index % 5) + 1),
      materialCode: `MAT-00${(index % 5) + 1}`,
      materialName: a.materialName,
      quantity: a.quantity,
      unit: a.unit,
      reason: a.reason,
      status: statusMap[a.status] || 'รออนุมัติ',
      requestDate: a.requestDate,
      borrowDate: isBorrow ? a.requestDate : undefined,
      expectedReturnDate: isBorrow ? '25 ส.ค. 2569' : undefined,
      approvedBy: a.approvedBy,
      approvedDate: a.approvedDate,
      rejectReason: a.status === 'ไม่อนุมัติ' ? 'จำนวนสต็อกไม่เพียงพอต่อการใช้งานของโครงการ' : null,
    };
  });
}

function getDatabase() {
  if (!global.__municipalServerDb) {
    global.__municipalServerDb = {
      users: [...mockUsers],
      categories: [...mockCategories],
      materials: [...mockMaterials],
      requests: initInitialRequests(),
      returnRecords: [
        {
          id: 'RET-001',
          requestId: '99',
          requestCode: 'REQ-2569-0099',
          materialName: 'ท่อ PVC 4 นิ้ว',
          borrowerName: 'วันทนา สุขกมล',
          department: 'สำนักปลัด',
          borrowedQuantity: 5,
          returnedQuantity: 5,
          returnDate: '15 ส.ค. 2569',
          condition: 'สมบูรณ์',
          receivedBy: 'สมชาย ใจดี',
          notes: 'อุปกรณ์อยู่ในสภาพสมบูรณ์ พร้อมใช้งาน',
        },
      ],
      activityLogs: [...mockActivityLogs],
    };
  }
  return global.__municipalServerDb;
}

export const serverRepository = {
  // ==========================================
  // USERS
  // ==========================================
  getUsers(query?: { search?: string; role?: string; department?: string }) {
    const db = getDatabase();
    let result = [...db.users];

    if (query?.search) {
      const s = query.search.toLowerCase();
      result = result.filter(
        (u) =>
          u.fullName.toLowerCase().includes(s) ||
          u.username.toLowerCase().includes(s) ||
          u.email.toLowerCase().includes(s)
      );
    }
    if (query?.role) {
      result = result.filter((u) => u.role === query.role);
    }
    if (query?.department) {
      result = result.filter((u) => u.department === query.department);
    }

    return result;
  },

  getUserById(id: string) {
    const db = getDatabase();
    return db.users.find((u) => u.id === id) || null;
  },

  getUserByUsername(username: string) {
    const db = getDatabase();
    const query = username.trim().toLowerCase();
    
    // 1. Exact Email Match
    let found = db.users.find((u) => u.email.toLowerCase() === query);
    if (found) return found;

    // 2. Exact Username Match
    found = db.users.find((u) => u.username.toLowerCase() === query);
    if (found) return found;

    // 3. Active Role Match
    if (query === 'admin' || query.startsWith('admin@')) {
      return db.users.find((u) => u.role === 'ผู้ดูแลระบบ' && u.status === 'ใช้งาน') || null;
    }
    if (query === 'approver' || query.startsWith('approver@')) {
      return db.users.find((u) => u.role === 'ผู้อนุมัติ' && u.status === 'ใช้งาน') || null;
    }
    if (query === 'staff' || query.startsWith('staff@')) {
      return db.users.find((u) => u.role === 'เจ้าหน้าที่' && u.status === 'ใช้งาน') || null;
    }

    return null;
  },

  getUserByUsernameOrEmail(identifier: string) {
    return this.getUserByUsername(identifier);
  },

  createUser(dto: CreateUserDto) {
    const db = getDatabase();
    const newUser: User = {
      id: String(Date.now()),
      fullName: dto.fullName,
      username: dto.username,
      email: dto.email,
      department: dto.department,
      role: dto.role,
      status: dto.status || 'ใช้งาน',
      phone: dto.phone || '-',
      avatar: dto.fullName.slice(0, 2),
      lastLogin: '-',
      createdAt: new Date().toISOString().split('T')[0],
    };
    db.users.unshift(newUser);

    this.createActivityLog({
      userName: 'ระบบ',
      action: 'เพิ่มผู้ใช้',
      description: `เพิ่มผู้ใช้ใหม่: ${newUser.fullName} (${newUser.role}) แผนก ${newUser.department}`,
      module: 'ผู้ใช้งาน',
      type: 'สร้าง',
    });

    return newUser;
  },

  updateUser(id: string, dto: UpdateUserDto) {
    const db = getDatabase();
    const idx = db.users.findIndex((u) => u.id === id);
    if (idx === -1) return null;

    db.users[idx] = {
      ...db.users[idx],
      ...dto,
    };

    this.createActivityLog({
      userName: 'ระบบ',
      action: 'แก้ไขข้อมูลผู้ใช้',
      description: `แก้ไขข้อมูลผู้ใช้: ${db.users[idx].fullName}`,
      module: 'ผู้ใช้งาน',
      type: 'แก้ไข',
    });

    return db.users[idx];
  },

  deleteUser(id: string) {
    const db = getDatabase();
    const idx = db.users.findIndex((u) => u.id === id);
    if (idx === -1) return false;

    const removed = db.users.splice(idx, 1)[0];
    this.createActivityLog({
      userName: 'ระบบ',
      action: 'ลบผู้ใช้',
      description: `ลบผู้ใช้: ${removed.fullName}`,
      module: 'ผู้ใช้งาน',
      type: 'ลบ',
    });
    return true;
  },

  // ==========================================
  // CATEGORIES
  // ==========================================
  getCategories() {
    const db = getDatabase();
    // Dynamically update itemCount based on current materials
    return db.categories.map((c) => ({
      ...c,
      itemCount: db.materials.filter((m) => m.categoryId === c.id || m.categoryName === c.name).length,
    }));
  },

  getCategoryById(id: string) {
    const db = getDatabase();
    const cat = db.categories.find((c) => c.id === id);
    if (!cat) return null;
    return {
      ...cat,
      itemCount: db.materials.filter((m) => m.categoryId === cat.id || m.categoryName === cat.name).length,
    };
  },

  createCategory(dto: CreateCategoryDto) {
    const db = getDatabase();
    const newCat: Category = {
      id: String(Date.now()),
      name: dto.name,
      description: dto.description || '',
      icon: dto.icon || '📦',
      itemCount: 0,
      status: dto.status || 'ใช้งาน',
      createdAt: new Date().toISOString().split('T')[0],
    };
    db.categories.push(newCat);

    this.createActivityLog({
      userName: 'ระบบ',
      action: 'เพิ่มหมวดหมู่',
      description: `เพิ่มหมวดหมู่ใหม่: ${newCat.name}`,
      module: 'หมวดหมู่',
      type: 'สร้าง',
    });

    return newCat;
  },

  updateCategory(id: string, dto: UpdateCategoryDto) {
    const db = getDatabase();
    const idx = db.categories.findIndex((c) => c.id === id);
    if (idx === -1) return null;

    db.categories[idx] = {
      ...db.categories[idx],
      ...dto,
    };

    this.createActivityLog({
      userName: 'ระบบ',
      action: 'แก้ไขหมวดหมู่',
      description: `แก้ไขข้อมูลหมวดหมู่: ${db.categories[idx].name}`,
      module: 'หมวดหมู่',
      type: 'แก้ไข',
    });

    return db.categories[idx];
  },

  deleteCategory(id: string) {
    const db = getDatabase();
    const idx = db.categories.findIndex((c) => c.id === id);
    if (idx === -1) return false;

    const removed = db.categories.splice(idx, 1)[0];
    this.createActivityLog({
      userName: 'ระบบ',
      action: 'ลบหมวดหมู่',
      description: `ลบหมวดหมู่: ${removed.name}`,
      module: 'หมวดหมู่',
      type: 'ลบ',
    });
    return true;
  },

  // ==========================================
  // MATERIALS
  // ==========================================
  getMaterials(query?: { search?: string; categoryId?: string; status?: string }) {
    const db = getDatabase();
    let result = [...db.materials];

    if (query?.search) {
      const s = query.search.toLowerCase();
      result = result.filter(
        (m) =>
          m.name.toLowerCase().includes(s) ||
          m.code.toLowerCase().includes(s) ||
          m.categoryName.toLowerCase().includes(s) ||
          m.location.toLowerCase().includes(s)
      );
    }
    if (query?.categoryId) {
      result = result.filter((m) => m.categoryId === query.categoryId);
    }
    if (query?.status) {
      result = result.filter((m) => m.status === query.status);
    }

    return result;
  },

  getMaterialById(id: string) {
    const db = getDatabase();
    return db.materials.find((m) => m.id === id) || null;
  },

  createMaterial(dto: CreateMaterialDto) {
    const db = getDatabase();
    const qty = Number(dto.quantity) || 0;
    const minQty = Number(dto.minQuantity) || 10;
    const price = Number(dto.pricePerUnit) || 0;

    let catName = dto.categoryName;
    if (!catName && dto.categoryId) {
      const cat = db.categories.find((c) => c.id === dto.categoryId);
      catName = cat?.name || 'ทั่วไป';
    }

    const status: Material['status'] =
      qty === 0 ? 'หมดสต็อก' : qty <= minQty ? 'ใกล้หมด' : 'มีสต็อก';

    const newMat: Material = {
      id: String(Date.now()),
      code: dto.code,
      name: dto.name,
      categoryId: dto.categoryId,
      categoryName: catName || 'ทั่วไป',
      unit: dto.unit,
      quantity: qty,
      minQuantity: minQty,
      pricePerUnit: price,
      totalValue: qty * price,
      location: dto.location || 'โกดังกลาง',
      status,
      lastUpdated: new Date().toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
      description: dto.description || '',
    };

    db.materials.unshift(newMat);

    this.createActivityLog({
      userName: 'ระบบ',
      action: 'เพิ่มวัสดุ',
      description: `เพิ่มวัสดุใหม่: ${newMat.name} (${newMat.code}) จำนวน ${qty} ${newMat.unit}`,
      module: 'วัสดุ',
      type: 'สร้าง',
    });

    return newMat;
  },

  updateMaterial(id: string, dto: UpdateMaterialDto) {
    const db = getDatabase();
    const idx = db.materials.findIndex((m) => m.id === id);
    if (idx === -1) return null;

    const existing = db.materials[idx];
    const qty = dto.quantity !== undefined ? Number(dto.quantity) : existing.quantity;
    const minQty = dto.minQuantity !== undefined ? Number(dto.minQuantity) : existing.minQuantity;
    const price = dto.pricePerUnit !== undefined ? Number(dto.pricePerUnit) : existing.pricePerUnit;

    const status: Material['status'] =
      qty === 0 ? 'หมดสต็อก' : qty <= minQty ? 'ใกล้หมด' : 'มีสต็อก';

    let catName = dto.categoryName || existing.categoryName;
    if (dto.categoryId && dto.categoryId !== existing.categoryId) {
      const cat = db.categories.find((c) => c.id === dto.categoryId);
      if (cat) catName = cat.name;
    }

    db.materials[idx] = {
      ...existing,
      ...dto,
      categoryName: catName,
      quantity: qty,
      minQuantity: minQty,
      pricePerUnit: price,
      totalValue: qty * price,
      status,
      lastUpdated: new Date().toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      }),
    };

    this.createActivityLog({
      userName: 'ระบบ',
      action: 'แก้ไขวัสดุ',
      description: `แก้ไขข้อมูลวัสดุ: ${db.materials[idx].name}`,
      module: 'วัสดุ',
      type: 'แก้ไข',
    });

    return db.materials[idx];
  },

  deleteMaterial(id: string) {
    const db = getDatabase();
    const idx = db.materials.findIndex((m) => m.id === id);
    if (idx === -1) return false;

    const removed = db.materials.splice(idx, 1)[0];
    this.createActivityLog({
      userName: 'ระบบ',
      action: 'ลบวัสดุ',
      description: `ลบวัสดุ: ${removed.name} (${removed.code})`,
      module: 'วัสดุ',
      type: 'ลบ',
    });
    return true;
  },

  restockMaterial(id: string, addQty: number, reason: string, userName?: string) {
    const db = getDatabase();
    const mat = db.materials.find((m) => m.id === id);
    if (!mat) return null;

    const newQty = mat.quantity + addQty;
    const status: Material['status'] =
      newQty === 0 ? 'หมดสต็อก' : newQty <= mat.minQuantity ? 'ใกล้หมด' : 'มีสต็อก';

    mat.quantity = newQty;
    mat.totalValue = newQty * mat.pricePerUnit;
    mat.status = status;
    mat.lastUpdated = new Date().toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    this.createActivityLog({
      userName: userName || 'ผู้ดูแลระบบ',
      action: 'เติมสต็อก',
      description: `เติมสต็อก ${mat.name} จำนวน +${addQty} ${mat.unit} (เหตุผล: ${reason})`,
      module: 'คลังสินค้า',
      type: 'แก้ไข',
    });

    return mat;
  },

  // ==========================================
  // REQUESTS (Requisition & Borrow)
  // ==========================================
  getRequests(query?: { requesterId?: string; status?: string; type?: RequestType }) {
    const db = getDatabase();
    let result = [...db.requests];

    if (query?.requesterId) {
      result = result.filter((r) => r.requesterId === query.requesterId);
    }
    if (query?.status) {
      result = result.filter((r) => r.status === query.status);
    }
    if (query?.type) {
      result = result.filter((r) => r.requestType === query.type);
    }

    return result;
  },

  getRequestById(id: string) {
    const db = getDatabase();
    return db.requests.find((r) => r.id === id) || null;
  },

  createRequest(dto: CreateRequestDto) {
    const db = getDatabase();
    const mat = db.materials.find((m) => m.id === dto.materialId);

    // If stock validation needed
    if (mat && mat.quantity < dto.quantity) {
      throw new Error(`สต็อกคงเหลือไม่เพียงพอ (มีคงเหลือ ${mat.quantity} ${mat.unit})`);
    }

    const reqNum = db.requests.length + 1;
    const padNum = String(reqNum).padStart(4, '0');
    const user = db.users.find((u) => u.id === dto.requesterId);

    const nowTh = new Date().toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    const newReq: EnhancedRequest = {
      id: String(Date.now()),
      requestCode: `REQ-2569-${padNum}`,
      requestType: dto.requestType,
      requesterId: dto.requesterId,
      requesterName: dto.requesterName || user?.fullName || 'เจ้าหน้าที่',
      department: dto.department || user?.department || 'สำนักปลัด',
      materialId: dto.materialId,
      materialCode: mat?.code || '',
      materialName: mat?.name || 'วัสดุ',
      quantity: dto.quantity,
      unit: mat?.unit || 'ชิ้น',
      reason: dto.reason,
      status: 'รออนุมัติ',
      requestDate: nowTh,
      borrowDate: dto.borrowDate,
      expectedReturnDate: dto.expectedReturnDate,
    };

    db.requests.unshift(newReq);

    this.createActivityLog({
      userName: newReq.requesterName,
      action: dto.requestType === 'ยืมวัสดุ' ? 'ส่งคำขอยืม' : 'ส่งคำขอเบิก',
      description: `${newReq.requesterName} ส่งคำขอ ${dto.requestType}: ${newReq.materialName} จำนวน ${dto.quantity} ${newReq.unit}`,
      module: 'การอนุมัติ',
      type: 'สร้าง',
    });

    return newReq;
  },

  approveRequest(id: string, approverName?: string) {
    const db = getDatabase();
    const req = db.requests.find((r) => r.id === id);
    if (!req) return null;

    // Deduct stock
    const mat = db.materials.find((m) => m.id === req.materialId || m.name === req.materialName);
    if (mat) {
      const newQty = Math.max(0, mat.quantity - req.quantity);
      mat.quantity = newQty;
      mat.totalValue = newQty * mat.pricePerUnit;
      mat.status = newQty === 0 ? 'หมดสต็อก' : newQty <= mat.minQuantity ? 'ใกล้หมด' : 'มีสต็อก';
      mat.lastUpdated = new Date().toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }

    const nowTh = new Date().toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    req.status = req.requestType === 'ยืมวัสดุ' ? 'กำลังยืม' : 'อนุมัติแล้ว';
    req.approvedBy = approverName || 'ผู้อนุมัติ';
    req.approvedDate = nowTh;

    this.createActivityLog({
      userName: req.approvedBy,
      action: 'อนุมัติคำขอ',
      description: `อนุมัติคำขอ ${req.requestCode} (${req.requestType}) ของ ${req.requesterName} รายการ: ${req.materialName}`,
      module: 'การอนุมัติ',
      type: 'อนุมัติ',
    });

    return req;
  },

  rejectRequest(id: string, reason: string, approverName?: string) {
    const db = getDatabase();
    const req = db.requests.find((r) => r.id === id);
    if (!req) return null;

    const nowTh = new Date().toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    req.status = 'ไม่อนุมัติ';
    req.rejectReason = reason;
    req.approvedBy = approverName || 'ผู้อนุมัติ';
    req.approvedDate = nowTh;

    this.createActivityLog({
      userName: req.approvedBy,
      action: 'ไม่อนุมัติคำขอ',
      description: `ไม่อนุมัติคำขอ ${req.requestCode} เหตุผล: ${reason}`,
      module: 'การอนุมัติ',
      type: 'อนุมัติ',
    });

    return req;
  },

  cancelRequest(id: string, cancellerName?: string) {
    const db = getDatabase();
    const req = db.requests.find((r) => r.id === id);
    if (!req) return null;

    const nowTh = new Date().toLocaleDateString('th-TH', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });

    req.status = 'ยกเลิกแล้ว';
    req.cancelledBy = cancellerName || req.requesterName;
    req.cancelledDate = nowTh;

    this.createActivityLog({
      userName: req.cancelledBy,
      action: 'ยกเลิกคำขอ',
      description: `ยกเลิกคำขอ ${req.requestCode} โดย ${req.cancelledBy}`,
      module: 'การอนุมัติ',
      type: 'แก้ไข',
    });

    return req;
  },

  // ==========================================
  // RETURNS
  // ==========================================
  getReturnRecords() {
    const db = getDatabase();
    return db.returnRecords;
  },

  processReturn(dto: ProcessReturnDto) {
    const db = getDatabase();
    const req = db.requests.find((r) => r.id === dto.requestId);
    if (!req) return null;

    // Restore stock
    const mat = db.materials.find((m) => m.id === req.materialId || m.name === req.materialName);
    if (mat) {
      const newQty = mat.quantity + dto.returnedQuantity;
      mat.quantity = newQty;
      mat.totalValue = newQty * mat.pricePerUnit;
      mat.status = newQty === 0 ? 'หมดสต็อก' : newQty <= mat.minQuantity ? 'ใกล้หมด' : 'มีสต็อก';
      mat.lastUpdated = new Date().toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });
    }

    const returnDate =
      dto.returnDate ||
      new Date().toLocaleDateString('th-TH', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      });

    const returnRecord: ReturnRecord = {
      id: `RET-${Date.now().toString().slice(-4)}`,
      requestId: req.id,
      requestCode: req.requestCode,
      materialName: req.materialName,
      borrowerName: req.requesterName,
      department: req.department,
      borrowedQuantity: req.quantity,
      returnedQuantity: dto.returnedQuantity,
      returnDate,
      condition: dto.condition,
      receivedBy: dto.receivedByName || 'ผู้ดูแลระบบ',
      notes: dto.notes || '',
    };

    db.returnRecords.unshift(returnRecord);

    req.status = 'คืนแล้ว';
    req.actualReturnDate = returnDate;
    req.returnedQuantity = dto.returnedQuantity;
    req.returnCondition = dto.condition;
    req.returnNotes = dto.notes;

    this.createActivityLog({
      userName: returnRecord.receivedBy,
      action: 'บันทึกการคืน',
      description: `บันทึกการคืนวัสดุ ${req.materialName} จำนวน ${dto.returnedQuantity} ${req.unit} จาก ${req.requesterName} (สภาพ: ${dto.condition})`,
      module: 'คลังสินค้า',
      type: 'เบิกจ่าย',
    });

    return returnRecord;
  },

  // ==========================================
  // ACTIVITY LOGS
  // ==========================================
  getActivityLogs(query?: { type?: string; module?: string; limit?: number }) {
    const db = getDatabase();
    let result = [...db.activityLogs];

    if (query?.type) {
      result = result.filter((l) => l.type === query.type);
    }
    if (query?.module) {
      result = result.filter((l) => l.module === query.module);
    }
    if (query?.limit) {
      result = result.slice(0, query.limit);
    }

    return result;
  },

  createActivityLog(dto: CreateActivityLogDto) {
    const db = getDatabase();
    const newLog: ActivityLog = {
      id: String(Date.now()) + Math.random().toString().slice(2, 6),
      userName: dto.userName,
      action: dto.action,
      description: dto.description,
      module: dto.module,
      type: dto.type,
      timestamp: new Date().toLocaleString('th-TH', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      ipAddress: dto.ipAddress || '192.168.1.100',
    };

    db.activityLogs.unshift(newLog);
    return newLog;
  },

  // ==========================================
  // DASHBOARD & STATS
  // ==========================================
  getDashboardStats() {
    const db = getDatabase();
    const totalUsers = db.users.length;
    const activeUsers = db.users.filter((u) => u.status === 'ใช้งาน').length;
    const totalMaterials = db.materials.length;
    const totalCategories = db.categories.length;
    const totalValue = db.materials.reduce((acc, m) => acc + m.totalValue, 0);
    const pendingApprovals = db.requests.filter((r) => r.status === 'รออนุมัติ').length;
    const lowStockItems = db.materials.filter((m) => m.status === 'ใกล้หมด').length;
    const outOfStockItems = db.materials.filter((m) => m.status === 'หมดสต็อก').length;
    const activeBorrows = db.requests.filter((r) => r.status === 'กำลังยืม').length;

    return {
      totalUsers,
      activeUsers,
      totalMaterials,
      totalCategories,
      totalValue,
      pendingApprovals,
      lowStockItems,
      outOfStockItems,
      activeBorrows,
      recentRequests: db.requests.slice(0, 5),
      recentLogs: db.activityLogs.slice(0, 6),
    };
  },
};
