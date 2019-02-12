import cherrypy
import os
import requests
import yaml
import json

class Crystal_Maze(object):

    def __init__(self, config_file):
        self.config_file = config_file
        self.load_config(self.config_file)
        return
        
    @cherrypy.expose
    def answer(self):
        return '{"data": ' + str(3809) + '}'

    @cherrypy.expose
    def whosonfirst_buttons(self):
        return json.dumps(self.config)

    @cherrypy.expose
    def post_slack_message(self, imageurl='null'):
        attachment = {'image_url': imageurl, 'text': 'Test'}
        data = {'attachments': [attachment]}
        # r = requests.post(self.config['slack_url'], json=data)
        return

    @cherrypy.expose
    def reload_config(self):
        self.load_config(self.config_file)
        return

    def load_config(self, config_file):
        with open(config_file) as config:
            self.config = yaml.safe_load(config)



if __name__ == '__main__':
    conf = \
        {
            '/':
                {'tools.staticdir.on': True,
                 'tools.staticdir.root': os.path.abspath(os.getcwd()),
                 'tools.staticdir.dir': './'}
        }

    cherrypy.config.update({'server.socket_host': '0.0.0.0'})
    cherrypy.config.update({'server.socket_port': 91})

    game_config = os.path.join(os.getcwd(), 'config', 'whosonfirst.yaml')

    cherrypy.quickstart(Crystal_Maze(game_config), '/', conf)
