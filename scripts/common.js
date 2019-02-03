// Used to size the area in which we can draw buttons/lights
function size_game_board(board, width, height)
{
	var svg_area = document.getElementById(board);
    svg_area.setAttribute("width", width);
    svg_area.setAttribute("height", height);
}    

