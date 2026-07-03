
export const exportToCSV = (
    data: Record<string, any>[],
    filename: string = "report"
): void => {

    import("xlsx").then((XLSX) => {
        const worksheet = XLSX.utils.json_to_sheet(data);

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

        XLSX.writeFile(workbook, `${filename}.csv`);
    });
};

export const exportToExcel = (
    data: Record<string, any>[],
    filename: string = "report",
    sheetName: string = "Report"
): void => {
    import("xlsx").then((XLSX) => {
        const worksheet = XLSX.utils.json_to_sheet(data);

        const colWidths = Object.keys(data[0] || {}).map((key) => ({
            wch: Math.max(
                key.length,
                ...data.map((row) => String(row[key] || "").length)
            ),
        }));
        worksheet["!cols"] = colWidths;

        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, sheetName);

        XLSX.writeFile(workbook, `${filename}.xlsx`);
    });
};


export const exportToPDF = async (
    title: string,
    subtitle: string,
    columns: { header: string; dataKey: string }[],
    rows: Record<string, any>[],
    filename: string = "report"
): Promise<void> => {
    const { default: jsPDF } = await import("jspdf");
    const { default: autoTable } = await import("jspdf-autotable");

    const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

    doc.setFillColor(99, 102, 241);
    doc.rect(0, 0, 210, 28, "F");

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.text("Track-Vault", 14, 12);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text(title, 14, 20);

    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.text(subtitle, 14, 34);
    doc.text(
        `Generated: ${new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
            year: "numeric",
        })}`,
        14,
        40
    );

    autoTable(doc, {
        startY: 46,
        head: [columns.map((c) => c.header)],
        body: rows.map((row) => columns.map((c) => row[c.dataKey] ?? "")),
        theme: "striped",
        headStyles: {
            fillColor: [99, 102, 241],
            textColor: 255,
            fontStyle: "bold",
            fontSize: 9,
        },
        bodyStyles: {
            fontSize: 9,
            textColor: [50, 50, 50],
        },
        alternateRowStyles: {
            fillColor: [245, 247, 255],
        },
        margin: { left: 14, right: 14 },
    });

    const pageCount = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setTextColor(150);
        doc.text(
            `Page ${i} of ${pageCount} — Track-Vault Financial Report`,
            14,
            doc.internal.pageSize.height - 8
        );
    }

    doc.save(`${filename}.pdf`);
};
export const fmtExport = (amount: number): string =>
    `₹${Math.round(amount).toLocaleString("en-IN")}`;

export const fmtDateExport = (dateStr: string): string => {
    return new Date(dateStr).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
};