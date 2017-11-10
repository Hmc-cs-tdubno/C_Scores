# Test Data Generator
import csv
import json
import random

numRows = 25 #desired number of rows in test data set

def questionScores():
    """ randomly orders the numbers 1 through 4 in an array
    return array that represents the rank student gave to each
    teamwork types in a single question """
    rank = [1,2,3,4]
    scores = ""
    for x in range(4):
        rand = random.randint(1, 4)
        while rank[rand-1] == 0:
            rand = random.randint(1,4)
        scores +=  str(rank[rand-1])
        rank[rand-1] = 0
    return scores



def quizScores():
    """ returns a array of strings that represents a students' answer to every
    question on the quiz """
    quizScores = []
    for x in range(18):
        quizScores.append(questionScores())
    return quizScores


def getTypes(quizScores):
    """ uses the results from a full quiz (a 2D array, as generated by q
    uizScores) to show an individual's teamwork type scores """
    challenger = 0
    collaborator = 0
    communicator = 0
    contributor = 0
    for x in range(18):
        questionScore = quizScores[x]
        challenger += int(questionScore[0])
        collaborator += int(questionScore[1])
        communicator += int(questionScore[2])
        contributor += int(questionScore[3])
    return [ challenger, collaborator, communicator, contributor]



def writeCSV(filename):
    """ opens csv file with name filename and writes numRows rows of
    random quiz data """
    if not filename.endswith('.csv'):
        filename += '.csv'
    with open(filename, 'wb') as csvfile:
        filewriter = csv.writer(csvfile, delimiter=',',
        quotechar='|', quoting=csv.QUOTE_MINIMAL)
        for x in range(numRows):
            scores = quizScores()
            types = getTypes(quizScores())
            extra = []
            filewriter.writerow([x] + types + scores + extra)



def writeJSON(filename):
    """ opens json file with name filename and writes numRows rows of
    random quiz data """
<<<<<<< HEAD
    if not filename.endswith('.json'):
        filename += '.json'
=======
    if not filename.endswith(".json"):
        filename+=".json"
>>>>>>> e0d998398a94065aec30a7518e51fc0102c6d469
    with open(filename, 'w') as f:
        for x in range(numRows):
            scores = quizScores()
            types = getTypes(scores)
            row = { 'id': x,
                'challenger': types[0], 'collaborator': types[1],
                'communicator': types[2], 'contributor': types[3],
                'q1': scores[0], 'q2': scores[1], 'q3': scores[2],
                'q4': scores[3], 'q5': scores[4], 'q6': scores[5],
                'q7': scores[6], 'q8': scores[7], 'q9': scores[8],
                'q10': scores[9], 'q11': scores[10], 'q12': scores[11],
                'q13': scores[12], 'q14': scores[13], 'q15': scores[14],
                'q16': scores[15], 'q17': scores[16], 'q18': scores[17]
            }
            json.dump(row, f, sort_keys=True)
