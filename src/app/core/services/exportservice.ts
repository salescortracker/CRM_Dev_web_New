import { Service } from '@angular/core';
import { Injectable } from '@angular/core';
// import * as XLSX from 'xlsx';
// import jsPDF from 'jspdf';
// import autoTable from 'jspdf-autotable';
// import * as FileSaver from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class Exportservice {
  //   constructor() { }

  // // ================= EXCEL =================

  // exportToExcel(data: any[], fileName: string): void {

  //   const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(data);

  //   const workbook: XLSX.WorkBook = {
  //     Sheets: {
  //       Data: worksheet
  //     },
  //     SheetNames: ['Data']
  //   };

  //   const excelBuffer = XLSX.write(workbook, {
  //     bookType: 'xlsx',
  //     type: 'array'
  //   });

  //   const blob = new Blob(
  //     [excelBuffer],
  //     {
  //       type:
  //         'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8'
  //     }
  //   );

  //   FileSaver.saveAs(blob, `${fileName}.xlsx`);
  // }

  // // ================= PDF =================

  // exportToPdf(
  //   title: string,
  //   headers: string[],
  //   body: any[][],
  //   fileName: string
  // ): void {

  //   const pdf = new jsPDF();

  //   pdf.setFontSize(16);

  //   pdf.text(title, 14, 15);

  //   autoTable(pdf, {
  //     head: [headers],
  //     body: body,
  //     startY: 25,
  //     styles: {
  //       fontSize: 9
  //     },
  //     headStyles: {
  //       fillColor: [220, 53, 69]
  //     }
  //   });

  //   pdf.save(`${fileName}.pdf`);
  // }
}
