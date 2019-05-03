import json
filename = 'store.json'
new_filename ='store-new.json'
o = None
with open(filename, 'r') as f:
    o = json.load(f)

for i in range(len(o)):
    record = o[i]
    try:
        del record['_id']
    except:
        pass

with open(new_filename, 'w') as f:
    json.dump(o,f)


