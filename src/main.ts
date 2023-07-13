import { ImportedWebsite, importWebsites } from "./import";
import dotenv from 'dotenv';
import { performGetRequest } from "./puppeteer-fetch";
import puppeteer, { Browser } from "puppeteer";
import { composeOutput, writeToFile } from "./export";
import path from "path";
import cliProgress from 'cli-progress'

const argv = require('minimist')(process.argv.slice(2));
dotenv.config({ path: path.resolve(__dirname, '../.env') });

interface Params {
  Full: boolean,
  Timeout: number,
  RandomCoeff: number,
  ConcurrencyStep: number,
  Range: number,
}

const loadEnv = (env: Record<string, string>) : Params => {
  let {Range, RandomCoeff, ConcurrencyStep, Timeout, Full}  = env

  const result : Params = {
    Range: Number(Range),
    RandomCoeff: Full === "true" ? 1 : Number(RandomCoeff),
    ConcurrencyStep: Number(ConcurrencyStep),
    Timeout: Number(Timeout),
    Full: Full === "true" ? true : false
  }

  return result
}

// create a new progress bar instance and use shades_classic theme
const bar1 = new cliProgress.SingleBar({ 
  clearOnComplete: true,
  hideCursor: true,
  format: '[{bar}] {percentage}% | ETA: {eta}s',
}, cliProgress.Presets.shades_classic);

// start the progress bar with a total value of 200 and start value of 0
bar1.start(100, 0);

const {Range, Timeout, ConcurrencyStep, RandomCoeff, Full} = loadEnv({...process.env, ...argv})

let output = ''

const isWebsiteAccessible = async (
  browser: Browser,
  url: string,
  rank: number,
): Promise<boolean> => {
  try {

    const res = await performGetRequest(browser, url, Timeout * 1000)
    accessibleWeight += rank;
    output = composeOutput(`${url}: ✔`, output)
    return true;
  } catch (e: any) {
    output = composeOutput(`${url}: ✘`, output)
    return false;
  }
};

function shuffleArray<T>(array: T[]): T[] {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

const buildLink = (website: string) => {
  const isHttp = website.includes('http://')
  const isHttps = website.includes('https://')

  return isHttp || isHttps ? website : `https://${website}`;
}

let totalWeight = 0;
let accessibleWeight = 0;

const getExecutionQueue = (
  websites: ImportedWebsite[],
  browser: Browser,
) => {
  
  const execQueue = [] 
  
  for (let j = 0; j < websites.length; j = j + ConcurrencyStep) {
    const executionArray = [];
    for (let i = 0; i < ConcurrencyStep && i + j < websites.length; i++) {
      const index = i + j;
      const {url, rank} = websites[index]
      totalWeight += rank;
      executionArray.push(
        () => isWebsiteAccessible(browser, buildLink(url), rank)
        );
      }
      execQueue.push(executionArray)
    }
    
  return shuffleArray(execQueue)
  
};


const main = async () => {
  const start = Date.now();
  let websitesScanned = 0
  const websites : ImportedWebsite[] = await importWebsites(Range - 1, RandomCoeff);
  const browser = await puppeteer.launch({headless: 'new', args: ['--no-sandbox']});
  
  const shuffledExecutionQueue = getExecutionQueue(websites, browser)

  const interval = setInterval(() => {
    const percent = Math.floor(websitesScanned / websites.length * 100)
    bar1.update(percent);
  }, Timeout * 1000);
  
  for (const job of shuffledExecutionQueue) {
    await Promise.allSettled(job.map((item) => item()))
    websitesScanned += job.length
  }

  browser.close()

  const accessibilityPercentage = (accessibleWeight / totalWeight) * 100;
  const end = Date.now();
  bar1.stop();
  clearInterval(interval)
  console.log("Scan done in", (end - start) / 1000 / 60, "minutes");
  console.log(
    `Percentage of accessible websites: ${accessibilityPercentage.toFixed(2)}%`
    );
  output = composeOutput(`Percentage of accessible websites: ${accessibilityPercentage.toFixed(2)}%`, output)
  writeToFile('../output', `scan-${Date.now()}`, output)
  console.log("Check the output folder for the detailed result.")
};

main();
