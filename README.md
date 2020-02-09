# Crystal Maze Games

A web framework for playing Crystal Maze like games. 

## [Lights Out](http://www.crystalmazedatabase.com/game.php?id=2)

In this game, a random set of switches are provided to the user and a light board. Some switches will turn off lights from the light board, ultimately revealing
a 4 digit combination. However, some of the buttons will "reset" the light board. The player must remember which switches reset the board and avoid them to reveal
the code.

In order to play Lights Out, a config file named `lightsout.yaml` must be provided in the config directory. This must contain the following config

1. `answer` - The numerical answer the player needs to guess

## Who's on First

Based on the game Who's on First from [Keep Talking and Nobody Explodes](https://keeptalkinggame.com/). In this game, 1 player is presented with a set of buttons
with text on them. They score points by clicking on the correct buttons. The button to press is given to the second player who describes the button to the first
player.

In order to play Who's on First, a config file named 'whosonfirst.yaml' must be provided in the config directory. This must container the following config

1. `slack_url` - The slack webhook URL to send the picture of the button to press.
1. `scores` - A list of dictionaries which act as a scoreboard. Must be provided in ascending order. Each entry may contain
	1. `score` - Mandatory, the score for this position
	1. `urls` - Optional, a list of urls for the picture of the score (recommended that this looks like a button)
1. `buttons` - A list of buttons to display to the user. Each button can have the following config
	1. `colour` - The colour of the button
	1. `text_colour` - The colour of the text that appears on the button
	1. `url` - A URL that is a picture of the button
	1. `text` - A list of text to display on the button. Each list item is on a new line
	1. `text_size` - An optional value, the text size in pixels to draw the text, default is 16.

Additionally, the following configuration options can be provided

1. `slack_icon` - The icon to display on the slack message. If no slack_icon is provided the default slack icon for the webhook is used.
1. `stats` - The file to write stats to (how long a guess took and whether it was correct or not). If not provided, stats are not recorded.
1. `rounds` - The number of buttons to have guesses for before the game ends. If no rounds config is provided, the game will continue until the max score is reached.
1. `gamelength` - The length of time in seconds before the game ends. If no gamelength config is provided, the game will continue until the max score is reached.
1. `height` - The height of the gameboard to display buttons in. Default is 675 pixels.
1. `width` - The width of the gameboard to display buttons in. Default is 1200 pixels.

An example config file is as follows

```
slack_url: https://hooks.slack.com/services/T1A8GVBNH/7KBF7RXKU/BB2p3u8swyom10fK9mPBWthw
# rounds: 5
gamelength: 60
height: 720
width: 1200
scores:
  - score: 0
    urls: 
      - https://i.imgur.com/hJU5yHG.png
      - https://i.imgur.com/HPljlHt.png
  - score : 1
    urls:
      - https://i.imgur.com/KgpbCZH.png
      - https://i.imgur.com/EJxp03a.png
  - score : 2
    urls:
      - https://i.imgur.com/h7xDmr8.png
      - https://i.imgur.com/MEkkXhb.png
  - score : 3
    urls:
      - https://i.imgur.com/qNE17F9.png
      - https://i.imgur.com/fsswiOV.png
buttons:
  - colour: black
    text_colour: white
    url: https://i.imgur.com/7SsPgdc.png
    text: ONE
  - colour: black
    text_colour: white
    text_size: 14
    url: https://i.imgur.com/gxrWdVV.png
    text: one

```

## Moving Blocks

In this game, a set of 6 blocks will move left and right across the screen. Each can be stopped using one of the keys between a-z (which are randomised on each play). Pressing space bar will restart *all* blocks.

The player must stop all blocks in the target area. 