import {Injectable}     from "@angular/core";
import {Http, Response} from "@angular/http";
import {NgForm} from "@angular/forms";
import "rxjs/add/operator/toPromise";
import { MapsAPILoader } from 'angular2-google-maps/core';
//import {forEach} from "@angular/router/src/utils/collection";

export enum sexeEnum {M, F}
export interface PatientInterface {
    prenom                  : string;
    nom                     : string;
    sexe                    : sexeEnum;
    numeroSecuriteSociale   : string;
    adresse                 : {
        ville       : string;
        codePostal  : number;
        rue         : string;
        numero      : string;
        etage       : string;
        lat         : number;
        lng         : number;
    };
}
export interface InfirmierInterface {
    id          : string;
    prenom      : string;
    nom         : string;
    photo       : string;
    patients    : PatientInterface[];
}
export interface CabinetInterface {
    infirmiers          : InfirmierInterface[];
    patientsNonAffectes : PatientInterface  [];
}

@Injectable()
export class ServiceCabinetMedical {
    geocoder: any;
    constructor(private _http: Http, private __loader : MapsAPILoader) {
        // Le service CabinetMedical a besoin du service Http et du service de geocoding
    }
    getData( url: string ) : Promise<CabinetInterface> {
        return this._http.get(url).toPromise().then( (res: Response) => {
            let cabinet : CabinetInterface = {
                infirmiers          : [],
                patientsNonAffectes : []
            };
            let parser = new DOMParser();
            let doc = parser.parseFromString( res.text(), "text/xml");
            let patientsXML     = doc.querySelectorAll("patient");
            let infirmiersXML   = doc.querySelectorAll("infirmier");

            // Les infirmiers
            for (let infirmierXML of infirmiersXML){
                let infirmier : InfirmierInterface = {
                    id      : infirmierXML.getAttribute("id"),
                    nom     : infirmierXML.querySelector("nom").textContent,
                    prenom  : infirmierXML.querySelector("prénom").textContent,
                    photo   : infirmierXML.querySelector("photo").textContent,
                    patients: []
                };
                cabinet.infirmiers.push( infirmier );
            }


            // Les patients
            let patients: PatientInterface[] = [];
            for (let patientXML of patientsXML) {
                let etage="", numero = "";
                if(patientXML.querySelector("étage")) {
                    etage = patientXML.querySelector("étage").textContent;
                }
                if(patientXML.querySelector("adresse numéro")) {
                    numero = patientXML.querySelector("adresse numéro").textContent;
                }

                let patient : PatientInterface = {
                    prenom     : patientXML.querySelector("prénom").textContent,
                    nom  : patientXML.querySelector("nom").textContent,
                    sexe  : patientXML.querySelector("sexe").textContent==="M"?sexeEnum.M:sexeEnum.F,
                    numeroSecuriteSociale : patientXML.querySelector("numéro").textContent,
                    adresse : {
                        ville       : patientXML.querySelector("ville").textContent,
                        codePostal  : +patientXML.querySelector("codePostal").textContent,
                        rue         : patientXML.querySelector("rue").textContent,
                        numero      : numero,
                        etage       : etage,
                        lat         : undefined,
                        lng         : undefined
                    }
                };
                patients.push(patient);

                // Le patient est il affecté ?
                let visite = patientXML.querySelector( "visite" );
                if( visite && visite.hasAttribute("intervenant")) {
                    let idInfirmier = visite.getAttribute("intervenant");
                    let infirmier = cabinet.infirmiers.find( inf => inf.id === idInfirmier );
                    infirmier.patients.push( patient );
                } else {
                    cabinet.patientsNonAffectes.push( patient );
                }

            }

            this.__loader.load().then( () => {
                this.geocoder = new google.maps.Geocoder();
                this.getPatientsAdresse(patients, this.geocoder);
            } );
            console.log("Le serveur renvoi",res);
            return cabinet;
        }); // Fin de this._http.get
    }
    getPatientsAdresse(patients: PatientInterface[], geocoder: any) {
        let patient = patients.pop();
        if(patient){
            let A = patient.adresse;
            let address = `${A.numero} ${A.rue}, ${A.codePostal} ${A.ville}`;
            geocoder.geocode( {address: address}, (results, status) => {
                if (status == google.maps.GeocoderStatus.OK) {
                    /* Récupération de sa latitude et de sa longitude */
                    console.log("Géolocalisation OK pour", address);
                    patient.adresse.lat = results[0].geometry.location.lat();
                    patient.adresse.lng = results[0].geometry.location.lng();
                } else {
                    console.error("Pas de géolocalisation pour", address);
                }
                this.getPatientsAdresse(patients, geocoder);
            } );
        }

    }
    AjouterPatient(f: NgForm) : Promise<PatientInterface> {
        let controls = f.form.controls;
        let body     = {};
        for(let v in controls) {
            body[v] = controls[v].value;
        }
        return this._http.post( "./addPatient", body ).toPromise().then( () => {
            let patient : PatientInterface = {
                prenom      : body["patientName"],
                nom         : body["patientForname"],
                sexe        : body["patientSex"]==="M"?sexeEnum.M:sexeEnum.F,
                numeroSecuriteSociale : body["patientNumber"],
                adresse : {
                    ville       : body["patientCity"],
                    codePostal  :+body["patientPostalCode"],
                    rue         : body["patientStreet"],
                    numero      : body["patientStreetNumber"],
                    etage       : body["patientFloor"],
                    lat         : undefined,
                    lng         : undefined
                }
            };
            return patient;
        });
    }
    AffecterPatient(draggedElement : { patient : PatientInterface , infirmier : InfirmierInterface}, infirmier : InfirmierInterface) {
        let body;
        if (infirmier) {
            body = {
                infirmier: infirmier.id,
                patient: draggedElement.patient.numeroSecuriteSociale,
            };
        } else {
            body = {
                infirmier: "",
                patient: draggedElement.patient.numeroSecuriteSociale,
            };
        }
        return this._http.post("./affectation", body).toPromise();
    }
}

