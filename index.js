#!/usr/bin/env node

const fs = require("fs");
const path = require("path");
const inquirer = require("inquirer");

const DEFAULT_EXCLUDE_FILES = [
  "node_modules",
  "package-lock.json",
  "yarn.lock",
];

function excludeFile(file, excludeFiles) {
  if (file.startsWith(".") || excludeFiles.includes(file)) {
    return true;
  }
  return false;
}

function readFiles(directory, filelist = [], excludeFiles) {
  const files = fs.readdirSync(directory);
  files.forEach((file) => {
    if (excludeFile(file, excludeFiles)) {
      return;
    }

    const filepath = path.join(directory, file);
    if (fs.statSync(filepath).isDirectory()) {
      filelist = readFiles(filepath, filelist, excludeFiles);
    } else {
      let content = fs.readFileSync(filepath, "utf8");
      content = content.trim();
      filelist.push({ path: filepath, content: content });
    }
  });
  return filelist;
}

function minifyJSONContent(jsonContent) {
  return JSON.stringify(JSON.parse(jsonContent));
}

function splitAndSaveJSONContent(jsonContent, baseFileName, maxSize) {
  let part = 1;
  for (let start = 0; start < jsonContent.length; start += maxSize, part++) {
    const chunk = jsonContent.substring(start, start + maxSize);
    fs.writeFileSync(`${baseFileName}_part${part}.json`, chunk);
  }
  console.log(`Files split into multiple parts (${part - 1})`);
}

function mergeCodeFiles(directory, excludeFiles, maxSize) {
  const allFiles = readFiles(directory, [], excludeFiles);
  let jsonContent = JSON.stringify(allFiles);
  jsonContent = minifyJSONContent(jsonContent);

  if (maxSize && Buffer.byteLength(jsonContent, "utf8") > maxSize) {
    splitAndSaveJSONContent(jsonContent, "merged_code_files", maxSize);
  } else {
    fs.writeFileSync("merged_code_files.json", jsonContent);
    console.log("Files merged into merged_code_files.json");
  }
}

async function promptForInputs() {
  const answers = await inquirer.prompt([
    {
      type: "input",
      name: "path",
      message: "Enter the path to the directory (or . for current):",
      default: ".",
    },
    {
      type: "input",
      name: "exclude",
      message: "Enter comma-separated files or directories to exclude:",
      default: DEFAULT_EXCLUDE_FILES.join(","),
    },
    {
      type: "input",
      name: "maxSize",
      message: "Enter the maximum file size in MB for each JSON file (leave empty for unlimited):",
      default: "",
      filter: (input) => {
        return input ? parseInt(input) * 1024 * 1024 : null;
      },
    },
  ]);

  return {
    directory: answers.path,
    exclude: answers.exclude.split(",").map((s) => s.trim()),
    maxSize: answers.maxSize,
  };
}

async function main() {
  const { directory, exclude, maxSize } = await promptForInputs();

  if (!fs.existsSync(directory)) {
    console.error("Directory does not exist.");
    return;
  }

  const resolvedDirectory = path.resolve(directory);
  mergeCodeFiles(resolvedDirectory, exclude, maxSize);
}

main();
