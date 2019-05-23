import requests
import pickle
import json
from bs4 import BeautifulSoup
import re

dict_url = 'https://www.dictionary.com/e/slang/'
word = 'jesus take the wheel'

def write_content(examples):
	for e in examples:
		starts = [m.start() for m in re.finditer(word, e)]
		if not starts:
			continue
		ends = [i+len(word)-1 for i in starts]
		
		labels = ["Slang" for _ in starts]
		points = [{"start":s, "end":e, "text":word} for s,e in zip(starts,ends)]
		
		annotation = []
		for i in range(len(starts)):
			annotation.append({
				"label": [labels[i]],
				"points": [points[i]], 
			})

		d = {
			"content": e,
			"annotation":annotation,
		}
		with open("../twitter_data/slang4.json", 'a') as outfile:
			json_data = json.dumps(d)
			outfile.write(json_data)
			outfile.write('\n')


def webscrape():
	global word
	new_url = dict_url + "jesus-take-the-wheel"
	while (True):
		print(word)
		try:
			html = requests.get(new_url).text
			parsed_html = BeautifulSoup(html, 'html.parser')
			examples = parsed_html.findAll('div', class_="examples__item__content")
			
			examples = list(filter(None, [BeautifulSoup(str(e), 'html.parser').text.strip() for e in examples]))
			examples = [e.replace("“", "\"").replace("’", "\'").replace("”", "\"").replace('…', "") for e in examples]
			write_content(examples)
			links = parsed_html.findAll('a', class_="next")
			if len(links) == 0:
				break
			link = str(links[0])
			s = link.find('href="') + 6
			link = link[s:]
			e = link.find('">')
			link = link[:e]
			new_url = link
			word = new_url.split('/')[-1].replace('-', ' ')
		except:
			continue

webscrape()



#next url = class next 
#examples__item__content text
#{"content": "you won't regret it!! and if you need help, hmu!","annotation":[{"label":["Slang"],"points":[{"start":44,"end":46,"text":"hmu"}]}]}