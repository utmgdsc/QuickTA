from pymongo import MongoClient

def get_cluster():
    cluster = MongoClient('mongodb+srv://admin:cEWQJjkyDAracCLY@quickta.dmbx3ix.mongodb.net/?retryWrites=true&w=majority')
    return cluster
    # db = cluster["quickTA"]
    # collection = db["Users"]
