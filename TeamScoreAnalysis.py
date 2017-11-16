from nltk.cluster.kmeans import KMeansClusterer
import numpy
import itertools

"""This file is not well tested at this time, good chance it would run into an error"""


#Number of times the k-means algorithm is repeated, in order to find best solution
REPEAT_NUM = 10

#About how many teams will be in each cluster. Used to calculate the k of k-means
APPROX_CLUSTER_SIZE = 4


#List of previous data tuples with team scores array and outgoing score
TEAMS_DATA = []

def euclidean_distance(v1, v2):
	'''calculates the classic euclidean distance between to vectors'''
	#list(itertools.chain(L)) flattens L , needed since here v1.tolist() gives a list of lists
	v1 = list(itertools.chain(v1.tolist()))
	v2 = list(itertools.chain(v2.tolist()))
	dist = 0
	for i in range(len(v1)):
		dist += (v1[i] - v2[i])**2
		dist = numpy.sqrt(dist) 
	return dist

def populatePermDict():
	'''assigns each integer 0-23 to a unique permutation in S4 used in the current
	implementation of permute(vector, perm)'''
	pD = {}
	pD[0] = [0,1,2,3]
	pD[1] = [0,1,3,2]
	pD[2] = [0,2,1,3]
	pD[3] = [0,2,3,1]
	pD[4] = [0,3,1,2]
	pD[5] = [0,3,2,1]
	pD[6] = [1,0,2,3]
	pD[7] = [1,0,3,2]
	pD[8] = [1,2,0,3]
	pD[9] = [1,2,3,0]
	pD[10] = [1,3,0,2]
	pD[11] = [1,3,2,0]
	pD[12] = [2,0,1,3]
	pD[13] = [2,0,3,1]
	pD[14] = [2,1,0,3]
	pD[15] = [2,1,3,0]
	pD[16] = [2,3,0,1]
	pD[17] = [2,3,1,0]
	pD[18] = [3,0,1,2]
	pD[19] = [3,0,2,1]
	pD[20] = [3,1,0,2]
	pD[21] = [3,1,2,0]
	pD[22] = [3,2,0,1]
	pD[23] = [3,2,1,0]
	return pD


def permute(vector, perm):
	'''takes a vector and permutation (number) and returns a new vector with it's 4 
	elements shuffled according to that permutation. There is almost certainly a more
	elegant way to do this.'''
	permDict = populatePermDict()
	vector = vector.tolist()
	sigma = permDict[perm]
	vector = [vector[sigma[0]], vector[sigma[1]], vector[sigma[2]], vector[sigma[3]]]
	vector = numpy.array(vector)
	return vector

def distance(v1, v2):
	'''custom distance function required to calculate k-means computes the minimal
	euclidean distance between v1, v2 when the (4) elements are permuted in every 
	possible way'''
	dist = float("inf")
	for i in range(24):
		newDist = euclidean_distance(permute(v1, i), v2)
		if newDist <= dist:
			dist = newDist
	return dist

def kMeans(vectors, k):
	'''Uses the nltk.cluster package to find k means among the input vectors. Outputs
	a list telling which cluster each vector belongs to (in order) and another of the
	means'''
	clusterer = (KMeansClusterer(k, distance, repeats = REPEAT_NUM))
	clusters = clusterer.cluster(vectors, True)
	means = clusterer.means()
	return clusters, means

'''
Description: This function should be run once (at server start?). It uses past data
			(currently hardcoded into this file) in the form of a list of team, score
			tuples to calculate means and assign them scores. This is with the help of
			the kMeans function above to generate means.
Output:      A dictionary whose keys are the 'means' of kMeans (as numpy.array's)
			and whose values are the outgoing score (float) associated with that mean.
			This should be stored somehow in the application and used as a parameter of
			analyze(newTeam, meanScores) every time it is called.
'''
def preAnalyze()
	vectors = []
	for team in TEAMS_DATA:
		vectors.append(numpy.array(team[0]))
	clusters, means = kMeans(vectors, len(vectors)/APPROX_CLUSTER_SIZE)
	#list of the number of teams assigned to each mean in order
	meanScores = {}
	teamsInMeans = []
	for i in range(len(means)):
		#make TeamsInMeans the right length
		teamsInMeans.append(0)
		#populatet ScoreDict with entries to fill in the score of each mean
		meanScores[means[i]] = 0
	for i in range(len(clusters)):
		#Add 1 to the number of teams in the cluster of the current team
		teamsInMeans[clusters[i]] += 1
		#Add the score is the score of the current team
		score = TEAMS_DATA[i][1]
		#add this score to the score for the current team's mean
		meanScores[means[clusters[i]]] += score
	#get the AVERAGE score for teams in a mean
	for i in range(len(means)):
		meanScores[means[i]] = meanScores[means[i]]/teamsInMeans[i]
	return meanScores


'''
Description: This function should be called when the user asks for a new prediction.
			It classifies a hypothetical team based on stored past data, and returns the 
			outgoing score associated with that classification.
Output:     An float value describing the predicted success of input team.

Paraeters:
	newTeam - a 16-vector (currently expected as a list of 4 lists length 4, each
				representing the scores of a particualr team member) selected by the user
	meanScores - a python dictionary computed earlier (possibly server start?) whose keys 
				are the 'means' used to classify newTeam (as numpy.array's) and whose values
				are the outgoing score (float) associated with that mean. This should be stored
				somehow in the application and entered as this parameter for every call of this
				function.
'''
def analyze(newTeam, meanScores):
	newTeam = numpy.array(newTeam)
	#newTeam used as a placeholder for the closest mean
	closeMean = newTeam
	#start dist of as inf to ensure we select a closer mean
	dist = float("inf")
	#find the closest mean
	for mean in meanScores.keys():
		if distance(newTeam, mean) < dist:
			closeMean = mean
	#return the score associated with that mean
	return meanScores[closeMean]
