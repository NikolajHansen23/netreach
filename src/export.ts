import * as fs from 'fs';


export const composeOutput = (element: string, accumulator: string = '') => {
  const result = accumulator + `\n` + element 
  return result;
}

export const writeToFile = (directoryPath: string, fileName: string, data: string) => {
  // Create directory if it doesn't exist
  if (!fs.existsSync(directoryPath)) {
    fs.mkdirSync(directoryPath, { recursive: true });
  }

  // Write to file
  fs.writeFileSync(`${directoryPath}/${fileName}.txt`, data);
}