import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  User,
  Category,
  Material,
  ApprovalRequest,
  ActivityLog,
  mockUsers,
  mockCategories,
  mockMaterials,
  mockApprovals,
  mockActivityLogs,
} from './mockData';

export type RequestType = 'เบิกวัสดุ' | 'ยืมวัสดุ';
export type RequestStatus = 'รออนุมัติ' | 'อนุมัติแล้ว' | 'ไม่อนุมัติ' | 'กำลังยืม' | 'คืนแล้ว' | 'ยกเลิกแล้ว';

export interface EnhancedRequest {
  id: string;
  requestCode: string;
  requestType: RequestType;
  requesterId: string;
  requesterName: string;
  department: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  quantity: number;
  unit: string;
  reason: string;
  status: RequestStatus;
  requestDate: string;
  borrowDate?: string;
  expectedReturnDate?: string;
  actualReturnDate?: string;
  returnedQuantity?: number;
  returnCondition?: 'สมบูรณ์' | 'ชำรุด' | 'สูญหาย';
  returnNotes?: string;
  approvedBy?: string | null;
  approvedDate?: string | null;
  rejectReason?: string | null;
  cancelledBy?: string | null;
  cancelledDate?: string | null;
}

export interface ReturnRecord {
  id: string;
  requestId: string;
  requestCode: string;
  materialName: string;
  borrowerName: string;
  department: string;
  borrowedQuantity: number;
  returnedQuantity: number;
  returnDate: string;
  condition: 'สมบูรณ์' | 'ชำรุด' | 'สูญหาย';
  receivedBy: string;
  notes: string;
}

interface AppState {
  // Current session
  currentUser: User;
  setCurrentUser: (user: User) => void;
  switchRole: (role: User['role']) => void;
  changePassword: (oldPass: string, newPass: string) => boolean;

  // Users
  users: User[];
  addUser: (user: Omit<User, 'id' | 'createdAt' | 'lastLogin' | 'avatar'>) => void;
  updateUser: (id: string, user: Partial<User>) => void;
  deleteUser: (id: string) => void;

  // Categories
  categories: Category[];
  addCategory: (category: Omit<Category, 'id' | 'createdAt' | 'itemCount'>) => void;
  updateCategory: (id: string, category: Partial<Category>) => void;
  deleteCategory: (id: string) => void;

  // Materials
  materials: Material[];
  addMaterial: (material: Omit<Material, 'id' | 'lastUpdated' | 'totalValue' | 'status'>) => void;
  updateMaterial: (id: string, material: Partial<Material>) => void;
  deleteMaterial: (id: string) => void;
  restockMaterial: (id: string, addQuantity: number, reason: string) => void;

  // Requests (Borrow & Requisition)
  requests: EnhancedRequest[];
  createRequest: (data: {
    requestType: RequestType;
    materialId: string;
    quantity: number;
    reason: string;
    borrowDate?: string;
    expectedReturnDate?: string;
  }) => void;
  approveRequest: (id: string) => void;
  rejectRequest: (id: string, reason: string) => void;
  cancelRequest: (id: string) => void;
  processReturn: (data: {
    requestId: string;
    returnedQuantity: number;
    returnDate: string;
    condition: 'สมบูรณ์' | 'ชำรุด' | 'สูญหาย';
    notes: string;
  }) => void;

  // Return records
  returnRecords: ReturnRecord[];

  // Activity Logs
  activityLogs: ActivityLog[];
  addActivityLog: (log: Omit<ActivityLog, 'id' | 'timestamp' | 'ipAddress'>) => void;

  // Reset demo data
  resetToDefault: () => void;
}

