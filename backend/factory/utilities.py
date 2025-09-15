from functools import partial, wraps
from collections import namedtuple
from itertools import *
from datetime import datetime, timedelta, date
from ast import literal_eval
from factory.logFactory import *
from factory.ThrowableExcept import *
from factory.filePropertiesUtils import filePropertiesSingleton 

import time, random, string, json, re, os
import base64, hashlib, ast, dis
import configparser, smtplib, ssl

class utilities:
    __instance = None
    __validPwd = lambda pwd : re.match('^([a-z]*|[A-Z]*|[0-9]*|.{0,6})$', pwd)
    __validEmail = r'\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b'
    __dictStringEscaping = {
            "-":  r"\-",
            "]":  r"\]",
            "\\": r"\\",
            "^":  r"\^",
            "$":  r"\$",
            "*":  r"\*",
            ".":  r"\."
        }
    __mapRegExp = {
                    "passwordSec"   : r'^([a-z]*|[A-Z]*|[0-9]*|.{0,6})$',
                    "email"         : r'(^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$)'
                }

    def __init__(self):
        if utilities.__instance == None:
            utilities.__instance = self

    # @staticmethod
    def getInstance(self):
        if self.__instance == None: 
            return self()
        return self.__instance

    @classmethod
    def toJson(self, func):
        @wraps(func)
        def wrapperToJson(*args, **kargs):
            d = func(*args, **kargs)
            return jsonify(d)
        return wrapperToJson

    @classmethod
    def toDumpJson(self, func):
        @wraps(func)
        def wrapperToJson(*args, **kargs):
            d = func(*args, **kargs)
            return dumps(d)
        return wrapperToJson

    def decodePwd(self, pwd = "~"):
        return base64.b64decode(pwd).decode("utf-8") 

    def getToken(self, username):
        return str(base64.b64encode(bytes(username + str(datetime.now()), 'utf-8'))).join(random.choice(string.ascii_lowercase) for i in range(4))
    
    def getSha256(self, value):
        hash_object = hashlib.sha384(value.encode())
        return hash_object.hexdigest()
    
    def getSha1(self, value):

        # print(value)

        hash_object = hashlib.sha1(value.encode('utf-8'))
        return hash_object.hexdigest()

    def jsonToDict(self, jsonString):
        return json.loads(jsonString, object_hook=lambda d: namedtuple('X', d.keys())(*d.values()))

    def jsonToDictDump(self, jsonString):
        return json.dumps(jsonString)

    def stringToDict(self, string):
        return ast.literal_eval(str(string))

    def listToDict(self, tup): 
        return zip(tup)

    def isNotNone(self, value):
        return value is not None 

    def validPassword(self, password):
        # if re.match('^([a-z]*|[A-Z]*|[0-9]*|.{0,6})$', password):
        print("password util {0}".format(password))
        if re.match(self.__mapRegExp["password"], password) is not None:
            print("password corretta")
            return True
        return False

    def isEmail(self, email):
        if re.match(self.__mapRegExp["email"], email):
            return True
        return False

    def getNow(self, format="%D-%m-%Y %H:%M"):
        now = datetime.now()
        return now.strftime(format)

    def getDAteDifference(self, d1, d2, typeDif = "day"):
        d1 = datetime.strptime(str(d1), "%d/%m/%Y")
        d2 = datetime.strptime(str(d2), "%d/%m/%Y")
        diff = d2 - d1
        if typeDif == "d":
            return abs((diff).days)
        if typeDif == "m":
            return abs((diff))
        return None

    # Without repetition  
    def Union(self, lst1, lst2): 
        final_list = list(set().union(lst1, lst2)) 
        return final_list


    def substractDayfromNow(self, day):
        try:
            
            return (datetime.today() - timedelta(days=day)).strftime("%m/%d/%Y %H:%M:%S")
        except Exception as e:
            print("errore nella conversione delle date {0}".format(e))
            return False

    def substractMonthfromNow(self, m):
        try:
            month = m *-1
            date = datetime.now()
            m, y = (date.month+month) % 12, date.year + ((date.month)+month-1) // 12
            if not m: m = 12
            d = min(date.day, [31,
                29 if y%4==0 and not y%400==0 else 28,31,30,31,30,31,31,30,31,30,31][m-1])
            return date.replace(day=d,month=m, year=y).strftime("%m/%d/%Y %H:%M:%S")
        except Exception as e:
            print("errore nella conversione delle date {0}".format(e))
            return False

    def getBeginginYear(self):
        beginningYear = "{0} 00:00:00".format(datetime.now().date().replace(month=1, day=1).strftime("%m/%d/%Y"))
        return beginningYear 

    def getBeginningToDay(self):
        beginningToDay = "{0} 00:00:00".format(date.today().strftime("%m/%d/%Y"))
        return beginningToDay
    

    def stringToJson(self, stringJson):
        if isinstance(stringJson, str):
            return literal_eval(stringJson), None
        return None, None


    
    def listDateTimeToListString(self, listDateTime, formatDate = "%d%m%Y%H%M%S"):
        listResult = []
        try:
            for item in listDateTime:
                listResult.append(item.strftime(formatDate))
        except Exception as e:
            listResult = None
        
        return listResult
        


    def isDateTime(self, value):
        res = None
        try:
            res = isinstance(value, datetime)
        except Exception as e:
            res = False
        return res
    
    def randomPwd(self, stringLength=8):
        letters = string.ascii_lowercase
        return ''.join(random.choice(letters) for i in range(stringLength))
    
    def escapingString(self, string):
        print("sono nel utilities")
        print(string.replace("'", "''"))
        return string.replace("'", "\'")

    def decodeBase64(self, text):
        import base64
        return base64.b64decode(text)
    
    def escapeString(self, text):
        return re.escape(text)

    def validateParamValue(self, paramName, args):
        # (None, args["numeroCommessa"])["numeroCommessa" in args or str(args["numeroCommessa"]).lower()=="null"]
        if paramName not in args:
            return None
        
        if args[paramName] == None:
            return None
        
        if str(args[paramName]).lower() == 'null' or str(args[paramName]).lower() == 'undefined':
            return None

        return args[paramName]

    def getRandomString(self, length):
        letters = string.ascii_lowercase
        result_str = ''.join(random.choice(letters) for i in range(length))
        return result_str
    
    def sendMailLinkRichiestaPwd(self, subject, email, tokenRichiestaPwd):
        print("a1")
        filePropertiesInit      = filePropertiesSingleton("config/init.properties")
        print("a2")
        filePropertiesEmail     = filePropertiesSingleton("config/email.properties")
        print("a3")
        
        baseUrl         = filePropertiesInit.get("initConfiguration", "baseUrl")
        print("a4")
        emailSMTPHost   = filePropertiesEmail.get("emailConfiguration", "email_smtp_host")
        print("a5")
        emailPort       = filePropertiesEmail.get("emailConfiguration", "email_port")
        print("a6")
        emailUsername   = filePropertiesEmail.get("emailConfiguration", "email_username")
        print("a7")
        emailPassword   = filePropertiesEmail.get("emailConfiguration", "email_password")
        print("a8")
        
        message = """\
        Subject: Hi there

        This message is sent from Python."""
        print("a9")

        context = ssl.create_default_context()
        with smtplib.SMTP_SSL(emailSMTPHost, emailPort, context=context) as server:
            server.login(emailUsername, emailPassword)
            server.sendmail(emailUsername, email, message)
        print("a10")
                

    def dir_path(self, string):
        if os.path.isdir(string):
            return string
        else:
            raise NotADirectoryError(string)

    def get_ini_val(self, file_ini, section, key):
        config = configparser.ConfigParser()
        config.read(file_ini)
        value = config[section][key]
        return value
    
    
    def excel_column_to_number(column_letter):
        column_letter = column_letter.upper()
        result = 0
        power = 0
        for i in range(len(column_letter) - 1, -1, -1):
            char_value = ord(column_letter[i]) - ord('A') + 1 #ord('A') = 65
            result += char_value * (26 ** power)
            power += 1
        return result

    
    def saveOCRResult(self, nome_file, testo):
        try:
            with open(nome_file, 'w', encoding='utf-8') as file:
                file.write(testo)
            return nome_file
        except Exception as e:
            print(f"errore: {e}")
            return None
        
    def saveOCRResultEmail(self, nome_file, testo):
        try:
            with open(nome_file, 'w', encoding='UTF-8') as file:
                file.write(testo)
            return nome_file
        except Exception as e:
            print(f"errore: {e}")
            return None
    
    def checkPrivilegesFolder(self, folderPath):
        try:
            return {
                "read"      : os.access(folderPath, os.R_OK),
                "write"     : os.access(folderPath, os.W_OK),
                "execution" : os.access(folderPath, os.X_OK)
            }
        except Exception as e:
            return False
    
    def cleanFilename(self, input_str):
        emoji_pattern = re.compile(
            "["                     # Start of the character class
            "\U0001F600-\U0001F64F"  # Emoticons
            "\U0001F300-\U0001F5FF"  # Miscellaneous Symbols and Pictographs
            "\U0001F680-\U0001F6FF"  # Transport and Map Symbols
            "\U0001F1E0-\U0001F1FF"  # Regional Indicator Symbols
            "\U00002500-\U00002BEF"  # Various CJK characters
            "\U00002702-\U000027B0"  # Dingbats
            "\U0001F926-\U0001F937"  # Supplemental Symbols and Pictographs
            "\U0001F9F0-\U0001F9FF"  # Additional Supplemental Symbols and Pictographs
            "\U0001F900-\U0001F9FF"  # Supplemental Symbols and Pictographs
            "\U0001FA70-\U0001FAFF"  # Chess Symbols
            "\U0001F004-\U0001F0CF"  # MahJong Tiles and Domino Tiles
            "]+",                    # End of the character class
            flags=re.UNICODE
        )
        notAllowedChars = ['<', '>', ':', '\"', '/', '\\', '|', '?', '*']
        # cleaned_str = ''.join(char for char in input_str if char not in string.punctuation)
        cleaned_str = ''.join(char for char in input_str if char not in notAllowedChars)
        cleaned_str = emoji_pattern.sub('', cleaned_str)
        return cleaned_str
    
    def normalizeText(self, s, sep_token = " \n "):
        s = re.sub(r'\s+',  ' ', s).strip()
        s = re.sub(r". ,","",s)
        # remove all instances of multiple spaces    
        s = s.replace("__","")
        s = s.replace("..",".")
        s = s.replace(". .",".")
        s = s.replace("\n", "")
        s = s.strip()
        return s

    def checkPWD(self, password=""):
        if not (5 <= len(password) <= 10): return False
        if not password.isalnum():return False
        if not any(char.isdigit() for char in password):return False
        if not any(char.isalpha() for char in password): return False
        return True

    def checkUser(self, password=""):
        if not (5 <= len(password) <= 10): return False
        return True
