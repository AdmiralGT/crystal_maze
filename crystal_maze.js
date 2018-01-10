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
  for (row = 1; row < rows + 1; row++)
  {
    for (column = 1; column < columns + 1; column++)
    {
      var circle = document.createElementNS(svgNS, "circle");
      var id = "circle_" + row + "_" + column;
      var centre_x = (column * 20);
      var centre_y = (row * 20);
      var radius = 19;
      var colour = "red";
      var stroke = "black";
      var stroke_width = "2";
      circle.setAttributeNS(svgNS, 'id', id);
      circle.setAttributeNS(svgNS, 'cx', centre_x);
      circle.setAttributeNS(svgNS, 'cy', centre_y);
      circle.setAttributeNS(svgNS, 'r', radius);
      circle.setAttributeNS(svgNS, 'fill', colour);
      circle.setAttributeNS(svgNS, 'stroke', stroke);
      circle.setAttributeNS(svgNS, 'stroke-width', stroke_width);

      grid_svg.appendChild(circle);
    }
  }
}

