
function get_mult_width_repeat(arr) {
	let arr_if = [];
	let arr_repeat = [];
	if(Array.isArray(arr)){
		arr_if = arr.filter( e => e.type === 'if' );
		arr_repeat = arr.filter( e => e.type === 'while' || e.type ==='for');
	}
	let max_arr = 0;
	if(arr_if.length !== 0 ){
		for(let i = 0; i < arr_if.length; i++){
			max_arr = Math.max(get_mult_width_if(arr_if[i].yes,true),get_mult_width_if(arr_if[i].false,false),max_arr);
		}
		return 1 + max_arr*1.4;
	} else if (arr_repeat.length !== 0){
		for (let i = 0; i < arr_repeat.length ; i++) {
			max_arr = Math.max(get_mult_width_repeat(arr_repeat[i].loop),max_arr);
		}
		return 1 + max_arr;
	} else return 1;
}

function get_mult_width_if(arr, way) {
	let arr_if = [];
	let arr_repeat = [];
	if(Array.isArray(arr)){
		arr_if = arr.filter( e => e.type === 'if' );
		arr_repeat = arr.filter( e => e.type === 'while' || e.type ==='for');
	}
	let max_arr = 0;
	if(arr_if.length !== 0 ){
		if(way){
			for(let i = 0; i < arr_if.length; i++){
				max_arr = Math.max(get_mult_width_if(arr_if[i].no,way),max_arr);
			}
		}else {
			for(let i = 0; i < arr_if.length; i++){
				max_arr = Math.max(get_mult_width_if(arr_if[i].yes,way),max_arr);
			}
		}
		return 1 + max_arr*1.4;
	}else if (arr_repeat.length !== 0){
		for (let i = 0; i < arr_repeat.length ; i++) {
			max_arr = Math.max(get_mult_width_repeat(arr_repeat[i].loop),max_arr);
		}
		return 1 + max_arr;
	} else return 1;

}

function refrescar(canvas) {
	const promise = new Promise(function (resolve) {
		while(canvas.getLayers().length > 0){
			limpiar(canvas);
		}
		resolve(canvas);
	});

	return promise;
}

function limpiar(canvas) {
	canvas.clearCanvas();
	canvas.getLayers().forEach(function(element) {
		console.log(element.name);
		canvas.removeLayer(element.name);
	});
}

function dibujar(canvas) {

	var x = 2500 ,y = 150;
	// Draw text
	dibujar_inicio(x,y,canvas);
	y += canvas.measureText('inicio').width+5 / 2;
	dibujar_linea(x,y,x,y+100,0,canvas,array_main,true,'main');
	y += 100;
	for (var i = 0; i < array_main.length; i++) {
		array_main[i].dibujar(x,y,i,canvas);
		y += canvas.getLayer('maino'+i).height + 10;
		dibujar_linea(x,y,x,y+100,i+1,canvas,array_main,true,'main');
		y += 100;
	}
	y += canvas.measureText('inicio').width + 20 / 2;
	dibujar_fin(x,y,canvas);
}

function dibujar_inicio(x,y,canvas) {
	canvas.drawText({
		layer: true,
		name: 'inicio',
		fillStyle: '#36c',
		strokeWidth: 1,
		x: x, y: y,
		fontSize: '11pt',
		fontFamily: 'Verdana, sans-serif',
		text: 'Inicio'
	})
	// Draw circle as wide as the text
	.drawArc({
		layer: true,
		name: 'o_inicio',
		strokeStyle: '#000',
		strokeWidth: 2,
		x: x, y: y,
		radius: canvas.measureText('inicio').width+5 / 2
	});
}

function dibujar_fin(x,y,canvas) {
	canvas.drawText({
		layer: true,
		name: 'fin',
		fillStyle: '#36c',
		strokeWidth: 1,
		x: x, y: y,
		fontSize: '11pt',
		fontFamily: 'Verdana, sans-serif',
		text: 'Fin'
	})
	// Draw circle as wide as the text
	.drawArc({
		layer: true,
		name: 'o_fin',
		strokeStyle: '#000',
		strokeWidth: 2,
		x: x, y: y,
		radius: canvas.measureText('inicio').width+5 / 2
	});
}

function dibujar_cuadrado(x,y,i,canvas, o) {
	canvas.drawRect({
		layer:true,
		fillStyle: '#FFF',
		strokeStyle: '#000',
		strokeWidth: 2,
		name: o.parent+'o'+i,
		i: i,
		x: x, y: y + (100+20)/2,
		width: 200,
		height: 100,
		click: function(layer) {
			alert("Click on: Assing" + layer.name);
		}
	});
}

