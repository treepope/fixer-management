
import { Fixer, FixerStatus, Province, Skill, User } from "@/types";

export const statuses: FixerStatus[] = [
  { id: "active", name: "Active", name_th: "ใช้งาน", color: "#10b981" },
  { id: "inactive", name: "Inactive", name_th: "ไม่ใช้งาน", color: "#6b7280" },
  { id: "pending", name: "Pending", name_th: "รอดำเนินการ", color: "#f59e0b" },
  { id: "suspended", name: "Suspended", name_th: "ระงับชั่วคราว", color: "#ef4444" },
];

export const provinces: Province[] = [
  { id: "bangkok", name: "Bangkok", name_th: "กรุงเทพฯ" },
  { id: "chiang_mai", name: "Chiang Mai", name_th: "เชียงใหม่" },
  { id: "phuket", name: "Phuket", name_th: "ภูเก็ต" },
  { id: "khon_kaen", name: "Khon Kaen", name_th: "ขอนแก่น" },
  { id: "chonburi", name: "Chonburi", name_th: "ชลบุรี" },
];

export const skills: Skill[] = [
  { id: "engine", name: "Engine Repair", name_th: "ซ่อมเครื่องยนต์" },
  { id: "electrical", name: "Electrical Systems", name_th: "ระบบไฟฟ้า" },
  { id: "transmission", name: "Transmission", name_th: "ระบบส่งกำลัง" },
  { id: "tires", name: "Tire Replacement", name_th: "เปลี่ยนยาง" },
  { id: "battery", name: "Battery Service", name_th: "บริการแบตเตอรี่" },
  { id: "diagnostic", name: "Computer Diagnostics", name_th: "วินิจฉัยด้วยคอมพิวเตอร์" },
];

export const users: User[] = [
  {
    id: "1",
    email: "super@24carfix.com",
    name: "Super Admin",
    role: "super_admin",
    created_at: "2023-01-01T00:00:00Z",
    last_login: "2023-04-28T09:24:17Z",
  },
  {
    id: "2",
    email: "admin@24carfix.com",
    name: "Regular Admin",
    role: "admin",
    created_at: "2023-01-15T00:00:00Z",
    last_login: "2023-04-29T14:05:32Z",
  },
  {
    id: "3",
    email: "viewer@24carfix.com",
    name: "View Only",
    role: "viewer",
    created_at: "2023-02-01T00:00:00Z",
    last_login: "2023-04-27T11:32:08Z",
  },
];

const generateFixers = (count: number): Fixer[] => {
  const fixers: Fixer[] = [];
  
  for (let i = 1; i <= count; i++) {
    const statusIndex = Math.floor(Math.random() * statuses.length);
    const provinceIndex = Math.floor(Math.random() * provinces.length);
    const skillCount = Math.floor(Math.random() * 4) + 1;
    const skillSet = new Set<string>();
    
    while (skillSet.size < skillCount) {
      const randomSkill = skills[Math.floor(Math.random() * skills.length)].id;
      skillSet.add(randomSkill);
    }
    
    const totalJobs = Math.floor(Math.random() * 500) + 1;
    const completionRate = Math.round((Math.random() * 30) + 70);
    
    const fixer: Fixer = {
      id: `f${i}`,
      first_name: `Technician ${i}`,
      last_name: `Lastname ${i}`,
      phone: `081-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`,
      email: i % 3 === 0 ? `tech${i}@example.com` : undefined,
      province_id: provinces[provinceIndex].id,
      province: provinces[provinceIndex],
      status_id: statuses[statusIndex].id,
      status: statuses[statusIndex],
      skills: Array.from(skillSet),
      skillObjects: Array.from(skillSet).map(skillId => 
        skills.find(skill => skill.id === skillId)!
      ),
      hire_date: new Date(2022, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1).toISOString().split('T')[0],
      notes: i % 5 === 0 ? "Some notes about this technician's performance and areas of expertise." : undefined,
      total_jobs: totalJobs,
      completion_rate: completionRate,
      created_at: new Date(2022, 0, 1).toISOString(),
      updated_at: new Date().toISOString(),
    };
    
    fixers.push(fixer);
  }
  
  return fixers;
};

export const fixers: Fixer[] = generateFixers(100);
