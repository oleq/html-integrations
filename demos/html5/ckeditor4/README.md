# Example integrating Mathtype and Enhanced Image plugins on CKEditor4

- [Executive Summary](#executive-summary)
- [Context](#context)
  - [Issues detected so far](#issues-detected-so-far)
- [Research purpose](#research-purpose)
  - [How to run the demo](#how-to-run-the-demo)
  - [How to manually test the demo](#how-to-manually-test-the-demo)
  - [The downlodable demo](#the-downlodable-demo)
- [Drawbacks](#drawbacks)
- [Bugs](#bugs)

## Executive Summary

**Enhanced image and MathType plugins for CKEditor4 can be considered compatibles and can be used together**.

Both plugins use the `img` tag for their own purposes, causing [some issues that have been detected, so far](#11-issues-detected-so-far).

We've built a CKEditor4 demo using Enhanced Image2 and MathType plugins together in a way that solves and/or mitigates the issues mentioned above.

Even though, there are some [drawbacks](#drawbacks) with this solution and, at least, [a bug has been detected](#bugs) on the image plugin. 

You can try it by yourself with a [proof-of-concept demo](#how-to-try-it) we've prepared that uses the [@wiris/mathtype-ckeditor4](https://www.npmjs.com/package/@wiris/mathtype-ckeditor4) package. 

For you're convenience, we've prepared a step-by-step guide with the [custom integration settings](#how-to-reproduce-it) from the demo's source code.

## Context

*MathType plugin allows to type and handwrite mathematical notation on the CKEditor and include quality math equations in the document.*

*The Enhanced Image is an optional plugin, introduced in CKEditor 4.3, that supports inserting images into the editor, and subsitutes the default 'image' plugin.*

Both plugins affect the markup inside the editor and depend heavily on the `img` element manipulation and supports double-click event on it.

The Enhanced Image plugin offers these features to manage image elements:

1. Dynamic "click and drag" resizing of images.
2. Dynamic "click and drag" moving of images.
3. An option to integrate image captions.
4. An option to align images.

While MathType plugin uses some custom attributes and a predefined class on the affected `img` elements, the Enhanced Image plugin wraps them with other different elements and accepts different configuration values and HTML templates to fit the user needs. 

Therefore, we can expect collisions between both CKEditor4 plugins when they are used at the same time.

### Issues detected so far

From the information reported from our clients and the Customer Success team, we've found that:

1. **Drag and drop *Image format mathematical formulas* doesn't work** as expected and stops working when errors appear on the console.
2. **Resize *Image format mathematical formulas* does not work**: the image is not resized.
3. **Changes made with MathType editor are lost** after an *Image format mathematical formulas* is edited with the "Enhanced Image" plugin, or dragged or aligned.


## Research purpose

The purpose of this research is to build a CKEditor4 demo using Enhance Image and MathType plugins together in a way that solves and/or mitigates the issues mentioned above.

**The premise is to use the CKEditor API while not making any change on any of the plugins source code to integrate them together**.

At the same time, any unexpected behavior on the MathType plugin resulting of this experiment, will be registered as an issue in our backlog in order to be fixed whenever possible.

We've prepared an example demo and its source code is avaiable at [src/app.js](src/app.js) file.

*asasdas*

This demo allows to: 

1. **Edit Mathematical formulas** using MathType editor is allowed.
2. **Edit images** with the Enhanced Image editor is allowed.
3. **Align images and Mathematical formula** images.
4. **Move images and Mathematical formula** images around the editor's content: drag&drop and/or cut&paste.

### How to run the demo

1. We've prepared [an online demo on jsfiddle.net](https://jsfiddle.net/dcanet/a0qo34dg/30/show) of **a default installation** of CKEditor4 using MathType Web, Enhanced Image and Justify plugins, to reproduce the informed issues.

2. Then, we've prepared [an online demo on jsfiddle.net](https://jsfiddle.net/dcanet/h21ksu0v/30/show) of **a custom installation** of CKEditor4 using MathType Web, Enhanced Image and Justify plugins. It takes advantadge of the CKEDITOR API to fix or mitigate some of the incompatibility issues detected between these plugins.

3. Finally, there's also a downlodable demo from the `html-repository` that includes a fix on the image2 plugin for the justify bug; see section below.

### How to manually test the demo

Then follow these instructions to test the demo:

1. Edit the formula with MathType editor and change it to a different value
2. Select the the formula and click the 'center' or 'right' align command buttons.
3. Use the contextual menu, right click with the mouse, on the formula image.
4. Select the formula and press enter, (nothing should happen ^_^).
5. Use the contextual menu, right click with the mouse, on the cat's image and select 'Image properties'.
6. Edit the image with the contextual menu and save values.
7. Drag several times the cat's image on the editor's window.
8. Select the image and press enter, the image editor should appear.
9. Resize the cat's image on the editor's window with the click&drag option.
10. Cut the formula using the contextual menu.
11. Move the formula by pasting it somewhere else on the editor's window. 


### The downlodable demo

This example tries to show how to integrate succesfully both plugins in terms of user experience, and without making any change on the code of any of the plugins.

![CKEditor4 with MathType + Image2 demo](./snapshot.png)

1. Clone `html-integrations` repository
2. Checkout branch `KB-5603`
3. Follow these commands to run the demo:

```sh
    $ cd demos/html5/ckeditor4
	# This will install @wiris/mathtype-ckeditor4 and ckeditor4 packages from npm.
    $ npm install
    # This will start the demo and open a browser's window to it.
	$ npm start
```

## Drawbacks

There are some drawbacks on this solution, that are consistent with the behavior of the MathType plugin with the default CKEditor image plugin.

1. *Image format mathematical formulas* can't be edited with the Enhanced Image dialog form: the contextual menu item is not shown.
2. *Image format mathematical formulas* can't be resized with the Enhanced Image plugin: the resize feature is not visible. 
3. *Image format mathematical formulas* can't be dragged once with the Enhanced Image plugin: the drag feature is not visible. Use Cut+Paste, instead.

## Bugs

At the same time, we've identified this inconsistent behavior than can be considered a bug on the image2 plugin:

1. When a previously edited *Image format mathematical formulas* is been aligned using the [justify](https://ckeditor.com/cke4/addon/justify) plugin, the older value is shown again. Double-clicking the image format mathematical formula again, shows MathType editor with the new value again.

2. The justify command is not compatible with the image2 

**How we fixed:**

The [image2.plugin.js](/demos/html5/ckeditor4/image2.plugin.js) file contains the modification to the `ckeditor4/plugins/image2/plugin.js` original file. 

```Javascript

	function alignCommandIntegrator( editor ) {
		var execCallbacks = [],
			enabled;

		return function( value ) {
			// KB-5603
			// This is likely to produce issues with MathType
			// this function is executed before ACF rules are ready.
			console.log('You are running a patched version of CKEditor4 image2 plugin for validation purposes with WIRIS MathType plugin.');
			return false;
			
			var command = editor.getCommand( 'justify' + value );

```