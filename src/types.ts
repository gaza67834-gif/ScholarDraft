export interface Proposal {
  id: string;
  title: string;
  draftId: string;
  author: string;
  lastSaved: string;
  content: string;
  outline: { title: string; content: string }[];
  progress: number;
  tags: string[];
}

export interface Paper {
  id: string;
  type: 'journal' | 'conference';
  title: string;
  authors: string;
  journal: string;
  year: number;
  abstract: string;
  citations: number;
  isPeerReviewed: boolean;
  isOpenAccess: boolean;
  isHighImpact: boolean;
  aiSummary?: string;
}

export interface Activity {
  id: string;
  collaborator: string;
  action: string;
  project: string;
  date: string;
  avatarUrl?: string;
  isAi?: boolean;
}

export interface Project {
  id: string;
  name: string;
  papersCount: number;
  papers: Paper[];
}
