# from factory.logFactory import *
from utils.FilePropertiesFactory import FilePropertiesFactory
from factory.bundle import *

import tornado.httpserver
import tornado.websocket
import tornado.ioloop
import tornado.web
import socket
import json


class wSocket(tornado.websocket.WebSocketHandler):
    def __init__(self):
        # self.log = LogUtil('log', "").getInstance()
        pass

    def open(self):
        print('Nuova connessione')

    def on_message(self, message):
        self.write_message(json.dumps(message))
        print('Messaggio ricevuto: {0}'.format(message))

    def on_close(self):
        print('Connessione chiusa')

    def check_origin(self, origin):
        return True



class conWebSocket():
    def __init__(self, wsConnection):
        #self.log            = LogUtil('log', "").getInstance()
        self.wsConnection   = wsConnection
        self.fileProperties = FilePropertiesFactory("configFiles/initConfig.ini")
        self._server        = self.fileProperties.get(self.wsConnection, "server")
        self._port          = self.fileProperties.get(self.wsConnection, "port")

        self.bnd = bundle(lang="it").getBnd()


    
    def getPlayStream(self, chanel):
        application = tornado.web.Application([(r'/{0}'.format(chanel), wSocket),])
        http_server = tornado.httpserver.HTTPServer(application)
        http_server.listen(self._port)
        tornado.ioloop.IOLoop.instance().start()
    
    def getCloseStream(self, chanel):
        tornado.ioloop.IOLoop.instance().stop()