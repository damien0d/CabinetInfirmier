System.register(["@Services/cabinetMedicalService", "@angular/core"], function(exports_1, context_1) {
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
    var NF, core_1;
    var htmlTemplate, ComposantPatient;
    return {
        setters:[
            function (NF_1) {
                NF = NF_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            }],
        execute: function() {
            htmlTemplate = `
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
            ComposantPatient = class ComposantPatient {
                selectInfirmier(id) {
                    console.log("selectInfirmier", id);
                    /*let infirmier = InfirmierInterface.find( inf => inf.id === id );
                    infirmier.patients.push( PatientInterface );*/
                }
            };
            __decorate([
                core_1.Input(), 
                __metadata('design:type', Object)
            ], ComposantPatient.prototype, "Patient", void 0);
            __decorate([
                core_1.Input(), 
                __metadata('design:type', Array)
            ], ComposantPatient.prototype, "Infirmiers", void 0);
            ComposantPatient = __decorate([
                core_1.Component({
                    selector: "composant-patient",
                    template: htmlTemplate
                }), 
                __metadata('design:paramtypes', [])
            ], ComposantPatient);
            exports_1("ComposantPatient", ComposantPatient);
        }
    }
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvbXBvbmVudHMvQ29tcG9zYW50UGF0aWVudC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O1FBTU0sWUFBWTs7Ozs7Ozs7OztZQUFaLFlBQVksR0FBRzs7Ozs7Ozs7Ozs7Ozs7Q0FjcEIsQ0FBQztZQU9GO2dCQUlJLGVBQWUsQ0FBRSxFQUFVO29CQUN2QixPQUFPLENBQUMsR0FBRyxDQUFDLGlCQUFpQixFQUFFLEVBQUUsQ0FBQyxDQUFDO29CQUNuQztrRUFDOEM7Z0JBQ2xELENBQUM7WUFFTCxDQUFDO1lBVEc7Z0JBQUMsWUFBSyxFQUFFOzs2REFBQTtZQUNSO2dCQUFDLFlBQUssRUFBRTs7Z0VBQUE7WUFQWjtnQkFBQyxnQkFBUyxDQUFDO29CQUNQLFFBQVEsRUFBRyxtQkFBbUI7b0JBQzlCLFFBQVEsRUFBRyxZQUFZO2lCQUMxQixDQUFDOztnQ0FBQTtZQUVGLCtDQVVDLENBQUEiLCJmaWxlIjoiQ29tcG9uZW50cy9Db21wb3NhbnRQYXRpZW50LmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgTkYgZnJvbSBcIkBTZXJ2aWNlcy9jYWJpbmV0TWVkaWNhbFNlcnZpY2VcIjtcbmltcG9ydCB7Q29tcG9uZW50LCBJbnB1dH0gZnJvbSBcIkBhbmd1bGFyL2NvcmVcIjtcbmltcG9ydCB7UGF0aWVudEludGVyZmFjZX0gZnJvbSBcIkBTZXJ2aWNlcy9jYWJpbmV0TWVkaWNhbFNlcnZpY2VcIjtcbmltcG9ydCB7SW5maXJtaWVySW50ZXJmYWNlfSBmcm9tIFwiQFNlcnZpY2VzL2NhYmluZXRNZWRpY2FsU2VydmljZVwiO1xuXG5cbmNvbnN0IGh0bWxUZW1wbGF0ZSA9IGBcbiAgICA8dGFibGUgYm9yZGVyPVwiMVwiIGNlbGxwYWRkaW5nPVwiMTVcIj5cbiAgICAgICAgPHRyPlxuICAgICAgICAgICAgPHRkPlxuICAgICAgICAgICAgICAgIHt7UGF0aWVudC5udW1lcm9TZWN1cml0ZVNvY2lhbGV9fVxuICAgICAgICAgICAgPC90ZD5cbiAgICAgICAgICAgIDx0ZD5cbiAgICAgICAgICAgICAgICB7e1BhdGllbnQubm9tfX1cbiAgICAgICAgICAgIDwvdGQ+XG4gICAgICAgICAgICA8dGQ+XG4gICAgICAgICAgICAgICAge3tQYXRpZW50LnByZW5vbX19XG4gICAgICAgICAgICA8L3RkPiAgICAgIFxuICAgICAgICA8L3RyPlxuICAgIDwvdGFibGU+XG5gO1xuXG5AQ29tcG9uZW50KHtcbiAgICBzZWxlY3Rvclx0OiBcImNvbXBvc2FudC1wYXRpZW50XCIsXG4gICAgdGVtcGxhdGVcdDogaHRtbFRlbXBsYXRlXG59KVxuXG5leHBvcnQgY2xhc3MgQ29tcG9zYW50UGF0aWVudCB7XG4gICAgQElucHV0KCkgUGF0aWVudCAgICA6IE5GLlBhdGllbnRJbnRlcmZhY2U7XG4gICAgQElucHV0KCkgSW5maXJtaWVycyA6IE5GLkluZmlybWllckludGVyZmFjZVtdO1xuICAgIGlkSW5maXJtaWVyICAgICAgICAgOiBzdHJpbmc7XG4gICAgc2VsZWN0SW5maXJtaWVyKCBpZDogc3RyaW5nICkge1xuICAgICAgICBjb25zb2xlLmxvZyhcInNlbGVjdEluZmlybWllclwiLCBpZCk7XG4gICAgICAgIC8qbGV0IGluZmlybWllciA9IEluZmlybWllckludGVyZmFjZS5maW5kKCBpbmYgPT4gaW5mLmlkID09PSBpZCApO1xuICAgICAgICBpbmZpcm1pZXIucGF0aWVudHMucHVzaCggUGF0aWVudEludGVyZmFjZSApOyovXG4gICAgfVxuXG59XG5cbiJdLCJzb3VyY2VSb290IjoiIn0=
