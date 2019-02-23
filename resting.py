import cherrypy
import os
import requests
import yaml
import json


class Crystal_Maze(object):

    def __init__(self, config_files):
        self.config_files = config_files
        self.config = {}
        self.load_config(self.config_files)
        return

    @cherrypy.expose
    def answer(self):
        if 'lightsout' in self.config:
            if 'answer' in self.config['lightsout']:
                answer = self.config['lightsout']['answer']
                return '{"data": ' + str(answer) + '}'

    @cherrypy.expose
    def whosonfirst_buttons(self):
        self.reload_config()
        if 'whosonfirst' in self.config:
            return json.dumps(self.config['whosonfirst'])

    @cherrypy.expose
    def post_slack_message(self, imageurl='null'):
        attachment = {'image_url': imageurl, 'text': 'Test'}
        data = {'attachments': [attachment]}
        if 'slack_url' in self.config:
            requests.post(self.config['slack_url'], json=data)
        return

    @cherrypy.expose
    def reload_config(self):
        self.load_config(self.config_files)
        return

    def load_config(self, config_files):
        for config_name, config_file in config_files.items():
            with open(config_file) as config:
                self.config[config_name] = yaml.safe_load(config)

    @cherrypy.expose
    def describe_button(self, description="", button_colour="Unknown", text_colour="Unknown", button_text="Unknown"):
        with open('descriptions.txt', 'a+') as descriptions:
            button_test = "Button Colour: " + button_colour + ", Text Colour: " + text_colour + "\n"
            button_text = "Button Text:\n" + button_text + "\n"
            description_text = "Description: " + description + "\n"
            descriptions.write(button_test + button_text + description_text)


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
