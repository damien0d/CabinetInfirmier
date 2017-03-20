#ifndef TSP_H
#define TSP_H

#include <iostream>
#include <vector>
#include <stack>
#include "kruskal.h"



using namespace std;

void parc_prof (vector<vector<int> > &Graphe, vector<int> &ordre, int s);

// G: graphe pondere non oriente complet verifiant l'inegalite triangulaire
// Retourne les sommets dans l'ordre de visite d'un tour de longueur au plus 2 fois l'optimal, en partant de depart.
vector<int> travelingSalesmanPerson(vector<vector<int> > &G, int depart);


/* Fonction reordonne: doit modifier le vector de strings pointés par adresses, pour respecter le nouvel ordre donne par le second parametre.
 Exemple: si ordre contient (3,1,2,4) et (*adresses) contient (Rue A, Rue B, Rue C, Rue D), alors après appel de la fonction, (*adresses) doit contenir (Rue C, Rue A, Rue B, Rue D) */
void reordonne(vector<string> *  adresses, vector<int> &ordre);


#endif
