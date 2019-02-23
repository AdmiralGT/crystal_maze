// SVG Namespace
var svgNS = "http://www.w3.org/2000/svg";

// Variables for the total SVG area
var svg_width = 1200;
var svg_height = 675

var scoreboard_svg_inner = 56;
var scoreboard_svg_border = 4;
var scoreboard_svg_size = scoreboard_svg_inner + scoreboard_svg_border;

// A list of all the buttons and all the locations
var global_button_list = new Array();
var global_button_locations = new Array();

// A list of buttons that are the targets this game
var target_button_list = new Array();

// A list of the buttons in this game
var game_button_list = new Array();

// A list of possible scores
var scores_list = new Array();

// Variables for the buttons that can be pressed
var button_pressed = "white";
var button_radius = 50;
var button_diameter = 2 * button_radius;
var button_separation = 2;
var button_effective_diameter = button_diameter + button_separation;
var score_pos = 0;
var rounds = 0;
var game_in_progress = false;

// Variable to track the timer.
var game_end_timer;
var game_length = -1;

// Function called when a button is pressed
// If this is a reset button, reset the light board, otherwise turn off the segment of lights.
function button_press()
{
	// Don't do anything if the game is not in progress, it's just some buttons on a screen.
	if (game_in_progress)
	{
	    var clicked_button = getButtonFromElementID(this.event.target.id);

	    if (clicked_button.target)
	    {
	    	alert("Correct")
	    	set_score_position(score_pos + 1)
	    	if (score_pos == scores_list.length - 1)
	    	{
	    		end_game()
	    		return
	    	}
	    }
	    else
	    {
	    	alert("Wrong")
	    	set_score_position(score_pos - 1)
	    }

	    // We don't know which button is the current target so just set them all not to be the target
	    for (var ii = 0; ii < game_button_list.length; ii++)
	    {
	    	var button = game_button_list[ii]
	    	button.setTarget(false)
	    }

	    determine_next_action()
	}
}

function determine_next_action()
{
    if (rounds > 0)
    {
	    if (target_button_list.length > 0)
	    {
		    set_next_target(target_button_list.pop())
	    }
	    else
	    {
	    	end_game()
	    }
    }
    else
    {
    	if (target_button_list.length == 0)
    	{
		    shuffle(game_button_list)
		    generate_target_list(rounds)
    	}
	    set_next_target(target_button_list.pop())
    }

}

// Function to end the game and print the score
function end_game()
{
	clearTimeout(game_end_timer)
   	game_in_progress = false
   	alert("Score: " + scores_list[score_pos])
   	reset_game()
}


// Function to get the next target button and send the image to slack
function set_next_target(button)
{
    button.setTarget(true)
    send_message_to_server("post_slack_message?imageurl=" + button.imageurl);
}

// Function that receives game configuration
function receive_game_config(config)
{
	var json = JSON.parse(config)
	if (json['rounds'])
		rounds = json['rounds']
	if (json['gamelength'])
		game_length = json['gamelength']
  	if (json['width'])
  		svg_width = json['width']
  	if (json['height'])
  	  	svg_height = json['height']
  	size_game_board("svg_area", svg_width, svg_height)

  	if (json['buttons'])
  		generate_buttons(json['buttons'])
 	if (json['scores'])
		scores_list = json['scores'] 		
  		generate_score_board(scores_list)
  		size_game_board("score_svg", scoreboard_svg_size * scores_list.length, scoreboard_svg_size)
}

// Function that generates all our necessary buttons
function generate_buttons(buttons)
{
	horizontal = Math.floor(svg_width / button_effective_diameter)
	vertical = Math.floor(svg_height / button_effective_diameter)

	for (var ii = 0; ii < buttons.length; ii++)
    {
    	var button = buttons[ii]
    	if (!Array.isArray(button.text))
    	{
    		button.text = [button.text]
    	}
        make_button(button);
    }

    // Generate the locations for the buttons
    for (var button_num = 0; button_num < buttons.length; button_num++)
    {
      button_location = generate_button_location(button_num, horizontal, vertical)
      global_button_locations.push(button_location);
    }
}

// Function to generate a button location.
function generate_button_location(id, width, height)
{
	y_pos = Math.floor(id / width)
	x_pos = id % width

	x = button_radius + (x_pos * button_effective_diameter)
	y = button_radius + (y_pos * button_effective_diameter)
	var pos = new Position(x,y);
    return pos;
}

// Used on page load to generate the light grid and buttons that will be in game
function generate_game()
{
    get_game_config();
    generate_objects();
}

// Function to generate the guess box and guess button.
function generate_objects()
{
    var gameboard = document.getElementById('scoreboard');
    var div = document.createElement('div');
    div.setAttribute('id', 'guess_div');

    var start_button = document.createElement('button');
    start_button.innerHTML = "Start";
    start_button.setAttribute('onclick', 'start_game()');
    start_button.setAttribute('id', 'start_button');
    div.appendChild(start_button);

    var reset_button = document.createElement('button');
    reset_button.innerHTML = "Reset";
    reset_button.setAttribute('onclick', 'reset_game()');
    reset_button.setAttribute('id', 'reset_button');
    div.appendChild(reset_button);

    gameboard.appendChild(div);
}

