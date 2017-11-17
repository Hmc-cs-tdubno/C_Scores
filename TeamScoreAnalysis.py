from sklearn.metrics.pairwise import pairwise_distances
import random
import numpy as np
import itertools

"""This file is not well tested at this time, good chance it would run into an error"""


#Number of times the k-means algorithm is repeated, in order to find best solution
REPEAT_NUM = 10

#Max number of iterations in the K-medoids algorithm
K_MEDIODS_ITERATIONS = 100

#About how many teams will be in each cluster. Used to calculate the k of k-means
APPROX_CLUSTER_SIZE = 2


#List of previous data tuples with team scores array and outgoing score
TEAMS_DATA = [([1,2,3,4], 8),([4,3,2,1], 8),([-1,-2,-3,-4], 3),([-4,-3,-2,-1], 3)]

def euclidean_distance(v1, v2):
	'''calculates the classic euclidean distance between to vectors'''
	#list(itertools.chain(L)) flattens L , needed since here v1.tolist() gives a list of lists
	v1 = list(itertools.chain(v1.tolist()))
	v2 = list(itertools.chain(v2.tolist()))
	dist = 0
	for i in range(len(v1)):
		dist += (v1[i] - v2[i])**2
		dist = np.sqrt(dist) 
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
	vector = np.array(vector)
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


'''
Description: Takes a list of 'team' vectors and the desired number of medoids and returns a list of final
			medoids, as well as a dictionary representing the clusters.
'''
def kMedoids(vectors, k, tmax = K_MEDIODS_ITERATIONS):
	"""Note: this function heavily inspired by the paper located at 
	https://www.researchgate.net/publication/272351873_NumPy_SciPy_Recipes_for_Data_Science_k-Medoids_Clustering"""

	#Precompute distance matrix for efficiency
	D = pairwise_distances(vectors,metric = distance)
	#figure out how many teams there are
	n = len(D)

	if k > n:
		raise Exception('too many medoids')

	# randomly initialize an array of k medoid indices
	M = np.arange(n)
	np.random.shuffle(M)
	M = np.sort(M[:k])

	 # create a copy of the array of medoid indices
	Mnew = np.copy(M)

	#Create a dictionary to represent clusters
	C = {}
	for t in range(tmax):
		# determine clusters, i. e. arrays of data indices
		J = np.argmin(D[:,M], axis=1)
		for kappa in range(k):
			C[kappa] = np.where(J==kappa)[0]
		# update cluster medoids
		for kappa in range(k):
			J = np.mean(D[np.ix_(C[kappa],C[kappa])],axis=1)
			j = np.argmin(J)
			Mnew[kappa] = C[kappa][j]
			np.sort(Mnew)
		# check for convergence
		if np.array_equal(M, Mnew):
			break
		M = np.copy(Mnew)
	else:
		# final update of cluster memberships
		J = np.argmin(D[:,M], axis=1)
		for kappa in range(k):
			C[kappa] = np.where(J==kappa)[0]

	# return results
	return M, C





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
def preAnalyze():
	vectors = []
	for team in TEAMS_DATA:
		vectors.append(np.array(team[0]))
	meds, C = kMedoids(vectors, int(len(vectors)/APPROX_CLUSTER_SIZE))
	
	#reconfigure meds to be more useful
	meds = list(map(lambda x: tuple(vectors[x].tolist()), meds))
	print(meds)
	
	#reconfigure the C dictionary to be mure useful
	Clusters = {}
	for med_indx in C:
		Clusters[meds[med_indx]] = C[med_indx].tolist()
	print(Clusters)
	#will hold the assigned score to each med
	medScores = {}
	#keep track of the number of teams assigned to each med
	teamsInMeds = {}
	for medoid in Clusters:
		#initialize teamsinmeans dictionary entries to 0
		teamsInMeds[medoid] = 0
		#populatet ScoreDict with entries to fill in the score of each mean
		medScores[medoid] = 0
	for medoid in Clusters:
		for team_indx in Clusters[medoid]:
			#Add 1 to the number of teams in the cluster of the current team
			teamsInMeds[medoid] += 1
			#Add the score is the score of the current team
			score = TEAMS_DATA[team_indx][1]
			#add this score to the score for the current team's mean
			medScores[medoid] += score
	#get the AVERAGE score for teams in a mean
	for medoid in medScores:
		medScores[medoid] = medScores[medoid]/teamsInMeds[medoid]
	return medScores


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
	newTeam = np.array(newTeam)
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
