// Function to build a button and put it in the global list of buttons.
function make_button(colour, text, text_colour)
{
    //var button = new Button(colour, text, text_colour, button_radius);
    var button = new Button(colour, text, text_colour, button_radius);
    global_button_list.push(button);
}

