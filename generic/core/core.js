﻿/* Vars */
var _wrs_currentPath = window.location.toString().substr(0, window.location.toString().lastIndexOf('/') + 1);
var _wrs_isNewElement = true;
var _wrs_temporalImage;

/**
 * Cross-browser addEventListener/attachEvent function.
 * @param object element Element target
 * @param event event Event
 * @param function func Function to run
 */
function wrs_addEvent(element, event, func) {
	if (element.addEventListener) {
		element.addEventListener(event, func, false);
	}
	else if (element.attachEvent) {
		element.attachEvent('on' + event, func);
	}
}

function wrs_removeEvent(element, event, func) {
	if (element.removeEventListener) {
		element.removeEventListener(event, func, false);
	}
	else if (element.detachEvent) {
		element.detachEvent('on' + event, func);
	}
}

/**
 * Adds iframe events.
 * @param object iframe Target
 * @param function doubleClickHandler Function to run when user double clicks the iframe
 * @param function mousedownHandler Function to run when user mousedowns the iframe
 * @param function mouseupHandler Function to run when user mouseups the iframe
 */
function wrs_addIframeEvents(iframe, doubleClickHandler, mousedownHandler, mouseupHandler) {
	if (doubleClickHandler) {
		wrs_addEvent(iframe.contentWindow.document, 'dblclick', function (event) {
			var realEvent = (event) ? event : window.event;
			var element = realEvent.srcElement ? realEvent.srcElement : realEvent.target;
			doubleClickHandler(iframe, element);
		});
	}
	
	if (mousedownHandler) {
		wrs_addEvent(iframe.contentWindow.document, 'mousedown', function (event) {
			var realEvent = (event) ? event : window.event;
			var element = realEvent.srcElement ? realEvent.srcElement : realEvent.target;
			mousedownHandler(iframe, element);
		});
	}
	
	if (mouseupHandler) {
		wrs_addEvent(iframe.contentWindow.document, 'mouseup', function (event) {
			var realEvent = (event) ? event : window.event;
			var element = realEvent.srcElement ? realEvent.srcElement : realEvent.target;
			mouseupHandler(iframe, element);
		});
	}
}

function wrs_addTextareaEvents(textarea, clickHandler, documentClickHandler) {
	if (clickHandler) {
		wrs_addEvent(textarea, 'click', function (event) {
			var realEvent = (event) ? event : window.event;
			clickHandler(textarea, realEvent);
		});
	}
}

/**
 * WIRIS special encoding.
 *  We use these entities because IE doesn't support html entities on its attributes sometimes. Yes, sometimes.
 * @param string input
 * @return string
 */
function wrs_mathmlDecode(input) {
	input = input.split('«').join('<');
	input = input.split('»').join('>');
	input = input.split('¨').join('"');
	input = input.split('$').join('&');
	input = input.split('`').join("'");
	return input;
}

/**
 * WIRIS special encoding.
 *  We use these entities because IE doesn't support html entities on its attributes sometimes. Yes, sometimes.
 * @param string input
 * @return string
 */
function wrs_mathmlEncode(input) {
	input = input.split('<').join('«');
	input = input.split('>').join('»');
	input = input.split('"').join('¨');
	input = input.split('&').join('$');
	input = input.split("'").join('`');
	return input;
}

/**
 * Converts special symbols (> 128) to entities.
 * @param string mathml
 * @return string
 */
function wrs_mathmlEntities(mathml) {
	var toReturn = '';
	for (var i = 0; i < mathml.length; ++i) {
		//parsing > 128 characters
		if (mathml.charCodeAt(i) > 128) {
			toReturn += '&#' + mathml.charCodeAt(i) + ';';
		}
		else {
			toReturn += mathml.charAt(i);
		}
	}
	return toReturn;
}

/**
 * Inserts or modifies formulas on an iframe.
 * @param object iframe Target
 * @param string mathml Mathml code
 */
