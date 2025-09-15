from functools import partial, wraps
from datetime import datetime
from utils.LoggingUtil import LoggingUtil
# from LoggingUtil import LoggingUtil
import configparser, traceback, sys

class ThrowableExcept(object):
    __istance = None

    def __new__(cls, *args, **kwargs):
        if cls.__istance is None:
            cls.__istance = super(ThrowableExcept, cls).__new__(cls)
        return cls.__istance

    def __init__(self, logErr=False, logfile="logErr.log", classType="class", method="method"):
        self.logErr         = logErr
        self.__classType    = classType
        self.__method       = method
        self.__ts           = datetime.now().strftime("%Y%m%d%H%M%S%f")

        # leggo logpath file da initConfig.ini:
        config = configparser.ConfigParser(defaults=None, strict=False)
        #configFile = r"C:\Users\john.dimaano\Git\document-classifier\code\configFiles\initConfig.ini"
        
        if self.logErr:
            configFile = "configFiles/initConfig.ini"
            config.read(configFile)
            loggingFile = config.get("develop", "logFile")

            # istanzio LoggingUtil:
            self.loggingUtil = LoggingUtil(loggingFile)
            self.__fileName = logfile

    def __call__(self, function):
        def wrappedFunction(*args):
            try:
                return function(*args)
            except Exception as e:
                eType, eObject, eTraceback = sys.exc_info()
                # print(f"{eType=}")
                # print(f"{eObject=}")
                # print(f"{eTraceback=}")
                # for etr in traceback.extract_tb(eTraceback):
                #     print(f"{etr=}")
                    # for inetr in etr:
                    #     print(f"{inetr=}")
                # print(f"{traceback.extract_tb(eTraceback)[1][0]}")
                # print(f"{traceback.extract_tb(eTraceback)[1][1]}")
                # print("----")
                # print("\n")

                msg = "[{ts}:{classType} -> {method}, (file: {file}, line: {line})]: {error}".format(
                        ts          = self.__ts, 
                        classType   = self.__classType, 
                        method      = self.__method, 
                        file        = traceback.extract_tb(eTraceback)[1][0],
                        line        = traceback.extract_tb(eTraceback)[1][1],
                        error       = str(e)
                    )
                print(msg)
                # TODO: gestire i log con loggingutils:
                # write del log:
                if self.logErr: self.loggingUtil.log(msg)
                return None
                # return msg

        return wrappedFunction

