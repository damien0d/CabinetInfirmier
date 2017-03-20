#ifndef KRUSKAL_H
#define KRUSKAL_H

#include <vector>

using namespace std;

struct Arete;




// Fonction kruskal: Stocke dans T un arbre couvrant de poids minimum du graphe G
// Renvoie true si G a un arbre couvrant, false sinon
bool kruskal(vector<vector<int> > &G, vector<vector<int> > &T);

void afficheArete(vector<Arete*> aretes);

bool est_connexe (vector<vector<int> > &T);

void rec_connexe (vector<vector<int> > &Graphe, int s, vector<int> &s_atteints);

vector<Arete*> Tri (vector<vector<int> > &G);

#endif