function wrs_updateFormula(iframe, mathml) {
	try {
		if (iframe && mathml) {
			iframe.contentWindow.focus();
			var imgObject = wrs_mathmlToImgObject(iframe.contentWindow.document, mathml);
			
			if (_wrs_isNewElement) {
				if (document.selection) {
					var range = iframe.contentWindow.document.selection.createRange();
					
					iframe.contentWindow.document.execCommand('insertimage', false, imgObject.src);

					if (range.parentElement) {
						var temporalImg = range.parentElement();

						temporalImg.title = imgObject.title;
						temporalImg.setAttribute('align', imgObject.getAttribute('align'));
						temporalImg.setAttribute(_wrs_conf_imageMathmlAttribute, imgObject.getAttribute(_wrs_conf_imageMathmlAttribute));
						temporalImg.className = imgObject.className;
					}
				}
				else {
					var sel = iframe.contentWindow.getSelection();
					try {
						var range = sel.getRangeAt(0);
					}
					catch (e) {
						var range = iframe.contentWindow.document.createRange();
					}
					
					sel.removeAllRanges();
					range.deleteContents();
				
					var node = range.startContainer;
					var pos = range.startOffset;
					
					if (node.nodeType == 3) {
						node = node.splitText(pos);
						node.parentNode.insertBefore(imgObject, node);
					}
					else if (node.nodeType == 1) {
						node.insertBefore(imgObject, node.childNodes[pos]);
					}
				}
			}
			else {
				_wrs_temporalImage.parentNode.insertBefore(imgObject, _wrs_temporalImage);
				_wrs_temporalImage.parentNode.removeChild(_wrs_temporalImage);
			}
		}
	}
	catch (e) {
	}
}

/**
 * Inserts or modifies CAS on an iframe.
 * @param object iframe Target
 * @param string appletCode Applet code
 * @param string image Base 64 image stream
 * @param int imageWidth Image width
 * @param int imageHeight Image height
 */
function wrs_updateCAS(iframe, appletCode, image, imageWidth, imageHeight) {
	try {
		if (iframe && appletCode) {
			iframe.contentWindow.focus();
			var imgObject = wrs_appletCodeToImgObject(iframe.contentWindow.document, appletCode, image, imageWidth, imageHeight);
			
			if (_wrs_isNewElement) {
				if (document.selection) {
					var range = iframe.contentWindow.document.selection.createRange();
					
					iframe.contentWindow.document.execCommand('insertimage', false, imgObject.src);

					if (range.parentElement) {
						var temporalImg = range.parentElement();

						temporalImg.width = imgObject.width;
						temporalImg.height = imgObject.height;
						temporalImg.setAttribute('align', imgObject.getAttribute('align'));
						temporalImg.title = imgObject.title;
						temporalImg.setAttribute(_wrs_conf_CASMathmlAttribute, imgObject.getAttribute(_wrs_conf_CASMathmlAttribute));
						temporalImg.className = imgObject.className;
					}
				}
				else {
					var sel = iframe.contentWindow.getSelection();
					try {
						var range = sel.getRangeAt(0);
					}
					catch (e) {
						var range = iframe.contentWindow.document.createRange();
					}
					
					sel.removeAllRanges();
					range.deleteContents();
					
					var node = range.startContainer;
					var pos = range.startOffset;
					
					if (node.nodeType == 3) {
						node = node.splitText(pos);
						node.parentNode.insertBefore(imgObject, node);
					}
					else if (node.nodeType == 1) {
						node.insertBefore(imgObject, node.childNodes[pos]);
					}
				}
			}
			else {
				_wrs_temporalImage.parentNode.insertBefore(imgObject, _wrs_temporalImage);
				_wrs_temporalImage.parentNode.removeChild(_wrs_temporalImage);
			}
		}
	}
	catch (e) {
	}
}

/**
 * Inserts or modifies formulas or CAS on a textarea.
 * @param object textarea Target
 * @param string text Text to add in the textarea. For example, if you want to add the link to the image, you can call this function as wrs_updateFormula_onTextarea(textarea, wrs_createImageSrc(mathml));
 */
function wrs_updateTextarea(textarea, text) {
	if (textarea && text) {
		textarea.focus();
		
		if (textarea.selectionStart != null) {
			textarea.value = textarea.value.substring(0, textarea.selectionStart) + text + textarea.value.substring(textarea.selectionEnd, textarea.value.length);
		}
		else {
			var selection = document.selection.createRange();
			selection.text = text;
		}
	}
}

/**
 * Converts mathml to img object.
 * @param object creator Object with "createElement" method
 * @param string mathml Mathml code
 * @return object
 */
function wrs_mathmlToImgObject(creator, mathml) {
	var imageSrc = wrs_createImageSrc(mathml);
	
	var imgObject = creator.createElement('img');

	imgObject.title = 'Double click to edit';
	imgObject.src = imageSrc;
	imgObject.align = 'middle';
	imgObject.setAttribute(_wrs_conf_imageMathmlAttribute, wrs_mathmlEncode(mathml));
	imgObject.className = 'Wirisformula';
	
	return imgObject;
}

/**
 * Gets formula image src with AJAX.
 * @param mathml Mathml code
 * @return string
 */
