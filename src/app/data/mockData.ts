// ข้อมูลจำลอง (Mock Data) สำหรับระบบจัดการวัสดุเทศบาล

export interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
  department: string;
  role: 'ผู้ดูแลระบบ' | 'ผู้อนุมัติ' | 'เจ้าหน้าที่';
  status: 'ใช้งาน' | 'ไม่ใช้งาน';
  lastLogin: string;
  avatar: string;
  phone: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  description: string;
  icon: string;
  itemCount: number;
  status: 'ใช้งาน' | 'ไม่ใช้งาน';
  createdAt: string;
}

export interface Material {
  id: string;
  code: string;
  name: string;
  categoryId: string;
  categoryName: string;
  unit: string;
  quantity: number;
  minQuantity: number;
  pricePerUnit: number;
  totalValue: number;
  location: string;
  status: 'มีสต็อก' | 'ใกล้หมด' | 'หมดสต็อก';
  lastUpdated: string;
  description: string;
}

export interface ApprovalRequest {
  id: string;
  requestCode: string;
  requesterName: string;
  department: string;
  materialName: string;
  quantity: number;
  unit: string;
  reason: string;
  status: 'รออนุมัติ' | 'อนุมัติแล้ว' | 'ไม่อนุมัติ';
  requestDate: string;
  approvedBy: string | null;
  approvedDate: string | null;
}

export interface ActivityLog {
  id: string;
  action: string;
  description: string;
  userName: string;
  module: string;
  timestamp: string;
  ipAddress: string;
  type: 'สร้าง' | 'แก้ไข' | 'ลบ' | 'เข้าสู่ระบบ' | 'อนุมัติ' | 'เบิกจ่าย';
}

// =============================================
// ข้อมูลผู้ใช้งาน
// =============================================
export const mockUsers: User[] = [
  {
    id: '1',
    fullName: 'สมชาย ใจดี',
    username: 'somchai.j',
    email: 'somchai.j@rangsit.go.th',
    department: 'กองช่าง (Public Works)',
    role: 'ผู้ดูแลระบบ',
    status: 'ใช้งาน',
    lastLogin: '2 นาทีที่แล้ว',
    avatar: 'สช',
    phone: '081-234-5678',
    createdAt: '2023-01-15',
  },
  {
    id: '2',
    fullName: 'วันทนา สุขกมล',
    username: 'wantana.s',
    email: 'wantana.s@rangsit.go.th',
    department: 'สำนักปลัด (Office of the Palad)',
    role: 'เจ้าหน้าที่',
    status: 'ใช้งาน',
    lastLogin: '24 ต.ค. 2566',
    avatar: 'วส',
    phone: '082-345-6789',
    createdAt: '2023-03-20',
  },
  {
    id: '3',
    fullName: 'กฤษฎา เรืองจ',
    username: 'kritsada.r',
    email: 'kritsada.r@rangsit.go.th',
    department: 'กองคลัง (Finance)',
    role: 'ผู้อนุมัติ',
    status: 'ไม่ใช้งาน',
    lastLogin: '12 ก.ย. 2566',
    avatar: 'กร',
    phone: '083-456-7890',
    createdAt: '2023-05-10',
  },
  {
    id: '4',
    fullName: 'สุภาพร แสงทอง',
    username: 'supaporn.s',
    email: 'supaporn.s@rangsit.go.th',
    department: 'กองสาธารณสุข (Public Health)',
    role: 'เจ้าหน้าที่',
    status: 'ใช้งาน',
    lastLogin: '15 ส.ค. 2569',
    avatar: 'สส',
    phone: '084-567-8901',
    createdAt: '2023-07-01',
  },
  {
    id: '5',
    fullName: 'ประยุทธ์ มั่นคง',
    username: 'prayuth.m',
    email: 'prayuth.m@rangsit.go.th',
    department: 'กองช่าง (Public Works)',
    role: 'ผู้อนุมัติ',
    status: 'ใช้งาน',
    lastLogin: '14 ส.ค. 2569',
    avatar: 'ปม',
    phone: '085-678-9012',
    createdAt: '2023-02-28',
  },
  {
    id: '6',
    fullName: 'นารีรัตน์ พิมพา',
    username: 'nareerat.p',
    email: 'nareerat.p@rangsit.go.th',
    department: 'กองการศึกษา (Education)',
    role: 'เจ้าหน้าที่',
    status: 'ใช้งาน',
    lastLogin: '10 ส.ค. 2569',
    avatar: 'นพ',
    phone: '086-789-0123',
    createdAt: '2023-09-15',
  },
  {
    id: '7',
    fullName: 'ธนากร วงษ์ศรี',
    username: 'thanakorn.w',
    email: 'thanakorn.w@rangsit.go.th',
    department: 'กองคลัง (Finance)',
    role: 'เจ้าหน้าที่',
    status: 'ใช้งาน',
    lastLogin: '13 ส.ค. 2569',
    avatar: 'ธว',
    phone: '087-890-1234',
    createdAt: '2024-01-10',
  },
  {
    id: '8',
    fullName: 'พรทิพย์ ศรีสว่าง',
    username: 'porntip.s',
    email: 'porntip.s@rangsit.go.th',
    department: 'สำนักปลัด (Office of the Palad)',
    role: 'ผู้ดูแลระบบ',
    status: 'ใช้งาน',
    lastLogin: '16 ส.ค. 2569',
    avatar: 'พศ',
    phone: '088-901-2345',
    createdAt: '2023-04-05',
  },
  {
    id: '9',
    fullName: 'อนุชา ปานแก้ว',
    username: 'anucha.p',
    email: 'anucha.p@rangsit.go.th',
    department: 'กองสาธารณสุข (Public Health)',
    role: 'เจ้าหน้าที่',
    status: 'ไม่ใช้งาน',
    lastLogin: '5 มิ.ย. 2569',
    avatar: 'อป',
    phone: '089-012-3456',
    createdAt: '2024-03-20',
  },
  {
    id: '10',
    fullName: 'จิราภรณ์ ดวงดี',
    username: 'jiraporn.d',
    email: 'jiraporn.d@rangsit.go.th',
    department: 'กองการศึกษา (Education)',
    role: 'ผู้อนุมัติ',
    status: 'ใช้งาน',
    lastLogin: '11 ส.ค. 2569',
    avatar: 'จด',
    phone: '090-123-4567',
    createdAt: '2024-06-01',
  },
];

