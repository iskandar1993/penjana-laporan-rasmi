export interface VipPerson {
  id: string;
  name: string;
  selected: boolean;
}

export interface AgendaItem {
  id: string;
  time: string;
  items: string[];
}

export interface SecurityDuty {
  id: string;
  title: string;
  count: number;
}

export interface ReportData {
  greeting: string;
  recipients: string[];
  title: string;
  date: string;
  timeRange: string;
  venue: string;
  securityDuties: SecurityDuty[];
  vips: VipPerson[];
  agendas: AgendaItem[];
  attendanceCount: string;
  customNotes: string;
  ulasanPoints: string[];
}