function dibujar_assing(x,y,i,canvas, o) {
	canvas.drawText({
		layer: true,
		name: o.parent+'t'+i,
		fillStyle: '#36c',
		strokeWidth: 1,
		x: x, y:  y + canvas.measureText('inicio').width,
		fontSize: '11pt',
		fontFamily: 'Verdana, sans-serif',
		text: 'assing'
	}).drawRect({
		layer:true,
		strokeStyle: '#000',
		strokeWidth: 2,
		name: o.parent+'o'+i,
		x: x, y: y + canvas.measureText('inicio').width,
		width: (canvas.measureText(o.parent+'t'+i).width + 20)*2,
		height: (canvas.measureText(o.parent+'t'+i).height + 20)*2,
		click: function(layer) {
			alert("Click on: Assing" + layer.name);
		}
	});

}

function dibujar_linea(x1,y1,x2,y2,i,canvas,array, arrow ,struct) {
	canvas.drawLine({
		layer: true,
		strokeStyle: '#000',
		strokeWidth: 2,
		name: struct +'l'+i,
		rounded: true,
		endArrow: arrow,
		arrowRadius: 15,
		arrowAngle: 90,
		x1: x1, y1: y1,
		x2: x2, y2: y2,
		mouseover: function(layer) {
	    $(this).css('cursor','copy');
	  },
		click: function (layer) {

			switch(active){
				case 'if':
					array.splice(i,0,new If_Struct(struct));
					break;

				case 'while':
					array.splice(i,0,new While_Struct(struct));
					break;

				case 'assing':
					array.splice(i,0,new Assing_Struct(struct));
					break;

				case 'out':
					array.splice(i,0,new Out_Struct(struct));
					break;

				case 'in':
					array.splice(i,0,new In_Struct(struct));
					break;

				case 'for':
					array.splice(i,0,new For_Struct(struct));
					break;

				default:
					array.splice(i,0,new Code_Struct('default',struct));
			}
			refrescar(canvas).then(function () {
				dibujar(canvas);
			});
			//dibujar(canvas);
		}
	});
}


