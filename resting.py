import cherrypy
import os

digits = \
        {  0 : ["on",  "on",  "on",  "on",  "on",  "on",  "off"],
           1 : ["off", "on",  "on",  "off", "off", "off", "off"],
           2 : ["on",  "on",  "off", "on",  "on",  "off", "on"],
           3 : ["on",  "on",  "on",  "on",  "off", "off", "on"],
           4 : ["off", "on",  "on",  "off", "off", "on",  "on"],
           5 : ["on",  "off", "on",  "on",  "off", "on",  "on"],
           6 : ["on",  "off", "on",  "on",  "on",  "on",  "on"],
           7 : ["on",  "on",  "on",  "off", "off", "off", "off"],
           8 : ["on",  "on",  "on",  "on",  "on",  "on",  "on"],
           9 : ["on",  "on",  "on",  "on",  "off", "on",  "on"],
        }  

class Crystal_Maze(object):

    def __init__(self):
        return
        
    @cherrypy.expose
    def answer(self):
        return '{"data": ' + str(5319) + '}'


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

    cherrypy.quickstart(Crystal_Maze(), '/', conf)
