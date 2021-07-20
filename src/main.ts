import { readFileSync } from 'fs';

import getStdin from 'get-stdin';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { DateTime, Duration } from 'luxon';

import {
  WatsonReport,
  WatsonReportEntry,
  WatsonReportProject
} from './watsonReport';

interface ProjectReportEntry {
  project: string;
  total: Duration;
  entries: ReportEntry[];
}

interface ReportEntry {
  name: string;
  total: Duration;
  subEntries?: ReportEntry[];
}

const createNewProjectReportEntry = (project: string): ProjectReportEntry => ({
  project,
  total: Duration.fromMillis(0),
  entries: []
});

const findEntryByName = (
  name: string,
  entry: ReportEntry
): ReportEntry | undefined => {
  if (entry.name === name) return entry;
  else
    return entry.subEntries?.find(subEntry => findEntryByName(name, subEntry));
};

const formReport = (
  watsonReportEntries: WatsonReportEntry[]
): ProjectReportEntry[] =>
  watsonReportEntries.reduce<ProjectReportEntry[]>((acc, entry) => {
    const project =
      acc.find(({ project }) => project === entry.project) ||
      createNewProjectReportEntry(entry.project);

    // надо использовать entry.tags.join() as key
    // искать entryRoot по entryRoot.name.includes(key)

    const entryRoot = project.entries.find(entryProject =>
      findEntryByName(entry.tags.join(), entryProject)
    );

    return 1 as any;
  }, []);

async function main() {
  const { argv: argvPromise } = yargs(hideBin(process.argv))
    .option('input', {
      alias: 'i',
      boolean: true
    })
    .option('file', {
      alias: 'f',
      coerce: path => (path ? readFileSync(path) : null)
    })
    .demandCommand(1)
    .conflicts('file', 'input');

  const argv = await argvPromise;

  console.log(argv);

  // if (argv.input)
}

main();
