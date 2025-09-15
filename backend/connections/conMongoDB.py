from utils.FilePropertiesFactory import FilePropertiesFactory
from factory.bundle import *
import pymongo 
from collections import namedtuple

class conMongoDB():
    def __init__(self, dbConnection):
        self._dbConnection  = dbConnection
        self.fileProperties = FilePropertiesFactory("configFiles/connectionsDB.properties")
        self._host          = self.fileProperties.get(self._dbConnection, "host")
        self._db            = self.fileProperties.get(self._dbConnection, "db")
        self._port          = self.fileProperties.get(self._dbConnection, "port")
        self._username      = self.fileProperties.get(self._dbConnection, "username")
        self._password      = self.fileProperties.get(self._dbConnection, "password")
        self._database      = self.fileProperties.get(self._dbConnection, "db")
        self._connDB        = pymongo.MongoClient(
            "mongodb://{0}:{1}/".format(self._host, self._port) , 
            #"mongodb://{0}:{1}@{2}:{3}".format(self._username, self._password, self._host, self._port),
             username=self._username,
             password=self._password
             #authSource=self._database
             )
        self._dbConnected = self._connDB[self._db]
        self.bnd = bundle(lang="it").getBnd()
  
    def getConnection(self):
        try:
            # infor = self._connDB.server_info()
            # self.log.write("info {0}".format(infor))
            conn = self._connDB[self._db]
            return conn
        except Exception as e: 
            error = 'conMongoDb - getConnection - impossibile connettersi al DB: {0}'.format(e)
            # self.log.write(error,'ERROR')
            raise ValueError(self.bnd["datiNoDisp"])


    def find(self, collection, query={}, condition={}, typeFind="ONE"):
        # self.log.write("conMongoDB - find - params document {0}, query {1}, condition, {2}, typeFind {3}".format(collection, query, condition,  typeFind))
        try:   
            coll = self.getConnection()[collection]
            findOne = lambda x, y : coll.find_one(x, y)
            findMany = lambda x, y : coll.find(x, y)
            if typeFind=="ONE": return findOne(query,condition)
            if typeFind=="MANY": return findMany(query,condition)
            else: return findMany(query, condition)
        except Exception as e:
            error = 'conMongoDb - find - impossibile eseguire il find: {0}'.format(e)
            # self.log.write(error,'ERROR')
            raise ValueError(self.bnd["datiNoDisp"])
    

    def aggregate(self, collection, query, options={}):
        # self.log.write("conMongoDB - aggregate - params document {0}, query {1}".format(collection, query))
        try:
            coll = self.getConnection()[collection]
            aggregateX = lambda p,o : coll.aggregate(p, o)
            return aggregateX(query,options)
        except Exception as e:
            error = 'conMongoDb - aggregate - impossibile eseguire aggregate: {0}'.format(e)
            self.log.write(error,'ERROR')
            raise ValueError(self.bnd["datiNoDisp"])


    def insert(self, collection, query={}, typeInsert="ONE"):
        # self.log.write("conMongoDB - insert - params document {0}, query {1}, typeInsert {2}".format(collection, query, typeInsert))
        # self.log.write("conMongoDB - insert - querry type {0}, query {1}".format(type(query), query))
        try:
            coll = self.getConnection()[collection]
            insertOne = lambda x : coll.insert(x)
            insertMany = lambda x : coll.insert_many(x)
            if typeInsert=="ONE": return insertOne(query)
            if typeInsert=="MANY": return insertMany(query)
        except Exception as e:
            error = "conMongoDb - insert - impossibile eseguire l'insert: {0}".format(e)
            # self.log.write(error,'ERROR')
            raise ValueError(self.bnd["datiNoDisp"])

    def update(self, collection, query, newData, upsert=False, multi=False,writeConcern={},collation={},arrayFilters=[] ):
        # self.log.write("conMongoDB - update - params document {0}, query {1}".format(collection, query))
        # self.log.write("conMongoDB - update - doc type {0}, query {1}".format(type(newData), newData))
        try:
            coll = self.getConnection()[collection]
            return coll.update(query,newData,upsert=upsert)
            # if multi:
            #     return coll.update_many(query,newData,upsert=upsert)
            # else:
            #     return coll.update_one(query,newData,upsert=upsert)
        except Exception as e:
            error = "conMongoDb - update - impossibile eseguire l'update: {0}".format(e)
            # self.log.write(error,'ERROR')
            raise ValueError(self.bnd["datiNoDisp"])            

    def delete(self, collection, query):
        # self.log.write("conMongoDB - delete - params document {0}, query {1}".format(collection, query))
        try:
            coll = self.getConnection()[collection]
            coll.delete_one(query)
            return True
        except Exception as e:
            error = "conMongoDb - update - impossibile eseguire la cancellazione: {0}".format(e)
            # self.log.write(error,'ERROR')
            raise ValueError(self.bnd["datiNoDisp"])    