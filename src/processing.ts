import {levenshteinEditDistance} from 'levenshtein-edit-distance'

export const detectDuplicates = (websites: string[]) => {
  const duplicates : string[][] = websites.map((_) => [])

  const ws = websites.map((website) => website.split('.')[0])
  ws.forEach((website, index) => {
    ws.forEach((w2, index2) => {
      if (index === index2) return;
      if (levenshteinEditDistance(website, w2) < Math.ceil(website.length / 3)) {
        if (duplicates[index].length === 0) duplicates[index].push(website)
        duplicates[index].push(w2)
      }
    })
  })

  return duplicates.filter((item) => item.length !== 0)
}