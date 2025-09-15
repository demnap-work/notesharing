from sqlalchemy import Column, ForeignKey, Integer, String
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
import socket


Base = declarative_base()

class driverConn(Base):
    __tablename__ = "driverConnection"

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    httpcontext = Column(String(100), nullable=False)
    schema = Column(String(5), nullable=False, default='http')


