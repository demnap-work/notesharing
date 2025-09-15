import functools, xmltodict
import xml.etree.ElementTree as ET
from utils.ThrowableExcept import ThrowableExcept
#from ThrowableExcept import ThrowableExcept

class XmlFactory(object):
    __istance = None

    def __new__(cls, *args, **kwargs):
        if cls.__istance is None:
            cls.__istance = super(XmlFactory, cls).__new__(cls)
        return cls.__istance
    
    def __init__(self, xmlPath=""):
        if not hasattr(self, 'inizialized'):
            self.xmlPath        = xmlPath
            self.inizialized    = True

    @functools.lru_cache(maxsize=1)
    @ThrowableExcept(classType="XmlFactory", method="getContent")
    def getContent(self):
        with open(self.xmlPath, 'r') as file:
            xml_data = file.read()
            xml_dict = xmltodict.parse(xml_data)
        return dict(xml_dict)

class XMLParser(object):
    __istance = None
    
    def __new__(cls, *args, **kwargs):
        if cls.__istance is None:
            cls.__istance = super(XMLParser, cls).__new__(cls)
        return cls.__istance
    
    def __init__(self, filePath=""):
        if not hasattr(self, 'inizialized'):
            self.filePath      = filePath
            self.inizialized    = True
    
    @ThrowableExcept(classType="XMLParser", method="_xml2Dictict")
    def _xml2Dictict(self, element):
        dict_data = {}
        if element.attrib:
            dict_data.update(element.attrib)
        if element.text and element.text.strip():
            dict_data[element.tag] = element.text.strip()
        else:
            child_data = {}
            for child in element:
                child_data_list = self._xml2Dictict(child)
                if child.tag in child_data:
                    if isinstance(child_data[child.tag], list):
                        child_data[child.tag].append(child_data_list)
                    else:
                        child_data[child.tag] = [child_data[child.tag], child_data_list]
                else:
                    child_data[child.tag] = child_data_list
            dict_data.update(child_data)
        return dict_data
    
    
    @ThrowableExcept(classType="XMLParser", method="getDict")
    def getDict(self):
        tree = ET.parse(self.filePath)
        root = tree.getroot()
        return self._xml2Dictict(root)