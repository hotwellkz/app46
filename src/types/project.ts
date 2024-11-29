export interface Project {
  id: string;
  clientName: string;
  status: 'building' | 'deposit' | 'built';
  progress: number;
  budget: number;
  deadline: Date;
  createdAt: Date;
  constructionDays: number;
  year: number;
  photos: string[];
  address: string;
}