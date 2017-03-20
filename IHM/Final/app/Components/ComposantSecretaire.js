System.register(["@angular/core", "@Services/cabinetMedicalService"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    var __metadata = (this && this.__metadata) || function (k, v) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
    };
    var core_1, cabinetMedicalService_1;
    var htmlTemplate, ComposantSecretaire;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (cabinetMedicalService_1_1) {
                cabinetMedicalService_1 = cabinetMedicalService_1_1;
            }],
        execute: function() {
            htmlTemplate = `
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
            ComposantSecretaire = class ComposantSecretaire {
                constructor(cms) {
                    this.cms = cms;
                    this.initDone = false;
                    this.infirmiers = [];
                    this.patientsNonAffectes = [];
                }
                ngOnInit() {
                    console.log("Appelez le service pour formatter et obtenir les données du cabinet\n", this);
                    this.cms.getData("/data/cabinetInfirmier.xml").then((cabinet) => {
                        console.log("\t=> cabinetJS:", cabinet);
                        this.initDone = true;
                        this.infirmiers = cabinet.infirmiers;
                        this.patientsNonAffectes = cabinet.patientsNonAffectes;
                    }, (err) => { console.error("Erreur lors du chargement du cabinet", "/data/cabinetInfirmier.xml", "\n", err); });
                }
                ;
                getInfirmiers() {
                    return this.infirmiers;
                }
                isPatient(obj) {
                    return obj.patient;
                }
                AffecterPatient(draggedElement, infirmier) {
                    this.cms.AffecterPatient(draggedElement, infirmier);
                    let T;
                    if (draggedElement.infirmier) {
                        T = draggedElement.infirmier.patients;
                    }
                    else {
                        T = this.patientsNonAffectes;
                    }
                    T.splice(T.indexOf(draggedElement.patient), 1);
                    if (infirmier) {
                        infirmier.patients.push(draggedElement.patient);
                    }
                    else {
                        this.patientsNonAffectes.push(draggedElement.patient);
                    }
                }
                AjouterPatient(f) {
                    this.cms.AjouterPatient(f).then((patient) => {
                        let adrs = patient.adresse;
                        this.geocoder = new google.maps.Geocoder();
                        let adress = `${adrs.numero} ${adrs.rue} ${adrs.codePostal} ${adrs.ville}`;
                        this.geocoder.geocode({ address: adress }, (results, status) => {
                            if (status == google.maps.GeocoderStatus.OK) {
                                patient.adresse.lat = results[0].geometry.location.lat();
                                patient.adresse.lng = results[0].geometry.location.lng();
                            }
                            else {
                                console.error("Pas de géolocalisation pour", adress);
                            }
                        });
                        this.patientsNonAffectes.push(patient);
                    });
                }
            };
            ComposantSecretaire = __decorate([
                core_1.Component({
                    selector: "composant-secretaire",
                    template: htmlTemplate
                }), 
                __metadata('design:paramtypes', [cabinetMedicalService_1.ServiceCabinetMedical])
            ], ComposantSecretaire);
            exports_1("ComposantSecretaire", ComposantSecretaire);
        }
    }
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvbXBvbmVudHMvQ29tcG9zYW50U2VjcmV0YWlyZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O1FBTU0sWUFBWTs7Ozs7Ozs7OztZQUFaLFlBQVksR0FBRzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Q0F1RXBCLENBQUM7WUFLRjtnQkFNSSxZQUFxQixHQUEwQjtvQkFBMUIsUUFBRyxHQUFILEdBQUcsQ0FBdUI7b0JBTC9DLGFBQVEsR0FBd0IsS0FBSyxDQUFDO29CQUN0QyxlQUFVLEdBQW9DLEVBQUUsQ0FBQztvQkFDakQsd0JBQW1CLEdBQTJCLEVBQUUsQ0FBQztnQkFJakQsQ0FBQztnQkFDRCxRQUFRO29CQUNKLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUVBQXVFLEVBQUUsSUFBSSxDQUFDLENBQUM7b0JBQzNGLElBQUksQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFFLDRCQUE0QixDQUFFLENBQUMsSUFBSSxDQUFFLENBQUMsT0FBeUI7d0JBQzdFLE9BQU8sQ0FBQyxHQUFHLENBQUUsaUJBQWlCLEVBQUUsT0FBTyxDQUFFLENBQUM7d0JBQzFDLElBQUksQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDO3dCQUNyQixJQUFJLENBQUMsVUFBVSxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUM7d0JBQ3JDLElBQUksQ0FBQyxtQkFBbUIsR0FBRyxPQUFPLENBQUMsbUJBQW1CLENBQUM7b0JBQzNELENBQUMsRUFBRSxDQUFDLEdBQUcsT0FBTSxPQUFPLENBQUMsS0FBSyxDQUFDLHNDQUFzQyxFQUFFLDRCQUE0QixFQUFFLElBQUksRUFBRSxHQUFHLENBQUMsQ0FBQyxDQUFBLENBQUMsQ0FBQyxDQUFDO2dCQUNuSCxDQUFDOztnQkFDRCxhQUFhO29CQUNULE1BQU0sQ0FBQyxJQUFJLENBQUMsVUFBVSxDQUFDO2dCQUMzQixDQUFDO2dCQUNELFNBQVMsQ0FBQyxHQUFTO29CQUNmLE1BQU0sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDO2dCQUN2QixDQUFDO2dCQUNELGVBQWUsQ0FBQyxjQUErRSxFQUFFLFNBQTZCO29CQUMxSCxJQUFJLENBQUMsR0FBRyxDQUFDLGVBQWUsQ0FBQyxjQUFjLEVBQUcsU0FBUyxDQUFDLENBQUM7b0JBRXJELElBQUksQ0FBc0IsQ0FBQztvQkFDM0IsRUFBRSxDQUFDLENBQUUsY0FBYyxDQUFDLFNBQVMsQ0FBQyxDQUFBLENBQUM7d0JBQzNCLENBQUMsR0FBRyxjQUFjLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQztvQkFDMUMsQ0FBQztvQkFBQSxJQUFJLENBQUEsQ0FBQzt3QkFDRixDQUFDLEdBQUcsSUFBSSxDQUFDLG1CQUFtQixDQUFDO29CQUNqQyxDQUFDO29CQUNELENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxjQUFjLENBQUMsT0FBTyxDQUFDLEVBQUUsQ0FBQyxDQUFDLENBQUM7b0JBRS9DLEVBQUUsQ0FBQSxDQUFDLFNBQVMsQ0FBQyxDQUFBLENBQUM7d0JBQ1YsU0FBUyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUNwRCxDQUFDO29CQUFBLElBQUksQ0FBQSxDQUFDO3dCQUNGLElBQUksQ0FBQyxtQkFBbUIsQ0FBQyxJQUFJLENBQUMsY0FBYyxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUMxRCxDQUFDO2dCQUNMLENBQUM7Z0JBQ0QsY0FBYyxDQUFFLENBQVM7b0JBQ3JCLElBQUksQ0FBQyxHQUFHLENBQUMsY0FBYyxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBRSxDQUFDLE9BQXlCO3dCQUN2RCxJQUFJLElBQUksR0FBRyxPQUFPLENBQUMsT0FBTyxDQUFFO3dCQUM1QixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxRQUFRLEVBQUUsQ0FBQzt3QkFDM0MsSUFBSSxNQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDLFVBQVUsSUFBSSxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7d0JBQzNFLElBQUksQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLEVBQUMsT0FBTyxFQUFHLE1BQU0sRUFBQyxFQUFFLENBQUMsT0FBTyxFQUFFLE1BQU07NEJBQ3RELEVBQUUsQ0FBQSxDQUFDLE1BQU0sSUFBSSxNQUFNLENBQUMsSUFBSSxDQUFDLGNBQWMsQ0FBQyxFQUFHLENBQUMsQ0FBQSxDQUFDO2dDQUN6QyxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUMsUUFBUSxDQUFDLFFBQVEsQ0FBQyxHQUFHLEVBQUUsQ0FBQztnQ0FDekQsT0FBTyxDQUFDLE9BQU8sQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDLFFBQVEsQ0FBQyxRQUFRLENBQUMsR0FBRyxFQUFFLENBQUM7NEJBQzdELENBQUM7NEJBQUEsSUFBSSxDQUFBLENBQUM7Z0NBQ0YsT0FBTyxDQUFDLEtBQUssQ0FBQyw2QkFBNkIsRUFBRSxNQUFNLENBQUMsQ0FBQzs0QkFDekQsQ0FBQzt3QkFDTCxDQUFDLENBQUMsQ0FBQTt3QkFFRixJQUFJLENBQUMsbUJBQW1CLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO29CQUMzQyxDQUFDLENBQUMsQ0FBQztnQkFDUCxDQUFDO1lBRUwsQ0FBQztZQTlERDtnQkFBQyxnQkFBUyxDQUFDO29CQUNQLFFBQVEsRUFBRyxzQkFBc0I7b0JBQ2pDLFFBQVEsRUFBRyxZQUFZO2lCQUMxQixDQUFDOzttQ0FBQTtZQUNGLHFEQTBEQyxDQUFBIiwiZmlsZSI6IkNvbXBvbmVudHMvQ29tcG9zYW50U2VjcmV0YWlyZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7Q29tcG9uZW50LCBPbkluaXR9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQge05nRm9ybX0gZnJvbSBcIkBhbmd1bGFyL2Zvcm1zXCI7XG5pbXBvcnQge1BhdGllbnRJbnRlcmZhY2V9IGZyb20gXCJAU2VydmljZXMvY2FiaW5ldE1lZGljYWxTZXJ2aWNlXCI7XG5pbXBvcnQge0luZmlybWllckludGVyZmFjZX0gZnJvbSBcIkBTZXJ2aWNlcy9jYWJpbmV0TWVkaWNhbFNlcnZpY2VcIjtcbmltcG9ydCB7Q2FiaW5ldEludGVyZmFjZSwgU2VydmljZUNhYmluZXRNZWRpY2FsfSBmcm9tIFwiQFNlcnZpY2VzL2NhYmluZXRNZWRpY2FsU2VydmljZVwiO1xuXG5jb25zdCBodG1sVGVtcGxhdGUgPSBgXG4gICAgPGhlYWQ+XG4gICAgICAgIDxsaW5rIHJlbD1cInN0eWxlc2hlZXRcIiBocmVmPVwiLi4vY3NzL3NlY3JldGFyeS5jc3NcIiAvPlxuICAgIDwvaGVhZD5cbiAgICA8aDEgYWx4LWRyYWdkcm9wPklITSBkZSBsYSBzZWNyw6l0YWlyZTwvaDE+XG4gICAgPHAgKm5nSWY9XCIhaW5pdERvbmVcIj5DSEFSR0VNRU5ULi4uPC9wPlxuICAgIDxzZWN0aW9uICpuZ0lmPVwiaW5pdERvbmVcIiBjbGFzcz1cImNhYmluZXRcIj5cbiAgICAgICAgTW9uIGJlYXUgY2FiaW5ldCBtw6lkaWNhbFxuICAgIDwvc2VjdGlvbj5cbiAgICA8c2VjdGlvbj5cbiAgICAgICAgPGgyPkxpc3RlIGRlcyBpbmZpcm1pZXJzIDo8L2gyPlxuICAgICAgICA8dGFibGUgYm9yZGVyPVwiMVwiIGNlbGxwYWRkaW5nPVwiMTVcIj5cbiAgICAgICAgICAgIDx0aD5JZDwvdGg+PHRoPk5vbTwvdGg+PHRoPlByw6lub208L3RoPjx0aD5QYXRpZW50czwvdGg+PHRoPkNhcnRlPC90aD5cbiAgICAgICAgICAgIDx0ciAqbmdGb3I9XCJsZXQgaW5maXJtaWVyIG9mIGdldEluZmlybWllcnMoKVwiXG4gICAgICAgICAgICAgICAgICAgIGFseC1kcm9wem9uZVxuICAgICAgICAgICAgICAgICAgICBbYWx4LWFjY2VwdC1mY3RdPVwiaXNQYXRpZW50XCJcbiAgICAgICAgICAgICAgICAgICAgYWx4LWRyYWdzdGFydC1jc3M9XCJkcm9wQ2FuZGlkYXRlXCJcbiAgICAgICAgICAgICAgICAgICAgYWx4LWRyYWdob3Zlci1jc3M9XCJjYW5Ecm9wXCJcbiAgICAgICAgICAgICAgICAgICAgKGFseC1vbmRyb3ApPVwiQWZmZWN0ZXJQYXRpZW50KCRldmVudCwgaW5maXJtaWVyKVwiPlxuICAgICAgICAgICAgICAgIDx0ZD5cbiAgICAgICAgICAgICAgICAgICAgPGltZyBzcmM9XCIuLi9kYXRhL3t7aW5maXJtaWVyLnBob3RvfX1cIiAvPiA8YnI+XG4gICAgICAgICAgICAgICAgICAgIHt7aW5maXJtaWVyLmlkfX1cbiAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgIDx0ZD5cbiAgICAgICAgICAgICAgICAgICAge3tpbmZpcm1pZXIubm9tfX1cbiAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgIDx0ZD5cbiAgICAgICAgICAgICAgICAgICAge3tpbmZpcm1pZXIucHJlbm9tfX1cbiAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgIDx0ZD5cbiAgICAgICAgICAgICAgICAgICAgPG9sPlxuICAgICAgICAgICAgICAgICAgICAgICAgPGxpICpuZ0Zvcj1cImxldCBwYXRpZW50IG9mIGluZmlybWllci5wYXRpZW50c1wiXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFthbHgtZHJhZ2dhYmxlXT1cIntwYXRpZW50OiBwYXRpZW50LCBpbmZpcm1pZXI6IGluZmlybWllcn1cIj5cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGFibGUgYm9yZGVyPVwiMVwiPjx0cj57e3BhdGllbnQubm9tfX0ge3twYXRpZW50LnByZW5vbX19IDxicj4ge3twYXRpZW50Lm51bWVyb1NlY3VyaXRlU29jaWFsZX19PC90cj48L3RhYmxlPlxuICAgICAgICAgICAgICAgICAgICAgICAgPC9saT5cbiAgICAgICAgICAgICAgICAgICAgPC9vbD5cbiAgICAgICAgICAgICAgICA8L3RkPlxuICAgICAgICAgICAgICAgIDx0ZD5cbiAgICAgICAgICAgICAgICAgICAgPHNlYm0tZ29vZ2xlLW1hcCBjbGFzcz1cIm1hcFwiIFtsYXRpdHVkZV09XCI0NVwiIFtsb25naXR1ZGVdPVwiNS41XCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8c2VibS1nb29nbGUtbWFwLW1hcmtlciAqbmdGb3I9XCJsZXQgUCBvZiBpbmZpcm1pZXIucGF0aWVudHNcIiBcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIFtsYXRpdHVkZV0gPVwiUC5hZHJlc3NlLmxhdFwiIFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgW2xvbmdpdHVkZV09XCJQLmFkcmVzc2UubG5nXCI+XG4gICAgICAgICAgICAgICAgICAgICAgICA8L3NlYm0tZ29vZ2xlLW1hcC1tYXJrZXI+XG4gICAgICAgICAgICAgICAgICAgIDwvc2VibS1nb29nbGUtbWFwPlxuICAgICAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICA8L3RyPlxuICAgICAgICA8L3RhYmxlPlxuICAgICAgICA8aDI+TGlzdGUgZGVzIHBhdGllbnRzIG5vbiBhZmZlY3TDqXMgOjwvaDI+XG4gICAgICAgICAgICA8b2w+IFxuICAgICAgICAgICAgICAgIDxsaSAqbmdGb3I9XCJsZXQgcCBvZiBwYXRpZW50c05vbkFmZmVjdGVzXCJcbiAgICAgICAgICAgICAgICAgICAgICAgIFthbHgtZHJhZ2dhYmxlXT1cIntwYXRpZW50OiBwfVwiPlxuICAgICAgICAgICAgICAgICAgICA8Y29tcG9zYW50LXBhdGllbnQgW1BhdGllbnRdPVwicFwiIFtJbmZpcm1pZXJzXT1cImluZmlybWllcnNcIj48L2NvbXBvc2FudC1wYXRpZW50PlxuICAgICAgICAgICAgICAgIDwvbGk+XG4gICAgICAgICAgICA8L29sPlxuICAgICAgICA8aDI+Rm9ybXVsYWlyZSBkJ2Fqb3V0IGQndW4gcGF0aWVudCA6PC9oMj5cbiAgICAgICAgPGZvcm0gKG5nU3VibWl0KT1cIkFqb3V0ZXJQYXRpZW50KG5ld1BhdGllbnRGb3JtKVwiIFxuICAgICAgICAgICAgI25ld1BhdGllbnRGb3JtPVwibmdGb3JtXCIgXG4gICAgICAgICAgICBub3ZhbGlkYXRlPlxuICAgICAgICAgICAgPHA+UHJlbm9tIDogPGlucHV0IG5hbWU9XCJwYXRpZW50Rm9ybmFtZVwiIG5nTW9kZWwgcmVxdWlyZWQ+PC9wPlxuICAgICAgICAgICAgPHA+Tm9tIDogPGlucHV0IG5hbWU9XCJwYXRpZW50TmFtZVwiIG5nTW9kZWwgcmVxdWlyZWQ+PC9wPlxuICAgICAgICAgICAgPHA+U2V4ZSA6IDxpbnB1dCBuYW1lPVwicGF0aWVudFNleFwiIG5nTW9kZWwgcmVxdWlyZWQ+PC9wPlxuICAgICAgICAgICAgPHA+RGF0ZSBkZSBuYWlzc2FuY2UgOiA8aW5wdXQgbmFtZT1cInBhdGllbnRCaXJ0aGRheVwiIG5nTW9kZWwgcmVxdWlyZWQ+PC9wPlxuICAgICAgICAgICAgPHA+TnVtw6lybyBkZSBzw6ljdXJpdMOpIHNvY2lhbGUgOiA8aW5wdXQgbmFtZT1cInBhdGllbnROdW1iZXJcIiBuZ01vZGVsIHJlcXVpcmVkPjwvcD5cbiAgICAgICAgICAgIDxwPkV0YWdlIDogPGlucHV0IG5hbWU9XCJwYXRpZW50Rmxvb3JcIiBuZ01vZGVsIG9wdGlvbmFsPjwvcD5cbiAgICAgICAgICAgIDxwPk51bcOpcm8gOiA8aW5wdXQgbmFtZT1cInBhdGllbnRTdHJlZXROdW1iZXJcIiBuZ01vZGVsIG9wdGlvbmFsPjwvcD5cbiAgICAgICAgICAgIDxwPlJ1ZSA6IDxpbnB1dCBuYW1lPVwicGF0aWVudFN0cmVldFwiIG5nTW9kZWwgcmVxdWlyZWQ+PC9wPlxuICAgICAgICAgICAgPHA+VmlsbGUgOiA8aW5wdXQgbmFtZT1cInBhdGllbnRDaXR5XCIgbmdNb2RlbCByZXF1aXJlZD48L3A+XG4gICAgICAgICAgICA8cD5Db2RlIFBvc3RhbCA6IDxpbnB1dCBuYW1lPVwicGF0aWVudFBvc3RhbENvZGVcIiBuZ01vZGVsIHJlcXVpcmVkPjwvcD5cbiAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwic3VibWl0XCIgdmFsdWU9XCJTdWJtaXRcIiBbZGlzYWJsZWRdPVwiIW5ld1BhdGllbnRGb3JtLnZhbGlkXCI+XG4gICAgICAgIDwvZm9ybT5cbiAgICA8L3NlY3Rpb24+XG5gO1xuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3JcdDogXCJjb21wb3NhbnQtc2VjcmV0YWlyZVwiLFxuICAgIHRlbXBsYXRlXHQ6IGh0bWxUZW1wbGF0ZVxufSlcbmV4cG9ydCBjbGFzcyBDb21wb3NhbnRTZWNyZXRhaXJlIGltcGxlbWVudHMgT25Jbml0IHtcbiAgICBpbml0RG9uZSAgICAgICAgICAgIDogYm9vbGVhbiA9IGZhbHNlO1xuICAgIGluZmlybWllcnMgICAgICAgICAgOiBJbmZpcm1pZXJJbnRlcmZhY2UgW10gPSBbXTtcbiAgICBwYXRpZW50c05vbkFmZmVjdGVzIDogUGF0aWVudEludGVyZmFjZSAgIFtdID0gW107XG4gICAgZ2VvY29kZXI6IGFueTtcblxuICAgIGNvbnN0cnVjdG9yXHRcdChwdWJsaWMgY21zOiBTZXJ2aWNlQ2FiaW5ldE1lZGljYWwpIHsgLy8gQ2UgY29tcG9zYW50IGTDqXBlbmQgZHUgc2VydmljZSBkZSBjYWJpbmV0IG3DqWRpY2FsXG4gICAgfVxuICAgIG5nT25Jbml0KCkge1xuICAgICAgICBjb25zb2xlLmxvZyhcIkFwcGVsZXogbGUgc2VydmljZSBwb3VyIGZvcm1hdHRlciBldCBvYnRlbmlyIGxlcyBkb25uw6llcyBkdSBjYWJpbmV0XFxuXCIsIHRoaXMpO1xuICAgICAgICB0aGlzLmNtcy5nZXREYXRhKCBcIi9kYXRhL2NhYmluZXRJbmZpcm1pZXIueG1sXCIgKS50aGVuKCAoY2FiaW5ldDogQ2FiaW5ldEludGVyZmFjZSkgPT4ge1xuICAgICAgICAgICAgY29uc29sZS5sb2coIFwiXFx0PT4gY2FiaW5ldEpTOlwiLCBjYWJpbmV0ICk7XG4gICAgICAgICAgICB0aGlzLmluaXREb25lID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuaW5maXJtaWVycyA9IGNhYmluZXQuaW5maXJtaWVycztcbiAgICAgICAgICAgIHRoaXMucGF0aWVudHNOb25BZmZlY3RlcyA9IGNhYmluZXQucGF0aWVudHNOb25BZmZlY3RlcztcbiAgICAgICAgfSwgKGVycikgPT4ge2NvbnNvbGUuZXJyb3IoXCJFcnJldXIgbG9ycyBkdSBjaGFyZ2VtZW50IGR1IGNhYmluZXRcIiwgXCIvZGF0YS9jYWJpbmV0SW5maXJtaWVyLnhtbFwiLCBcIlxcblwiLCBlcnIpO30pO1xuICAgIH07XG4gICAgZ2V0SW5maXJtaWVycygpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuaW5maXJtaWVycztcbiAgICB9XG4gICAgaXNQYXRpZW50KG9iaiA6IGFueSkgOiBib29sZWFue1xuICAgICAgICByZXR1cm4gb2JqLnBhdGllbnQ7XG4gICAgfVxuICAgIEFmZmVjdGVyUGF0aWVudChkcmFnZ2VkRWxlbWVudCA6IHsgcGF0aWVudCA6IFBhdGllbnRJbnRlcmZhY2UgLCBpbmZpcm1pZXIgOiBJbmZpcm1pZXJJbnRlcmZhY2V9LCBpbmZpcm1pZXI6IEluZmlybWllckludGVyZmFjZSl7XG4gICAgICAgIHRoaXMuY21zLkFmZmVjdGVyUGF0aWVudChkcmFnZ2VkRWxlbWVudCAsIGluZmlybWllcik7XG5cbiAgICAgICAgbGV0IFQgOiBQYXRpZW50SW50ZXJmYWNlW107XG4gICAgICAgIGlmICggZHJhZ2dlZEVsZW1lbnQuaW5maXJtaWVyKXtcbiAgICAgICAgICAgIFQgPSBkcmFnZ2VkRWxlbWVudC5pbmZpcm1pZXIucGF0aWVudHM7XG4gICAgICAgIH1lbHNle1xuICAgICAgICAgICAgVCA9IHRoaXMucGF0aWVudHNOb25BZmZlY3RlcztcbiAgICAgICAgfVxuICAgICAgICBULnNwbGljZShULmluZGV4T2YoZHJhZ2dlZEVsZW1lbnQucGF0aWVudCksIDEpO1xuXG4gICAgICAgIGlmKGluZmlybWllcil7XG4gICAgICAgICAgICBpbmZpcm1pZXIucGF0aWVudHMucHVzaChkcmFnZ2VkRWxlbWVudC5wYXRpZW50KTtcbiAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICB0aGlzLnBhdGllbnRzTm9uQWZmZWN0ZXMucHVzaChkcmFnZ2VkRWxlbWVudC5wYXRpZW50KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBBam91dGVyUGF0aWVudCAoZjogTmdGb3JtKSB7XG4gICAgICAgIHRoaXMuY21zLkFqb3V0ZXJQYXRpZW50KGYpLnRoZW4oIChwYXRpZW50OiBQYXRpZW50SW50ZXJmYWNlKSA9PiB7XG4gICAgICAgICAgICBsZXQgYWRycyA9IHBhdGllbnQuYWRyZXNzZSA7XG4gICAgICAgICAgICB0aGlzLmdlb2NvZGVyID0gbmV3IGdvb2dsZS5tYXBzLkdlb2NvZGVyKCk7XG4gICAgICAgICAgICBsZXQgYWRyZXNzID0gYCR7YWRycy5udW1lcm99ICR7YWRycy5ydWV9ICR7YWRycy5jb2RlUG9zdGFsfSAke2FkcnMudmlsbGV9YDtcbiAgICAgICAgICAgIHRoaXMuZ2VvY29kZXIuZ2VvY29kZSh7YWRkcmVzcyA6IGFkcmVzc30sIChyZXN1bHRzLCBzdGF0dXMpID0+e1xuICAgICAgICAgICAgICAgIGlmKHN0YXR1cyA9PSBnb29nbGUubWFwcy5HZW9jb2RlclN0YXR1cy5PSyApe1xuICAgICAgICAgICAgICAgICAgICBwYXRpZW50LmFkcmVzc2UubGF0ID0gcmVzdWx0c1swXS5nZW9tZXRyeS5sb2NhdGlvbi5sYXQoKTtcbiAgICAgICAgICAgICAgICAgICAgcGF0aWVudC5hZHJlc3NlLmxuZyA9IHJlc3VsdHNbMF0uZ2VvbWV0cnkubG9jYXRpb24ubG5nKCk7XG4gICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUuZXJyb3IoXCJQYXMgZGUgZ8Opb2xvY2FsaXNhdGlvbiBwb3VyXCIsIGFkcmVzcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSlcblxuICAgICAgICAgICAgdGhpcy5wYXRpZW50c05vbkFmZmVjdGVzLnB1c2gocGF0aWVudCk7XG4gICAgICAgIH0pO1xuICAgIH1cblxufVxuXG5cbiJdLCJzb3VyY2VSb290IjoiIn0=
