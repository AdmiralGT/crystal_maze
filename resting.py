import cherrypy
import os
import requests
import yaml
import json

class Crystal_Maze(object):

    def __init__(self, config_file):
        with open(config_file) as config:
            self.config_file = config_file
            self.config = yaml.safe_load(config_file)
        return
        
    @cherrypy.expose
    def answer(self):
        return '{"data": ' + str(3809) + '}'

    @cherrypy.expose
    def whosonfirst_buttons(self):
        return json.dumps(self.config['buttons'])

    @cherrypy.expose
    def post_slack_message(self):
        print(self.config)
        attachment = {'image_url': 'https://i.imgur.com/3OJS3N3.jpg?1', 'text': 'Test'}
        data = {'attachments': [attachment]}
        r = requests.post(self.config['slack_url'], json=data)
        print(r.text)
        print(r.status_code)
        return 'OK'

    @cherrypy.expose
    def reload_config(self):
        self.config = yaml.safe_load(self.config_file)


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

    game_config = os.path.join(os.getcwd(), 'whosonfirst', 'config.yaml')

    cherrypy.quickstart(Crystal_Maze(game_config), '/', conf)
