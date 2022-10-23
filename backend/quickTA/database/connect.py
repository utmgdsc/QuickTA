import pymongo
from pymongo import MongoClient

cluster = MongoClient('mongodb+srv://admin:cEWQJjkyDAracCLY@quickta.dmbx3ix.mongodb.net/?retryWrites=true&w=majority')
db = cluster["quickTA"]
collection = db["Users"]

# collection.insert_one({'name': 'Marko'})