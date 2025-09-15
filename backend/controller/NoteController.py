from DAO.NoteDao import NoteDao


class NoteController:
    def __init__(self): pass
        
    def insertNota(self, args, header):        
        response    = dict()
        msg         = self._controller["msg"]
        nota        = self._controller["utils"].validateParamValue("nota", args)
        tags        = self._controller["utils"].validateParamValue("tags", args)
        idUser      = int(self._controller["userInfo"]["id_user"])
        idNota      = NoteDao().execute("insert", (nota, idUser, tags, ))
        
        NoteDao().execute("insert_share_nota", (idUser, idNota, ))
        response["status"]  = "OK"
        response["nota"]    = nota
        response["result"]  = msg["insertNotaOK"]
        return response
    
    def sharedNotaOLD(self, args, header):        
        response      = dict()
        msg           = self._controller["msg"]
        idNota        = self._controller["utils"].validateParamValue("idNota", args)
        idUser        = self._controller["utils"].validateParamValue("idUser", args)
        idNOtaShared  = NoteDao().execute("insert_share_nota", (idNota, idUser, ))
        response["status"]  = "OK"
        response["result"]  = msg["notaSharedOK"]
        response["idNota"] = idNOtaShared
        return response
    
    def sharedNota(self, args, header):        
        response      = dict()
        msg           = self._controller["msg"]
        idNota        = self._controller["utils"].validateParamValue("idNota", args)
        idUsers       = str(self._controller["utils"].validateParamValue("idUser", args)).split(",")
        params = [(idUser, idNota) for idUser in idUsers]
        idNOtaShared  = NoteDao().execute("insert_many_share_nota", params)
        response["status"]  = "OK"
        response["result"]  = msg["notaSharedOK"]
        response["idNota"] = idNOtaShared
        return response
    
    def getAllNotes(self, args, header): 
        response    = dict()       
        result      = NoteDao().execute("get_all")
        response["status"]  = "OK"
        response["result"]  = result
        return response
    
    def getNotesSharedByIDUser(self, args, header): 
        response    = dict()       
        idUser      = int(self._controller["userInfo"]["id_user"])
        result      = NoteDao().execute("get_all_by_idUser", (idUser, ))
        response["status"]  = "OK"
        response["result"]  = result
        return response
    
    def updateNote(self, args, header): 
        response    = dict()       
        msg         = self._controller["msg"]
        notaNuova   = self._controller["utils"].validateParamValue("notaNuova", args)
        idNota      = self._controller["utils"].validateParamValue("idNota", args)
        tags        = self._controller["utils"].validateParamValue("tags", args)
        idUser      = int(self._controller["userInfo"]["id_user"])
        result      = NoteDao().execute("check_owner", (idUser, idNota, ))
        response["status"]  = "KO"
        response["result"]  =  msg["privilegesKO"]
        if len(result)==1:
            result      = NoteDao().execute("update", (notaNuova, tags, idUser, idNota,  ))
            response["status"]  = "OK"
            response["result"]  = msg["notaUpdateOK"]
        return response
    
    def removeNote(self, args, header): 
        response    = dict()       
        msg         = self._controller["msg"]
        idNota      = self._controller["utils"].validateParamValue("idNota", args)
        idUser      = int(self._controller["userInfo"]["id_user"])
        result      = NoteDao().execute("check_owner", (idUser, idNota,  ))
        response["status"]  = "KO"
        response["result"]  =  msg["privilegesKO"]
        if len(result)==1:
            NoteDao().execute("delete", (idUser, idNota, ))
            response["status"]  = "OK"
            response["result"]  = msg["removedNotaOK"]
        return response
    