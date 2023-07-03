import { ImportedWebsite, importWebsites } from "./import";
import dotenv from 'dotenv';
import ora from 'ora';
import { performGetRequest } from "./puppeteer-fetch";
import puppeteer, { Browser } from "puppeteer";
import { composeOutput, writeToFile } from "./export";
dotenv.config();

const full = process.env?.mode === "full"
const RANGE = 1000;
const RANDOM_COEF = full ? 1 : 0.1
const ConcurrencyStep = 1;
const Timeout = 7.5
let output = ''

// const DEBUG = false;


const spinner = ora({text: '', spinner: 'moon', color: 'yellow'}).start();


const problemMakers : any = {}

const estimateTime = (length: number, concurrency: number, timeout: number) => {
  console.log(length, concurrency, timeout)
  const seconds = Math.ceil((length / concurrency) * timeout);
  return seconds;
}

const isWebsiteAccessible = async (
  browser: Browser,
  url: string,
  rank: number,
  index: number
): Promise<boolean> => {
  try {

    const res = await performGetRequest(browser, url, Timeout * 1000)
    accessibleWeight += rank;
    output = composeOutput(`${url}: ✔`, output)
    return true;
  } catch (e: any) {
    output = composeOutput(`${url}: ✘`, output)
    if (problemMakers[url]) {
      problemMakers[url] = problemMakers[url] + 1
    } else problemMakers[url] = 1
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

const calculateAccessibilityPercentage = async (
  websites: ImportedWebsite[]
): Promise<number> => {

  const browser = await puppeteer.launch({headless: 'new', args: ['--no-sandbox']});
  const execQueue: any[] = [] 

  for (let j = 0; j < websites.length; j = j + ConcurrencyStep) {
    const executionArray : any[] = [];
    for (let i = 0; i < ConcurrencyStep && i + j < websites.length; i++) {
      const index = i + j;
      const {url, rank} = websites[index]
      totalWeight += rank;
      executionArray.push(
        () => isWebsiteAccessible(browser, buildLink(url), rank, index)
      );
    }
    execQueue.push(executionArray)
  }

  const shuffeledExecQueue = shuffleArray(execQueue)
  for (let i = 0; i < shuffeledExecQueue.length; i++) {
    await Promise.allSettled(shuffeledExecQueue[i].map((item: any) => item()))
  }
  browser.close()
  return (accessibleWeight / totalWeight) * 100;
};

const main = async () => {
  const start = Date.now();
  const websites : ImportedWebsite[] = await importWebsites(RANGE - 1, RANDOM_COEF);
  const eta = estimateTime(websites.length, ConcurrencyStep, Timeout)
  console.log("Estimated Time:", eta, "Seconds")
  setInterval(() => {
    const now = Date.now()
    const percent = Math.floor((now - start) / eta / 10)
    spinner.text = `Running: ${percent}%`;
    // spinner.spinner = 'moon';
  }, 500);
  const accessibilityPercentage = await calculateAccessibilityPercentage(
    websites
  );
  const end = Date.now();
  console.log("Scan done in", (end - start) / 1000 / 60, "minutes");
  console.log(
    `Percentage of accessible websites: ${accessibilityPercentage.toFixed(2)}%`
    );
  writeToFile('../output', 'scan', output)
  console.log("Check output folder for the detailed result.")
  spinner.stop()
};

main();