function wrs_createImageSrc(mathml) {
	var httpRequest = wrs_createHttpRequest();
	
	if (httpRequest) {
		var data = 'mml=' + wrs_urlencode(mathml);
		
		if (_wrs_conf_createimagePath.substr(0, 1) == '/' || _wrs_conf_createimagePath.substr(0, 7) == 'http://' || _wrs_conf_createimagePath.substr(0, 8) == 'https://') {
			httpRequest.open('POST', _wrs_conf_createimagePath, false);
		}
		else {
			httpRequest.open('POST', _wrs_currentPath + _wrs_conf_createimagePath, false);
		}
		
		httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
		httpRequest.send(data);
		
		return httpRequest.responseText;
	}
	else {
		alert('Your browser is not compatible with AJAX technology. Please, use the latest version of Mozilla Firefox.');
		return '';
	}
}

/**
 * Converts applet code to img object.
 * @param object creator Object with "createElement" method
 * @param string appletCode Applet code
 * @param string image Base 64 image stream
 * @param int imageWidth Image width
 * @param int imageHeight Image height
 * @return object
 */
function wrs_appletCodeToImgObject(creator, appletCode, image, imageWidth, imageHeight) {
	var imageSrc = wrs_createImageCASSrc(image);
	
	var imgObject = creator.createElement('img');
	
	imgObject.title = 'Double click to edit';
	imgObject.src = imageSrc;
	imgObject.align = 'middle';
	imgObject.width = imageWidth;
	imgObject.height = imageHeight;
	imgObject.setAttribute(_wrs_conf_CASMathmlAttribute, wrs_mathmlEncode(appletCode));
	imgObject.className = 'Wiriscas';
	
	return imgObject;
}

/**
 * Gets CAS image src with AJAX.
 * @param string image Base 64 image stream
 * @return string
 */
function wrs_createImageCASSrc(image) {
	var httpRequest = wrs_createHttpRequest();
	
	if (httpRequest) {
		var data = 'image=' + wrs_urlencode(image);
		if (_wrs_conf_createcasimagePath.substr(0, 1) == '/' || _wrs_conf_createcasimagePath.substr(0, 7) == 'http://' || _wrs_conf_createimagePath.substr(0, 8) == 'https://') {
			httpRequest.open('POST', _wrs_conf_createcasimagePath, false);
		}
		else {
			httpRequest.open('POST', _wrs_currentPath + _wrs_conf_createcasimagePath, false);
		}
		
		httpRequest.setRequestHeader('Content-type', 'application/x-www-form-urlencoded; charset=UTF-8');
		httpRequest.send(data);
		
		return httpRequest.responseText;
	}
	else {
		alert('Your browser is not compatible with AJAX technology. Please, use the latest version of Mozilla Firefox.');
		return '';
	}
}

/**
 * URL encode function
 * @param string clearString Input 
 * @return string
 */
function wrs_urlencode(clearString) {
	var output = '';
	var x = 0;
	clearString = clearString.toString();
	var regex = /(^[a-zA-Z0-9_.]*)/;
	
	var clearString_length = ((typeof clearString.length) == 'function') ? clearString.length() : clearString.length;

	while (x < clearString_length) {
		var match = regex.exec(clearString.substr(x));
		if (match != null && match.length > 1 && match[1] != '') {
			output += match[1];
			x += match[1].length;
		}
		else {
			var charCode = clearString.charCodeAt(x);
			var hexVal = charCode.toString(16);
			output += '%' + ( hexVal.length < 2 ? '0' : '' ) + hexVal.toUpperCase();
			++x;
		}
	}
	
	return output;
}

/**
 * Cross-browser httpRequest creation.
 * @return object
 */
function wrs_createHttpRequest() {
	if (typeof XMLHttpRequest != 'undefined') {
		return new XMLHttpRequest();
	}
			
	try {
		return new ActiveXObject('Msxml2.XMLHTTP');
	}
	catch (e) {
		try {
			return new ActiveXObject('Microsoft.XMLHTTP');
		}
		catch (oc) {
		}
	}
	
	return false;
}

/**
 * Creates new object using its html code.
 * @param string objectCode
 * @return object
 */
