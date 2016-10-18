(function(parent){
	"use strict";
	delete window.array;
	var doc = window.document;
	var output = doc.getElementById("strict-output");

	function writeLine(string) {
		var line = doc.createElement('div');
		line.textContent = string;
		output.appendChild(line);
	}

	writeLine("if (array):");
	try {
		writeLine(array && "true" || "false");
	} catch (error) {
		writeLine("error: " + error.message);
	}

	writeLine("if ('array' in window):");
	try {
		writeLine(('array' in window) && "true" || "false");
	} catch (error) {
		writeLine("error: " + error.message);
	}
	
	writeLine("if (typeof(array) === 'undefined'):");
	try {
		writeLine((typeof(array) === 'undefined') && "true" || "false");
	} catch (error) {
		writeLine("error: " + error.message);
	}
	
	writeLine("array = [];");
	try{
		array = [];
	} catch(error) {
		writeLine("error: " + error.message);
	}
	writeLine("if (array):");
	try {
		writeLine(array && "true" || "false");
	} catch (error) {
		writeLine("error: " + error.message);
	}

})(window);