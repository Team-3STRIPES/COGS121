'''
Python script used to scrape dictionary.com for slang words, acrynonyms, 
definitions, and examples. The words, acrynonyms, and definitions were
later saved into a json format and added into our Firestore database. 
The examples were transformed into the dataturks formatting and used
to add more data to our model. 
'''

import requests
import pickle
import json
from bs4 import BeautifulSoup
import re

#url for slang and first slang word
dict_url = 'https://www.dictionary.com/e/slang/'
word = 'ad hoc'

#url for acrynonyms and first acronyms
ac_url = 'https://www.dictionary.com/e/acronyms/'
ac = 'aafes'


def write_content(examples):
    '''
    Method: given a list of examples, annotates and writes examples into
        a file in dataturks formatting
    Input: list of examples - list of strings
    '''

    search = word
    #search = ac

    filename = "../twitter_data/acronyms.json"

    for e in examples:
        #Clean example 
        e = e.lower()
        starts = [m.start() for m in re.finditer(search, e)]

        #Check to see starting points of word exists
        if not starts:
            continue

        #Set list of ends
        ends = [i+len(search)-1 for i in starts]
        

        #Annotate examples into dictionaries
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

        #Output dictionaries as a json
        with open(filename, 'a') as outfile:
            json_data = json.dumps(d)
            outfile.write(json_data)
            outfile.write('\n')


def webscrape():
    '''
    Method: webscrape all words, and examples from dictionary.com/e/slang
    '''
    global word
    new_url = dict_url + "ad-hoc"

    while (True):
        print(word)
        try:
            #request html from specified url 
            html = requests.get(new_url).text
            parsed_html = BeautifulSoup(html, 'html.parser')

            #parse out list of examples and clean punctuation
            examples = parsed_html.findAll('div', class_="examples__item__content")
            examples = list(filter(None, [BeautifulSoup(str(e), 'html.parser').text.strip() for e in examples]))
            examples = [e.replace("“", "\"").replace("’", "\'").replace("”", "\"").replace('…', "") for e in examples]

            #write examples into a json file 
            write_content(examples)

            #find next link and set next url 
            links = parsed_html.findAll('a', class_="next")
            if len(links) == 0:
                break
            link = str(links[0])
            s = link.find('href="') + 6
            link = link[s:]
            e = link.find('">')
            link = link[:e]
            new_url = link

            #find next word and set word 
            word = new_url.split('/')[-1].replace('-', ' ')
        except:
            continue

def get_defs():
    '''
    Method: webscrape all words and definitions from dictionary.com/e/slang
    '''

    global word
    data = {
        'definition': [],
    }
    new_url = dict_url + "ad-hoc"

    while (True):
        try:
            #request html from specified url 
            html = requests.get(new_url).text
            parsed_html = BeautifulSoup(html, 'html.parser')
            definition = parsed_html.findAll('div', class_="article-word__header__content__holder")

            #find next link and set next url 
            links = parsed_html.findAll('a', class_="next")
            if len(links) == 0:
                break
            link = str(links[0])
            s = link.find('href="') + 6
            link = link[s:]
            e = link.find('">')
            link = link[:e]
            new_url = link

            #parse out definition of slang
            if len(definition) < 1:
                break

            #clean definition from html and save definition to dict
            result = re.search('<p>(.*)</p>', str(definition[0]))
            final_def = result.group(1)
            final_def = re.sub("<[^>]*>", "", final_def);
            d = {
                'word': word,
                'def': final_def,
            }
            data['definition'].append(d)

            #set next word
            word = new_url.split('/')[-1].replace('-', ' ')
            
        except:
            continue

    #write definitions of slang to file 
    with open("../twitter_data/definitions3.json", 'a') as outfile:
            json_data = json.dumps(data)
            outfile.write(json_data)

def webscrape2():
    '''
    Method: webscrape all acronyms, definitions, and examples from dictionary.com/e/acronyms
    '''

    global ac
    data = {
        'definition': [],
    }
    new_url = ac_url + ac

    while (True):
        print(ac)
        try:
            #request html from specified url 
            html = requests.get(new_url).text
            parsed_html = BeautifulSoup(html, 'html.parser')

            #parse out list of examples and clean punctuation
            examples = parsed_html.findAll('div', class_="examples__item__content text")
            examples = list(filter(None, [BeautifulSoup(str(e), 'html.parser').text.strip() for e in examples]))
            examples = [e.replace("“", "\"").replace("’", "\'").replace("”", "\"").replace('…', "") for e in examples]
            
            #write examples into a json file 
            write_content(examples)

            #parse out definition of acronym
            definition = parsed_html.findAll('div', class_="article-word__header__content__holder")
            
            #find next link and set next url 
            links = parsed_html.findAll('a', class_="next")
            if len(links) == 0:
                break
            link = str(links[0])
            s = link.find('href="') + 6
            link = link[s:]
            e = link.find('">')
            link = link[:e]
            new_url = link

            #clean definition from html and save definition to dict
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

            #set next word
            ac = new_url.split('/')[-1].replace('-', ' ')

        except:
            #continue
            pass

    #write definitions of acronyms to file 
    with open("../twitter_data/definitions3.json", 'a') as outfile:
            json_data = json.dumps(data)
            outfile.write(json_data)

#Method calls
#webscrape2()