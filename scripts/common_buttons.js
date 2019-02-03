// Generate the grid of buttons that can be pressed to turn off lights or reset
// the light board.
function generate_button_grid()
{
	// All buttons have the same border for now...
	var stroke = "black";
	var stroke_width = 2;

	// Generate the general SVG area to put buttons in.
	var switch_svg = document.getElementById("svg_area");

	for (var button_num = 0; button_num < global_button_list.length; button_num++)
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
		button_element.setAttributeNS(null, 'onmousedown', 'button_press()');

		// Put the Button element in the group.
		g.appendChild(button_element);

		var text = document.createElementNS(svgNS, "text");
		var text_id = "text_for_" + button_id;
		button.setTextID(text_id);
		text.setAttributeNS(null, 'id', text_id);
		text.setAttributeNS(null, 'style', 'fill: ' + button.text_colour + ';font-weight: bold; font-size: 2em; dominant-baseline: middle');
		text.setAttributeNS(null, 'text-anchor', 'middle');
		text.setAttributeNS(null, 'onmousedown', 'button_press()');
		var text_node = document.createTextNode(button.text);
		text.appendChild(text_node);
		g.appendChild(text);

	}
	set_button_locations();
}

// Shuffle the order of buttons around on the display.
function set_button_locations()
{
    // Update the button location of each button
	for (var button_num = 0; button_num < global_button_list.length; button_num++)
	{
		var button = global_button_list[button_num];
		button.setLocation(global_button_locations[button_num]);
		redraw_button(button);
	}
}

// Redraw a button in it's new position
function redraw_button(button)
{
	var button_element = document.getElementById(button.button_id);
	button_element.setAttribute('cx', button.location.x);
	button_element.setAttribute('cy', button.location.y);
	var text_element = document.getElementById(button.text_id);
	text_element.setAttribute('x', button.location.x);
	text_element.setAttribute('y', button.location.y);
}