import cherrypy
import os
import requests
import yaml
import json
import random


class Crystal_Maze(object):

    def __init__(self, config_files):
        self.config_files = config_files
        self.config = {}
        self.load_config(self.config_files)
        return

    # Return the answer to Lights Out! so we can check if the user has the right answer
    @cherrypy.expose
    def answer(self):
        if 'lightsout' in self.config:
            if 'answer' in self.config['lightsout']:
                answer = self.config['lightsout']['answer']
                return '{"data": ' + str(answer) + '}'

    # Return the Who's on first configuration
    @cherrypy.expose
    def whosonfirst_config(self):
        self.reload_config()
        if 'whosonfirst' in self.config:
            return json.dumps(self.config['whosonfirst'])

    # Post a slack message with the image of the next button to press
    @cherrypy.expose
    def post_whosonfirst_button(self, imageurl='null', color='good', text='Describe'):
        if 'whosonfirst' in self.config:
            if 'slack_url' in self.config['whosonfirst']:
                data = {}
                attachment = {'image_url': imageurl, 'text': text, 'color': color}
                data['attachments'] = [attachment]
                requests.post(self.config['whosonfirst']['slack_url'], json=data)
        return

    # Post a slack message with the image of the score
    @cherrypy.expose
    def post_score(self, score_pos=0):
        if 'whosonfirst' in self.config:
            if 'scores' in self.config['whosonfirst']:
                score = self.config['whosonfirst']['scores'][int(score_pos)]
                print(score)
                if 'urls' in score:
                    image_url = random.choice(score['urls'])
                    self.post_whosonfirst_button(imageurl=image_url,color='warning',text="Score")
                else:
                    data = {}
                    data['text'] = 'Game Over: Score: ' + score['score']
                    requests.post(self.config['whosonfirst']['slack_url'], json=data)

    # Reload our configuration
    @cherrypy.expose
    def reload_config(self):
        self.load_config(self.config_files)
        return

    # Load our config
    def load_config(self, config_files):
        for config_name, config_file in config_files.items():
            with open(config_file) as config:
                self.config[config_name] = yaml.safe_load(config)


if __name__ == '__main__':
    conf = \
        {
            '/':
                {'tools.staticdir.on': True,
                 'tools.staticdir.root': os.path.abspath(os.getcwd()),
                 'tools.staticdir.dir': './'}
        }

    cherrypy.config.update({'server.socket_host': '0.0.0.0'})
    cherrypy.config.update({'server.socket_port': 8091})

    who_config = os.path.join(os.getcwd(), 'config', 'whosonfirst.yaml')
    lights_config = os.path.join(os.getcwd(), 'config', 'lightsout.yaml')

    configs = {}
    if os.path.isfile(who_config):
        configs['whosonfirst'] = who_config
    if os.path.isfile(lights_config):
        configs['lightsout'] = lights_config

    cherrypy.quickstart(Crystal_Maze(configs), '/', conf)