// =============================================
// ข้อมูลหมวดหมู่วัสดุ
// =============================================
export const mockCategories: Category[] = [
  {
    id: '1',
    name: 'วัสดุสำนักงาน',
    description: 'อุปกรณ์เครื่องเขียน กระดาษ แฟ้ม และอุปกรณ์สำนักงานทั่วไป',
    icon: '📋',
    itemCount: 156,
    status: 'ใช้งาน',
    createdAt: '2023-01-01',
  },
  {
    id: '2',
    name: 'วัสดุไฟฟ้า',
    description: 'หลอดไฟ สายไฟ สวิตช์ ปลั๊กไฟ และอุปกรณ์ไฟฟ้าต่างๆ',
    icon: '⚡',
    itemCount: 89,
    status: 'ใช้งาน',
    createdAt: '2023-01-01',
  },
  {
    id: '3',
    name: 'วัสดุก่อสร้าง',
    description: 'ปูน ทราย อิฐ เหล็ก และวัสดุก่อสร้างทุกชนิด',
    icon: '🏗️',
    itemCount: 234,
    status: 'ใช้งาน',
    createdAt: '2023-01-01',
  },
  {
    id: '4',
    name: 'วัสดุประปา',
    description: 'ท่อน้ำ ข้อต่อ วาล์ว ก๊อกน้ำ และอุปกรณ์ประปา',
    icon: '🔧',
    itemCount: 112,
    status: 'ใช้งาน',
    createdAt: '2023-02-15',
  },
  {
    id: '5',
    name: 'วัสดุคอมพิวเตอร์',
    description: 'หมึกพิมพ์ กระดาษ A4 อุปกรณ์ต่อพ่วง และวัสดุสิ้นเปลือง IT',
    icon: '💻',
    itemCount: 67,
    status: 'ใช้งาน',
    createdAt: '2023-03-01',
  },
  {
    id: '6',
    name: 'วัสดุทำความสะอาด',
    description: 'น้ำยาทำความสะอาด ไม้กวาด ถุงขยะ และอุปกรณ์ทำความสะอาด',
    icon: '🧹',
    itemCount: 45,
    status: 'ใช้งาน',
    createdAt: '2023-04-01',
  },
  {
    id: '7',
    name: 'วัสดุการเกษตร',
    description: 'ปุ๋ย ยาฆ่าแมลง เมล็ดพันธุ์ และอุปกรณ์การเกษตร',
    icon: '🌱',
    itemCount: 38,
    status: 'ใช้งาน',
    createdAt: '2023-05-15',
  },
  {
    id: '8',
    name: 'วัสดุยานพาหนะ',
    description: 'น้ำมันเครื่อง ยางรถ อะไหล่ และอุปกรณ์ซ่อมบำรุงรถ',
    icon: '🚗',
    itemCount: 73,
    status: 'ไม่ใช้งาน',
    createdAt: '2023-06-01',
  },
];

