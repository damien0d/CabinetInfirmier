import {Component, OnInit} from "@angular/core";
import {NgForm} from "@angular/forms";
import {PatientInterface} from "@Services/cabinetMedicalService";
import {InfirmierInterface} from "@Services/cabinetMedicalService";
import {CabinetInterface, ServiceCabinetMedical} from "@Services/cabinetMedicalService";

const htmlTemplate = `
    <head>
        <link rel="stylesheet" href="../css/secretary.css" />
    </head>
    <h1 alx-dragdrop>IHM de la secrétaire</h1>
    <p *ngIf="!initDone">CHARGEMENT...</p>
    <section *ngIf="initDone" class="cabinet">
        Mon beau cabinet médical
    </section>
    <section>
        <h2>Liste des infirmiers :</h2>
        <table border="1" cellpadding="15">
            <th>Id</th><th>Nom</th><th>Prénom</th><th>Patients</th><th>Carte</th>
            <tr *ngFor="let infirmier of getInfirmiers()"
                    alx-dropzone
                    [alx-accept-fct]="isPatient"
                    alx-dragstart-css="dropCandidate"
                    alx-draghover-css="canDrop"
                    (alx-ondrop)="AffecterPatient($event, infirmier)">
                <td>
                    <img src="../data/{{infirmier.photo}}" /> <br>
                    {{infirmier.id}}
                </td>
                <td>
                    {{infirmier.nom}}
                </td>
                <td>
                    {{infirmier.prenom}}
                </td>
                <td>
                    <ol>
                        <li *ngFor="let patient of infirmier.patients"
                                [alx-draggable]="{patient: patient, infirmier: infirmier}">
                            <table border="1"><tr>{{patient.nom}} {{patient.prenom}} <br> {{patient.numeroSecuriteSociale}}</tr></table>
                        </li>
                    </ol>
                </td>
                <td>
                    <sebm-google-map class="map" [latitude]="45" [longitude]="5.5">
                        <sebm-google-map-marker *ngFor="let P of infirmier.patients" 
                                                [latitude] ="P.adresse.lat" 
                                                [longitude]="P.adresse.lng">
                        </sebm-google-map-marker>
                    </sebm-google-map>
                </td>
            </tr>
        </table>
        <h2>Liste des patients non affectés :</h2>
            <ol> 
                <li *ngFor="let p of patientsNonAffectes"
                        [alx-draggable]="{patient: p}">
                    <composant-patient [Patient]="p" [Infirmiers]="infirmiers"></composant-patient>
                </li>
            </ol>
        <h2>Formulaire d'ajout d'un patient :</h2>
        <form (ngSubmit)="AjouterPatient(newPatientForm)" 
            #newPatientForm="ngForm" 
            novalidate>
            <p>Prenom : <input name="patientForname" ngModel required></p>
            <p>Nom : <input name="patientName" ngModel required></p>
            <p>Sexe : <input name="patientSex" ngModel required></p>
            <p>Date de naissance : <input name="patientBirthday" ngModel required></p>
            <p>Numéro de sécurité sociale : <input name="patientNumber" ngModel required></p>
            <p>Etage : <input name="patientFloor" ngModel optional></p>
            <p>Numéro : <input name="patientStreetNumber" ngModel optional></p>
            <p>Rue : <input name="patientStreet" ngModel required></p>
            <p>Ville : <input name="patientCity" ngModel required></p>
            <p>Code Postal : <input name="patientPostalCode" ngModel required></p>
            <input type="submit" value="Submit" [disabled]="!newPatientForm.valid">
        </form>
    </section>
`;
@Component({
    selector	: "composant-secretaire",
    template	: htmlTemplate
})
export class ComposantSecretaire implements OnInit {
    initDone            : boolean = false;
    infirmiers          : InfirmierInterface [] = [];
    patientsNonAffectes : PatientInterface   [] = [];
    geocoder: any;

    constructor		(public cms: ServiceCabinetMedical) { // Ce composant dépend du service de cabinet médical
    }
    ngOnInit() {
        console.log("Appelez le service pour formatter et obtenir les données du cabinet\n", this);
        this.cms.getData( "/data/cabinetInfirmier.xml" ).then( (cabinet: CabinetInterface) => {
            console.log( "\t=> cabinetJS:", cabinet );
            this.initDone = true;
            this.infirmiers = cabinet.infirmiers;
            this.patientsNonAffectes = cabinet.patientsNonAffectes;
        }, (err) => {console.error("Erreur lors du chargement du cabinet", "/data/cabinetInfirmier.xml", "\n", err);});
    };
    getInfirmiers() {
        return this.infirmiers;
    }
    isPatient(obj : any) : boolean{
        return obj.patient;
    }
    AffecterPatient(draggedElement : { patient : PatientInterface , infirmier : InfirmierInterface}, infirmier: InfirmierInterface){
        this.cms.AffecterPatient(draggedElement , infirmier);

        let T : PatientInterface[];
        if ( draggedElement.infirmier){
            T = draggedElement.infirmier.patients;
        }else{
            T = this.patientsNonAffectes;
        }
        T.splice(T.indexOf(draggedElement.patient), 1);

        if(infirmier){
            infirmier.patients.push(draggedElement.patient);
        }else{
            this.patientsNonAffectes.push(draggedElement.patient);
        }
    }
    AjouterPatient (f: NgForm) {
        this.cms.AjouterPatient(f).then( (patient: PatientInterface) => {
            let adrs = patient.adresse ;
            this.geocoder = new google.maps.Geocoder();
            let adress = `${adrs.numero} ${adrs.rue} ${adrs.codePostal} ${adrs.ville}`;
            this.geocoder.geocode({address : adress}, (results, status) =>{
                if(status == google.maps.GeocoderStatus.OK ){
                    patient.adresse.lat = results[0].geometry.location.lat();
                    patient.adresse.lng = results[0].geometry.location.lng();
                }else{
                    console.error("Pas de géolocalisation pour", adress);
                }
            })

            this.patientsNonAffectes.push(patient);
        });
    }

}


