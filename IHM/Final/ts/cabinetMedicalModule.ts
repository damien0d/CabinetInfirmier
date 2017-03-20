import { NgModule }                 from "@angular/core";
import { CommonModule }             from "@angular/common";
import { FormsModule  }             from "@angular/forms";
import { DragDropModule }           from "./DragDrop/DragDropModule";
import { HttpModule }               from "@angular/http";

import { ComposantSecretaire }      from "./Components/ComposantSecretaire";
import { ServiceCabinetMedical }    from "@Services/cabinetMedicalService";
import { ComposantPatient }         from "./Components/ComposantPatient";
import { ComposantMap }             from "./Components/ComposantMap";
import { AgmCoreModule }            from "angular2-google-maps/core";

@NgModule({
    imports     : [ CommonModule, FormsModule, DragDropModule, HttpModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyAUS9yT1vRytThjxYkBQVXu4MUn7Ewf8VI'
        }) ],
    exports     : [ ComposantSecretaire ],
    declarations: [ ComposantSecretaire, ComposantPatient, ComposantMap ],
    providers   : [ ServiceCabinetMedical ],

})
export class CabinetMedicalModule { }
