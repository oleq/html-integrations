/**
 * This file is a prototype on what should be
 * the conversion from md to html
 */

/**
    const fs = require('fs');
    const MarkdownIt = require('markdown-it');

    // Create the markdown variable
    const md = new MarkdownIt();

    // Read the readme file of interest
    const markdownData = fs.readFileSync('README.md', 'utf8');

    // Render the markdown data to html data
    const result = md.render(markdownData);

    // Write the html data to a file
    fs.writeFileSync('foo.html', result);
*/

const fs = require('fs');
const MarkdownIt = require('markdown-it');

// Create the markdown variable
const md = new MarkdownIt();

function readWriteFile(file, dir, name) {
    // Create folder if it does not exist
    fs.mkdirSync(dir, { recursive: true });

    // Read the readme file of interest
    const markdownData = fs.readFileSync(file, 'utf8');
    
    // Render the markdown data to html data
    const markdownRendered = md.render(markdownData);

    // Write the html data to a file
    fs.writeFileSync(dir + name, markdownRendered);
}

const writeFiles = () => new Promise((resolve) => {
    // require the folder that contains the files paths 
    const mdFolders = require('./md.json'); // eslint-disable-line global-require
  
    // Save all the routes in a object to run the test execution in one line
    const mdPaths = Object.values(mdFolders);  //eslint-disable-line
  
    resolve(
      Promise.all(
        mdPaths.map(async (file) => { 
            readWriteFile(file.path, file.dest, file.name);
        }), 
      ),
    );
  });

// This file is being executed as a script.
if (!module.parent) {
    // Process args
    const args = process.argv.slice(2);
  
    // Log a warning if there are more than 0 arguments
    if (args.length > 0) {
      emitWarning('No parameters needed, all the additional parameters will be ignored.');
    }
  
    // Execute all the tests and resolve when finished
    writeFiles();
  } else { // This file is being imported as a module.
    module.exports = markdownit;
  }
