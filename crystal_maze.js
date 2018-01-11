var svgNS = "http://www.w3.org/2000/svg";
var global_button_locations = new Array();
var global_button_list = new Array();
var lit = "#ffffcc"

function change_lights(on)
{
	if (on)
	{
		colour = lit;
	}
	else
	{
		colour = 'black';
	}

	$("#circle_3_4").attr('fill', colour);
	$("#circle_3_5").attr('fill', colour);
	$("#circle_3_6").attr('fill', colour);
	$("#circle_4_3").attr('fill', colour);
	$("#circle_5_3").attr('fill', colour);
	$("#circle_6_3").attr('fill', colour);
	$("#circle_4_7").attr('fill', colour);
	$("#circle_5_7").attr('fill', colour);
	$("#circle_6_7").attr('fill', colour);
	$("#circle_7_4").attr('fill', colour);
	$("#circle_7_5").attr('fill', colour);
	$("#circle_7_6").attr('fill', colour);
	$("#circle_8_3").attr('fill', colour);
	$("#circle_9_3").attr('fill', colour);
	$("#circle_10_3").attr('fill', colour);
	$("#circle_8_7").attr('fill', colour);
	$("#circle_9_7").attr('fill', colour);
	$("#circle_10_7").attr('fill', colour);
	$("#circle_11_4").attr('fill', colour);
	$("#circle_11_5").attr('fill', colour);
	$("#circle_11_6").attr('fill', colour);

	$("#circle_3_11").attr('fill', colour);
	$("#circle_3_12").attr('fill', colour);
	$("#circle_3_13").attr('fill', colour);
	$("#circle_11_11").attr('fill', colour);
	$("#circle_11_12").attr('fill', colour);
	$("#circle_11_13").attr('fill', colour);
	$("#circle_4_10").attr('fill', colour);
	$("#circle_5_10").attr('fill', colour);
	$("#circle_6_10").attr('fill', colour);
	$("#circle_4_14").attr('fill', colour);
	$("#circle_5_14").attr('fill', colour);
	$("#circle_6_14").attr('fill', colour);
	$("#circle_8_10").attr('fill', colour);
	$("#circle_9_10").attr('fill', colour);
	$("#circle_10_10").attr('fill', colour);
	$("#circle_8_14").attr('fill', colour);
	$("#circle_9_14").attr('fill', colour);
	$("#circle_10_14").attr('fill', colour);
}

function test()
{
    var button = getButtonFromElementID(this.event.target.id);

    if (button.reset)
    {
    	change_lights(true);
	   	shuffleButtons();
    }
    else
    {
    	change_lights(false);
    }

}

function generate_switch_grid()
{
	var rows = 15;
	var columns = 30;
	var radius = 10;
	var diameter = 2 * radius;
	var width = diameter * columns;
	var height = diameter * rows;
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

function generate_button_grid()
{
	// All buttons have the same border for now...
	var stroke = "block";
	var stroke_width = 2;

	// Generate the general SVG area to put buttons in.
    var width = 600;
    var height = 300;
	var switch_svg = document.getElementById("switch_grid");
	switch_svg.setAttribute("width", width);
	switch_svg.setAttribute("height", height);

	// Generate a local copy of the global button list as we're going to remove elements from it
	for (button_num = 0; button_num < global_button_list.length; button_num++)
	{
		// Get the Button Object from our global list and generate a element name for this Button.
		var button = global_button_list[button_num];
		var button_id = "button_" + button_num.toString().padStart(2, "0");
		button.setButtonID(button_id);

		// Create a group attribute for the circle and text.
		var g = document.createElementNS(svgNS, "g");
		switch_svg.appendChild(g);

		// Create the button element with the properties from the Button.
		var button_element = document.createElementNS(svgNS, "circle");

		button_element.setAttributeNS(null, 'id', button.button_id);
		button_element.setAttributeNS(null, 'r', button.radius - 1);
		button_element.setAttributeNS(null, 'fill', button.colour);
		button_element.setAttributeNS(null, 'stroke', stroke);
		button_element.setAttributeNS(null, 'stroke-width', stroke_width);
		button_element.setAttributeNS(null, 'onclick', 'test()');

		// Put the Button element in the group.
		g.appendChild(button_element);

		var text = document.createElementNS(svgNS, "text");
		var text_id = "text_for_" + button_id;
		button.setTextID(text_id);
		text.setAttributeNS(null, 'id', text_id);
		text.setAttributeNS(null, 'style', 'fill: ' + button.text_colour);
		text.setAttributeNS(null, 'text-anchor', 'middle');
		text.setAttributeNS(null, 'onclick', 'test()');
		var text_node = document.createTextNode(button.text);
		text.appendChild(text_node);
		g.appendChild(text);

	}
	shuffleButtons();
}

// Function that generates all our necessary buttons
function generate_buttons()
{
	var radius = 40;
	var button = new Button("red", "RED", "black", false, radius);
	global_button_list.push(button);
	button = new Button("black", "BLACK", "white", true, radius);
	global_button_list.push(button);
	button = new Button("blue", "BLUE", "black", false, radius);
	global_button_list.push(button);
	button = new Button("orange", "ORANGE", "black", false, radius);
	global_button_list.push(button);
	button = new Button("yellow", "YELLOW", "black", false, radius);
	global_button_list.push(button);
	button = new Button("green", "GREEN", "black", false, radius);
	global_button_list.push(button);

	for (button_id = 0; button_id < global_button_list.length; button_id++)
	{
		var button_location = new ButtonLocation(((2*radius) * button_id) + radius, radius);
		global_button_locations.push(button_location);
	}
}

// Used on page load to generate the light grid and buttons that will be in game
function generate_game()
{
	generate_switch_grid();
	generate_buttons();
	generate_button_grid();
}

// Buttons that can be pressed by the user to turn off lights or reset the grid
function Button(colour, text, text_colour, reset, radius)
{
	this.colour = colour;
	this.text = text;
	this.text_colour = text_colour;
	this.reset = reset;
	this.radius = radius;
	this.location = null;
	this.button_id = null;
	this.text_id = null;

	this.setLocation = function(buttonLocation)
	{
		this.location = buttonLocation;
	}

	this.setButtonID = function(buttonID)
	{
		this.button_id = buttonID;
	}

	this.setTextID = function(textID)
	{
		this.text_id = textID;
	}
}

//
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
	for (button_num = 0; button_num < global_button_list.length; button_num++)
	{
		var index = getRandomInt(0, local_button_locations.length - 1);
		var button = global_button_list[button_num];
		var location = local_button_locations[index];
		button.setLocation(location);
		redraw_button(button);


		local_button_locations.splice(index, 1);

	}
}

function redraw_button(button)
{
	var button_element = document.getElementById(button.button_id);
	button_element.setAttribute('cx', button.location.x);
	button_element.setAttribute('cy', button.location.y);
	var text_element = document.getElementById(button.text_id);
	text_element.setAttribute('x', button.location.x);
	text_element.setAttribute('y', button.location.y);
}

function getButtonFromElementID(elementID)
{
    // Either the text or button was pressed, the last 8 characters is always
    // the button's buttonID.
    var button_num_string = this.event.target.id.substr(this.event.target.id.length - 2);
    var button_num = parseInt(button_num_string, 10);
    var button = global_button_list[button_num];

    return button;
}
