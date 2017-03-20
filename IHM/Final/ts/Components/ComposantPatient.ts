import * as NF from "@Services/cabinetMedicalService";
import {Component, Input} from "@angular/core";
import {PatientInterface} from "@Services/cabinetMedicalService";
import {InfirmierInterface} from "@Services/cabinetMedicalService";


const htmlTemplate = `
    <table border="1" cellpadding="15">
        <tr>
            <td>
                {{Patient.numeroSecuriteSociale}}
            </td>
            <td>
                {{Patient.nom}}
            </td>
            <td>
                {{Patient.prenom}}
            </td>      
        </tr>
    </table>
`;

@Component({
    selector	: "composant-patient",
    template	: htmlTemplate
})

export class ComposantPatient {
    @Input() Patient    : NF.PatientInterface;
    @Input() Infirmiers : NF.InfirmierInterface[];
    idInfirmier         : string;
    selectInfirmier( id: string ) {
        console.log("selectInfirmier", id);
        /*let infirmier = InfirmierInterface.find( inf => inf.id === id );
        infirmier.patients.push( PatientInterface );*/
    }

}

