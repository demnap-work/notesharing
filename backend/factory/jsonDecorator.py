    
from functools import partial, wraps
import json
from flask import jsonify

class JsonDecorator:
    __istance = None

    def __init__(self):
        if JsonDecorator.__istance == None:
            JsonDecorator.__istance = self


    @staticmethod
    def getIstance():
        if JsonDecorator.__istance == None: 
            return JsonDecorator()
        return JsonDecorator.__istance
    
    @classmethod
    def toJson(cls, func):
        @wraps(func)
        def wrapperToJson(*args, **kargs):
            d = func(*args, **kargs)
            # return jsonify(d)
            return json.dumps(d)
        return wrapperToJson