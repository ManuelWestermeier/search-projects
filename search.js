const { error, log } = require("console");
const fs = require("fs");
const { join, normalize } = require("path");
const { argv, exit } = require("process");

const argumentIndex = 2;

// Ensure argument is provided
if (!argv[argumentIndex]) {
  error("You must input one argument (the folder to search)");
  exit(1);
}

const searchTerms = argv[argumentIndex].split(/\s+/g);

try {
  const currentDir = process.cwd();

  // Get all directories in the current folder
  const foldersInFolder = fs.readdirSync(currentDir).filter((pathName) => {
    const fullPath = join(currentDir, pathName);
    return fs.statSync(fullPath).isDirectory();
  });

  function includesSearch(folderName) {
    // Check if all search terms are present
    return searchTerms.every((term) => folderName.includes(term));
  }

  const out = [];

  // Search through subdirectories
  for (const subFolder of foldersInFolder) {
    console.log(`scanning ./${subFolder}/ ...`);

    const subFolderPath = join(currentDir, subFolder);

    // Get the folders inside each subFolder
    const subFolders = fs.readdirSync(subFolderPath).filter((pathName) => {
      const fullPath = join(subFolderPath, pathName);
      return fs.statSync(fullPath).isDirectory();
    });

    // Check if folder names match the search terms
    for (const subFolderName of subFolders) {
      console.log(`\t ./${subFolder}/${subFolderName}/`);

      if (includesSearch(subFolderName)) {
        log(join(subFolder, subFolderName)); // Log the relative path
        out.push(`./${subFolder}/${subFolderName}/`);
      }
    }
  }

  console.log(`\n${out.length} results found`);
  out.forEach((path) => {
    console.log("\t" + join(__dirname, path));
  });
} catch (mainError) {
  error(`Error reading folders: ${mainError.message}`);
  exit(1);
}
