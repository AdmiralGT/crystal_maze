var button_num_pad = 3

// Get a Button Object from a HTTP Element ID
function getButtonFromElementID(elementID)
{
    // Either the text or button was pressed, the last 10 characters is always
    // the button's buttonID (button_XXX).
    var button_id_length = 7 + button_num_pad
    var button_num_string = this.event.target.id.substr(this.event.target.id.length - button_id_length);
    for (var ii = 0; ii < global_button_list.length; ii++)
    {
    	var button = global_button_list[ii]
    	if (button.button_id == button_num_string)
    	{
    		return button
    	}
    }
    return
}

// Generate the grid of buttons that can be pressed to turn off lights or reset
// the light board.
function generate_button_grid(button_list)
{
	// All buttons have the same border for now...
	var stroke = "black";
	var stroke_width = 2;

	// Generate the general SVG area to put buttons in.
	var switch_svg = document.getElementById("svg_area");

	for (var button_num = 0; button_num < button_list.length; button_num++)
	{
		// Get the Button Object from our global list and generate a element name for this Button.
		var button = button_list[button_num];
		var button_id = "button_" + button_num.toString().padStart(button_num_pad, "0");
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

		button.text_id.length = 0
		for (var ii = 0; ii < button.text.length; ii++)
		{
			var text_element = document.createElementNS(svgNS, "text");
			var text_id = "text_" + ii + "_for_" + button_id;
			button.addTextID(text_id);
			text_element.setAttributeNS(null, 'id', text_id);
			if (button.bold)
			{
				text_element.setAttributeNS(null, 'style', 'fill: ' + button.text_colour + ';font-weight: bold; font-size: ' + button.text_size + 'px; dominant-baseline: middle');
			}
			else
			{
				text_element.setAttributeNS(null, 'style', 'fill: ' + button.text_colour + '; font-size: ' + button.text_size + 'px; dominant-baseline: middle');
			}
			text_element.setAttributeNS(null, 'text-anchor', 'middle');
			text_element.setAttributeNS(null, 'onmousedown', 'button_press()');
			var text_node = document.createTextNode(button.text[ii]);
			text_element.appendChild(text_node);
			g.appendChild(text_element);
		}
	}
}

// Shuffle the order of buttons around on the display.
function set_button_locations(button_list)
{
    // Update the button location of each button
	for (var button_num = 0; button_num < button_list.length; button_num++)
	{
		var button = button_list[button_num];
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

	vertical_offset = (button.text_size * button.text_id.length) / 2
	y_pos = button.location.y - vertical_offset
	for (var ii = 0; ii < button.text_id.length; ii++)
	{
		var text_element = document.getElementById(button.text_id[ii]);
		text_element.setAttribute('x', button.location.x);
		text_element.setAttribute('y', y_pos + text_vertical_offset(button.text_size, ii));
	}
}

// Function that works out where to put each text box vertically
function text_vertical_offset(text_size, id)
{
	return (text_size / 2) + (id * text_size)

}