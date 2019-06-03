'''
Python script to parse and gather tweets from the Twitter firehose.
This scripts logs in with a users Twitter development credentials
and parses the Twitter tweet stream, searching for tweets with
corresponding key words. 
'''

from tweepy.streaming import StreamListener
from tweepy import OAuthHandler
from tweepy import Stream
import json
import configparser


config = configparser.ConfigParser()
config.read('config.ini')


#Variables that contains the user credentials to access Twitter API 
access_token = config['default']['atoken']
access_token_secret = config['default']['asecret']
consumer_key = config['default']['ckey']
consumer_secret = config['default']['csecret']


#This is a basic listener that just prints received tweets to stdout.
class StdOutListener(StreamListener):

    def on_data(self, data):
        tweet = json.loads(data)
        try:
            text = tweet['text']
            words = text.split()

            #Remove the retweet flag
            if words[0] == 'RT':
                words = words[1:]
            
            #Remove user handles and any potential links
            words = [w for w in words if w[0] != '@' and w[:5] != 'https' and "…" not in w]

            #Remove fancy quotes
            words = " ".join(words)+"\n"
            words = words.replace("“", "\"").replace("’", "'").replace("”", "\"")

            #Write results to a given file
            file = open('twitter_data/twitter_session_1_may_2019.txt','a')
            file.write(words)
        except:
            pass
        return True

    def on_error(self, status):
        print(status)

if __name__ == '__main__':
    l = StdOutListener()
    auth = OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)
    stream = Stream(auth, l)
    #Search tweets on a given subset of key words
    stream.filter(languages=["en"], track=['lit', 'bae', 'af', 'low key', 'bruh', 
    'on fleek', 'oof', 'yikes', 'fam', 'savage', 'fomo', 'jomo', 'tbh', 'yeet', 
    'thicc', 'suh', 'swol', 'cray', 'smh', 'finna', 'dm', 'high key', 
    'light weight', 'woke', 'yass', 'yas', 'love you 3000', 'wet', 
    'fire', 'popping', 'salty', 'gucci', 'adulting', 'basic', 'bet', 
    'can\'t even', 'chill', 'cringy', 'curve', 'deets', 'extra', 'dope', 'glow up', 
    'goals', 'hmu', 'dead', 'ligma', 'mood', 'otp', 'peeps', 'roast', 'same', 'ship', 
    'shots fired', 'slay', 'dm', 'smol', 'snacc', 'squad', 'thirsty', 'triggered', 'reee', 'woke']) 
