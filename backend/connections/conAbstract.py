
class conAbstract():
    def __init__(self):
        pass

    def getDescriptions(self):
        #restituisce il "nome" dei dati del result set
        raise NotImplementedError("The method not implemented")

    def getData(self,params):
        #restituisce i dati in base ai parametri 
        #nel formato dizionario [{name: value,name:value},.....)]
        raise NotImplementedError("The method not implemented")

