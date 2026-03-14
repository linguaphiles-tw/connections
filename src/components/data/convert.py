import json


a = open('data.txt').readlines()

levels = []
l = []
br = False

for line in a:     
   if len(line.strip()) < 2:              
     br = True
   else:  
     if br:    
       levels.append(l)
       l = []
       br = False
     l.append(line)
levels.append(l)

converted = [{'content': [{
      'theme': (items := [item for item in line.split() if item])[-1],
      'words': items[:-1],
      'category': i + 1
    }
    for i, line in enumerate(level) ],
        'levelName': ''}
  for level in levels]
             

print(json.dumps(converted, indent=2, ensure_ascii=False))