function dibujar_if(x,y,i,canvas,o) {
	y+=canvas.measureText('inicio').width;
	canvas.drawText({
		layer: true,
		name: o.parent+'t'+i,
		fillStyle: '#36c',
		strokeWidth: 1,
		x: x, y: y,
		fontSize: '11pt',
		fontFamily: 'Verdana, sans-serif',
		text: o.condition
	})
	.drawPath({
	  layer: true,
		name: o.parent+'o'+i,
	  strokeStyle: '#000',
	  strokeWidth: 2,
		height: (canvas.measureText(o.parent+'t'+i).width),
		closed:true,
	  p1: {
	    type: 'line',
	    x1: x, y1: y - canvas.measureText(o.parent+'t'+i).width/2,
	    x2: x + 30 + canvas.measureText(o.parent+'t'+i).width, y2: y,
	    x3: x, y3: y + canvas.measureText(o.parent+'t'+i).width/2,
	    x4: x - 30 - canvas.measureText(o.parent+'t'+i).width, y4: y,
			x5: x, y5: y - canvas.measureText(o.parent+'t'+i).width/2,
	  },
	  click: function(layer) {
			alert("Click on: if " + layer.name);
		}
	}).drawText({
		layer: true,
		name: o.parent+'t-no'+i,
		fillStyle: '#36c',
		strokeWidth: 1,
		x: x + 60 + canvas.measureText(o.parent+'t'+i).width, y: y - 20 ,
		fontSize: '11pt',
		fontFamily: 'Verdana, sans-serif',
		text: "No"
	}).drawText({
		layer: true,
		name: o.parent+'t-yes'+i,
		fillStyle: '#36c',
		strokeWidth: 1,
		x: x - 60 - canvas.measureText(o.parent+'t'+i).width, y: y - 20 ,
		fontSize: '11pt',
		fontFamily: 'Verdana, sans-serif',
		text: "Yes"
	});

	let arrow = false;
	let arr_yes = o.yes;
	let arr_no = o.no;
	let multp_yes_width = get_mult_width_if(arr_yes,true);
	let multp_no_width = get_mult_width_if(arr_no,false);
	canvas.drawLine({
		layer: true,
		strokeStyle: '#000',
		strokeWidth: 2,
		name: o.parent+'lh1if'+i,
		x1: x + 30 + canvas.measureText(o.parent+'t'+i).width, y1: y,
		x2: x + (130 * multp_no_width) + canvas.measureText(o.parent+'t'+i).width, y2: y
	}).drawLine({
		layer: true,
		strokeStyle: '#000',
		strokeWidth: 2,
		name: o.parent+'lh2if'+i,
		x1: x - 30 - canvas.measureText(o.parent+'t'+i).width, y1: y,
		x2: x - (130 * multp_yes_width) - canvas.measureText(o.parent+'t'+i).width, y2: y
	});
	//Array SI
	let xh2 = (x - (130 * multp_yes_width) - canvas.measureText(o.parent+'t'+i).width);
	let yh2 = y;

	if(arr_yes.length>0)  arrow = true;
	dibujar_linea(xh2,yh2,xh2,yh2+100,0,canvas,arr_yes,arrow,o.parent+'if'+i+'yes-');
	yh2 += 100;

	for (let j = 0; j < arr_yes.length; j++) {
		console.log(j);
		arr_yes[j].dibujar(xh2,yh2,j,canvas);
		console.log(o.parent+'if'+i+'yes-'+'o'+j);
		yh2 += canvas.getLayer(o.parent+'if'+i+'yes-'+'o'+j).height + 10;
		if(j >= arr_yes.length-1) arrow = false;
		dibujar_linea(xh2,yh2,xh2,yh2+100,j+1,canvas,arr_yes, arrow,o.parent+'if'+i+'yes-');
		yh2 += 100;
	}
	//Array No
	let xh1 = (x + (130 * multp_no_width) + canvas.measureText(o.parent+'t'+i).width);
	let yh1 = y;
	if(arr_no.length>0)  arrow = true;
	dibujar_linea(xh1,yh1,xh1,yh1+100,0,canvas,arr_no, arrow,o.parent+'if'+i+'no-');
	yh1 += 100;
	for (let j = 0; j < arr_no.length; j++) {
		arr_no[j].dibujar(xh1,yh1,j,canvas);
		yh1 += canvas.getLayer(o.parent+'if'+i+'no-'+'o'+j).height + 10;
		if(j >= arr_no.length-1) arrow = false;
		dibujar_linea(xh1,yh1,xh1,yh1+100,j+1,canvas,arr_no, arrow,o.parent+'if'+i+'no-');
		yh1 += 100;
	}

	//Completar lado desigual
	if(yh1 > yh2){
		console.log("igualando si");
		dibujar_linea(xh2,yh2,xh2,yh1,arr_yes.length + 1,canvas,arr_yes, arrow,o.parent+'if'+i+'yes-');
		yh2 = yh1;
	}else if( yh2 > yh1){
		console.log("igualando no");
		dibujar_linea(xh1,yh1,xh1,yh2,arr_no.length +1,canvas,arr_no, arrow,o.parent+'if'+i+'no-');
	}

	canvas.drawLine({
		layer: true,
		strokeStyle: '#000',
		strokeWidth: 2,
		name: o.parent+'l_end_if'+i,
		x1: xh1, y1: yh2,
		x2: xh2, y2: yh2
	});
	canvas.getLayer(o.parent+'o'+i).height = yh2 - (y - canvas.measureText(o.parent+'t'+i).width/2);
	//
}

function dibujar_lectura(x,y,i,canvas, o) {
	y+=canvas.measureText('inicio').width;
	canvas.drawText({
		layer: true,
		name: o.parent+'t'+i,
		fillStyle: '#36c',
		strokeWidth: 1,
		x: x, y: y,
		fontSize: '11pt',
		fontFamily: 'Verdana, sans-serif',
		text: 'lectura'
	});
	let height = canvas.measureText(o.parent+'t'+i).height + 20;
	let width = canvas.measureText(o.parent+'t'+i).width + 20;
	canvas.drawPath({
		layer: true,
		name: o.parent+'o'+i,
		strokeStyle: '#000',
		strokeWidth: 2,
		height: height*2,
		closed:true,
		p1: {
			type: 'line',
			x1: x - width/2, y1: y - height,
			x2: x + width, y2: y - height,
			x3: x + width/2, y3: y + height,
			x4: x - width, y4: y + height,
			x5: x - width/2, y5: y - height,
		},
		click: function(layer) {
			alert("Click on: lectura " + layer.name);
		}
	})
}