function wrs_createObject(objectCode) {
	// Internet Explorer can't include "param" tag when is setting an innerHTML property.
	objectCode = objectCode.split('<applet ').join('<div wirisObject="WirisApplet" ').split('<APPLET ').join('<div wirisObject="WirisApplet" ');	// Is a 'div' because 'div' object can contain any object.
	objectCode = objectCode.split('</applet>').join('</div>').split('</APPLET>').join('</div>');
	
	objectCode = objectCode.split('<param ').join('<br wirisObject="WirisParam" ').split('<PARAM ').join('<br wirisObject="WirisParam" ');			// Is a 'br' because 'br' can't contain nodes.
	objectCode = objectCode.split('</param>').join('</br>').split('</PARAM>').join('</br>');
	
	var container = document.createElement('span');
	container.innerHTML = objectCode;
	
	function recursiveParamsFix(object) {
		if (object.getAttribute && object.getAttribute('wirisObject') == 'WirisParam') {
			var param = document.createElement('param');
			
			for (var i = 0; i < object.attributes.length; ++i) {
				if (object.attributes[i].nodeValue !== null) {
					param.setAttribute(object.attributes[i].nodeName, object.attributes[i].nodeValue);
				}
			}
			
			// IE fix
			if (param.NAME) {
				param.name = param.NAME;
				param.value = param.VALUE;
			}
			
			param.removeAttribute('wirisObject');
			
			object.parentNode.replaceChild(param, object);
		}
		else if (object.getAttribute && object.getAttribute('wirisObject') == 'WirisApplet') {
			var applet = document.createElement('applet');
			
			for (var i = 0; i < object.attributes.length; ++i) {
				if (object.attributes[i].nodeValue !== null) {
					applet.setAttribute(object.attributes[i].nodeName, object.attributes[i].nodeValue);
				}
			}
			
			applet.removeAttribute('wirisObject');
			
			for (var i = 0; i < object.childNodes.length; ++i) {
				recursiveParamsFix(object.childNodes[i]);
				
				if (object.childNodes[i].nodeName.toLowerCase() == 'param') {
					applet.appendChild(object.childNodes[i]);
					--i;	// When we inserts the object child into the applet, object loses one child.
				}
			}

			object.parentNode.replaceChild(applet, object);
			object = applet;
		}
		else {
			for (var i = 0; i < object.childNodes.length; ++i) {
				recursiveParamsFix(object.childNodes[i]);
			}
		}
	}
	
	recursiveParamsFix(container);
	
	return container.firstChild;
}

/**
 * Converts an object to its HTML code.
 * @param object object
 * @return string
 */
function wrs_createObjectCode(object) {
	var parent = object.parentNode;
	var newParent = document.createElement(parent.tagName);
	parent.replaceChild(newParent, object);
	newParent.appendChild(object);
	var toReturn = newParent.innerHTML;
	parent.replaceChild(object, newParent);
	return toReturn;
}

/**
 * Parses initial HTML code, converts CAS applets to CAS images.
 * @param string code
 * @return string
 */
function wrs_initParse(code) {
	var containerCode = '<div>' + code + '</div>';
	var container = wrs_createObject(containerCode);
	
	var appletList = container.getElementsByTagName('applet');
	
	for (var i = 0; i < appletList.length; ++i) {
		if (appletList[i].className == 'Wiriscas' || appletList[i].getAttribute('class') == 'Wiriscas') {		// Internet Explorer can't read className correctly
			var imgObject = document.createElement('img');
			imgObject.title = 'Double click to edit';
			imgObject.src = appletList[i].getAttribute('src');
			imgObject.align = 'middle';
			
			var appletCode = wrs_createObjectCode(appletList[i]);
			imgObject.setAttribute(_wrs_conf_CASMathmlAttribute, wrs_mathmlEncode(appletCode));
			imgObject.className = 'Wiriscas';
			
			appletList[i].parentNode.replaceChild(imgObject, appletList[i]);
			--i;		// we have deleted one sleeped applet
		}
	}
	
	return container.innerHTML;
}

/**
 * Parses end HTML code, converts CAS images to CAS applets.
 * @param string code
 * @return string
 */
function wrs_endParse(code) {
	var containerCode = '<span>' + code + '</span>';
	var container = wrs_createObject(containerCode);
	var imgList = container.getElementsByTagName('img');
	
	for (var i = 0; i < imgList.length; ++i) {
		if (imgList[i].className == 'Wiriscas') {
			var appletCode = imgList[i].getAttribute(_wrs_conf_CASMathmlAttribute);
			appletCode = wrs_mathmlDecode(appletCode);
			var appletObject = wrs_createObject(appletCode);
			appletObject.setAttribute('src', imgList[i].src);
			
			imgList[i].parentNode.replaceChild(appletObject, imgList[i]);
			--i;		// we have deleted one image
		}
	}

	return container.innerHTML;
}
