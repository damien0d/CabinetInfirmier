#include <iostream>
#include <vector>
#include <cstdlib>
#include "tsp.h"
#include "affiche.h"
#include "initialisation.h"
#include "kruskal.h"


using namespace std;

// **************** BINOME ****************
// Etudiant 1: AMIN Carine
// Etudiant 2: DELOUES Damien


void test(vector<vector<int> > &G, vector<string> &adr)
{
    // A completer avec les tests de vos fonctions intermediaires que vous jugerez pertinents.
}

void test_kruskal(vector<vector<int> > &G)
{
    int i, j;
    bool check = false;

    cout << "Un arbre couvrant de ce graphe est : " << endl;

    //Graphe de test
    vector<vector<int> > * graphe = new vector<vector<int> > (5);
    vector<vector<int> > &refsurGraphe  = (*graphe);
    for (i = 0; i < 5; i++){
        refsurGraphe[i].resize(5,0);
    }
        //Sommet 0
        refsurGraphe[0][1] = 1;
        refsurGraphe[1][0] = 1;
        refsurGraphe[0][3] = 5;
        refsurGraphe[3][0] = 5;
        refsurGraphe[0][2] = 6;
        refsurGraphe[2][0] = 6;
        //Sommet 1
        refsurGraphe[2][1] = 2;
        refsurGraphe[1][2] = 2;
        //Sommet 2
        refsurGraphe[2][4] = 1;
        refsurGraphe[4][2] = 1;
        //Sommet 3
        refsurGraphe[4][3] = 1;
        refsurGraphe[3][4] = 1;


        /* Copie du graphe G */
    vector<vector<int> > * T = new vector<vector<int> > (G.size());
    vector<vector<int> > &refsurT  = (*T);
    for (i = 0; i < G.size(); i++)
    {
        refsurT[i].resize(G.size(),0);
        for (j = 0; j < G[i].size() ; j++)
        {
            refsurT[i][j] = G[i][j];
        }
    }

    //check = kruskal(G, refsurGraphe);
    check = kruskal(G, refsurT);


        /* On test le booléen renvoyé par la fonction kruskal */
    if(check){
       afficheGraphe(refsurT);
    }else{
        cout << "Ce graphe ne contient pas d'arbre couvrant de poids minimum\n"<< endl;
    }
    cout << endl;
}


int main()
{

    /* Apres integration dans le reste du projet, la partie RO prendra comme donnees:
     vector<string> * adresses; // contient les adresses des patients
     vector<vector<int> > * distances; // pointeur sur matrice d'adjacence du graphe

     Pour pouvoir tester la partie RO avant integration dans le reste du projet, on utilise des donnees artificielles choisies arbitrairement/aleatoirement:
     */

    int n=5;
    int distance_max=9;
    vector<string> * adresses = new vector<string>(n);
    initialise_adresses(adresses);
    vector<vector<int> > * distances= new vector<vector<int> > (n);
    initialise_distances_random(distances, distance_max);



    /* Ici commence la partie RO. Dans cette, on va travailler avec des references sur les vectors plutot que des pointeurs sur des vector, pour faciliter l'ecriture. Il faut donc transformer les pointeurs obtenus dans le reste du projet en references. */

    vector<vector<int> > &refsurGraphe= (*distances);
    vector<string> &refsurAdresses = (*adresses);



    /* Affichages intermédiaires pour vos tests; Il faudra probablement les supprimer lors de la phase finale d'integration */
    afficheGraphe(refsurGraphe);
    cout << "Adresses contient: " << endl;
    afficheVectorString(refsurAdresses);


    /* Vous pouvez rajouter ici vos tests intermediaires.
     Dans la version finale que vous m'enverrez, "test" doit contenir des tests judicieusement choisis faisant démonstration de vos fonctions intermediaires.
     J'evaluerai votre programme AVEC puis SANS l'appel a test */
    test(refsurGraphe, refsurAdresses);

    /* En particulier, on fera ici un test de la fonction kruskal, et on affichera l'arbre couvrant calculé*/
    test_kruskal(refsurGraphe);





    /* Appel à la fonction principale de TSP, resultat stocke dans ordreParcours */
    vector<int> ordreParcours = travelingSalesmanPerson(refsurGraphe, 0);
    cout << "L'ordre de parcours de la tournée est: " << endl;
    afficheVectorInt(ordreParcours);

    /*Appel a la fonction reordonne pour trier les adresses dans l'ordre trouve */
    reordonne(adresses, ordreParcours);

    /*Affichage du resultat */
    cout << "Adresses contient desormais: " << endl;
    afficheVectorString(refsurAdresses);

    return EXIT_SUCCESS;

}
