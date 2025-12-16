import { readFileSync } from "fs";
import { join } from "path";
import { parse } from "csv-parse/sync";
import WordsTable from "./components/WordsTable";

export interface Word {
  word: string;
  finnish: string;
  english: string;
  russian: string;
  type: string;
  group: string;
}

export default function Home() {
  // Read the CSV file
  const csvPath = join(process.cwd(), "OmaSuomi words.csv");
  const csvContent = readFileSync(csvPath, "utf-8");
  
  // Parse CSV using csv-parse library
  const records = parse(csvContent, {
    delimiter: ";",
    columns: true,
    skip_empty_lines: true,
    trim: true,
  }) as Array<{
    word: string;
    finnish: string;
    english: string;
    russian: string;
    type: string;
    group: string;
  }>;

  // Map to Word interface
  const words: Word[] = records.map((record) => ({
    word: record.word || record.finnish,
    finnish: record.finnish || record.word,
    english: record.english,
    russian: record.russian,
    type: record.type,
    group: record.group,
  }));

  // Sort words alphabetically by the word column
  const sortedWords = [...words].sort((a, b) => {
    return a.word.localeCompare(b.word, 'fi');
  });

  return <WordsTable words={sortedWords} />;
}
