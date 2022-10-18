from pymongo import MongoClient

DB_URI="mongodb+srv://admin:cEWQJjkyDAracCLY@quickta.dmbx3ix.mongodb.net/?retryWrites=true&w=majority"

def get_db_handle(db_name, host, port, username="admin", password=":cEWQJjkyDAracCLY"):

    client = MongoClient(host=host,
                        port=int(port),
                        username=username,
                        password=password
                        )
    
    db_handle = client['db_name']
    return db_handle, client

def get_collection_handle(db_handle, collection_name):
    return db_handle[collection_name]