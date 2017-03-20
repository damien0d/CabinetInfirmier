#include <iostream>
#include <vector>
#include <cstdlib>
#include "kruskal.h"

using namespace std;

struct Arete
{
	Arete(int u_, int v_, int poids_) {u = u_; v = v_; poids = poids_; }
	int u, v;
	int poids;
};



/* ============================================================================================ */
/* ===================================== Fonction de tri ====================================== */
/* ============================================================================================ */
vector<Arete*> Tri (vector<vector<int> > &G){
    int i, j;
    vector<Arete*> weight;

        /* Création du tableau de pointeur d'arête à partir de la matrisse en paramètre */
    for(i=0 ; i < G.size(); i++){
        for(j=i ; j < G[i].size(); j++){            if(G[i][j] != 0){
                Arete *a1 = new Arete(i,j,G[i][j]);
				weight.push_back(a1);
            }
        }
    }
    i = 0;

        /* Parcours du tableau de pointeur et tri */
    while(i < weight.size()-1){
        if(weight[i]->poids < weight[i+1]->poids){
                Arete *a2 = weight[i+1];
                weight[i+1] = weight[i];
                weight[i] = a2;
                i=0;
        }else {
            i++;
        }
    }
	return weight;
}



/* ============================================================================================ */
/* ================================== Fonction est connexe ==================================== */
/* ============================================================================================ */
// Effectué en 2 fonctions :
//      est_connexe => retourne un booléen VRAI si tout les sommets ont été visité
//      rec_connexe => effectue un parcours en profondeur, en remplissant un tableau pour chaque sommet visité
void rec_connexe (vector<vector<int> > &Graphe, int s, vector<int> &s_atteints){
    int i;
    s_atteints[s] = 1;

    for (i=0; i < Graphe[s].size(); i++) {
        if ((Graphe[s][i] != 0) && (s_atteints[i] == 0)) {
            rec_connexe(Graphe, i, s_atteints);
        }
    }
}

bool est_connexe (vector<vector<int> > &T){
    int i;
    int taille = T.size();
    vector<int> s_atteints(taille, 0);

    /* Fonction récursive d'un parcours en profondeur */
    rec_connexe(T,0,s_atteints);

    /* On test si tout les sommets ont été atteint */
    for (i=0 ; i < s_atteints.size() ; i++) {
        if (s_atteints[i] == 0) {       /* Si un sommet n'a pas été visité alors le graphe n'est pas connexe */
            return false;               /* On reourne donc FALSE */
        }
    }
    return true;
}



/* ============================================================================================ */
/* ============================ Fonction d'affichage des arêtes =============================== */
/* ============================================================================================ */
//Simple fonction d'affichage des aretes
void afficheArete(vector<Arete*> aretes){
    cout << "nombre d'arretes = " << aretes.size() << " :" << endl;
    int i;
    for (i=0; i<aretes.size(); i++){
        cout << aretes[i] -> u << "-"<< aretes[i] -> v << ": "<< aretes[i] -> poids << endl;
    }
}



/* ============================================================================================ */
/* ==================================== Fonction kruskal ====================================== */
/* ============================================================================================ */
// Fonction kruskal: Stocke dans T un arbre couvrant de poids minimum du graphe G
// Renvoie true si G a un arbre couvrant, false sinon
/* Etat de départ : G et T sont des graphes identiques. T est ensuite modifié si il contient un arbre couvrant de poids minimum */
bool kruskal (vector<vector<int> > &G, vector<vector<int> > &T)
{
    // Il est fortement recommandé de decouper le code en fonctions intermediaires. En particulier vous ferez une ou des fonctions intermediaires pour le test de connexite.
    vector<Arete*> aretes = Tri(G);
    Arete *a;
    int i = 0;
    int taille = aretes.size();

    //afficheArete(aretes);

    if (est_connexe(T)){                    /* On test si T (=G) est connexe */
        while (taille > (T.size())-1){

            a = aretes[i];
            T[a->u][a->v] = 0;              /* On retire à T l'arête a */
            T[a->v][a->u] = 0;              /* On met la valeur de 0 (et non -1), pour une meilleur lisibilité lors de l'affichage */

            if(!est_connexe(T)){            /* On test si T est toujours connexe */
                T[a->u][a->v] = a->poids;   /* Si ce n'est pas le cas on remet l'arête qui a été enlevée */
                T[a->v][a->u] = a->poids;
            }else{
                taille--;                   /* On décrémente notre indice de boucle while */
            }
            i++;                            /* On incrémente i pour allé chercher l'arête qui suit dans le tavleau de pointeur */
        }
        return true;
    }else{
        return false;
    }

}





