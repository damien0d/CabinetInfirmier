/**
 * Created by delouesd on 15/11/16.
 */
import * as NF from "@Services/cabinetMedicalService";
import { MapsAPILoader } from 'angular2-google-maps/core';
import {Component, OnInit, Input} from "@angular/core";
import {PatientInterface} from "@Services/cabinetMedicalService";

const template = `
    <div class="map-{{infirmier.id}} map"> </div>
`;

@Component({
    selector: "composant-map",
    template: template
})
// Dans le composant où vous voulez utiliser le géocoding, injecter la dépendance :

export class ComposantMap implements OnInit {
    @Input("infirmier") infirmier    : NF.InfirmierInterface;

    map     : google.maps.Map

    constructor( private __loader : MapsAPILoader ) {}

    ngOnInit(): void {
        this.__loader.load().then( () => {
            console.log("Geocoder:", google.maps.Geocoder);
            //let gecoder = new google.maps.Geocoder();
            //gecoder.geocode(  )

            this.map = new google.maps.Map(document.querySelector(".map" + this.infirmier.id), {
                center: {lat: -34.397, lng: 150.644},
                zoom: 8
            });
        });
    }

}
