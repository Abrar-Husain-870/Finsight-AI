
export interface ColumnMapping {
  date: string;
  amount: string;
  merchant: string;
  description?: string | undefined;
}

export interface ParsedRow {
  index: number;
  data: Record<string, string>;
  mappedData: {
    date?: string | undefined;
    amount?: number | undefined;
    merchant?: string | undefined;
    description?: string;
  };
  isValid: boolean;
  errors: string[];
  isDuplicate: boolean;
  suggestedCategoryId?: string | undefined;
  suggestedCategoryName?: string | undefined;
}

export interface ImportPreviewResponse {
  sessionId: string;
  headers: string[];
  rows: ParsedRow[];
  totalRows: number;
  validRows: number;
  duplicateRows: number;
}

export interface ImportCommitRequest {
  sessionId: string;
  categoryMapping: Record<number, string>; // rowIndex -> categoryId
}

export interface ImportSessionResponse {
  id: string;
  status: string;
  totalRows: number;
  successRows: number;
  failedRows: number;
  createdAt: string;
}
