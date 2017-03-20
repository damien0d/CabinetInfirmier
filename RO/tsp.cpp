#include "tsp.h"
#include <iostream>
#include <vector>
#include <stack>
#include "kruskal.h"

using namespace std;

/* ============================================================================================ */
/* ================================== Fonction de parcours ==================================== */
/* ============================================================================================ */
// Effectue un parcours en profondeur, en stockant à quand fois le sommet visité
void parc_prof (vector<vector<int> > &Graphe, vector<int> &ordre, vector<int> &s_atteints, int s){
    int i;
    s_atteints[s] = 1;                                          /* On indique que le sommet a déjà été visité */
    ordre.push_back(s);                                         /* Ajout du sommet s en bout du tableau ordre */

    for (i=0; i < Graphe[s].size(); i++) {
        if ((Graphe[s][i] != 0) && (s_atteints[i] == 0)) {      /* Si un sommet est accessible et non visité */
            parc_prof (Graphe, ordre, s_atteints, i);               /* Appel de la fonction en récursif */
        }
    }
}


/* ============================================================================================ */
/* ======================================= Fonction TSP ======================================= */
/* ============================================================================================ */
// G: graphe pondere non oriente complet verifiant l'inegalite triangulaire
// Retourne les sommets dans l'ordre de visite d'un tour de longueur au plus 2 fois l'optimal
vector<int> travelingSalesmanPerson(vector<vector<int> > &G, int depart)
{
    int taille = G.size();
    vector<int> L ;                                         /* Liste des sommets à retourner */
    vector<int> s_visites (taille, 0);                      /* Tableau des sommets visités (pour fonction de parcours) */
    int i, j;
    bool check = false;

    /* Copie du grpahe passé en paramètre, pour utilisation de la fonction kruskal */
    vector<vector<int> > * T = new vector<vector<int> > (G.size());
    vector<vector<int> > &refsurT  = (*T);
    for (i = 0; i < G.size(); i++){
        refsurT[i].resize(G.size(),0);
        for (j = 0; j < G[i].size() ; j++){
            refsurT[i][j] = G[i][j];
        }
    }

    /* On fait appel à la fonction kruskal */
    check = kruskal (G, refsurT);

    /* ===================== On a un arbre couvrant ==================== */
    if(check){                                          /* Si on a un arbre couvrant de poids minimum */
        parc_prof(refsurT, L, s_visites, depart);       /* On fait un parcours en profondeur avec L en paramètre, qui sera compléter dans la fonction */


    /* ====================== Aucun arbre couvrant ===================== */
    }else{                                          /* Aucun arbre couvrant de poids mini */
        for(i=1; i<L.size() ; i++){                 /* on a donc un graphe complet n'ayant aucun parcours optimal */
            if (i != depart){
               L[i] = i;                            /* On remplie donc L sans ordre précis */
            }
        }
    }

    return L;
}



/* ============================================================================================ */
/* =================================== Fonction reordonner ==================================== */
/* ============================================================================================ */
/* Fonction reordonne: doit modifier le vector de strings pointés par adresses, pour respecter le nouvel ordre donne par le second parametre.
  Exemple: si ordre contient (3,1,2,4) et (*adresses) contient (Rue A, Rue B, Rue C, Rue D), alors après appel de la fonction, (*adresses) doit contenir (Rue C, Rue A, Rue B, Rue D) */
void reordonne(vector<string> *  adresses, vector<int> &ordre)
{
    int i;
    int taille = ordre.size();
    vector<string> *  save = new vector<string> (taille);         /* Variable qui servira à sauvegarde l'ordre original des adresses  */


    /* On remplie le tableau save */
    for(i=0 ; i<taille ; i++){
        (*save)[i] = (*adresses)[i];
    }

    /* On modifie chaque adresse pour lesquelles l'ordre a été modifié */
    for(i=0 ; i<taille ; i++){
        if(ordre[i] != i){                          /* Si un sommet ne correspond pas à l'ordre initial */
            (*adresses)[i] = (*save)[ordre[i]];     /* On va cherche dans "save" l'adresse correspondante, que l'on modifie dans le tavleau "adresses" */
        }
    }


}

