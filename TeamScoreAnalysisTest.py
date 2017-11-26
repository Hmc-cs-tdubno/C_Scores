from TeamScoreAnalysis import preAnalyze, analyze
import numpy as np
import random

def generatePerson():
	C = []
	C.append(np.random.choice(180))
	C.append(np.random.choice(180 - C[0]))
	C.append(np.random.choice(180 - C[0] - C[1]))
	C.append(180 - C[0] - C[1] - C[2])
	np.random.shuffle(C)
	return C

def generateTeam():
	P = []
	P.append(generatePerson())
	P.append(generatePerson())
	P.append(generatePerson())
	P.append(generatePerson())
	score = np.random.choice(10)
	return (P, score)

def generateSet(size):
	S = []
	for i in range(size):
		S.append(generateTeam())
	return S

def preAnalTest(size):
	seed = generateSet(size)
	medScores = preAnalyze(seed)
	print(medScores)
	return medScores

def analTest(medScores):
	newTeam = generateTeam()[0]
	score = analyze(newTeam, medScores)
	print(newTeam)
	print(score)
	return score