import json
from openai import AzureOpenAI
from pprint import pprint
from utils.ThrowableExcept import *

class AzureOpenAIWrapper(object):
    __instance  = None
    __clent     = None
    __response  = None
    
    
    # def __new__(cls, *args, **kwargs):
    #     if cls.__instance is None:
    #         cls.__instance = super().__new__(cls)
    #         cls.__instance.data = None
    #     return cls.__instance
    
    def __init__(self, apiKey="", apiVersion="", endPoint="", model="gpt35"):
        if AzureOpenAIWrapper.__instance is None:
            AzureOpenAIWrapper.__instance = self
            self.__max_tokens   = 50    # Valore predefinito per max_tokens
            self.__temperature  = 0    # Valore predefinito per temperature è 1.0
            self.__apiKey       = apiKey
            self.__apiVersion   = apiVersion
            self.__endPoint     = endPoint
            self.__model        = model
            self.__clent        = self.setClient()

    
    @classmethod
    @ThrowableExcept(classType="AzureOpenAIWrapper", method="getInstance")
    def getInstance(cls):
        if cls.__instance is None: cls.__instance = cls()
        return cls.__instance
    
    @ThrowableExcept(classType="AzureOpenAIWrapper", method="setClient")
    def setClient(self): return AzureOpenAI(api_key=self.__apiKey,api_version=self.__apiVersion,azure_endpoint=self.__endPoint)
    
    @ThrowableExcept(classType="AzureOpenAIWrapper", method="test")
    def response(self, messages="", role="user"):
        self.__response = self.__clent.chat.completions.create(
            model       = self.__model,
            messages    = [{"role" : role,"content": messages}],
            temperature = self.__temperature,
            max_tokens = 650 # maximum
            # max_tokens = 100 # maximum
            # max_tokens = 900 # maximum
        )
        return self.__response
        
    @ThrowableExcept(classType="AzureOpenAIWrapper", method="test")
    def getFormatRepsonse(self):
        # res = json.loads(self.__response.model_dump_json(indent=2))['choices'][0]['message']['content']
        res = json.loads(self.__response.model_dump_json(indent=2))['choices'][0]['message']['content']
        if isinstance(res, dict):
            res = json.loads(res)
        return res
        # return res.replace('\n', '')
        # return json.loads(json.loads(self.__response.model_dump_json(indent=2))['choices'][0]['message']['content'])
    

    @ThrowableExcept(classType="AzureOpenAIWrapper", method="test")
    def getSimpleRepsonse(self):
        return self.__response

if __name__ == '__main__':
    aoaiW = AzureOpenAIWrapper(
                    apiKey      = "6733a4b85eab4b3e9e4765b1cc13a357",
                    endPoint    = "https://edogtp.openai.azure.com/",
                    apiVersion  = "2023-07-01-preview"
                ).getInstance()
    
    
    topics      = ['Merge&Acquisition', 'Bonds', 'Derivatives', 'Stock Options']
    messages     = '''Considering the following topics: {topics} ; return a json object with the probability of 
            the presence of each in the following text?\n
            # Start of Report\n
            Walgreens Boots (NASDAQ:WBA) is evaluating options, including the sale of Shields Health Solutions, a specialty pharmacy business it purchased three years ago.
            The business may be valued at $4 billion in a potential sale, according to a Bloomberg report on Tuesday, which cited people familiar with the matter. The unit is expected to garner interest from healthcare companies and private equity firms.
            Walgreens hasn't made a final decision on the business and may decide to keep it, according to the report.
            Walgreens Boots announced in September 2022 that it would acquire the remaining 30% stake of Shields Health Solutions for about $1.37 billion. In September of 2021, Walgreens made a majority investment in Shields with for $970 million.
            A potential sale comes at the same as Walgreens (WBA) is reportedly trying to again jettison is UK Boots drugstore chain. Bloomberg reported last month that the company has been having early discussions about ways to separate the Boots chain, which could be valued at about £7 billion ($8.8 billion) in a transaction.
            A potential sale of UK-based Boots comes after Walgreens in November inked a deal with insurer Legal & General to take over responsibility for the UK Boots pharmacy chain's £5 billion legacy pension plan.
            Walgreens (WBA) is scheduled to hold its annual meeting on Thursday.
            # End of Report'''.format(topics=', '.join(topics))
    
    messages = "raccontami una breve storia"
        
    res = aoaiW.response(messages)
    print(aoaiW.getSimpleRepsonse())
    
    
    
