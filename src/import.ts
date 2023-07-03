import { readFileSync } from "fs";
import * as XLSX from "xlsx";

export interface ImportedWebsite {
  rank: number;
  url: string;
}

export const importWebsites = async (range: number, randomCoefficient: number) => {
  // Read the Excel file
  const buf = readFileSync("../data/websites-2.xlsx");
  // const buf = readFileSync("../data/diag.xlsx");
  /* buf is a Buffer */

  const workbook = XLSX.read(buf);

  // Select the first sheet
  const worksheet = workbook.Sheets[workbook.SheetNames[0]];

  // console.log(worksheet)
  // Create an array to store the websites
  const websites: ImportedWebsite[] = [];

  // Iterate over the cells in each row
  for (let i = 1; i < range; i++) {
    const cell = worksheet[XLSX.utils.encode_cell({ r: i, c: 1 })];
    const standalone = worksheet[XLSX.utils.encode_cell({ r: i, c: 2 })];
    const alternativeUrl = worksheet[XLSX.utils.encode_cell({ r: i, c: 3 })];
    const duplicate = worksheet[XLSX.utils.encode_cell({ r: i, c: 5 })];
    const forbidden = worksheet[XLSX.utils.encode_cell({ r: i, c: 6 })];
    const regional = worksheet[XLSX.utils.encode_cell({ r: i, c: 7 })];
    const skip = worksheet[XLSX.utils.encode_cell({ r: i, c: 8 })];
    // console.log(XLSX.utils.encode_cell({ r: i, c: 1 }))
    // console.log(cell)
    // if (cell && forbidden?.v === 1) {
    //   websites.push(cell.v);
    // }
    if (
      (cell &&
        skip?.v !== 1 &&
        standalone?.v === 1 &&
        duplicate?.v !== 1 &&
        !forbidden?.v &&
        regional?.v !== 1) ||
      (cell &&
        alternativeUrl?.v &&
        skip?.v !== 1 &&
        duplicate?.v !== 1 &&
        !forbidden?.v &&
        regional?.v !== 1)
    ) {
      if (Math.random() > randomCoefficient) continue
      if (alternativeUrl) websites.push({url: alternativeUrl.v, rank: range - i});
      else websites.push({url: cell.v, rank: range - i});
    }
  }

  return websites;
};
