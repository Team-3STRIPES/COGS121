#Import the necessary methods from tweepy library
from tweepy.streaming import StreamListener
from tweepy import OAuthHandler
from tweepy import Stream
import json
import configparser

config = configparser.ConfigParser()
config.read('config.ini')


#Variables that contains the user credentials to access Twitter API 
access_token = config['DEFAULT']['access_token']
access_token_secret = config['DEFAULT']['access_token_secret']
consumer_key = config['DEFAULT']['consumer_key']
consumer_secret = config['DEFAULT']['consumer_secret']


#This is a basic listener that just prints received tweets to stdout.
class StdOutListener(StreamListener):

    def on_data(self, data):
        tweet = json.loads(data)
        try:
            text = tweet['text']
            print(text +"\n")
        except:
            pass
        return True

    def on_error(self, status):
        print(status)

if __name__ == '__main__':

    #This handles Twitter authetification and the connection to Twitter Streaming API
    l = StdOutListener()
    auth = OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)
    stream = Stream(auth, l)

    stream.filter(track=['lit', 'bae', 'af', 'low key', 'bruh', 'on fleek', 'oof', 'yikes', 'fam', 'savage', 'fomo', 'jomo', 'tbh', 'yeet', 'thicc', 'suh', 'swol', 'cray', 'smh', 'finna', 'dm', 'high key', 'light weight', 'woke', 'yass'])