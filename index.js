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

function mergeCodeFiles(directory, excludeFiles) {
  const allFiles = readFiles(directory, [], excludeFiles);
  const jsonContent = JSON.stringify(allFiles, null, 2);
  fs.writeFileSync("merged_code_files.json", jsonContent);
  console.log("Files merged into merged_code_files.json");
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
  ]);

  return {
    directory: answers.path,
    exclude: answers.exclude.split(",").map((s) => s.trim()),
  };
}

async function main() {
  const { directory, exclude } = await promptForInputs();

  if (!fs.existsSync(directory)) {
    console.error("Directory does not exist.");
    return;
  }

  const resolvedDirectory = path.resolve(directory);
  mergeCodeFiles(resolvedDirectory, exclude);
}

main();
