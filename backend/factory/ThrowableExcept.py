import logging.config
import logging.handlers
from logging.handlers import RotatingFileHandler
from functools import partial, wraps
from factory.LogUtil import *
import sys, os, traceback

class ThrowableExcept(object):
    def __init__(self, msgError="", logErr=False, logfile="log/logErr.log", classType="controller"):
        self.msgError   = msgError
        self.logErr     = logErr

        self.__classType    = classType
        self.__mexError     = {
            "status"    : "KO",
            "errCode"   : "-2",
            "msg"       : "Qualcosa è andato storto, si prega di riprovare più tardi"
        }

        if self.logErr:
            self.__fileName = logfile
            #self.__formatter = logging.Formatter('[%(asctime)s] - %(levelname)s - %(message)s')
            self.__formatter = logging.Formatter('[%(asctime)s] - %(levelname)s - %(message)s')
            self.__logger = logging.getLogger(__name__)            
            self.__logger.setLevel(logging.ERROR)
            self.__handler = logging.FileHandler(self.__fileName)
            self.__handler = RotatingFileHandler(self.__fileName, mode='a', maxBytes=5*1024*1024, backupCount=10, encoding=None, delay=0)
            self.__handler.setLevel(logging.ERROR)
            self.__handler.setFormatter(self.__formatter)
            self.__logger.addHandler(self.__handler)
            self.__classType = classType
            self.__mexError = {
                "status"    : "KO",
                "errCode"   : "-2",
                "msg"       : "Qualcosa è andato storto, si prega di riprovare più tardi"
            }

    def __call__(self, function):
        def wrappedFunction(*args):
            try:
                return function(*args)
            except Exception as e:
                e_type, e_object, e_traceback = sys.exc_info()
                file_name = traceback.extract_tb(e_traceback)[-1][0]
                line_n = traceback.extract_tb(e_traceback)[-1][1]
                msg = "[{0}]. ERROR: {1} ".format((self.msgError, "")[self.msgError==""], str(e))
                except_location = "file: \"{0}\", line: {1}".format(file_name, line_n)
                if self.__classType == "controller"     :
                    LogUtil.write(msg=f"{msg}", level="ERROR")
                    LogUtil.write(msg=f"ERROR in {except_location}", level="DEBUG")
                    return self.__mexError
                if self.__classType == "dao"            : return False
                if self.__classType == "mngrConnection" : return False
                if self.__classType == "daoBase" : return False
                print(msg)
                return msg

        return wrappedFunction

# import logging
# from logging.handlers import RotatingFileHandler
# from functools import wraps
# import sys, traceback

# class ThrowableExcept:
#     def __init__(self, msgError="", logErr=False, logfile="log/logErr.log", classType="controller"):
#         self.msgError   = msgError
#         self.logErr     = logErr
#         self.__classType = classType
#         self.__mexError  = {
#             "status": "KO",
#             "errCode": "-2",
#             "msg": "Qualcosa è andato storto, si prega di riprovare più tardi"
#         }

#         if self.logErr:
#             self.__logger = logging.getLogger(__name__)
#             self.__logger.setLevel(logging.ERROR)
#             if not self.__logger.handlers:
#                 handler = RotatingFileHandler(logfile, maxBytes=5*1024*1024, backupCount=10)
#                 handler.setFormatter(logging.Formatter('[%(asctime)s] - %(levelname)s - %(message)s'))
#                 self.__logger.addHandler(handler)

#     def __call__(self, function):
#         @wraps(function)
#         def wrappedFunction(*args, **kwargs):
#             try:
#                 return function(*args, **kwargs)
#             except Exception as e:
#                 e_type, e_object, e_traceback = sys.exc_info()
#                 tb = traceback.extract_tb(e_traceback)[-1]
#                 file_name, line_n = tb.filename, tb.lineno

#                 prefix = f"[{self.msgError}] " if self.msgError else ""
#                 msg = f"{prefix}ERROR: {e}"
#                 except_location = f'file: "{file_name}", line: {line_n}'

#                 if self.logErr:
#                     self.__logger.error(msg)
#                     self.__logger.debug(f"ERROR in {except_location}")

#                 if self.__classType == "controller":
#                     return self.__mexError
#                 elif self.__classType in ("dao", "mngrConnection", "daoBase"):
#                     return False
#                 return None

#         return wrappedFunction
