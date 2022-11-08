import pymongo
import json
from pprint import pprint
from pymongo import MongoClient, InsertOne
from bson.json_util import dumps


my_client = MongoClient("mongodb+srv://new-user:torcida@cluster0.qlcdnfi.mongodb.net/test?retryWrites=true&w=majority")
db = my_client["test"]

genus_collection = db["genus"]
species_collection = db["species"]

genus_cursor = list(genus_collection.find())
species_cursor = list(species_collection.find())

genus_json = dumps(genus_cursor)
species_json = dumps(species_cursor)

docs = [genus_cursor, species_cursor]
     

with open('../../public/sample_data/sample_data.json', 'w') as outfile:
      json.dump(species_json, outfile)

#pprint(genus_json)
#pprint(species_json)

try:
    my_client
    print("Sample Data loaded successfully!!!")
except:  
    print("Could not connect to MongoDB")