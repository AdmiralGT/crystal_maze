function test()
{
    $("#circle_1_1").attr("fill", "black");
}

var svgNS = "http://www.w3.org/2000/svg";
var rows = 5;
var columns = 20;

function generate_grid()
{

  var grid_svg = document.getElementById("lightboard_grid");
  for (row = 0; row < rows; row++)
  {
    for (column = 0; column < columns; column++)
    {
      var circle = document.createElementNS(svgNS, "circle");
      var id = "circle_" + row + "_" + column;
      var centre_x = (column * 40) + 20;
      var centre_y = (row * 40) + 20;
      var radius = 19;
      var colour = "red";
      var stroke = "black";
      var stroke_width = "2";
      circle.setAttributeNS(null, 'id', id);
      circle.setAttributeNS(null, 'cx', centre_x);
      circle.setAttributeNS(null, 'cy', centre_y);
      circle.setAttributeNS(null, 'r', radius);
      circle.setAttributeNS(null, 'style', 'fill : red; stroke : black; stroke-width : 2;');

      grid_svg.appendChild(circle);
    }
  }
}