// =============================================
// ข้อมูลวัสดุและครุภัณฑ์
// =============================================
export const mockMaterials: Material[] = [
  {
    id: '1',
    code: 'OFF-001',
    name: 'กระดาษ A4 80 แกรม',
    categoryId: '1',
    categoryName: 'วัสดุสำนักงาน',
    unit: 'รีม',
    quantity: 450,
    minQuantity: 100,
    pricePerUnit: 120,
    totalValue: 54000,
    location: 'ห้องเก็บของ A1',
    status: 'มีสต็อก',
    lastUpdated: '16 ส.ค. 2569',
    description: 'กระดาษถ่ายเอกสาร A4 ขนาด 80 แกรม ยี่ห้อ Double A',
  },
  {
    id: '2',
    code: 'OFF-002',
    name: 'ปากกาลูกลื่น',
    categoryId: '1',
    categoryName: 'วัสดุสำนักงาน',
    unit: 'ด้าม',
    quantity: 200,
    minQuantity: 50,
    pricePerUnit: 15,
    totalValue: 3000,
    location: 'ห้องเก็บของ A1',
    status: 'มีสต็อก',
    lastUpdated: '15 ส.ค. 2569',
    description: 'ปากกาลูกลื่น หมึกน้ำเงิน ขนาด 0.5 มม.',
  },
  {
    id: '3',
    code: 'ELE-001',
    name: 'หลอดไฟ LED 18W',
    categoryId: '2',
    categoryName: 'วัสดุไฟฟ้า',
    unit: 'หลอด',
    quantity: 35,
    minQuantity: 50,
    pricePerUnit: 89,
    totalValue: 3115,
    location: 'ห้องเก็บของ B2',
    status: 'ใกล้หมด',
    lastUpdated: '14 ส.ค. 2569',
    description: 'หลอดไฟ LED T8 ขนาด 18 วัตต์ แสงขาว',
  },
  {
    id: '4',
    code: 'CON-001',
    name: 'ปูนซีเมนต์ปอร์ตแลนด์',
    categoryId: '3',
    categoryName: 'วัสดุก่อสร้าง',
    unit: 'ถุง',
    quantity: 0,
    minQuantity: 20,
    pricePerUnit: 165,
    totalValue: 0,
    location: 'โกดัง C1',
    status: 'หมดสต็อก',
    lastUpdated: '10 ส.ค. 2569',
    description: 'ปูนซีเมนต์ปอร์ตแลนด์ ประเภท 1 ตราเสือ 50 กก.',
  },
  {
    id: '5',
    code: 'PLU-001',
    name: 'ท่อ PVC 4 นิ้ว',
    categoryId: '4',
    categoryName: 'วัสดุประปา',
    unit: 'ท่อน',
    quantity: 80,
    minQuantity: 30,
    pricePerUnit: 250,
    totalValue: 20000,
    location: 'โกดัง C2',
    status: 'มีสต็อก',
    lastUpdated: '12 ส.ค. 2569',
    description: 'ท่อ PVC แข็ง ขนาด 4 นิ้ว ชั้น 8.5 ยาว 4 เมตร',
  },
  {
    id: '6',
    code: 'COM-001',
    name: 'หมึกพิมพ์ HP 680',
    categoryId: '5',
    categoryName: 'วัสดุคอมพิวเตอร์',
    unit: 'ตลับ',
    quantity: 12,
    minQuantity: 10,
    pricePerUnit: 450,
    totalValue: 5400,
    location: 'ห้องเก็บของ A2',
    status: 'ใกล้หมด',
    lastUpdated: '13 ส.ค. 2569',
    description: 'หมึกพิมพ์ HP 680 สีดำ ของแท้',
  },
  {
    id: '7',
    code: 'CLN-001',
    name: 'น้ำยาถูพื้น',
    categoryId: '6',
    categoryName: 'วัสดุทำความสะอาด',
    unit: 'แกลลอน',
    quantity: 25,
    minQuantity: 10,
    pricePerUnit: 180,
    totalValue: 4500,
    location: 'ห้องเก็บของ D1',
    status: 'มีสต็อก',
    lastUpdated: '11 ส.ค. 2569',
    description: 'น้ำยาถูพื้น สูตรฆ่าเชื้อ ขนาด 3.8 ลิตร',
  },
  {
    id: '8',
    code: 'OFF-003',
    name: 'แฟ้มเอกสาร A4',
    categoryId: '1',
    categoryName: 'วัสดุสำนักงาน',
    unit: 'แฟ้ม',
    quantity: 300,
    minQuantity: 50,
    pricePerUnit: 35,
    totalValue: 10500,
    location: 'ห้องเก็บของ A1',
    status: 'มีสต็อก',
    lastUpdated: '16 ส.ค. 2569',
    description: 'แฟ้มเอกสาร A4 แบบสันห่วง คละสี',
  },
  {
    id: '9',
    code: 'ELE-002',
    name: 'สายไฟ THW 2.5 มม.',
    categoryId: '2',
    categoryName: 'วัสดุไฟฟ้า',
    unit: 'เมตร',
    quantity: 500,
    minQuantity: 100,
    pricePerUnit: 12,
    totalValue: 6000,
    location: 'ห้องเก็บของ B2',
    status: 'มีสต็อก',
    lastUpdated: '15 ส.ค. 2569',
    description: 'สายไฟ THW ขนาด 2.5 ตร.มม. สีดำ',
  },
  {
    id: '10',
    code: 'CON-002',
    name: 'ทราย',
    categoryId: '3',
    categoryName: 'วัสดุก่อสร้าง',
    unit: 'คิว',
    quantity: 15,
    minQuantity: 5,
    pricePerUnit: 800,
    totalValue: 12000,
    location: 'โกดัง C1',
    status: 'มีสต็อก',
    lastUpdated: '14 ส.ค. 2569',
    description: 'ทราย หยาบ สำหรับงานก่อสร้าง',
  },
];

