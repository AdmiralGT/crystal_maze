function test()
{
	$("#circle_3_4").attr('fill', 'black');
	$("#circle_3_5").attr('fill', 'black');
	$("#circle_3_6").attr('fill', 'black');
	$("#circle_4_3").attr('fill', 'black');
	$("#circle_5_3").attr('fill', 'black');
	$("#circle_6_3").attr('fill', 'black');
	$("#circle_4_7").attr('fill', 'black');
	$("#circle_5_7").attr('fill', 'black');
	$("#circle_6_7").attr('fill', 'black');
	$("#circle_7_4").attr('fill', 'black');
	$("#circle_7_5").attr('fill', 'black');
	$("#circle_7_6").attr('fill', 'black');
	$("#circle_8_3").attr('fill', 'black');
	$("#circle_9_3").attr('fill', 'black');
	$("#circle_10_3").attr('fill', 'black');
	$("#circle_8_7").attr('fill', 'black');
	$("#circle_9_7").attr('fill', 'black');
	$("#circle_10_7").attr('fill', 'black');
	$("#circle_11_4").attr('fill', 'black');
	$("#circle_11_5").attr('fill', 'black');
	$("#circle_11_6").attr('fill', 'black');
	
	$("#circle_3_11").attr('fill', 'black');
	$("#circle_3_12").attr('fill', 'black');
	$("#circle_3_13").attr('fill', 'black');
	$("#circle_11_11").attr('fill', 'black');
	$("#circle_11_12").attr('fill', 'black');
	$("#circle_11_13").attr('fill', 'black');
	$("#circle_4_10").attr('fill', 'black');
	$("#circle_5_10").attr('fill', 'black');
	$("#circle_6_10").attr('fill', 'black');
	$("#circle_4_14").attr('fill', 'black');
	$("#circle_5_14").attr('fill', 'black');
	$("#circle_6_14").attr('fill', 'black');
	$("#circle_8_10").attr('fill', 'black');
	$("#circle_9_10").attr('fill', 'black');
	$("#circle_10_10").attr('fill', 'black');
	$("#circle_8_14").attr('fill', 'black');
	$("#circle_9_14").attr('fill', 'black');
	$("#circle_10_14").attr('fill', 'black');
	
}

var svgNS = "http://www.w3.org/2000/svg";
var buttons = 6;
var global_button_locations = new Array();

function generate_grid()
{
	var rows = 15;
	var columns = 30;
	var radius = 10;
	var diameter = 2 * radius;
	var width = diameter * columns;
	var height = diameter * rows;
	var lit = "#ffffcc"
	var grid_svg = document.getElementById("lightboard_grid");
	grid_svg.setAttribute("width", width);
	grid_svg.setAttribute("height", height);
	for (row = 0; row < rows; row++)
	{
		for (column = 0; column < columns; column++)
		{
			var circle = document.createElementNS(svgNS, "circle");
			var id = "circle_" + row + "_" + column;
			var centre_x = (column * diameter) + radius;
			var centre_y = (row * diameter) + radius;
			var colour = "red";
			var stroke = "black";
			var stroke_width = 2;
			circle.setAttributeNS(null, 'id', id);
			circle.setAttributeNS(null, 'cx', centre_x);
			circle.setAttributeNS(null, 'cy', centre_y);
			circle.setAttributeNS(null, 'r', radius - 1);
			circle.setAttributeNS(null, 'fill', lit);
			circle.setAttributeNS(null, 'stroke', stroke);
			circle.setAttributeNS(null, 'stroke-width', stroke_width);

			grid_svg.appendChild(circle);
		}
	}
}

function generate_buttons()
{
    var width = 600;
    var height = 300;
	var radius = 40;
	var switch_svg = document.getElementById("switch_grid");
	switch_svg.setAttribute("width", width);
	switch_svg.setAttribute("height", height);
	
	for (button_id = 0; button_id < buttons; button_id++)
	{
		var button_location = new ButtonLocation(((2*radius) * button_id) + radius, radius);
		global_button_locations.push(button_location);
		var circle = document.createElementNS(svgNS, "circle");
		var id = "button_" + button_id;
		var colour = "red";
		var stroke = "block";
		var stroke_width = 2;
		var colours = ["red", "black", "yellow", "blue", "green", "orange"]
		
		circle.setAttributeNS(null, 'id', id);
		circle.setAttributeNS(null, 'r', radius - 1);
		circle.setAttributeNS(null, 'fill', colours[button_id]);
		circle.setAttributeNS(null, 'stroke', stroke);
		circle.setAttributeNS(null, 'stroke-width', stroke_width);

		switch_svg.appendChild(circle);
	}
	
	shuffleButtons();
	
}

function generate_game()
{
	generate_grid();
	generate_buttons();
}

function ButtonLocation(x, y)
{
	this.x = x;
	this.y = y;
}

function getRandomInt(min, max)
{
	return Math.floor(Math.random() * (max - min + 1)) + min;
}
	

function shuffleButtons()
{
	var local_button_locations = global_button_locations.slice(0);
	for (button_num = 0; button_num < buttons; button_num++)
	{
		var index = getRandomInt(0, local_button_locations.length - 1);
		var button_id = "button_" + button_num;
		var location = local_button_locations[index];
		var button = document.getElementById(button_id);
		button.setAttribute('cx', location.x);
		button.setAttribute('cy', location.y);
		
		local_button_locations.splice(index, 1);
		
	}
}


