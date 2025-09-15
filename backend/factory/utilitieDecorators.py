from functools import partial, wraps
from flask import jsonify
from collections import namedtuple
from itertools import *
from bson.json_util import dumps

import datetime
import time
import base64
import hashlib
import random
import string
import json
import ast
import dis
import re

class utilitieDecorators:
    def __init__(self):
        if utilitieDecorators.__instance == None:
            utilitieDecorators.__instance = self

    @staticmethod
    def getInstance():
        if utilitieDecorators.__instance == None: 
            return utilitieDecorators()
        return utilitieDecorators.__instance


    # inizio funzioni utilitieDecorators
    # funcione decoratore che ritorna un json array
    @classmethod
    def toJson(self, func):
        @wraps(func)
        def wrapperToJson(*args, **kargs):
            d = func(*args, **kargs)
            return jsonify(d)
        return wrapperToJson

    # inizio funzioni utilitieDecorators
    # funcione decoratore che ritorna un json dump
    @classmethod
    def toDumpJson(self, func):
        @wraps(func)
        def wrapperToDumpJson(*args, **kargs):
            d = func(*args, **kargs)
            return dumps(d)
        return wrapperToDumpJson