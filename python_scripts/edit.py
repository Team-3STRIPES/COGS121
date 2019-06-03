'''
Python script to clean up tweets collected from Twitter, essentially replacing
fancy quotes and ellipsis with single quotes ' or double quotes ". 
'''

import in_place

with in_place.InPlace('twitter_session_3_may_2019.txt') as file:
    for line in file:
        line = line.replace("“", "\"").replace("’", "'").replace("”", "\"").replace('…', "")
        file.write(line)