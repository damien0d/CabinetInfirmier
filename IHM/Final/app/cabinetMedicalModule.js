System.register(["@angular/core", "@angular/common", "@angular/forms", "./DragDrop/DragDropModule", "@angular/http", "./Components/ComposantSecretaire", "@Services/cabinetMedicalService", "./Components/ComposantPatient", "./Components/ComposantMap", "angular2-google-maps/core"], function(exports_1, context_1) {
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
    var core_1, common_1, forms_1, DragDropModule_1, http_1, ComposantSecretaire_1, cabinetMedicalService_1, ComposantPatient_1, ComposantMap_1, core_2;
    var CabinetMedicalModule;
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (common_1_1) {
                common_1 = common_1_1;
            },
            function (forms_1_1) {
                forms_1 = forms_1_1;
            },
            function (DragDropModule_1_1) {
                DragDropModule_1 = DragDropModule_1_1;
            },
            function (http_1_1) {
                http_1 = http_1_1;
            },
            function (ComposantSecretaire_1_1) {
                ComposantSecretaire_1 = ComposantSecretaire_1_1;
            },
            function (cabinetMedicalService_1_1) {
                cabinetMedicalService_1 = cabinetMedicalService_1_1;
            },
            function (ComposantPatient_1_1) {
                ComposantPatient_1 = ComposantPatient_1_1;
            },
            function (ComposantMap_1_1) {
                ComposantMap_1 = ComposantMap_1_1;
            },
            function (core_2_1) {
                core_2 = core_2_1;
            }],
        execute: function() {
            CabinetMedicalModule = class CabinetMedicalModule {
            };
            CabinetMedicalModule = __decorate([
                core_1.NgModule({
                    imports: [common_1.CommonModule, forms_1.FormsModule, DragDropModule_1.DragDropModule, http_1.HttpModule,
                        core_2.AgmCoreModule.forRoot({
                            apiKey: 'AIzaSyAUS9yT1vRytThjxYkBQVXu4MUn7Ewf8VI'
                        })],
                    exports: [ComposantSecretaire_1.ComposantSecretaire],
                    declarations: [ComposantSecretaire_1.ComposantSecretaire, ComposantPatient_1.ComposantPatient, ComposantMap_1.ComposantMap],
                    providers: [cabinetMedicalService_1.ServiceCabinetMedical],
                }), 
                __metadata('design:paramtypes', [])
            ], CabinetMedicalModule);
            exports_1("CabinetMedicalModule", CabinetMedicalModule);
        }
    }
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImNhYmluZXRNZWRpY2FsTW9kdWxlLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O1lBc0JBO1lBQW9DLENBQUM7WUFWckM7Z0JBQUMsZUFBUSxDQUFDO29CQUNOLE9BQU8sRUFBTyxDQUFFLHFCQUFZLEVBQUUsbUJBQVcsRUFBRSwrQkFBYyxFQUFFLGlCQUFVO3dCQUNqRSxvQkFBYSxDQUFDLE9BQU8sQ0FBQzs0QkFDbEIsTUFBTSxFQUFFLHlDQUF5Qzt5QkFDcEQsQ0FBQyxDQUFFO29CQUNSLE9BQU8sRUFBTyxDQUFFLHlDQUFtQixDQUFFO29CQUNyQyxZQUFZLEVBQUUsQ0FBRSx5Q0FBbUIsRUFBRSxtQ0FBZ0IsRUFBRSwyQkFBWSxDQUFFO29CQUNyRSxTQUFTLEVBQUssQ0FBRSw2Q0FBcUIsQ0FBRTtpQkFFMUMsQ0FBQzs7b0NBQUE7WUFDRix1REFBcUMsQ0FBQSIsImZpbGUiOiJjYWJpbmV0TWVkaWNhbE1vZHVsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IE5nTW9kdWxlIH0gICAgICAgICAgICAgICAgIGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQgeyBDb21tb25Nb2R1bGUgfSAgICAgICAgICAgICBmcm9tIFwiQGFuZ3VsYXIvY29tbW9uXCI7XG5pbXBvcnQgeyBGb3Jtc01vZHVsZSAgfSAgICAgICAgICAgICBmcm9tIFwiQGFuZ3VsYXIvZm9ybXNcIjtcbmltcG9ydCB7IERyYWdEcm9wTW9kdWxlIH0gICAgICAgICAgIGZyb20gXCIuL0RyYWdEcm9wL0RyYWdEcm9wTW9kdWxlXCI7XG5pbXBvcnQgeyBIdHRwTW9kdWxlIH0gICAgICAgICAgICAgICBmcm9tIFwiQGFuZ3VsYXIvaHR0cFwiO1xuXG5pbXBvcnQgeyBDb21wb3NhbnRTZWNyZXRhaXJlIH0gICAgICBmcm9tIFwiLi9Db21wb25lbnRzL0NvbXBvc2FudFNlY3JldGFpcmVcIjtcbmltcG9ydCB7IFNlcnZpY2VDYWJpbmV0TWVkaWNhbCB9ICAgIGZyb20gXCJAU2VydmljZXMvY2FiaW5ldE1lZGljYWxTZXJ2aWNlXCI7XG5pbXBvcnQgeyBDb21wb3NhbnRQYXRpZW50IH0gICAgICAgICBmcm9tIFwiLi9Db21wb25lbnRzL0NvbXBvc2FudFBhdGllbnRcIjtcbmltcG9ydCB7IENvbXBvc2FudE1hcCB9ICAgICAgICAgICAgIGZyb20gXCIuL0NvbXBvbmVudHMvQ29tcG9zYW50TWFwXCI7XG5pbXBvcnQgeyBBZ21Db3JlTW9kdWxlIH0gICAgICAgICAgICBmcm9tIFwiYW5ndWxhcjItZ29vZ2xlLW1hcHMvY29yZVwiO1xuXG5ATmdNb2R1bGUoe1xuICAgIGltcG9ydHMgICAgIDogWyBDb21tb25Nb2R1bGUsIEZvcm1zTW9kdWxlLCBEcmFnRHJvcE1vZHVsZSwgSHR0cE1vZHVsZSxcbiAgICAgICAgQWdtQ29yZU1vZHVsZS5mb3JSb290KHtcbiAgICAgICAgICAgIGFwaUtleTogJ0FJemFTeUFVUzl5VDF2Unl0VGhqeFlrQlFWWHU0TVVuN0V3ZjhWSSdcbiAgICAgICAgfSkgXSxcbiAgICBleHBvcnRzICAgICA6IFsgQ29tcG9zYW50U2VjcmV0YWlyZSBdLFxuICAgIGRlY2xhcmF0aW9uczogWyBDb21wb3NhbnRTZWNyZXRhaXJlLCBDb21wb3NhbnRQYXRpZW50LCBDb21wb3NhbnRNYXAgXSxcbiAgICBwcm92aWRlcnMgICA6IFsgU2VydmljZUNhYmluZXRNZWRpY2FsIF0sXG5cbn0pXG5leHBvcnQgY2xhc3MgQ2FiaW5ldE1lZGljYWxNb2R1bGUgeyB9XG4iXSwic291cmNlUm9vdCI6IiJ9
