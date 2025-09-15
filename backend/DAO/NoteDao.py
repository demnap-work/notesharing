from factory.filePropertiesUtils import filePropertiesSingleton 
from DAO.DaoBase import *

class NoteDao(DaoBase):
    def __init__(self):  
        
        strDBMS=filePropertiesSingleton("configFiles/connectionsDB.properties").get("notesharingDBMS", "DBMS")
        super(NoteDao, self).__init__(typeDBMS=strDBMS, nameConnection='notesharingDBMS')
        self.typeDBMS = self.getDBMS()
        
        self.__con, self.__cursor = self.getCon()
        self.__insertNota       = "INSERT into notes (note, owner, tags) value (%s, %s, %s)"
        self.__sharetNota       = "INSERT into notesharing (id_user, id_note) value (%s, %s)"
        self.__getALL           = "SELECT note, convert(creation, char) as creation_time, state from notes where state = 1"
        # self.__getALLByuserID   = "SELECT note, convert(creation, char) as creation_time, state from notes where id_user = %s and state = 1"
        self.__getALLByuserID   = """SELECT 
                                            t.id as idNota, note, t.tags,
                                            convert(t.creation, char) as dataCreation,
                                            convert(s.last_modify, char) as dataLastModify,
                                            case 
                                                when t.owner = s.id_user then 1 else 0 
                                            end as isOwner
                                            from notes t left join notesharing s on t.id = s.id_note
                                                where s.id_user = %s and t.state = 1 
                                                    order by t.id;
                                    """
        self.__updateNote       = "UPDATE notes SET note = %s, tags = %s WHERE owner = %s and id = %s;"
        self.__checkOwner       = "SELECT id FROM notes where owner = %s and id = %s;"
        self.__deleteNote       = "UPDATE notes SET state = 0 WHERE owner = %s and id = %s;"
        

    # @ThrowableExcept(logErr=True, msgError="UserDao - execute", logfile="log/logErrDao.log", classType="dao")
    def execute(self, operation, bindigParam=()):
        self.__con, self.__cursor = self.getCon()      # type: ignore
              
        if str(operation).lower() not in (
                    "insert", 
                    "insert_share_nota",
                    "insert_many_share_nota",
                    "get_all",
                    "get_all_by_iduser",
                    "update",
                    "delete",
                    "check_owner"
                ):
            print("NOT IN IT ", str(operation).lower())
            return False
        
        if str(operation).lower() == "insert":
            self.__cursor.execute(self.__insertNota, bindigParam)
            self.__con.commit()
            lastId = self.__cursor.lastrowid
            self.__closeSecreConn()
            return lastId 
        
        if str(operation).lower() == "insert_many_share_nota":
            print(self.__sharetNota, bindigParam)
            self.__cursor.executemany(self.__sharetNota, bindigParam)
            self.__con.commit()
            lastId = self.__cursor.lastrowid
            self.__closeSecreConn()
            return lastId 

        if str(operation).lower() == "insert_share_nota":
            print(self.__sharetNota, bindigParam)
            self.__cursor.execute(self.__sharetNota, bindigParam)
            self.__con.commit()
            lastId = self.__cursor.lastrowid
            self.__closeSecreConn()
            return lastId

        if str(operation).lower() == "get_all_by_iduser":
            self.__cursor.execute(self.__getALLByuserID, bindigParam)
            resp = self.__cursor.fetchall()
            self.__closeSecreConn()
            return resp
        
        if str(operation).lower() == "get_all":
            self.__cursor.execute(self.__getALL)
            resp = self.__cursor.fetchall()
            self.__closeSecreConn()
            return resp
        
        if str(operation).lower() == "check_owner":
            self.__cursor.execute(self.__checkOwner, bindigParam)
            resp = self.__cursor.fetchall()
            self.__closeSecreConn()
            return resp
        
        if str(operation).lower() == "update":
            self.__cursor.execute(self.__updateNote, bindigParam)
            self.__con.commit()
            lastId = self.__cursor.lastrowid
            self.__closeSecreConn()
            return lastId

        if str(operation).lower() == "delete": self.__cursor.execute(self.__deleteNote, bindigParam)
        
        self.__con.commit()
        self.__closeSecreConn()
        return True

    # @ThrowableExcept(logErr=True, msgError="UserDao - __closeSecreConn", logfile="log/logErrDao.log", classType="dao")
    def __closeSecreConn(self):
        if self.__cursor: self.__cursor.close()
        self.__con.close()