// =============================================
// ข้อมูลคำขอเบิกวัสดุ
// =============================================
export const mockApprovals: ApprovalRequest[] = [
  {
    id: '1',
    requestCode: 'REQ-2569-0001',
    requesterName: 'วันทนา สุขกมล',
    department: 'สำนักปลัด',
    materialName: 'กระดาษ A4 80 แกรม',
    quantity: 50,
    unit: 'รีม',
    reason: 'เบิกใช้สำหรับงานเอกสารประจำเดือน สิงหาคม 2569',
    status: 'รออนุมัติ',
    requestDate: '16 ส.ค. 2569',
    approvedBy: null,
    approvedDate: null,
  },
  {
    id: '2',
    requestCode: 'REQ-2569-0002',
    requesterName: 'นารีรัตน์ พิมพา',
    department: 'กองการศึกษา',
    materialName: 'ปากกาลูกลื่น',
    quantity: 100,
    unit: 'ด้าม',
    reason: 'เบิกใช้สำหรับโครงการอบรมครู ประจำปี 2569',
    status: 'รออนุมัติ',
    requestDate: '15 ส.ค. 2569',
    approvedBy: null,
    approvedDate: null,
  },
  {
    id: '3',
    requestCode: 'REQ-2569-0003',
    requesterName: 'ธนากร วงษ์ศรี',
    department: 'กองคลัง',
    materialName: 'หมึกพิมพ์ HP 680',
    quantity: 5,
    unit: 'ตลับ',
    reason: 'หมึกพิมพ์หมด ต้องการเบิกเพิ่มสำหรับเครื่องพิมพ์ประจำแผนก',
    status: 'อนุมัติแล้ว',
    requestDate: '14 ส.ค. 2569',
    approvedBy: 'ประยุทธ์ มั่นคง',
    approvedDate: '14 ส.ค. 2569',
  },
  {
    id: '4',
    requestCode: 'REQ-2569-0004',
    requesterName: 'อนุชา ปานแก้ว',
    department: 'กองสาธารณสุข',
    materialName: 'น้ำยาถูพื้น',
    quantity: 10,
    unit: 'แกลลอน',
    reason: 'เบิกใช้ทำความสะอาดสำนักงาน ประจำเดือน',
    status: 'อนุมัติแล้ว',
    requestDate: '13 ส.ค. 2569',
    approvedBy: 'จิราภรณ์ ดวงดี',
    approvedDate: '13 ส.ค. 2569',
  },
  {
    id: '5',
    requestCode: 'REQ-2569-0005',
    requesterName: 'สุภาพร แสงทอง',
    department: 'กองสาธารณสุข',
    materialName: 'ปูนซีเมนต์ปอร์ตแลนด์',
    quantity: 30,
    unit: 'ถุง',
    reason: 'ซ่อมแซมถนนในเขตเทศบาล',
    status: 'ไม่อนุมัติ',
    requestDate: '12 ส.ค. 2569',
    approvedBy: 'ประยุทธ์ มั่นคง',
    approvedDate: '12 ส.ค. 2569',
  },
  {
    id: '6',
    requestCode: 'REQ-2569-0006',
    requesterName: 'สมชาย ใจดี',
    department: 'กองช่าง',
    materialName: 'ท่อ PVC 4 นิ้ว',
    quantity: 20,
    unit: 'ท่อน',
    reason: 'ซ่อมแซมระบบประปาหมู่บ้านจัดสรร',
    status: 'รออนุมัติ',
    requestDate: '16 ส.ค. 2569',
    approvedBy: null,
    approvedDate: null,
  },
];

