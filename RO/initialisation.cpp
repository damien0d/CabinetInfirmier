#include "initialisation.h"
#include <vector>
#include <iostream>
#include <cstdlib>

using namespace std;


/* Ce module sert a creer des donnees artificielles pour les tests de la partie RO.
 Apres integration dans le reste du projet, les veritables donnees à utiliser seront precedemment calculees */



/* Fonction qui initialise le vector de string pointé par le pointeur adresse.
 La premiere entree contiendra "Rue A", la deuxième "Rue B", etc..
 Si la taille du vector est plus longue que 26, on complete le reste avec "Rue inconnue" */
void initialise_adresses(vector<string> * adresses)
{
    string alphabet="ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    int i;
    int n=(*adresses).size();
    int make_stop=min(26, n);
    
    for (i=0; i<make_stop; i++)
    {
        (*adresses)[i]= "Rue ";
        (*adresses)[i].append(alphabet, i, 1);
    }
    for (i=make_stop; i<n; i++)
    {
        (*adresses)[i]= "Rue inconnue";
    }
}

/* Fonction qui initialise la matrice d'adjacence pointée par distance.
 La distance entre i et j est 0 si i=j, et un nombre aléatoire entre 1 et distance_max sinon.
 La matrice renvoyee est bien symetrique. */
void initialise_distances_random(vector<vector<int> > * distances, int distance_max)
{
    srand (time(NULL));
    
    int i,j;
    int n=(*distances).size();
    for (int i = 0; i < n; i++)
    {
        (*distances)[i].resize(n);
    }
    for (i=0; i<n; i++)
    {
        for (j=0; j<i; j++)
        {
            (*distances)[i][j]=rand() %distance_max +1;
            (*distances)[j][i]=(*distances)[i][j];
        }
        (*distances)[i][i]=0;
    }
}

