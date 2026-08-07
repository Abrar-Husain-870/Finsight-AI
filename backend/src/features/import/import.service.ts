import { importRepository } from './import.repository.js';
import { ImportPreviewResponse, ParsedRow, ColumnMapping, toMinor } from '@finsight/shared';
import { prisma } from '../../../prisma/index.js';
import Papa from 'papaparse';
import { NotFoundError, ValidationError } from '../../core/errors/app-error.js';

export class ImportService {
  async processPreview(userId: string, fileBuffer: Buffer, mapping: ColumnMapping): Promise<ImportPreviewResponse> {
    const csvContent = fileBuffer.toString('utf-8');
    const parseResult = Papa.parse(csvContent, {
      header: true,
      skipEmptyLines: true
    });

    const headers = parseResult.meta.fields || [];
    const rows = parseResult.data as Record<string, string>[];
    const parsedRows: ParsedRow[] = [];

    let validRowsCount = 0;
    let duplicateRowsCount = 0;

    // Fetch existing categories for suggestions
        // Fetch last 100 transactions to find merchant-category patterns
    const recentTx = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 100,
      select: { merchant: true, categoryId: true, category: { select: { name: true } } }
    });

    const merchantToCategory = new Map<string, { id: string, name: string }>();
    for (const tx of recentTx) {
      if (tx.merchant && tx.categoryId) {
        merchantToCategory.set(tx.merchant.toLowerCase(), { id: tx.categoryId, name: tx.category.name });
      }
    }

    // Prepare duplicate check constraints (could be large, ideally optimized, but for MVP we check dates and amounts)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 90);
    const recentDbTx = await prisma.transaction.findMany({
      where: { userId, date: { gte: thirtyDaysAgo }, deletedAt: null },
      select: { date: true, amount: true, merchant: true }
    });

    for (let i = 0; i < rows.length; i++) {
      const row = rows[i] || {};
      const errors: string[] = [];
      let isValid = true;
      let isDuplicate = false;

      // Extract mapped fields
      const rawDate = row[mapping.date];
      const rawAmount = row[mapping.amount];
      const rawMerchant = row[mapping.merchant];
      const rawDesc = mapping.description ? row[mapping.description] : undefined;

      const mappedData: { date?: string; amount?: number; merchant?: string; description?: string } = {};

      // Parse Date
      let parsedDate: Date | null = null;
      if (!rawDate) {
        errors.push('Date is missing');
        isValid = false;
      } else {
        parsedDate = new Date(rawDate);
        if (isNaN(parsedDate.getTime())) {
          errors.push('Invalid date format');
          isValid = false;
        } else {
          mappedData.date = parsedDate.toISOString();
        }
      }

      // Parse Amount
      let parsedAmountMinor: number = 0;
      if (!rawAmount) {
        errors.push('Amount is missing');
        isValid = false;
      } else {
        // Strip symbols and parse
        const cleanAmount = rawAmount.replace(/[^\d.-]/g, '');
        const amountFloat = parseFloat(cleanAmount);
        if (isNaN(amountFloat)) {
          errors.push('Invalid amount format');
          isValid = false;
        } else {
          parsedAmountMinor = toMinor(amountFloat);
          mappedData.amount = parsedAmountMinor;
        }
      }

      mappedData.merchant = rawMerchant ? String(rawMerchant).trim() : '';
      mappedData.description = rawDesc ? String(rawDesc).trim() : '';

      // Check Duplicates
      if (isValid && parsedDate) {
        // Compare with DB (exact date match and amount)
        const isDbDup = recentDbTx.some(tx => 
          tx.date.toISOString().split('T')[0] === parsedDate!.toISOString().split('T')[0] &&
          tx.amount === parsedAmountMinor &&
          (tx.merchant === mappedData.merchant || (!tx.merchant && !mappedData.merchant))
        );
        if (isDbDup) {
          isDuplicate = true;
          duplicateRowsCount++;
        }
      }

      if (isValid) {
        validRowsCount++;
      }

      // Suggest Category
      let suggestedCategoryId: string | undefined;
      let suggestedCategoryName: string | undefined;

      if (mappedData.merchant) {
        const suggestion = merchantToCategory.get(mappedData.merchant.toLowerCase());
        if (suggestion) {
          suggestedCategoryId = suggestion.id;
          suggestedCategoryName = suggestion.name;
        }
      }

      parsedRows.push({
        index: i,
        data: row,
        mappedData,
        isValid,
        errors,
        isDuplicate,
        suggestedCategoryId,
        suggestedCategoryName
      });
    }

    const session = await importRepository.createSession(userId, {
      status: 'PENDING',
      totalRows: rows.length,
      parsedData: JSON.stringify(parsedRows),
      mapping: JSON.stringify(mapping)
    });

    return {
      sessionId: session.id,
      headers,
      rows: parsedRows,
      totalRows: rows.length,
      validRows: validRowsCount,
      duplicateRows: duplicateRowsCount
    };
  }

  async commitSession(userId: string, sessionId: string, categoryMapping: Record<number, string>) {
    const session = await importRepository.getSession(sessionId, userId);
    if (!session) throw new NotFoundError('Import session not found');
    if (session.status !== 'PENDING') throw new ValidationError('Session is already processed');

    const parsedRows = (typeof session.parsedData === 'string' ? JSON.parse(session.parsedData) : session.parsedData) as ParsedRow[] || [];
    
    let successCount = 0;
    

    const txToCreate = [];

    for (const row of parsedRows) {
      if (!row.isValid || row.isDuplicate) {
        
        continue;
      }

      const categoryId = categoryMapping[row.index];
      if (!categoryId) {
        
        continue; // Cannot import without a category
      }

      txToCreate.push({
        userId,
        categoryId,
        amount: row.mappedData.amount!,
        currency: 'USD',
        date: new Date(row.mappedData.date!),
        merchant: row.mappedData.merchant || null,
        description: row.mappedData.description || null,
      });
      successCount++;
    }

    if (txToCreate.length > 0) {
      await prisma.transaction.createMany({
        data: txToCreate
      });
    }

    await importRepository.updateSession(sessionId, {
      status: 'COMPLETED',
      successRows: successCount,
      failedRows: session.totalRows - successCount
    });

    return {
      id: session.id,
      status: 'COMPLETED',
      totalRows: session.totalRows,
      successRows: successCount,
      failedRows: session.totalRows - successCount,
      createdAt: session.createdAt.toISOString()
    };
  }
}

export const importService = new ImportService();
