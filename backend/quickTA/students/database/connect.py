from pymongo import MongoClient

def get_cluster():
    cluster = MongoClient('mongodb+srv://admin:admin@cluster0.qatcnyw.mongodb.net/test')
    return cluster
    # db = cluster["quickTA"]
    # collection = db["Users"]
