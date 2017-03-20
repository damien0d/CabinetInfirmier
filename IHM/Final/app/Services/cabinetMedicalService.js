System.register(["@angular/core", "@angular/http", "rxjs/add/operator/toPromise", 'angular2-google-maps/core'], function(exports_1, context_1) {
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
    var core_1, http_1, core_2;
    var sexeEnum, ServiceCabinetMedical;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (_1) {},
            function (core_2_1) {
                core_2 = core_2_1;
            }],
        execute: function() {
            //import {forEach} from "@angular/router/src/utils/collection";
            (function (sexeEnum) {
                sexeEnum[sexeEnum["M"] = 0] = "M";
                sexeEnum[sexeEnum["F"] = 1] = "F";
            })(sexeEnum || (sexeEnum = {}));
            exports_1("sexeEnum", sexeEnum);
            ServiceCabinetMedical = class ServiceCabinetMedical {
                constructor(_http, __loader) {
                    this._http = _http;
                    this.__loader = __loader;
                    // Le service CabinetMedical a besoin du service Http et du service de geocoding
                }
                getData(url) {
                    return this._http.get(url).toPromise().then((res) => {
                        let cabinet = {
                            infirmiers: [],
                            patientsNonAffectes: []
                        };
                        let parser = new DOMParser();
                        let doc = parser.parseFromString(res.text(), "text/xml");
                        let patientsXML = doc.querySelectorAll("patient");
                        let infirmiersXML = doc.querySelectorAll("infirmier");
                        // Les infirmiers
                        for (let infirmierXML of infirmiersXML) {
                            let infirmier = {
                                id: infirmierXML.getAttribute("id"),
                                nom: infirmierXML.querySelector("nom").textContent,
                                prenom: infirmierXML.querySelector("prénom").textContent,
                                photo: infirmierXML.querySelector("photo").textContent,
                                patients: []
                            };
                            cabinet.infirmiers.push(infirmier);
                        }
                        // Les patients
                        let patients = [];
                        for (let patientXML of patientsXML) {
                            let etage = "", numero = "";
                            if (patientXML.querySelector("étage")) {
                                etage = patientXML.querySelector("étage").textContent;
                            }
                            if (patientXML.querySelector("adresse numéro")) {
                                numero = patientXML.querySelector("adresse numéro").textContent;
                            }
                            let patient = {
                                prenom: patientXML.querySelector("prénom").textContent,
                                nom: patientXML.querySelector("nom").textContent,
                                sexe: patientXML.querySelector("sexe").textContent === "M" ? sexeEnum.M : sexeEnum.F,
                                numeroSecuriteSociale: patientXML.querySelector("numéro").textContent,
                                adresse: {
                                    ville: patientXML.querySelector("ville").textContent,
                                    codePostal: +patientXML.querySelector("codePostal").textContent,
                                    rue: patientXML.querySelector("rue").textContent,
                                    numero: numero,
                                    etage: etage,
                                    lat: undefined,
                                    lng: undefined
                                }
                            };
                            patients.push(patient);
                            // Le patient est il affecté ?
                            let visite = patientXML.querySelector("visite");
                            if (visite && visite.hasAttribute("intervenant")) {
                                let idInfirmier = visite.getAttribute("intervenant");
                                let infirmier = cabinet.infirmiers.find(inf => inf.id === idInfirmier);
                                infirmier.patients.push(patient);
                            }
                            else {
                                cabinet.patientsNonAffectes.push(patient);
                            }
                        }
                        this.__loader.load().then(() => {
                            this.geocoder = new google.maps.Geocoder();
                            this.getPatientsAdresse(patients, this.geocoder);
                        });
                        console.log("Le serveur renvoi", res);
                        return cabinet;
                    }); // Fin de this._http.get
                }
                getPatientsAdresse(patients, geocoder) {
                    let patient = patients.pop();
                    if (patient) {
                        let A = patient.adresse;
                        let address = `${A.numero} ${A.rue}, ${A.codePostal} ${A.ville}`;
                        geocoder.geocode({ address: address }, (results, status) => {
                            if (status == google.maps.GeocoderStatus.OK) {
                                /* Récupération de sa latitude et de sa longitude */
                                console.log("Géolocalisation OK pour", address);
                                patient.adresse.lat = results[0].geometry.location.lat();
                                patient.adresse.lng = results[0].geometry.location.lng();
                            }
                            else {
                                console.error("Pas de géolocalisation pour", address);
                            }
                            this.getPatientsAdresse(patients, geocoder);
                        });
                    }
                }
                AjouterPatient(f) {
                    let controls = f.form.controls;
                    let body = {};
                    for (let v in controls) {
                        body[v] = controls[v].value;
                    }
                    return this._http.post("./addPatient", body).toPromise().then(() => {
                        let patient = {
                            prenom: body["patientName"],
                            nom: body["patientForname"],
                            sexe: body["patientSex"] === "M" ? sexeEnum.M : sexeEnum.F,
                            numeroSecuriteSociale: body["patientNumber"],
                            adresse: {
                                ville: body["patientCity"],
                                codePostal: +body["patientPostalCode"],
                                rue: body["patientStreet"],
                                numero: body["patientStreetNumber"],
                                etage: body["patientFloor"],
                                lat: undefined,
                                lng: undefined
                            }
                        };
                        return patient;
                    });
                }
                AffecterPatient(draggedElement, infirmier) {
                    let body;
                    if (infirmier) {
                        body = {
                            infirmier: infirmier.id,
                            patient: draggedElement.patient.numeroSecuriteSociale,
                        };
                    }
                    else {
                        body = {
                            infirmier: "",
                            patient: draggedElement.patient.numeroSecuriteSociale,
                        };
                    }
                    return this._http.post("./affectation", body).toPromise();
                }
            };
            ServiceCabinetMedical = __decorate([
                core_1.Injectable(), 
                __metadata('design:paramtypes', [http_1.Http, core_2.MapsAPILoader])
            ], ServiceCabinetMedical);
            exports_1("ServiceCabinetMedical", ServiceCabinetMedical);
        }
    }
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlNlcnZpY2VzL2NhYmluZXRNZWRpY2FsU2VydmljZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7WUFLQSwrREFBK0Q7WUFFL0QsV0FBWSxRQUFRO2dCQUFFLGlDQUFDLENBQUE7Z0JBQUUsaUNBQUMsQ0FBQTtZQUFBLENBQUMsRUFBZixRQUFRLEtBQVIsUUFBUSxRQUFPOzRDQUFBO1lBNkIzQjtnQkFFSSxZQUFvQixLQUFXLEVBQVUsUUFBd0I7b0JBQTdDLFVBQUssR0FBTCxLQUFLLENBQU07b0JBQVUsYUFBUSxHQUFSLFFBQVEsQ0FBZ0I7b0JBQzdELGdGQUFnRjtnQkFDcEYsQ0FBQztnQkFDRCxPQUFPLENBQUUsR0FBVztvQkFDaEIsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxDQUFDLFNBQVMsRUFBRSxDQUFDLElBQUksQ0FBRSxDQUFDLEdBQWE7d0JBQ3ZELElBQUksT0FBTyxHQUFzQjs0QkFDN0IsVUFBVSxFQUFZLEVBQUU7NEJBQ3hCLG1CQUFtQixFQUFHLEVBQUU7eUJBQzNCLENBQUM7d0JBQ0YsSUFBSSxNQUFNLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQzt3QkFDN0IsSUFBSSxHQUFHLEdBQUcsTUFBTSxDQUFDLGVBQWUsQ0FBRSxHQUFHLENBQUMsSUFBSSxFQUFFLEVBQUUsVUFBVSxDQUFDLENBQUM7d0JBQzFELElBQUksV0FBVyxHQUFPLEdBQUcsQ0FBQyxnQkFBZ0IsQ0FBQyxTQUFTLENBQUMsQ0FBQzt3QkFDdEQsSUFBSSxhQUFhLEdBQUssR0FBRyxDQUFDLGdCQUFnQixDQUFDLFdBQVcsQ0FBQyxDQUFDO3dCQUV4RCxpQkFBaUI7d0JBQ2pCLEdBQUcsQ0FBQyxDQUFDLElBQUksWUFBWSxJQUFJLGFBQWEsQ0FBQyxDQUFBLENBQUM7NEJBQ3BDLElBQUksU0FBUyxHQUF3QjtnQ0FDakMsRUFBRSxFQUFRLFlBQVksQ0FBQyxZQUFZLENBQUMs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Qzs0QkFDN0MsT0FBTyxFQUFHO2dDQUNOLEtBQUssRUFBUyxJQUFJLENBQUMsYUFBYSxDQUFDO2dDQUNqQyxVQUFVLEVBQUcsQ0FBQyxJQUFJLENBQUMsbUJBQW1CLENBQUM7Z0NBQ3ZDLEdBQUcsRUFBVyxJQUFJLENBQUMsZUFBZSxDQUFDO2dDQUNuQyxNQUFNLEVBQVEsSUFBSSxDQUFDLHFCQUFxQixDQUFDO2dDQUN6QyxLQUFLLEVBQVMsSUFBSSxDQUFDLGNBQWMsQ0FBQztnQ0FDbEMsR0FBRyxFQUFXLFNBQVM7Z0NBQ3ZCLEdBQUcsRUFBVyxTQUFTOzZCQUMxQjt5QkFDSixDQUFDO3dCQUNGLE1BQU0sQ0FBQyxPQUFPLENBQUM7b0JBQ25CLENBQUMsQ0FBQyxDQUFDO2dCQUNQLENBQUM7Z0JBQ0QsZUFBZSxDQUFDLGNBQStFLEVBQUUsU0FBOEI7b0JBQzNILElBQUksSUFBSSxDQUFDO29CQUNULEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7d0JBQ1osSUFBSSxHQUFHOzRCQUNILFNBQVMsRUFBRSxTQUFTLENBQUMsRUFBRTs0QkFDdkIsT0FBTyxFQUFFLGNBQWMsQ0FBQyxPQUFPLENBQUMscUJBQXFCO3lCQUN4RCxDQUFDO29CQUNOLENBQUM7b0JBQUMsSUFBSSxDQUFDLENBQUM7d0JBQ0osSUFBSSxHQUFHOzRCQUNILFNBQVMsRUFBRSxFQUFFOzRCQUNiLE9BQU8sRUFBRSxjQUFjLENBQUMsT0FBTyxDQUFDLHFCQUFxQjt5QkFDeEQsQ0FBQztvQkFDTixDQUFDO29CQUNELE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxlQUFlLEVBQUUsSUFBSSxDQUFDLENBQUMsU0FBUyxFQUFFLENBQUM7Z0JBQzlELENBQUM7WUFDTCxDQUFDO1lBeklEO2dCQUFDLGlCQUFVLEVBQUU7O3FDQUFBO1lBQ2IseURBd0lDLENBQUEiLCJmaWxlIjoiU2VydmljZXMvY2FiaW5ldE1lZGljYWxTZXJ2aWNlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtJbmplY3RhYmxlfSAgICAgZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7SHR0cCwgUmVzcG9uc2V9IGZyb20gXCJAYW5ndWxhci9odHRwXCI7XG5pbXBvcnQge05nRm9ybX0gZnJvbSBcIkBhbmd1bGFyL2Zvcm1zXCI7XG5pbXBvcnQgXCJyeGpzL2FkZC9vcGVyYXRvci90b1Byb21pc2VcIjtcbmltcG9ydCB7IE1hcHNBUElMb2FkZXIgfSBmcm9tICdhbmd1bGFyMi1nb29nbGUtbWFwcy9jb3JlJztcbi8vaW1wb3J0IHtmb3JFYWNofSBmcm9tIFwiQGFuZ3VsYXIvcm91dGVyL3NyYy91dGlscy9jb2xsZWN0aW9uXCI7XG5cbmV4cG9ydCBlbnVtIHNleGVFbnVtIHtNLCBGfVxuZXhwb3J0IGludGVyZmFjZSBQYXRpZW50SW50ZXJmYWNlIHtcbiAgICBwcmVub20gICAgICAgICAgICAgICAgICA6IHN0cmluZztcbiAgICBub20gICAgICAgICAgICAgICAgICAgICA6IHN0cmluZztcbiAgICBzZXhlICAgICAgICAgICAgICAgICAgICA6IHNleGVFbnVtO1xuICAgIG51bWVyb1NlY3VyaXRlU29jaWFsZSAgIDogc3RyaW5nO1xuICAgIGFkcmVzc2UgICAgICAgICAgICAgICAgIDoge1xuICAgICAgICB2aWxsZSAgICAgICA6IHN0cmluZztcbiAgICAgICAgY29kZVBvc3RhbCAgOiBudW1iZXI7XG4gICAgICAgIHJ1ZSAgICAgICAgIDogc3RyaW5nO1xuICAgICAgICBudW1lcm8gICAgICA6IHN0cmluZztcbiAgICAgICAgZXRhZ2UgICAgICAgOiBzdHJpbmc7XG4gICAgICAgIGxhdCAgICAgICAgIDogbnVtYmVyO1xuICAgICAgICBsbmcgICAgICAgICA6IG51bWJlcjtcbiAgICB9O1xufVxuZXhwb3J0IGludGVyZmFjZSBJbmZpcm1pZXJJbnRlcmZhY2Uge1xuICAgIGlkICAgICAgICAgIDogc3RyaW5nO1xuICAgIHByZW5vbSAgICAgIDogc3RyaW5nO1xuICAgIG5vbSAgICAgICAgIDogc3RyaW5nO1xuICAgIHBob3RvICAgICAgIDogc3RyaW5nO1xuICAgIHBhdGllbnRzICAgIDogUGF0aWVudEludGVyZmFjZVtdO1xufVxuZXhwb3J0IGludGVyZmFjZSBDYWJpbmV0SW50ZXJmYWNlIHtcbiAgICBpbmZpcm1pZXJzICAgICAgICAgIDogSW5maXJtaWVySW50ZXJmYWNlW107XG4gICAgcGF0aWVudHNOb25BZmZlY3RlcyA6IFBhdGllbnRJbnRlcmZhY2UgIFtdO1xufVxuXG5ASW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU2VydmljZUNhYmluZXRNZWRpY2FsIHtcbiAgICBnZW9jb2RlcjogYW55O1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgX2h0dHA6IEh0dHAsIHByaXZhdGUgX19sb2FkZXIgOiBNYXBzQVBJTG9hZGVyKSB7XG4gICAgICAgIC8vIExlIHNlcnZpY2UgQ2FiaW5ldE1lZGljYWwgYSBiZXNvaW4gZHUgc2VydmljZSBIdHRwIGV0IGR1IHNlcnZpY2UgZGUgZ2VvY29kaW5nXG4gICAgfVxuICAgIGdldERhdGEoIHVybDogc3RyaW5nICkgOiBQcm9taXNlPENhYmluZXRJbnRlcmZhY2U+IHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX2h0dHAuZ2V0KHVybCkudG9Qcm9taXNlKCkudGhlbiggKHJlczogUmVzcG9uc2UpID0+IHtcbiAgICAgICAgICAgIGxldCBjYWJpbmV0IDogQ2FiaW5ldEludGVyZmFjZSA9IHtcbiAgICAgICAgICAgICAgICBpbmZpcm1pZXJzICAgICAgICAgIDogW10sXG4gICAgICAgICAgICAgICAgcGF0aWVudHNOb25BZmZlY3RlcyA6IFtdXG4gICAgICAgICAgICB9O1xuICAgICAgICAgICAgbGV0IHBhcnNlciA9IG5ldyBET01QYXJzZXIoKTtcbiAgICAgICAgICAgIGxldCBkb2MgPSBwYXJzZXIucGFyc2VGcm9tU3RyaW5nKCByZXMudGV4dCgpLCBcInRleHQveG1sXCIpO1xuICAgICAgICAgICAgbGV0IHBhdGllbnRzWE1MICAgICA9IGRvYy5xdWVyeVNlbGVjdG9yQWxsKFwicGF0aWVudFwiKTtcbiAgICAgICAgICAgIGxldCBpbmZpcm1pZXJzWE1MICAgPSBkb2MucXVlcnlTZWxlY3RvckFsbChcImluZmlybWllclwiKTtcblxuICAgICAgICAgICAgLy8gTGVzIGluZmlybWllcnNcbiAgICAgICAgICAgIGZvciAobGV0IGluZmlybWllclhNTCBvZiBpbmZpcm1pZXJzWE1MKXtcbiAgICAgICAgICAgICAgICBsZXQgaW5maXJtaWVyIDogSW5maXJtaWVySW50ZXJmYWNlID0ge1xuICAgICAgICAgICAgICAgICAgICBpZCAgICAgIDogaW5maXJtaWVyWE1MLmdldEF0dHJpYnV0ZShcImlkXCIpLFxuICAgICAgICAgICAgICAgICAgICBub20gICAgIDogaW5maXJtaWVyWE1MLnF1ZXJ5U2VsZWN0b3IoXCJub21cIikudGV4dENvbnRlbnQsXG4gICAgICAgICAgICAgICAgICAgIHByZW5vbSAgOiBpbmZpcm1pZXJYTUwucXVlcnlTZWxlY3RvcihcInByw6lub21cIikudGV4dENvbnRlbnQsXG4gICAgICAgICAgICAgICAgICAgIHBob3RvICAgOiBpbmZpcm1pZXJYTUwucXVlcnlTZWxlY3RvcihcInBob3RvXCIpLnRleHRDb250ZW50LFxuICAgICAgICAgICAgICAgICAgICBwYXRpZW50czogW11cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIGNhYmluZXQuaW5maXJtaWVycy5wdXNoKCBpbmZpcm1pZXIgKTtcbiAgICAgICAgICAgIH1cblxuXG4gICAgICAgICAgICAvLyBMZXMgcGF0aWVudHNcbiAgICAgICAgICAgIGxldCBwYXRpZW50czogUGF0aWVudEludGVyZmFjZVtdID0gW107XG4gICAgICAgICAgICBmb3IgKGxldCBwYXRpZW50WE1MIG9mIHBhdGllbnRzWE1MKSB7XG4gICAgICAgICAgICAgICAgbGV0IGV0YWdlPVwiXCIsIG51bWVybyA9IFwiXCI7XG4gICAgICAgICAgICAgICAgaWYocGF0aWVudFhNTC5xdWVyeVNlbGVjdG9yKFwiw6l0YWdlXCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGV0YWdlID0gcGF0aWVudFhNTC5xdWVyeVNlbGVjdG9yKFwiw6l0YWdlXCIpLnRleHRDb250ZW50O1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZihwYXRpZW50WE1MLnF1ZXJ5U2VsZWN0b3IoXCJhZHJlc3NlIG51bcOpcm9cIikpIHtcbiAgICAgICAgICAgICAgICAgICAgbnVtZXJvID0gcGF0aWVudFhNTC5xdWVyeVNlbGVjdG9yKFwiYWRyZXNzZSBudW3DqXJvXCIpLnRleHRDb250ZW50O1xuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgIGxldCBwYXRpZW50IDogUGF0aWVudEludGVyZmFjZSA9IHtcbiAgICAgICAgICAgICAgICAgICAgcHJlbm9tICAgICA6IHBhdGllbnRYTUwucXVlcnlTZWxlY3RvcihcInByw6lub21cIikudGV4dENvbnRlbnQsXG4gICAgICAgICAgICAgICAgICAgIG5vbSAgOiBwYXRpZW50WE1MLnF1ZXJ5U2VsZWN0b3IoXCJub21cIikudGV4dENvbnRlbnQsXG4gICAgICAgICAgICAgICAgICAgIHNleGUgIDogcGF0aWVudFhNTC5xdWVyeVNlbGVjdG9yKFwic2V4ZVwiKS50ZXh0Q29udGVudD09PVwiTVwiP3NleGVFbnVtLk06c2V4ZUVudW0uRixcbiAgICAgICAgICAgICAgICAgICAgbnVtZXJvU2VjdXJpdGVTb2NpYWxlIDogcGF0aWVudFhNTC5xdWVyeVNlbGVjdG9yKFwibnVtw6lyb1wiKS50ZXh0Q29udGVudCxcbiAgICAgICAgICAgICAgICAgICAgYWRyZXNzZSA6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZpbGxlICAgICAgIDogcGF0aWVudFhNTC5xdWVyeVNlbGVjdG9yKFwidmlsbGVcIikudGV4dENvbnRlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICBjb2RlUG9zdGFsICA6ICtwYXRpZW50WE1MLnF1ZXJ5U2VsZWN0b3IoXCJjb2RlUG9zdGFsXCIpLnRleHRDb250ZW50LFxuICAgICAgICAgICAgICAgICAgICAgICAgcnVlICAgICAgICAgOiBwYXRpZW50WE1MLnF1ZXJ5U2VsZWN0b3IoXCJydWVcIikudGV4dENvbnRlbnQsXG4gICAgICAgICAgICAgICAgICAgICAgICBudW1lcm8gICAgICA6IG51bWVybyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGV0YWdlICAgICAgIDogZXRhZ2UsXG4gICAgICAgICAgICAgICAgICAgICAgICBsYXQgICAgICAgICA6IHVuZGVmaW5lZCxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxuZyAgICAgICAgIDogdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9O1xuICAgICAgICAgICAgICAgIHBhdGllbnRzLnB1c2gocGF0aWVudCk7XG5cbiAgICAgICAgICAgICAgICAvLyBMZSBwYXRpZW50IGVzdCBpbCBhZmZlY3TDqSA/XG4gICAgICAgICAgICAgICAgbGV0IHZpc2l0ZSA9IHBhdGllbnRYTUwucXVlcnlTZWxlY3RvciggXCJ2aXNpdGVcIiApO1xuICAgICAgICAgICAgICAgIGlmKCB2aXNpdGUgJiYgdmlzaXRlLmhhc0F0dHJpYnV0ZShcImludGVydmVuYW50XCIpKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBpZEluZmlybWllciA9IHZpc2l0ZS5nZXRBdHRyaWJ1dGUoXCJpbnRlcnZlbmFudFwiKTtcbiAgICAgICAgICAgICAgICAgICAgbGV0IGluZmlybWllciA9IGNhYmluZXQuaW5maXJtaWVycy5maW5kKCBpbmYgPT4gaW5mLmlkID09PSBpZEluZmlybWllciApO1xuICAgICAgICAgICAgICAgICAgICBpbmZpcm1pZXIucGF0aWVudHMucHVzaCggcGF0aWVudCApO1xuICAgICAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGNhYmluZXQucGF0aWVudHNOb25BZmZlY3Rlcy5wdXNoKCBwYXRpZW50ICk7XG4gICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHRoaXMuX19sb2FkZXIubG9hZCgpLnRoZW4oICgpID0+IHtcbiAgICAgICAgICAgICAgICB0aGlzLmdlb2NvZGVyID0gbmV3IGdvb2dsZS5tYXBzLkdlb2NvZGVyKCk7XG4gICAgICAgICAgICAgICAgdGhpcy5nZXRQYXRpZW50c0FkcmVzc2UocGF0aWVudHMsIHRoaXMuZ2VvY29kZXIpO1xuICAgICAgICAgICAgfSApO1xuICAgICAgICAgICAgY29uc29sZS5sb2coXCJMZSBzZXJ2ZXVyIHJlbnZvaVwiLHJlcyk7XG4gICAgICAgICAgICByZXR1cm4gY2FiaW5ldDtcbiAgICAgICAgfSk7IC8vIEZpbiBkZSB0aGlzLl9odHRwLmdldFxuICAgIH1cbiAgICBnZXRQYXRpZW50c0FkcmVzc2UocGF0aWVudHM6IFBhdGllbnRJbnRlcmZhY2VbXSwgZ2VvY29kZXI6IGFueSkge1xuICAgICAgICBsZXQgcGF0aWVudCA9IHBhdGllbnRzLnBvcCgpO1xuICAgICAgICBpZihwYXRpZW50KXtcbiAgICAgICAgICAgIGxldCBBID0gcGF0aWVudC5hZHJlc3NlO1xuICAgICAgICAgICAgbGV0IGFkZHJlc3MgPSBgJHtBLm51bWVyb30gJHtBLnJ1ZX0sICR7QS5jb2RlUG9zdGFsfSAke0EudmlsbGV9YDtcbiAgICAgICAgICAgIGdlb2NvZGVyLmdlb2NvZGUoIHthZGRyZXNzOiBhZGRyZXNzfSwgKHJlc3VsdHMsIHN0YXR1cykgPT4ge1xuICAgICAgICAgICAgICAgIGlmIChzdGF0dXMgPT0gZ29vZ2xlLm1hcHMuR2VvY29kZXJTdGF0dXMuT0spIHtcbiAgICAgICAgICAgICAgICAgICAgLyogUsOpY3Vww6lyYXRpb24gZGUgc2EgbGF0aXR1ZGUgZXQgZGUgc2EgbG9uZ2l0dWRlICovXG4gICAgICAgICAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiR8Opb2xvY2FsaXNhdGlvbiBPSyBwb3VyXCIsIGFkZHJlc3MpO1xuICAgICAgICAgICAgICAgICAgICBwYXRpZW50LmFkcmVzc2UubGF0ID0gcmVzdWx0c1swXS5nZW9tZXRyeS5sb2NhdGlvbi5sYXQoKTtcbiAgICAgICAgICAgICAgICAgICAgcGF0aWVudC5hZHJlc3NlLmxuZyA9IHJlc3VsdHNbMF0uZ2VvbWV0cnkubG9jYXRpb24ubG5nKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIlBhcyBkZSBnw6lvbG9jYWxpc2F0aW9uIHBvdXJcIiwgYWRkcmVzcyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuZ2V0UGF0aWVudHNBZHJlc3NlKHBhdGllbnRzLCBnZW9jb2Rlcik7XG4gICAgICAgICAgICB9ICk7XG4gICAgICAgIH1cblxuICAgIH1cbiAgICBBam91dGVyUGF0aWVudChmOiBOZ0Zvcm0pIDogUHJvbWlzZTxQYXRpZW50SW50ZXJmYWNlPiB7XG4gICAgICAgIGxldCBjb250cm9scyA9IGYuZm9ybS5jb250cm9scztcbiAgICAgICAgbGV0IGJvZHkgICAgID0ge307XG4gICAgICAgIGZvcihsZXQgdiBpbiBjb250cm9scykge1xuICAgICAgICAgICAgYm9keVt2XSA9IGNvbnRyb2xzW3ZdLnZhbHVlO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzLl9odHRwLnBvc3QoIFwiLi9hZGRQYXRpZW50XCIsIGJvZHkgKS50b1Byb21pc2UoKS50aGVuKCAoKSA9PiB7XG4gICAgICAgICAgICBsZXQgcGF0aWVudCA6IFBhdGllbnRJbnRlcmZhY2UgPSB7XG4gICAgICAgICAgICAgICAgcHJlbm9tICAgICAgOiBib2R5W1wicGF0aWVudE5hbWVcIl0sXG4gICAgICAgICAgICAgICAgbm9tICAgICAgICAgOiBib2R5W1wicGF0aWVudEZvcm5hbWVcIl0sXG4gICAgICAgICAgICAgICAgc2V4ZSAgICAgICAgOiBib2R5W1wicGF0aWVudFNleFwiXT09PVwiTVwiP3NleGVFbnVtLk06c2V4ZUVudW0uRixcbiAgICAgICAgICAgICAgICBudW1lcm9TZWN1cml0ZVNvY2lhbGUgOiBib2R5W1wicGF0aWVudE51bWJlclwiXSxcbiAgICAgICAgICAgICAgICBhZHJlc3NlIDoge1xuICAgICAgICAgICAgICAgICAgICB2aWxsZSAgICAgICA6IGJvZHlbXCJwYXRpZW50Q2l0eVwiXSxcbiAgICAgICAgICAgICAgICAgICAgY29kZVBvc3RhbCAgOitib2R5W1wicGF0aWVudFBvc3RhbENvZGVcIl0sXG4gICAgICAgICAgICAgICAgICAgIHJ1ZSAgICAgICAgIDogYm9keVtcInBhdGllbnRTdHJlZXRcIl0sXG4gICAgICAgICAgICAgICAgICAgIG51bWVybyAgICAgIDogYm9keVtcInBhdGllbnRTdHJlZXROdW1iZXJcIl0sXG4gICAgICAgICAgICAgICAgICAgIGV0YWdlICAgICAgIDogYm9keVtcInBhdGllbnRGbG9vclwiXSxcbiAgICAgICAgICAgICAgICAgICAgbGF0ICAgICAgICAgOiB1bmRlZmluZWQsXG4gICAgICAgICAgICAgICAgICAgIGxuZyAgICAgICAgIDogdW5kZWZpbmVkXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIHJldHVybiBwYXRpZW50O1xuICAgICAgICB9KTtcbiAgICB9XG4gICAgQWZmZWN0ZXJQYXRpZW50KGRyYWdnZWRFbGVtZW50IDogeyBwYXRpZW50IDogUGF0aWVudEludGVyZmFjZSAsIGluZmlybWllciA6IEluZmlybWllckludGVyZmFjZX0sIGluZmlybWllciA6IEluZmlybWllckludGVyZmFjZSkge1xuICAgICAgICBsZXQgYm9keTtcbiAgICAgICAgaWYgKGluZmlybWllcikge1xuICAgICAgICAgICAgYm9keSA9IHtcbiAgICAgICAgICAgICAgICBpbmZpcm1pZXI6IGluZmlybWllci5pZCxcbiAgICAgICAgICAgICAgICBwYXRpZW50OiBkcmFnZ2VkRWxlbWVudC5wYXRpZW50Lm51bWVyb1NlY3VyaXRlU29jaWFsZSxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBib2R5ID0ge1xuICAgICAgICAgICAgICAgIGluZmlybWllcjogXCJcIixcbiAgICAgICAgICAgICAgICBwYXRpZW50OiBkcmFnZ2VkRWxlbWVudC5wYXRpZW50Lm51bWVyb1NlY3VyaXRlU29jaWFsZSxcbiAgICAgICAgICAgIH07XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuX2h0dHAucG9zdChcIi4vYWZmZWN0YXRpb25cIiwgYm9keSkudG9Qcm9taXNlKCk7XG4gICAgfVxufVxuXG4iXSwic291cmNlUm9vdCI6IiJ9
