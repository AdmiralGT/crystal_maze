

// how many people to put in the table?
var table_length = 28;

var tabledata;

// An array of all results
var all_results = [];

// How many games to consider whether a player is active or not
var activity_requirement = 500;

// A list of all active players
var active_players = [];

//
var activity_list = [];
var inactivy_list = [];

var s_db;
var d_db;

function addClickHandlers()
{
  //$('#add_single_left').on("click", function() {
  //  $('#circle_1_1').css({ fill: "#ff0000" });
  //});
  $("#add_single_left").click(function() {
    $("#circle_1_1").attr("fill", "red");
  });


  $("#add_single_right").click(function() {

  });

  $("#clear_results_players").click(function() {
    clear_results_inputs();
  });
}

function test()
{
    $("#circle_1_1").attr("fill", "red");
}

