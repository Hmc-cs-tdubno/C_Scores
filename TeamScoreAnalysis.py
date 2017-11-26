import random
import numpy as np
import itertools
import sys
"""This file is not well tested at this time, good chance it has bugs"""

#Max number of iterations in the K-medoids algorithm
K_MEDIODS_ITERATIONS = 100

#About how many teams will be in each cluster. Used to calculate the k of k-means
APPROX_CLUSTER_SIZE = 4


#List of previous data tuples with team scores array and outgoing score
TEAMS_DATA = [([1,2,3,4], 8),([4,3,2,1], 8),([-1,-2,-3,-4], 3),([-4,-3,-2,-1], 3)]

def flatten(L):
	newL = []
	for i in range(len(L)):
		if type(L[i]) == list:
			newL.extend(flatten(L[i]))
		else: newL.append(L[i])
	return newL

def euclidean_distance(v1, v2):
	'''calculates the classic euclidean distance between to vectors'''
	#list(itertools.chain(L)) flattens L , needed since here v1.tolist() gives a list of lists
	v1 = flatten(v1.tolist())
	v2 = flatten(v2.tolist())
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

def pairwiseDistances(vectors):
	n = len(vectors)
	D = np.reshape(np.arange(n*n), (n,n))
	for i in range(n):
		for j in range(i+1):
			dist = distance(vectors[i], vectors[j])
			D[i,j] = dist
			D[j,i] = dist
	return D


'''
Description: Takes a list of 'team' vectors and the desired number of medoids and returns a list of final
			medoids, as well as a dictionary representing the clusters.
'''
def kMedoids(vectors, k, tmax = K_MEDIODS_ITERATIONS):
	"""Note: this function heavily inspired by the paper located at 
	https://www.researchgate.net/publication/272351873_NumPy_SciPy_Recipes_for_Data_Science_k-Medoids_Clustering"""

	#Precompute distance matrix for efficiency
	D = pairwiseDistances(vectors)
	print(D)
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
			the kMedoids function above to generate medoids.
Output:      A dictionary whose keys are the 'medoids' of kMedoids (as tuples of lists, so 
			that they are hashable) and whose values are the outgoing score 
			(float) associated with that medoid. This should be stored somehow in 
			the application and used as a parameter of analyze(newTeam, medScores) 
			every time it is called.
'''
def preAnalyze(seed = TEAMS_DATA):
	vectors = []
	for team in seed:
		vectors.append(np.array(team[0]))
	meds, C = kMedoids(vectors, int(len(vectors)/APPROX_CLUSTER_SIZE))

	print('medoids:')
	for point_idx in meds:
		print( vectors[point_idx] )

	print('')
	print('clustering result:')
	for label in C:
		for point_idx in C[label]:
			print('label {0}:　{1}'.format(label, vectors[point_idx]))

	#reconfigure meds to be more useful
	meds = list(map(lambda x: tuple(vectors[x].tolist()), meds))


	
	#reconfigure the C dictionary to be mure useful, as pairs {med_indx: list of cluter's vectors}
	Clusters = {}
	for medI in C:
		Clusters[medI] = C[medI].tolist()
	
	#will hold the assigned score to each med
	medScores = {}
	
	#keep track of the number of teams assigned to each med
	teamsInMeds = {}

	for medI in Clusters:
		#initialize teamsinmeans dictionary entries to 0
		teamsInMeds[medI] = 0
		#populatet ScoreDict with entries to fill in the score of each mean
		medScores[medI] = 0

		for team_indx in Clusters[medI]:
			#Add 1 to the number of teams in the cluster of the current team
			teamsInMeds[medI] += 1
			#Add the score is the score of the current team
			score = seed[team_indx][1]
			#add this score to the score for the current team's mean
			medScores[medI] += score
		#get the AVERAGE score for teams in a cluster, and add the med vector ot the value
		medScores[medI] = (vectors[medI], medScores[medI]/teamsInMeds[medI])
	return medScores


'''
Description: This function should be called when the user asks for a new prediction.
			It classifies a hypothetical team based on stored past data, and returns the 
			outgoing score associated with that classification.
Output:     An float value describing the predicted success of input team.

Paraeters:
	newTeam - a 16-vector (currently expected as a list of 4 lists length 4, each
				representing the scores of a particualr team member) selected by the user
	medScores - a python dictionary computed earlier (possibly server start?) whose keys 
				are the indicies of medoids used to classify newTeam and whose values
				are the outgoing score the mediod and the score (float) associated with that mean. This should be stored
				somehow in the application and entered as this parameter for every call of this
				function.
'''
def analyze(newTeam, medScores):
	newTeam = np.array(newTeam)
	#newTeam used as a placeholder for the closest mean
	closeMed = 0
	#start dist of as inf to ensure we select a closer mean
	dist = float("inf")
	#find the closest mean
	for medI in medScores:
		if distance(newTeam, medScores[medI][0]) < dist:
			closeMed = medI
			dist = distance(newTeam, medScores[medI][0])
	#return the score associated with that mean
	return medScores[medI][1]
	
def main(argv):
	#x = preAnalyze();
	import ast
	#l = ast.literal_eval(''.join(argv))
	#y = analyze(l,x)
	print(4.57)
	

if __name__ == "__main__":
   main(sys.argv[1:])