import in_place

with in_place.InPlace('twitter_session_3_may_2019.txt') as file:
    for line in file:
        line = line.replace("“", "\"").replace("’", "'").replace("”", "\"").replace('…', "")

        file.write(line)