function dibujar_escritura(x,y,i,canvas,o) {
	y+=canvas.measureText('inicio').width;
	canvas.drawText({
		layer: true,
		name: o.parent+'t'+i,
		fillStyle: '#36c',
		strokeWidth: 1,
		x: x, y: y,
		fontSize: '11pt',
		fontFamily: 'Verdana, sans-serif',
		text: 'escritura'
	});
	let height = canvas.measureText(o.parent+'t'+i).height + 20;
	let width = canvas.measureText(o.parent+'t'+i).width + 20;
	canvas.drawPath({
		layer: true,
		name: o.parent+'o'+i,
		strokeStyle: '#000',
		strokeWidth: 2,
		height: height*2,
		closed:false,
		p1: {
			type: 'line',
			x1: x - width, y1: y + height,
			x2: x - width, y2: y - height,
			x3: x + width, y3: y - height,
			x4: x + width, y4: y + height
		},
		p2:	{
			type: 'quadratic',
			x1: x + width, y1: y + height,
			cx1: x + width/2, cy1: y + height - 20,
			x2: x, y2: y + height,
			cx2: x - width/2, cy2: y + height + 20,
			x3: x - width, y3: y + height
		},
		click: function(layer) {
			alert("Click on: escritura " + layer.name);
		}
	})
}

function dibujar_while(x,y,i,canvas,o) {
	y+=canvas.measureText('inicio').width;
	canvas.drawText({
		layer: true,
		name: o.parent+'t'+i,
		fillStyle: '#36c',
		strokeWidth: 1,
		x: x, y: y,
		fontSize: '11pt',
		fontFamily: 'Verdana, sans-serif',
		text: o.condition
	})
	.drawPath({
		layer: true,
		name: o.parent+'o'+i,
		strokeStyle: '#000',
		strokeWidth: 2,
		height: (canvas.measureText(o.parent+'t'+i).width),
		closed:true,
		p1: {
			type: 'line',
			x1: x, y1: y - canvas.measureText(o.parent+'t'+i).width/2,
			x2: x + 30 + canvas.measureText(o.parent+'t'+i).width, y2: y,
			x3: x, y3: y + canvas.measureText(o.parent+'t'+i).width/2,
			x4: x - 30 - canvas.measureText(o.parent+'t'+i).width, y4: y,
			x5: x, y5: y - canvas.measureText(o.parent+'t'+i).width/2,
		},
		click: function(layer) {
			alert("Click on: while " + layer.name);
		}
	})
	.drawText({
		layer: true,
		name: o.parent+'t-no'+i,
		fillStyle: '#36c',
		strokeWidth: 1,
		x: x + 60 + canvas.measureText(o.parent+'t'+i).width, y: y - 20 ,
		fontSize: '11pt',
		fontFamily: 'Verdana, sans-serif',
		text: "No"
	});

	let arr = o.loop;
	let multp_width = get_mult_width_repeat(arr);
	let yloop = y + canvas.measureText(o.parent+'t'+i).width/2;
	let arrow = false;
	if(arr.length>0)  arrow = true;
	dibujar_linea(x,yloop,x,yloop+100,0,canvas,arr,arrow,o.parent+'while'+i+'loop');
	yloop += 100;

	for (var j = 0; j < arr.length; j++) {
		arr[j].dibujar(x,yloop,j,canvas);
		yloop += canvas.getLayer(o.parent+'while'+i+'loop'+'o'+j).height + 10;
		if(j >= arr.length-1) arrow = false;
		dibujar_linea(x,yloop,x,yloop+100,j+1,canvas,arr, arrow,o.parent+'while'+i+'loop');
		yloop += 100;
	}
	//Draw Return back
	canvas.drawLine({
		layer: true,
		strokeStyle: '#000',
		strokeWidth: 2,
		rounded: true,
		endArrow: true,
		intangible: true,
		arrowRadius: 15,
		arrowAngle: 90,
		name: o.parent + 'lhwhile'+i+'-return',
		x1: x, y1: yloop,
		x2: x - (130 * multp_width) - canvas.measureText(o.parent+'t'+i).width, y2: yloop,
		x3: x - (130 * multp_width) - canvas.measureText(o.parent+'t'+i).width, y3: y - canvas.measureText(o.parent+'t'+i).width,
		x4: x -10, y4: y - canvas.measureText(o.parent+'t'+i).width
	});
	//Draw no lines
	canvas.drawLine({
		layer: true,
		strokeStyle: '#000',
		strokeWidth: 2,
		intangible: true,
		name: o.parent + 'lhwhile'+i+'-h1',
		x1: x + 30 + canvas.measureText(o.parent+'t'+i).width, y1: y,
		x2: x + (130 * multp_width) + canvas.measureText(o.parent+'t'+i).width, y2: y,
		x3: x + (130 * multp_width) + canvas.measureText(o.parent+'t'+i).width, y3: yloop + canvas.measureText(o.parent+'t'+i).width,
		x4: x, y4: yloop + canvas.measureText(o.parent+'t'+i).width
	});

	canvas.getLayer(o.parent+'o'+i).height = (yloop + canvas.measureText(o.parent+'t'+i).width) - (y - canvas.measureText(o.parent+'t'+i).width/2);

}

