'''
Python script used to train a spaCy model from a json file. 
spaCy is an open-source software library for advanced Natural Language Processing, 
written in the programming languages Python and Cython. This script has 
two functions, one function converts the json file from dataturks (a website used 
to annotate text and other mediums for machine learning) formating to
a formating used by spaCy. The second function trains the model from the data. 
'''

import spacy
import json
import random


def convert_dataturks_to_spacy(dataturks_JSON_FilePath):
    '''
    Method: used to convert a json file from dataturks formatting to a 
        formatting used by spaCy
    Input:  filepath to the json file - string
    '''
    try:
        training_data = []
        lines=[]
        with open(dataturks_JSON_FilePath, 'r') as f:
            lines = f.readlines()

        for line in lines:
            data = json.loads(line)
            text = data['content']
            entities = []

            #ignore points with no annotations
            if not data['annotation']:
                continue

            for annotation in data['annotation']:
                #only a single point in text annotation.
                point = annotation['points'][0]
                labels = annotation['label']
                # handle both list of labels or a single label.
                if not isinstance(labels, list):
                    labels = [labels]

                for label in labels:
                    #dataturks indices are both inclusive [start, end] but spacy is not [start, end)
                    entities.append((point['start'], point['end'] + 1 ,label))

            training_data.append((text, {"entities" : entities}))
        return training_data
    except Exception as e:
        print("Unable to process " + dataturks_JSON_FilePath + "\n" + "error = " + str(e))
        return None


def train_spacy():
    '''
    Method: train a spaCy model to perform Named Entity Recognition.
        The method saves the model to ./model 
    '''

    TRAIN_DATA = convert_dataturks_to_spacy("../twitter_data/slang5.json");
    nlp = spacy.blank('en')  # create blank Language class
    # create the built-in pipeline components and add them to the pipeline
    # nlp.create_pipe works for built-ins that are registered with spaCy

    if 'ner' not in nlp.pipe_names:
        ner = nlp.create_pipe('ner')
        nlp.add_pipe(ner, last=True)

    # add labels
    for _, annotations in TRAIN_DATA:
        for ent in annotations.get('entities'):
            ner.add_label(ent[2])

    # get names of other pipes to disable them during training
    other_pipes = [pipe for pipe in nlp.pipe_names if pipe != 'ner']
    with nlp.disable_pipes(*other_pipes):  # only train NER
        optimizer = nlp.begin_training()
        for itn in range(2):
            print("Starting iteration " + str(itn))
            random.shuffle(TRAIN_DATA)
            losses = {}
            for text, annotations in TRAIN_DATA:
                nlp.update(
                    [text],  # batch of texts
                    [annotations],  # batch of annotations
                    drop=0.2,  # dropout - make it harder to memorise data
                    sgd=optimizer,  # callable to update weights
                    losses=losses)
            print(losses)

    #save model 
    nlp.to_disk("./model")

train_spacy()
