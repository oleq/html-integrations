/**
 * This file is a prototype on what should be
 * the conversion from md to html
 */

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
