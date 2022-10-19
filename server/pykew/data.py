import pykew.powo as powo
from pykew.powo_terms import Name, Geography, Filters
from pprint import pprint
import json
import random
import pymongo
from pymongo import MongoClient, InsertOne

def get_species_from_genus(genus):
  species_list = []
  search_results = powo.search(genus, filters = [Filters.species, Filters.has_images, Filters.accepted])._response
  if search_results.get('results'):
    for result in search_results['results']:
      species_list.append(result['name'])
  return species_list

def get_species_object(name):
  if 'results' in powo.search(name, filters = [Filters.species, Filters.has_images, Filters.accepted])._response:
    return powo.search(name, filters = [Filters.species, Filters.has_images, Filters.accepted])._response['results'][0]
  else:
    return None
    
def get_species_synonyms(fqId):
  res = powo.lookup(fqId)
  if res.get('synonyms'):
    synonymsList = [synonym['name'] for synonym in res['synonyms']]
    return synonymsList
  else:
    return None
    
def get_native_range(fqId):
  res = powo.lookup(fqId, include=['distribution'])
  if res.get('distribution') and res['distribution'].get('natives'):
    native_to = [d['name'] for d in res['distribution']['natives']]
    return native_to
  else:
    return None

def get_image_links(species):
  image_links = [img['fullsize'] for img in species['images']]
  return image_links

def create_genus_list(data):
  genus_alphabetical = [genus['name'] for genus in data]
  return sorted(genus_alphabetical)

def create_species_list(data):
  species_alphabetical = [species['name'] for species in data]
  return sorted(species_alphabetical)
  
def create_species_object(species): 
  if get_species_object(species):
    species_obj = get_species_object(species)
    species_id = species_obj['fqId']
    species_dict = {'scientificName': species_obj['name'], 'images': get_image_links(species_obj), 'synonyms': get_species_synonyms(species_id), 'nativeRange': get_native_range(species_id), 'star': False}
    return species_dict
  
def create_image_data(species_list):
  image_data = {}
  for species in species_list:
      image_data[species] = get_image_links(get_species_object(species))
  with open('../../public/images/json_data.json', 'w') as outfile:
      json.dump(image_data, outfile)

def enter_species_data(col, colId, species):
  spec_obj = create_species_object(species)
  spec_obj["genus"] = colId
  return col.insert_one(spec_obj).inserted_id

def enter_data_by_genus(genus, random_species):
  genus_obj = genus_collection.insert_one({ 'genusName': genus})
  genusId = genus_obj.inserted_id
  for species in random_species:
    species_id = enter_species_data(species_collection, genusId, species)
    genus_collection.update_one({'_id': genusId}, {"$push": {'species': species_id}})
  
orchids_genus_data = powo.search('Orchidaceae', filters = [Filters.genera, Filters.has_images, Filters.accepted])
orchids_genus_data.size()

full_genus_list = create_genus_list(orchids_genus_data)[0:548]

random_genera_list = random.choices(full_genus_list, k=10)#USE 10
random_genera_list.sort()


my_client = MongoClient("mongodb+srv://new-user:torcida@cluster0.qlcdnfi.mongodb.net/test?retryWrites=true&w=majority")
db = my_client["test"]

genus_collection = db["genus"]
species_collection = db["species"]

random_species_list = []
for name in random_genera_list:
    get_species_list = get_species_from_genus(name)
    generate_random_species = random.choices(get_species_list, k=10) if len(get_species_list) > 10 else get_species_list
    random_species_list.extend(generate_random_species)
    enter_data_by_genus(name, generate_random_species)
    
pprint(random_species_list)
create_image_data(random_species_list)

try:
    my_client
    print("Connected successfully!!!")
except:  
    print("Could not connect to MongoDB")