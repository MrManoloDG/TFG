


require('./js/classes/code_struct.js');
var $array_main;
var $active = null;
var $canvas;
var $lang;


function btn_struct(str) {
	$('#'+$active).removeClass("active-btn");
	$active = str;
	$('#'+$active).addClass("active-btn");
}

function zoom_in(){
	$canvas.scaleCanvas({
		scale: 1.2
	});
}

function zoom_out(){
	$canvas.scaleCanvas({
		scale: 0.8
	});
}

function run_code() {
	let $new_line = "\n";
	let run = 'let $buffer_out = "";\n' +
		'let $promesas = [];\n' +
		run_arr($array_main) +
		'//alert($buffer_out);\n';
	alert(run);
    try {
			eval(run);
    }
    catch(error) {
        alert(error);
        console.error(error);
        // expected output: ReferenceError: nonExistentFunction is not defined
        // Note - error messages will vary depending on browser
    }
}

function save(){
	let FileSaver = require('file-saver');
	let json = JSON.stringify($array_main);
	let blob = new Blob([json], {type: "text/plain;charset=utf-8"});
	FileSaver.saveAs(blob, "flow.json");
}




function open_file(){
	// Check for the various File API support.
	if (window.File && window.FileReader) {
		let file = document.getElementById('file').files[0];
		if(file){
			getAsText(file);
		}
	} else {
		alert('The File APIs are not fully supported in this browser.');
	}
}

function getAsText(readFile) {

	let reader = new FileReader();
	// Read file into memory as UTF-8
	reader.readAsText(readFile, "UTF-8");
	// Closure to capture the file information.
	reader.onload = (function(theFile) {
		return function(e) {
			let extension = theFile.name.split(".")[1];
			if( extension === "json" || extension === "JSON"){
				let json = JSON.parse(e.target.result);
				$array_main = [];
				load_arr(json,$array_main);
				refrescar($canvas).then(function () {
					dibujar($canvas);
				});
			}else{
				alert("The file does not have json extension");
			}

		};
	})(readFile);
}

function change_language(lang){
	$.ajax({
			url : "./lang/"+ lang +".json",
			dataType: "text",
			success : function (data)
			{
				$lang = JSON.parse(data);
				$('#info').text($lang['config']['info']);
				$('#languages').text($lang['config']['languages']);
				$('#about').text($lang['config']['about']);
				$('#es').text($lang['languages']['es']);
				$('#en').text($lang['languages']['en']);

			}
		}
	);
}



$(document).ready(function() {


	let ln = x=window.navigator.language||navigator.browserLanguage;

	change_language(ln);

	$canvas = $('#canvas');
	$array_main = new Array();
	let JCanvas = require( './js/jcanvas.js' );
	JCanvas( $, window);
	//Codigo para probar
	dibujar($canvas);

	let width = window.innerWidth - 20; // ancho
	let height = window.innerHeight - $('#buttons').height() - 30; // alto
	$('#contenedor').css("width", width + "px");
	$('#contenedor').css("height", height + "px");

	$( window ).resize(function() {
		let width = window.innerWidth - 20; // ancho
		let height = window.innerHeight - $('#buttons').height() - 30; // alto
		$('#contenedor').css("width", width + "px");
		$('#contenedor').css("height", height + "px");
	});

	$('#contenedor').animate({
		scrollLeft: 2000
	}, 100);

	$('#file').change(function () {
		open_file();
	});
	//fin codigo para prueba
	/*
	function dibujar(){
		//console.log("Funcion dibujar()********");
		var x = 500,y = 150;
		// Draw text
		dibujar_inicio(x,y,$canvas);
		y += $canvas.measureText('inicio').width+5 / 2;
		dibujar_linea(x,y,x,y+100,0,$canvas,array,true,'main');
		y += 100;
		for (var i = 0; i < array.length; i++) {
			array[i].dibujar(x,y,i,$canvas);
			y += $canvas.getLayer('maino'+i).height + 10;
			dibujar_linea(x,y,x,y+100,i+1,$canvas,array,true,'main');
			y += 100;
		}
		y += $canvas.measureText('inicio').width + 20 / 2;
		dibujar_fin(x,y,$canvas);

		//console.log("fin funcion dibujar *******");
	}

	$canvas.clearCanvas();
	dibujar();

	$canvas.getLayers().forEach(function(element) {
		$canvas.removeLayer(element.name);
	});


	setInterval(function () {
		$canvas.clearCanvas();
		$canvas.getLayers().forEach(function(element) {
			//console.log(element.name);
			$canvas.removeLayer(element.name);
		});
		//console.log(array);
		dibujar();
	}, 500);
	*/



});