// Convert mockApprovals to EnhancedRequests
const initialEnhancedRequests: EnhancedRequest[] = mockApprovals.map((a, index) => {
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

const initialReturnRecords: ReturnRecord[] = [
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
  }
];

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentUser: mockUsers[0], // Somchai (Administrator)
      users: mockUsers,
      categories: mockCategories,
      materials: mockMaterials,
      requests: initialEnhancedRequests,
      returnRecords: initialReturnRecords,
      activityLogs: mockActivityLogs,

      setCurrentUser: (user) => set({ currentUser: user }),

      switchRole: (role) => {
        const found = get().users.find((u) => u.role === role);
        if (found) {
          set({ currentUser: found });
          get().addActivityLog({
            action: 'สลับบทบาท',
            description: `สลับไปยังบทบาท: ${role} (${found.fullName})`,
            userName: found.fullName,
            module: 'ระบบ',
            type: 'เข้าสู่ระบบ',
          });
        }
      },

      changePassword: (oldPass, newPass) => {
        const { currentUser, addActivityLog } = get();
        addActivityLog({
          action: 'เปลี่ยนรหัสผ่าน',
          description: `ผู้ใช้ ${currentUser.fullName} ได้เปลี่ยนรหัสผ่านสำเร็จ`,
          userName: currentUser.fullName,
          module: 'ผู้ใช้งาน',
          type: 'แก้ไข',
        });
        return true;
      },

      // User actions
      addUser: (userData) => {
        const { users, currentUser, addActivityLog } = get();
        const newUser: User = {
          id: String(Date.now()),
          ...userData,
          avatar: userData.fullName.slice(0, 2),
          createdAt: new Date().toISOString().split('T')[0],
          lastLogin: '-',
        };
        set({ users: [newUser, ...users] });
        addActivityLog({
          action: 'เพิ่มผู้ใช้',
          description: `เพิ่มผู้ใช้ใหม่: ${newUser.fullName} (${newUser.role}) แผนก ${newUser.department}`,
          userName: currentUser.fullName,
          module: 'ผู้ใช้งาน',
          type: 'สร้าง',
        });
      },

      updateUser: (id, updatedData) => {
        const { users, currentUser, addActivityLog } = get();
        const user = users.find((u) => u.id === id);
        set({
          users: users.map((u) => (u.id === id ? { ...u, ...updatedData } : u)),
        });
        addActivityLog({
          action: 'แก้ไขข้อมูลผู้ใช้',
          description: `แก้ไขข้อมูลผู้ใช้: ${user?.fullName || id}`,
          userName: currentUser.fullName,
          module: 'ผู้ใช้งาน',
          type: 'แก้ไข',
        });
      },

      deleteUser: (id) => {
        const { users, currentUser, addActivityLog } = get();
        const user = users.find((u) => u.id === id);
        set({ users: users.filter((u) => u.id !== id) });
        addActivityLog({
          action: 'ลบผู้ใช้',
          description: `ลบผู้ใช้: ${user?.fullName || id}`,
          userName: currentUser.fullName,
          module: 'ผู้ใช้งาน',
          type: 'ลบ',
        });
      },

      // Category actions
      addCategory: (catData) => {
        const { categories, currentUser, addActivityLog } = get();
        const newCat: Category = {
          id: String(Date.now()),
          ...catData,
          itemCount: 0,
          createdAt: new Date().toISOString().split('T')[0],
        };
        set({ categories: [...categories, newCat] });
        addActivityLog({
          action: 'เพิ่มหมวดหมู่',
          description: `เพิ่มหมวดหมู่ใหม่: ${newCat.name}`,
          userName: currentUser.fullName,
          module: 'หมวดหมู่',
          type: 'สร้าง',
        });
      },

      updateCategory: (id, updatedData) => {
        const { categories, currentUser, addActivityLog } = get();
        set({
          categories: categories.map((c) => (c.id === id ? { ...c, ...updatedData } : c)),
        });
        addActivityLog({
          action: 'แก้ไขหมวดหมู่',
          description: `แก้ไขข้อมูลหมวดหมู่: ${updatedData.name || id}`,
          userName: currentUser.fullName,
          module: 'หมวดหมู่',
          type: 'แก้ไข',
        });
      },

      deleteCategory: (id) => {
        const { categories, currentUser, addActivityLog } = get();
        const cat = categories.find((c) => c.id === id);
        set({ categories: categories.filter((c) => c.id !== id) });
        addActivityLog({
          action: 'ลบหมวดหมู่',
          description: `ลบหมวดหมู่: ${cat?.name || id}`,
          userName: currentUser.fullName,
          module: 'หมวดหมู่',
          type: 'ลบ',
        });
      },

      // Material actions
      addMaterial: (matData) => {
        const { materials, currentUser, addActivityLog } = get();
        const qty = Number(matData.quantity);
        const price = Number(matData.pricePerUnit);
        const minQty = Number(matData.minQuantity);
        const status: Material['status'] =
          qty === 0 ? 'หมดสต็อก' : qty <= minQty ? 'ใกล้หมด' : 'มีสต็อก';

        const newMat: Material = {
          id: String(Date.now()),
          ...matData,
          quantity: qty,
          pricePerUnit: price,
          minQuantity: minQty,
          totalValue: qty * price,
          status,
          lastUpdated: '16 ส.ค. 2569',
        };

        set({ materials: [newMat, ...materials] });
        addActivityLog({
          action: 'เพิ่มวัสดุ',
          description: `เพิ่มวัสดุใหม่: ${newMat.name} (${newMat.code}) จำนวน ${qty} ${newMat.unit}`,
          userName: currentUser.fullName,
          module: 'วัสดุ',
          type: 'สร้าง',
        });
      },

      updateMaterial: (id, updatedData) => {
        const { materials, currentUser, addActivityLog } = get();
        set({
          materials: materials.map((m) => {
            if (m.id !== id) return m;
            const merged = { ...m, ...updatedData };
            const qty = Number(merged.quantity);
            const price = Number(merged.pricePerUnit);
            const minQty = Number(merged.minQuantity);
            merged.status = qty === 0 ? 'หมดสต็อก' : qty <= minQty ? 'ใกล้หมด' : 'มีสต็อก';
            merged.totalValue = qty * price;
            merged.lastUpdated = '16 ส.ค. 2569';
            return merged;
          }),
        });
        addActivityLog({
          action: 'แก้ไขวัสดุ',
          description: `แก้ไขข้อมูลวัสดุ: ${updatedData.name || id}`,
          userName: currentUser.fullName,
          module: 'วัสดุ',
          type: 'แก้ไข',
        });
      },

      deleteMaterial: (id) => {
        const { materials, currentUser, addActivityLog } = get();
        const mat = materials.find((m) => m.id === id);
        set({ materials: materials.filter((m) => m.id !== id) });
        addActivityLog({
          action: 'ลบวัสดุ',
          description: `ลบวัสดุ: ${mat?.name || id} (${mat?.code || ''})`,
          userName: currentUser.fullName,
          module: 'วัสดุ',
          type: 'ลบ',
        });
      },

      restockMaterial: (id, addQty, reason) => {
        const { materials, currentUser, addActivityLog } = get();
        const mat = materials.find((m) => m.id === id);
        if (!mat) return;

        const newQty = mat.quantity + addQty;
        const status: Material['status'] =
          newQty === 0 ? 'หมดสต็อก' : newQty <= mat.minQuantity ? 'ใกล้หมด' : 'มีสต็อก';

        set({
          materials: materials.map((m) =>
            m.id === id
              ? {
                  ...m,
                  quantity: newQty,
                  totalValue: newQty * m.pricePerUnit,
                  status,
                  lastUpdated: '16 ส.ค. 2569',
                }
              : m
          ),
        });

        addActivityLog({
          action: 'เติมสต็อก',
          description: `เติมสต็อก ${mat.name} จำนวน +${addQty} ${mat.unit} (เหตุผล: ${reason})`,
          userName: currentUser.fullName,
          module: 'คลังสินค้า',
          type: 'แก้ไข',
        });
      },

      // Request actions (Borrow / Requisition)
      createRequest: (data) => {
        const { requests, materials, currentUser, addActivityLog } = get();
        const mat = materials.find((m) => m.id === data.materialId);
        const reqNum = requests.length + 1;
        const padNum = String(reqNum).padStart(4, '0');

        const newReq: EnhancedRequest = {
          id: String(Date.now()),
          requestCode: `REQ-2569-${padNum}`,
          requestType: data.requestType,
          requesterId: currentUser.id,
          requesterName: currentUser.fullName,
          department: currentUser.department,
          materialId: data.materialId,
          materialCode: mat?.code || '',
          materialName: mat?.name || 'วัสดุ',
          quantity: data.quantity,
          unit: mat?.unit || 'ชิ้น',
          reason: data.reason,
          status: 'รออนุมัติ',
          requestDate: '16 ส.ค. 2569',
          borrowDate: data.borrowDate,
          expectedReturnDate: data.expectedReturnDate,
        };

        set({ requests: [newReq, ...requests] });
        addActivityLog({
          action: data.requestType === 'ยืมวัสดุ' ? 'ส่งคำขอยืม' : 'ส่งคำขอเบิก',
          description: `${currentUser.fullName} ส่งคำขอ ${data.requestType}: ${newReq.materialName} จำนวน ${data.quantity} ${newReq.unit}`,
          userName: currentUser.fullName,
          module: 'การอนุมัติ',
          type: 'สร้าง',
        });
      },

      approveRequest: (id) => {
        const { requests, materials, currentUser, addActivityLog } = get();
        const req = requests.find((r) => r.id === id);
        if (!req) return;

        // Deduct material stock
        const newStatus: RequestStatus = req.requestType === 'ยืมวัสดุ' ? 'กำลังยืม' : 'อนุมัติแล้ว';

        const updatedMaterials = materials.map((m) => {
          if (m.id === req.materialId || m.name === req.materialName) {
            const newQty = Math.max(0, m.quantity - req.quantity);
            const status: Material['status'] =
              newQty === 0 ? 'หมดสต็อก' : newQty <= m.minQuantity ? 'ใกล้หมด' : 'มีสต็อก';
            return {
              ...m,
              quantity: newQty,
              totalValue: newQty * m.pricePerUnit,
              status,
              lastUpdated: '16 ส.ค. 2569',
            };
          }
          return m;
        });

        set({
          materials: updatedMaterials,
          requests: requests.map((r) =>
            r.id === id
              ? {
                  ...r,
                  status: newStatus,
                  approvedBy: currentUser.fullName,
                  approvedDate: '16 ส.ค. 2569',
                }
              : r
          ),
        });

        addActivityLog({
          action: 'อนุมัติคำขอ',
          description: `อนุมัติคำขอ ${req.requestCode} (${req.requestType}) ของ ${req.requesterName} รายการ: ${req.materialName}`,
          userName: currentUser.fullName,
          module: 'การอนุมัติ',
          type: 'อนุมัติ',
        });
      },

      rejectRequest: (id, reason) => {
        const { requests, currentUser, addActivityLog } = get();
        const req = requests.find((r) => r.id === id);
        set({
          requests: requests.map((r) =>
            r.id === id
              ? {
                  ...r,
                  status: 'ไม่อนุมัติ',
                  approvedBy: currentUser.fullName,
                  approvedDate: '16 ส.ค. 2569',
                  rejectReason: reason,
                }
              : r
          ),
        });

        addActivityLog({
          action: 'ไม่อนุมัติคำขอ',
          description: `ไม่อนุมัติคำขอ ${req?.requestCode} เหตุผล: ${reason}`,
          userName: currentUser.fullName,
          module: 'การอนุมัติ',
          type: 'อนุมัติ',
        });
      },

      cancelRequest: (id) => {
        const { requests, currentUser, addActivityLog } = get();
        const req = requests.find((r) => r.id === id);
        set({
          requests: requests.map((r) =>
            r.id === id
              ? {
                  ...r,
                  status: 'ยกเลิกแล้ว',
                  cancelledBy: currentUser.fullName,
                  cancelledDate: '16 ส.ค. 2569',
                }
              : r
          ),
        });

        addActivityLog({
          action: 'ยกเลิกคำขอ',
          description: `ยกเลิกคำขอ ${req?.requestCode} โดย ${currentUser.fullName}`,
          userName: currentUser.fullName,
          module: 'การอนุมัติ',
          type: 'แก้ไข',
        });
      },

      processReturn: (data) => {
        const { requests, materials, returnRecords, currentUser, addActivityLog } = get();
        const req = requests.find((r) => r.id === data.requestId);
        if (!req) return;

        // Restore material stock
        const updatedMaterials = materials.map((m) => {
          if (m.id === req.materialId || m.name === req.materialName) {
            const newQty = m.quantity + data.returnedQuantity;
            const status: Material['status'] =
              newQty === 0 ? 'หมดสต็อก' : newQty <= m.minQuantity ? 'ใกล้หมด' : 'มีสต็อก';
            return {
              ...m,
              quantity: newQty,
              totalValue: newQty * m.pricePerUnit,
              status,
              lastUpdated: '16 ส.ค. 2569',
            };
          }
          return m;
        });

        // Add return record
        const newReturnRecord: ReturnRecord = {
          id: `RET-${Date.now().toString().slice(-4)}`,
          requestId: req.id,
          requestCode: req.requestCode,
          materialName: req.materialName,
          borrowerName: req.requesterName,
          department: req.department,
          borrowedQuantity: req.quantity,
          returnedQuantity: data.returnedQuantity,
          returnDate: data.returnDate || '16 ส.ค. 2569',
          condition: data.condition,
          receivedBy: currentUser.fullName,
          notes: data.notes,
        };

        set({
          materials: updatedMaterials,
          returnRecords: [newReturnRecord, ...returnRecords],
          requests: requests.map((r) =>
            r.id === data.requestId
              ? {
                  ...r,
                  status: 'คืนแล้ว',
                  actualReturnDate: data.returnDate || '16 ส.ค. 2569',
                  returnedQuantity: data.returnedQuantity,
                  returnCondition: data.condition,
                  returnNotes: data.notes,
                }
              : r
          ),
        });

        addActivityLog({
          action: 'บันทึกการคืน',
          description: `บันทึกการคืนวัสดุ ${req.materialName} จำนวน ${data.returnedQuantity} ${req.unit} จาก ${req.requesterName} (สภาพ: ${data.condition})`,
          userName: currentUser.fullName,
          module: 'คลังสินค้า',
          type: 'เบิกจ่าย',
        });
      },

      addActivityLog: (logData) => {
        const { activityLogs } = get();
        const newLog: ActivityLog = {
          id: String(Date.now()),
          ...logData,
          timestamp: new Date().toLocaleString('th-TH', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
          }),
          ipAddress: '192.168.1.100',
        };
        set({ activityLogs: [newLog, ...activityLogs] });
      },

      resetToDefault: () => {
        set({
          currentUser: mockUsers[0],
          users: mockUsers,
          categories: mockCategories,
          materials: mockMaterials,
          requests: initialEnhancedRequests,
          returnRecords: initialReturnRecords,
          activityLogs: mockActivityLogs,
        });
      },
    }),
    {
      name: 'rangsit-municipality-store',
    }
  )
);
