// Load scripts
import '@wiris/mathtype-froala3/wiris.js';

// Load styles 
import 'froala-editor/css/froala_editor.pkgd.min.css';
import './style.css';

// Initialize editor.
new FroalaEditor('#editor', {
    // toolbarButtons: ['undo', 'redo' , 'bold', '|','clear', 'insert']
    toolbarButtons: ['undo', 'redo' , 'bold', '|', 'wirisEditor', 'wirisChemistry','clear', 'insert'],

    // Add [MW] buttons to Image Toolbar.
    imageEditButtons: ['wirisEditor', 'wirisChemistry', 'imageDisplay', 'imageAlign', 'imageInfo', 'imageRemove'],

    // Allowed tags
    htmlAllowedTags:   ['.*'],
    htmlAllowedAttrs: ['.*'], 
});