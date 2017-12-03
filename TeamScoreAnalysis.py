import numpy as np
import sys
import csv
"""This file is not well tested at this time, good chance it has bugs"""

#Max number of iterations in the K-medoids algorithm
K_MEDIODS_ITERATIONS = 100

#About how many teams will be in each cluster. Used to calculate the k of k-means
APPROX_CLUSTER_SIZE = 4

#The filename for the CSV file (stored in the C_Scores directory) with seed data (each row a team, with
#with 16 PTPS scores followed by some number (currently 10) outgoing survey scores)
SEED_DATA_FILE = 'seedData.csv'


def readSeed(seedFile = SEED_DATA_FILE):
	with open(seedFile, 'r') as file:
		seed = []
		seedReader = csv.reader(file, delimiter=',', quotechar='|')
		for row in seedReader:
			row = list(map(lambda x: int(x), row))
			PTPSScores = [row[:4], row[4:8], row[8:12], row[12:16]]
			successScores = row[16:-1]
			team = [PTPSScores, successScores]
			seed.append(team)
	return seed


#List of previous data tuples with team scores array and outgoing score
TEAMS_DATA = readSeed(SEED_DATA_FILE)



def euclideanDistance(v1, v2):
	'''calculates the classic euclidean distance between two vectors'''
	dist = 0
	for i in range(len(v1)):
		if type(v1[i]) == int:
			dist += (v1[i] - v2[i])**2
		else:
			dist += (euclideanDistance(v1[i],v2[i]))**2
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
	sigma = permDict[perm]
	vector = [vector[sigma[0]], vector[sigma[1]], vector[sigma[2]], vector[sigma[3]]]
	return vector

def distance(v1, v2):
	'''custom distance function required to calculate k-means computes the minimal
	euclidean distance between v1, v2 when the (4) elements are permuted in every 
	possible way'''
	dist = float("inf")
	for i in range(24):
		newDist = euclideanDistance(permute(v1, i), v2)
		if newDist <= dist:
			dist = newDist
	return dist

def pairwiseDistances(vectors):
	'''Helper Function for kMedoids which increases efficiency by putting all distances in a
	2D array so they only need to be calculated once'''
	n = len(vectors)
	D = np.reshape(np.arange(n*n), (n,n))
	for i in range(n):
		for j in range(i+1):
			dist = distance(vectors[i], vectors[j])
			#Array is symetric, so we fill in on both sides of the diagonal together
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
	#Everything in here is somewhat black magic indexing found at the credited link above
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
	return C





'''
Description: This function should be run once (at server start?). It uses past data
			(currently hardcoded into this file) in the form of a list of team, score
			tuples to calculate means and assign them scores. This is with the help of
			the kMedoids function above to generate medoids.
NOTE:		The scores given in seed data and assigned to clusters are a collection of scores
			recieved on the 10 question of the Team Success Survey currently in use. However, 
			this can be easily changed by making changes to the number of scores given in seed
			data, along with appropriate changes to the prediction veiws.
Output:      A dictionary whose keys are the 'medoids' of kMedoids (as tuples of lists, so 
			that they are hashable) and whose values are the outgoing score 
			(float) associated with that medoid. This should be stored somehow in 
			the application and used as a parameter of analyze(newTeam, medScores) 
			every time it is called.
'''
def preAnalyze(seed = TEAMS_DATA):
	vectors = []
	for team in seed:
		vectors.append(team[0])
	C = kMedoids(vectors, int(len(vectors)/APPROX_CLUSTER_SIZE))

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
		medScores[medI] = [0 for x in range(len(seed[0][1]))]

		for team_indx in Clusters[medI]:
			#Add 1 to the number of teams in the cluster of the current team
			teamsInMeds[medI] += 1
			#add scores to the cluster's aggregate
			for i in range(len(seed[team_indx][1])):
				medScores[medI][i]+=(seed[team_indx][1][i])
		#get the AVERAGE score for teams in a cluster, and add the med vector ot the value
		medScores[medI] = list(map(lambda x:x/teamsInMeds[medI], medScores[medI]))
		#Add the med vector to the information stored in the list
		medScores[medI] = (vectors[medI], medScores[medI])
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
	#a placeholder for the closest mean
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
	
#Below is machinery for alowing us to call the functions in this file from the app
def main(argv):
	x = preAnalyze();
	import ast
	l = ast.literal_eval(''.join(argv))
	y = analyze(l,x)
	print(y)
	

if __name__ == "__main__":
   main(sys.argv[1:])