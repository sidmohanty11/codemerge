# codemerge

`codemerge` is a simple, yet powerful command-line tool for merging all your code files into a single JSON file. This tool is especially handy for developers who need to aggregate source code from various files for analysis, backup, or documentation purposes.

![Screenshot 2023-12-31 at 9 51 12 PM](https://github.com/sidmohanty11/codemerge/assets/73601258/dd7ccf29-4321-4941-b66c-21f09b689fba)

## Features

- **Easy to Use**: Run `codemerge` in any directory to merge your code files.
- **Customizable**: Exclude specific files or directories.
- **Comprehensive**: Supports various code file types.
- **Interactive Prompts**: Guided experience using `inquirer.js`.

## Why It's Useful?

- **GPT Builders**: By merging code into a single JSON, `codemerge` simplifies the process of using code repositories for training AI models, such as GPT. This can be invaluable for understanding large codebases or for building AI-powered coding assistants.

## Usage

Run the tool in the directory where your code files are located:

```bash
npx codemerge
```

Upon running, codemerge will:

1. Prompt you to enter the path to the directory (or use the current directory by default).
2. Ask for comma-separated file names or directories that you want to exclude (e.g., node_modules, .env).

The tool will then generate a `merged_code_files.json` file in your current directory containing the contents of all your code files, formatted as an array of objects with `path` and `content` keys.

## Output Format

The output JSON file will have the following format:

```json
[
  {
    "path": "/path/to/file1.js",
    "content": "code content here..."
  },
  {
    "path": "/path/to/file2.py",
    "content": "code content here..."
  }
  // ... more files
]
```

## Supported File Types
`codemerge` supports various code file types, including but not limited to `.js`, `.py`, `.html`, `.css`. Feel free to extend this as per your requirements.

## Contributing
Contributions are welcome! If you have a suggestion or fix, please open a pull request or issue in the repository.

## License
codemerge is open-sourced software licensed under the MIT license.