function dibujar_for(x,y,i,canvas,o) {
	y+=canvas.measureText('inicio').width;
	canvas.drawText({
		layer: true,
		name: o.parent+'t'+i,
		fillStyle: '#36c',
		strokeWidth: 1,
		x: x, y: y,
		fontSize: '11pt',
		fontFamily: 'Verdana, sans-serif',
		text: o.condition
	})
		.drawPath({
			layer: true,
			name: o.parent+'o'+i,
			strokeStyle: '#000',
			strokeWidth: 2,
			height: (canvas.measureText(o.parent+'t'+i).width),
			closed:true,
			p1: {
				type: 'line',
				x1: x, y1: y - canvas.measureText(o.parent+'t'+i).width/2,
				x2: x + 30 + canvas.measureText(o.parent+'t'+i).width, y2: y,
				x3: x, y3: y + canvas.measureText(o.parent+'t'+i).width/2,
				x4: x - 30 - canvas.measureText(o.parent+'t'+i).width, y4: y,
				x5: x, y5: y - canvas.measureText(o.parent+'t'+i).width/2,
			},
			click: function(layer) {
				alert("Click on: for " + layer.name);
			}
		}).drawLine({
			layer: true,
			strokeStyle: '#000',
			strokeWidth: 2,
			name: o.parent + 'lhfor'+i+'romb',
			x1: x - 30 - canvas.measureText(o.parent+'t'+i).width + 10, y1: y +5,
			x2: x + 10, y2: y - canvas.measureText(o.parent+'t'+i).width/2 + 5
		})
		.drawText({
			layer: true,
			name: o.parent+'t-no'+i,
			fillStyle: '#36c',
			strokeWidth: 1,
			x: x + 60 + canvas.measureText(o.parent+'t'+i).width, y: y - 20 ,
			fontSize: '11pt',
			fontFamily: 'Verdana, sans-serif',
			text: "No"
		});

	let arr = o.loop;
	let multp_width = get_mult_width_repeat(arr);
	let yloop = y + canvas.measureText(o.parent+'t'+i).width/2;
	let arrow = false;
	if(arr.length>0)  arrow = true;
	dibujar_linea(x,yloop,x,yloop+100,0,canvas,arr,arrow,o.parent+'for'+i+'loop');
	yloop += 100;

	for (var j = 0; j < arr.length; j++) {
		arr[j].dibujar(x,yloop,j,canvas);
		yloop += canvas.getLayer(o.parent+'for'+i+'loop'+'o'+j).height + 10;
		if(j >= arr.length-1) arrow = false;
		dibujar_linea(x,yloop,x,yloop+100,j+1,canvas,arr, arrow,o.parent+'for'+i+'loop');
		yloop += 100;
	}
	//Draw Return back
	canvas.drawLine({
		layer: true,
		strokeStyle: '#000',
		strokeWidth: 2,
		rounded: true,
		endArrow: true,
		intangible: true,
		arrowRadius: 15,
		arrowAngle: 90,
		name: o.parent + 'lhfor'+i+'-return',
		x1: x, y1: yloop,
		x2: x - (130 * multp_width) - canvas.measureText(o.parent+'t'+i).width, y2: yloop,
		x3: x - (130 * multp_width) - canvas.measureText(o.parent+'t'+i).width, y3: y - canvas.measureText(o.parent+'t'+i).width,
		x4: x -10, y4: y - canvas.measureText(o.parent+'t'+i).width
	});
	//Draw no lines
	canvas.drawLine({
		layer: true,
		strokeStyle: '#000',
		strokeWidth: 2,
		intangible: true,
		name: o.parent + 'lhfor'+i+'-h1',
		x1: x + 30 + canvas.measureText(o.parent+'t'+i).width, y1: y,
		x2: x + (130 * multp_width) + canvas.measureText(o.parent+'t'+i).width, y2: y,
		x3: x + (130 * multp_width) + canvas.measureText(o.parent+'t'+i).width, y3: yloop + canvas.measureText(o.parent+'t'+i).width,
		x4: x, y4: yloop + canvas.measureText(o.parent+'t'+i).width
	});

	canvas.getLayer(o.parent+'o'+i).height = (yloop + canvas.measureText(o.parent+'t'+i).width) - (y - canvas.measureText(o.parent+'t'+i).width/2);

}