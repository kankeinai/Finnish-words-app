import { readFileSync } from "fs";
import { join } from "path";
import { parse } from "csv-parse/sync";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const csvPath = join(process.cwd(), "OmaSuomi words.csv");
    const csvContent = readFileSync(csvPath, "utf-8");
    
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

    const words = records.map((record) => ({
      word: record.word || record.finnish,
      finnish: record.finnish || record.word,
      english: record.english,
      russian: record.russian,
      type: record.type,
      group: record.group,
    }));

    return NextResponse.json(words);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to load words" },
      { status: 500 }
    );
  }
}

