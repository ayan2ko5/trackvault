
import { useState } from "react";
import {
    exportToCSV,
    exportToExcel,
    exportToPDF,
    fmtExport,
    fmtDateExport,
} from "@/utils/exportHelpers";
import toast from "react-hot-toast";
import type { Transaction } from "@/types/transaction.types";

interface ExportData {
    transactions: Transaction[];
    categoryBreakdown: Array<{ category: string; amount: number; count: number }>;
    totalIncome: number;
    totalExpenses: number;
    savings: number;
    period: string;
}

const useExport = () => {
    const [isExporting, setIsExporting] = useState(false);

    const prepareTransactionRows = (transactions: Transaction[]) =>
        transactions.map((t) => ({
            Date: fmtDateExport(t.date),
            Type: t.type,
            Category: t.category,
            Amount: fmtExport(t.amount),
            "Payment Method": t.paymentMethod || "—",
            Note: t.note || "—",
        }));



    const downloadCSV = async (data: ExportData) => {
        setIsExporting(true);
        try {
            const rows = prepareTransactionRows(data.transactions);
            exportToCSV(rows, `trackvault-transactions-${data.period}`);
            toast.success("CSV downloaded!");
        } catch (e) {
            toast.error("Failed to export CSV");
        } finally {
            setIsExporting(false);
        }
    };

    const downloadExcel = async (data: ExportData) => {
        setIsExporting(true);
        try {

            const txnRows = prepareTransactionRows(data.transactions);

            exportToExcel(txnRows, `trackvault-report-${data.period}`, "Transactions");
            toast.success("Excel file downloaded!");
        } catch (e) {
            toast.error("Failed to export Excel");
        } finally {
            setIsExporting(false);
        }
    };

    const downloadPDF = async (data: ExportData) => {
        setIsExporting(true);
        try {
            const txnCols = [
                { header: "Date", dataKey: "Date" },
                { header: "Type", dataKey: "Type" },
                { header: "Category", dataKey: "Category" },
                { header: "Amount", dataKey: "Amount" },
                { header: "Method", dataKey: "Payment Method" },
                { header: "Note", dataKey: "Note" },
            ];

            const txnRows = prepareTransactionRows(data.transactions);

            await exportToPDF(
                `${data.period} Financial Report`,
                `Income: ${fmtExport(data.totalIncome)}  |  Expenses: ${fmtExport(data.totalExpenses)}  |  Savings: ${fmtExport(data.savings)}`,
                txnCols,
                txnRows,
                `trackvault-report-${data.period}`
            );

            toast.success("PDF downloaded!");
        } catch (e) {
            console.error(e);
            toast.error("Failed to export PDF");
        } finally {
            setIsExporting(false);
        }
    };

    return {
        isExporting,
        downloadCSV,
        downloadExcel,
        downloadPDF,
    };
};

export default useExport;