// =============================================
// ข้อมูลประวัติการใช้งาน (Activity Log)
// =============================================
export const mockActivityLogs: ActivityLog[] = [
  {
    id: '1',
    action: 'เข้าสู่ระบบ',
    description: 'สมชาย ใจดี เข้าสู่ระบบ',
    userName: 'สมชาย ใจดี',
    module: 'ระบบ',
    timestamp: '16 ส.ค. 2569 14:30:00',
    ipAddress: '192.168.1.100',
    type: 'เข้าสู่ระบบ',
  },
  {
    id: '2',
    action: 'เพิ่มวัสดุ',
    description: 'เพิ่มวัสดุใหม่: กระดาษ A4 80 แกรม จำนวน 200 รีม',
    userName: 'สมชาย ใจดี',
    module: 'วัสดุ',
    timestamp: '16 ส.ค. 2569 14:25:00',
    ipAddress: '192.168.1.100',
    type: 'สร้าง',
  },
  {
    id: '3',
    action: 'อนุมัติคำขอ',
    description: 'อนุมัติคำขอเบิก REQ-2569-0003 หมึกพิมพ์ HP 680',
    userName: 'ประยุทธ์ มั่นคง',
    module: 'การอนุมัติ',
    timestamp: '16 ส.ค. 2569 13:45:00',
    ipAddress: '192.168.1.105',
    type: 'อนุมัติ',
  },
  {
    id: '4',
    action: 'แก้ไขผู้ใช้',
    description: 'แก้ไขข้อมูลผู้ใช้: กฤษฎา เรืองจ สถานะเปลี่ยนเป็นไม่ใช้งาน',
    userName: 'พรทิพย์ ศรีสว่าง',
    module: 'ผู้ใช้งาน',
    timestamp: '16 ส.ค. 2569 11:20:00',
    ipAddress: '192.168.1.108',
    type: 'แก้ไข',
  },
  {
    id: '5',
    action: 'เบิกจ่ายวัสดุ',
    description: 'เบิกจ่าย น้ำยาถูพื้น จำนวน 10 แกลลอน ให้กองสาธารณสุข',
    userName: 'สมชาย ใจดี',
    module: 'คลังสินค้า',
    timestamp: '16 ส.ค. 2569 10:00:00',
    ipAddress: '192.168.1.100',
    type: 'เบิกจ่าย',
  },
  {
    id: '6',
    action: 'เข้าสู่ระบบ',
    description: 'วันทนา สุขกมล เข้าสู่ระบบ',
    userName: 'วันทนา สุขกมล',
    module: 'ระบบ',
    timestamp: '16 ส.ค. 2569 09:30:00',
    ipAddress: '192.168.1.102',
    type: 'เข้าสู่ระบบ',
  },
  {
    id: '7',
    action: 'สร้างคำขอเบิก',
    description: 'สร้างคำขอเบิก REQ-2569-0001 กระดาษ A4 จำนวน 50 รีม',
    userName: 'วันทนา สุขกมล',
    module: 'การอนุมัติ',
    timestamp: '16 ส.ค. 2569 09:35:00',
    ipAddress: '192.168.1.102',
    type: 'สร้าง',
  },
  {
    id: '8',
    action: 'ลบหมวดหมู่',
    description: 'ลบหมวดหมู่: วัสดุยานพาหนะ (เปลี่ยนสถานะเป็นไม่ใช้งาน)',
    userName: 'สมชาย ใจดี',
    module: 'หมวดหมู่',
    timestamp: '15 ส.ค. 2569 16:00:00',
    ipAddress: '192.168.1.100',
    type: 'ลบ',
  },
  {
    id: '9',
    action: 'แก้ไขวัสดุ',
    description: 'แก้ไขข้อมูลวัสดุ: หลอดไฟ LED 18W ปรับจำนวนจาก 50 เป็น 35',
    userName: 'สมชาย ใจดี',
    module: 'วัสดุ',
    timestamp: '15 ส.ค. 2569 14:15:00',
    ipAddress: '192.168.1.100',
    type: 'แก้ไข',
  },
  {
    id: '10',
    action: 'เข้าสู่ระบบ',
    description: 'พรทิพย์ ศรีสว่าง เข้าสู่ระบบ',
    userName: 'พรทิพย์ ศรีสว่าง',
    module: 'ระบบ',
    timestamp: '15 ส.ค. 2569 09:00:00',
    ipAddress: '192.168.1.108',
    type: 'เข้าสู่ระบบ',
  },
  {
    id: '11',
    action: 'ไม่อนุมัติคำขอ',
    description: 'ไม่อนุมัติคำขอเบิก REQ-2569-0005 ปูนซีเมนต์ เหตุผล: สต็อกหมด',
    userName: 'ประยุทธ์ มั่นคง',
    module: 'การอนุมัติ',
    timestamp: '15 ส.ค. 2569 11:30:00',
    ipAddress: '192.168.1.105',
    type: 'อนุมัติ',
  },
  {
    id: '12',
    action: 'เพิ่มผู้ใช้',
    description: 'เพิ่มผู้ใช้ใหม่: จิราภรณ์ ดวงดี ตำแหน่งผู้อนุมัติ',
    userName: 'พรทิพย์ ศรีสว่าง',
    module: 'ผู้ใช้งาน',
    timestamp: '14 ส.ค. 2569 10:00:00',
    ipAddress: '192.168.1.108',
    type: 'สร้าง',
  },
];