// Get game configuration
function get_game_config()
{
	var button_request = new XMLHttpRequest();
	button_request.open('GET', 'whosonfirst_buttons', true);
	button_request.onload = function (e) {
		receive_game_config(button_request.responseText)
	}
	button_request.send()
}

// Someone is attempting to guess the answer.
function start_game()
{
	if (!game_in_progress)
	{
		set_score_position(0)
		game_in_progress = true;

	    // We can only display a certain number of buttons so slice the list at the max size
	    shuffle(global_button_list)
	    game_button_list = global_button_list.slice(0, horizontal * vertical)
	  	generate_button_grid(game_button_list)
	    set_button_locations(game_button_list)
	    shuffle(game_button_list)
	    generate_target_list(rounds)
	    set_next_target(target_button_list.pop())

	    if (game_length > 0)
	    {
		    game_end_timer = setTimeout(end_game, game_length * 1000)
	    }
	}
}

function generate_target_list(num_rounds)
{
    if (rounds != 0)
    {
    	target_button_list = game_button_list.slice(0, rounds)
    }
	else
	{
		target_button_list = game_button_list.slice()
	}
}

function reset_game()
{
	var svg_area = document.getElementById("svg_area")
	while (svg_area.firstChild)
	{
		svg_area.firstChild.remove()
	}
	var scoreboard_svg = document.getElementById("score_svg")
	while (scoreboard_svg.firstChild)
	{
		scoreboard_svg.firstChild.remove()
	}
	game_in_progress = false
	global_button_list.length = 0
	global_button_locations.length = 0
	game_button_list.length = 0
	get_game_config()
}

// Sends a picture of the button to slack
function send_message_to_server(url)
{
	var slack_request = new XMLHttpRequest();
	slack_request.open("GET", url, true);
	slack_request.send()
}

// Function to build a button and put it in the global list of buttons.
function make_button(button_json)
{
    //var button = new Button(colour, text, text_colour, button_radius);
    var button = new Button(button_json.colour, button_json.text, button_json.text_colour, button_radius)
    if (button_json.text_size)
    {
	    button.setTextSize(button_json.text_size)
    }
    else
    {
    	button.setTextSize(16)
    }
    if (button_json.url)
    {
	    button.setImageURL(button_json.url)
    }
    else
    {
    	button.setImageURL('https://i.imgur.com/JMy9n3p.jpg?1')
    }
    global_button_list.push(button)
}

function generate_score_board(score_list)
{
	// Generate the general SVG area to put buttons in.
	var scoreboard_svg = document.getElementById("score_svg");

	for (var score_num = 0; score_num < score_list.length; score_num++)
	{
		var score = score_list[score_num];

		var g = document.createElementNS(svgNS, "g");
		scoreboard_svg.appendChild(g);

		var score_element = document.createElementNS(svgNS, "rect");
		var scores_length = Math.floor(Math.log10(score_list.length)) + 1
		var score_id = "score_" + score_num.toString().padStart(scores_length, "0");

		score_element.setAttributeNS(null, 'id', score_id);
		score_element.setAttributeNS(null, 'width', scoreboard_svg_inner)
		score_element.setAttributeNS(null, 'height', scoreboard_svg_inner)
		score_element.setAttributeNS(null, 'x', scoreboard_svg_size * score_num + (scoreboard_svg_border / 2))
		score_element.setAttributeNS(null, 'y', scoreboard_svg_border / 2)
		score_element.setAttributeNS(null, 'style', 'fill:black;;stroke:black;stroke-width:8')
		g.appendChild(score_element)

		var text_element = document.createElementNS(svgNS, "text");
		var text_id = "text_for_" + score_id;
		text_element.setAttributeNS(null, 'id', text_id);
		text_element.setAttributeNS(null, 'text-anchor', 'middle');
		text_element.setAttributeNS(null, 'style', 'fill:white;font-weight: bold; font-size: 20px; dominant-baseline: middle');
		text_element.setAttributeNS(null, 'x', scoreboard_svg_size * score_num + (scoreboard_svg_size / 2))
		text_element.setAttributeNS(null, 'y', scoreboard_svg_size / 2)

		var text_node = document.createTextNode(score);
		text_element.appendChild(text_node);
		g.appendChild(text_element);
	}
}

function set_score_position(position)
{
	if (position >= scores_list.length)
		position = scores_list.length - 1
	if (position < 0)
		position = 0

	score_pos = position
	update_scoreboard(position, scores_list)
}

function update_scoreboard(position, score_list)
{
	var scoreboard_svg = document.getElementById("score_svg");

	for (var score_num = 0; score_num < score_list.length; score_num++)
	{
		var scores_length = Math.floor(Math.log10(score_list.length)) + 1
		var score_id = "score_" + score_num.toString().padStart(scores_length, "0");
		var score_element = document.getElementById(score_id);

		var score_style = 'fill:black'
		if (position == score_num)
			score_style = score_style + ';stroke:green;stroke-width:' + scoreboard_svg_border
		else
			score_style = score_style + ';stroke:black;stroke-width:' + scoreboard_svg_border
		score_element.setAttributeNS(null, 'style', score_style)
	}
}