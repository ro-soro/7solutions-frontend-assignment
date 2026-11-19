// รูปแบบ response ของ API ตามที่โจทย์กำหนด
// API response shape required by the assignment.
export interface DepartmentSummaryResponse {
  male: number;
  female: number;
  ageRange: string;
  hair: Record<string, number>;
  addressUser: Record<string, string>;
}

export type DepartmentSummaryListResponse = Record<
  string,
  DepartmentSummaryResponse
>;

// ตัวเลขสรุปของแต่ละแผนกที่หน้าเว็บใช้ อายุเก็บเป็นตัวเลข ไม่ต้องไปแยกจาก string "25-46"
// Per-department numbers used by the page; ages stay numbers instead of the "25-46" string.
export interface DepartmentStats {
  male: number;
  female: number;
  minAge: number;
  maxAge: number;
  hair: Record<string, number>;
  addressUser: Record<string, string>;
}

export type DepartmentStatsList = Record<string, DepartmentStats>;
