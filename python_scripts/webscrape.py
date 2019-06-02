import requests
import pickle
import json
from bs4 import BeautifulSoup
import re

dict_url = 'https://www.dictionary.com/e/slang/'
word = 'jesus take the wheel'

ac_url = 'https://www.dictionary.com/e/acronyms/'
ac = 'aafes'

def write_content(examples):
	for e in examples:
		e = e.lower()
		starts = [m.start() for m in re.finditer(ac, e)]
		if not starts:
			continue
		ends = [i+len(ac)-1 for i in starts]
		
		labels = ["Slang" for _ in starts]
		points = [{"start":s, "end":e, "text":ac} for s,e in zip(starts,ends)]
		
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
		with open("../twitter_data/acronyms.json", 'a') as outfile:
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

def webscrape2():
	global ac
	data = {
		'definition': [],
	}
	new_url = ac_url + ac
	while (True):
		print(ac)
		try:
			html = requests.get(new_url).text
			parsed_html = BeautifulSoup(html, 'html.parser')
			examples = parsed_html.findAll('div', class_="examples__item__content text")
			
			examples = list(filter(None, [BeautifulSoup(str(e), 'html.parser').text.strip() for e in examples]))
			examples = [e.replace("“", "\"").replace("’", "\'").replace("”", "\"").replace('…', "") for e in examples]
			write_content(examples)

			definition = parsed_html.findAll('div', class_="article-word__header__content__holder")
			
			links = parsed_html.findAll('a', class_="next")
			if len(links) == 0:
				break
			link = str(links[0])
			s = link.find('href="') + 6
			link = link[s:]
			e = link.find('">')
			link = link[:e]
			new_url = link

			if len(definition) < 1:
				break
			result = re.search('<p>(.*)</p>', str(definition[0]))
			final_def = result.group(1)
			final_def = re.sub("<[^>]*>", "", final_def);
			d = {
				'word': ac,
				'def': final_def,
			}
			data['definition'].append(d)

			ac = new_url.split('/')[-1].replace('-', ' ')

		except:
			#continue
			pass

	with open("../twitter_data/definitions3.json", 'a') as outfile:
			json_data = json.dumps(data)
			outfile.write(json_data)

#webscrape()
def get_defs():
	global word

	data = {
		'definition': [],
	}
	new_url = dict_url + "jesus-take-the-wheel"
	while (True):
		try:
			html = requests.get(new_url).text
			parsed_html = BeautifulSoup(html, 'html.parser')
			definition = parsed_html.findAll('div', class_="article-word__header__content__holder")


			links = parsed_html.findAll('a', class_="next")
			if len(links) == 0:
				break

			link = str(links[0])
			s = link.find('href="') + 6
			link = link[s:]
			e = link.find('">')
			link = link[:e]
			new_url = link

			if len(definition) < 1:
				break
			result = re.search('<p>(.*)</p>', str(definition[0]))
			final_def = result.group(1)
			final_def = re.sub("<[^>]*>", "", final_def);
			print(word)
			print(final_def)
			d = {
				'word': word,
				'def': final_def,
			}
			data['definition'].append(d)

			word = new_url.split('/')[-1].replace('-', ' ')
			
		except:
			continue
	with open("../twitter_data/definitions3.json", 'a') as outfile:
			json_data = json.dumps(data)
			outfile.write(json_data)

webscrape2()


#next url = class next 
#examples__item__content text
#{"content": "you won't regret it!! and if you need help, hmu!","annotation":[{"label":["Slang"],"points":[{"start":44,"end":46,"text":"hmu"}]}]}