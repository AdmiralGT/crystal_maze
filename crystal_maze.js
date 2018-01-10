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
var rows = 15;
var columns = 30;
var radius = 10;
var diameter = 2 * radius;
var width = diameter * columns;
var height = diameter * rows;
var lit = "#ffffcc"

function generate_grid()
{

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
      var stroke_width = "2";
      circle.setAttributeNS(null, 'id', id);
      circle.setAttributeNS(null, 'cx', centre_x);
      circle.setAttributeNS(null, 'cy', centre_y);
      circle.setAttributeNS(null, 'r', radius - 1);
      circle.setAttributeNS(null, 'fill', lit);
      circle.setAttributeNS(null, 'stroke', 'black');
      circle.setAttributeNS(null, 'stroke-width', 2);

      grid_svg.appendChild(circle);
    }
  }
}