// =============================================
// ข้อมูลแผนก
// =============================================
export const departments = [
  'กองช่าง (Public Works)',
  'สำนักปลัด (Office of the Palad)',
  'กองคลัง (Finance)',
  'กองสาธารณสุข (Public Health)',
  'กองการศึกษา (Education)',
  'กองสวัสดิการสังคม (Social Welfare)',
];

// =============================================
// ข้อมูลสรุปสำหรับ Dashboard
// =============================================
export const dashboardStats = {
  totalUsers: 1248,
  activeUsers: 1190,
  pendingRegistrations: 58,
  totalMaterials: 814,
  totalCategories: 8,
  totalValue: 2450000,
  pendingApprovals: 3,
  monthlyWithdrawals: 156,
  lowStockItems: 2,
  outOfStockItems: 1,
};

// =============================================
// ข้อมูลรายงาน (สรุปรายเดือน)
// =============================================
export const monthlyReportData = [
  { month: 'ม.ค.', withdrawals: 120, value: 185000, requests: 45 },
  { month: 'ก.พ.', withdrawals: 98, value: 142000, requests: 38 },
  { month: 'มี.ค.', withdrawals: 135, value: 210000, requests: 52 },
  { month: 'เม.ย.', withdrawals: 89, value: 125000, requests: 33 },
  { month: 'พ.ค.', withdrawals: 112, value: 178000, requests: 41 },
  { month: 'มิ.ย.', withdrawals: 145, value: 235000, requests: 55 },
  { month: 'ก.ค.', withdrawals: 130, value: 198000, requests: 48 },
  { month: 'ส.ค.', withdrawals: 156, value: 245000, requests: 62 },
];

export const departmentUsageData = [
  { department: 'กองช่าง', percentage: 35, value: 857500, color: '#3b82f6' },
  { department: 'สำนักปลัด', percentage: 22, value: 539000, color: '#10b981' },
  { department: 'กองคลัง', percentage: 15, value: 367500, color: '#f59e0b' },
  { department: 'กองสาธารณสุข', percentage: 18, value: 441000, color: '#ef4444' },
  { department: 'กองการศึกษา', percentage: 10, value: 245000, color: '#8b5cf6' },
];
