import pymongo

MongoClient = pymongo.MongoClient()

db = MongoClient['test_bluetooth']
db['raw_data'].insert_one({'test': 'test_entry_value'})