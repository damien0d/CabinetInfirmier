System.register(["@Services/cabinetMedicalService", 'angular2-google-maps/core', "@angular/core"], function(exports_1, context_1) {
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
    var NF, core_1, core_2;
    var template, ComposantMap;
    return {
        setters:[
            function (NF_1) {
                NF = NF_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (core_2_1) {
                core_2 = core_2_1;
            }],
        execute: function() {
            template = `
    <div class="map-{{infirmier.id}} map"> </div>
`;
            ComposantMap = class ComposantMap {
                constructor(__loader) {
                    this.__loader = __loader;
                }
                ngOnInit() {
                    this.__loader.load().then(() => {
                        console.log("Geocoder:", google.maps.Geocoder);
                        //let gecoder = new google.maps.Geocoder();
                        //gecoder.geocode(  )
                        this.map = new google.maps.Map(document.querySelector(".map" + this.infirmier.id), {
                            center: { lat: -34.397, lng: 150.644 },
                            zoom: 8
                        });
                    });
                }
            };
            __decorate([
                core_2.Input("infirmier"), 
                __metadata('design:type', Object)
            ], ComposantMap.prototype, "infirmier", void 0);
            ComposantMap = __decorate([
                core_2.Component({
                    selector: "composant-map",
                    template: template
                }), 
                __metadata('design:paramtypes', [core_1.MapsAPILoader])
            ], ComposantMap);
            exports_1("ComposantMap", ComposantMap);
        }
    }
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkNvbXBvbmVudHMvQ29tcG9zYW50TWFwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7UUFRTSxRQUFROzs7Ozs7Ozs7Ozs7O1lBQVIsUUFBUSxHQUFHOztDQUVoQixDQUFDO1lBUUY7Z0JBS0ksWUFBcUIsUUFBd0I7b0JBQXhCLGFBQVEsR0FBUixRQUFRLENBQWdCO2dCQUFJLENBQUM7Z0JBRWxELFFBQVE7b0JBQ0osSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUU7d0JBQ3ZCLE9BQU8sQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLE1BQU0sQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLENBQUM7d0JBQy9DLDJDQUEyQzt3QkFDM0MscUJBQXFCO3dCQUVyQixJQUFJLENBQUMsR0FBRyxHQUFHLElBQUksTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLGFBQWEsQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxFQUFFLENBQUMsRUFBRTs0QkFDL0UsTUFBTSxFQUFFLEVBQUMsR0FBRyxFQUFFLENBQUMsTUFBTSxFQUFFLEdBQUcsRUFBRSxPQUFPLEVBQUM7NEJBQ3BDLElBQUksRUFBRSxDQUFDO3lCQUNWLENBQUMsQ0FBQztvQkFDUCxDQUFDLENBQUMsQ0FBQztnQkFDUCxDQUFDO1lBRUwsQ0FBQztZQW5CRztnQkFBQyxZQUFLLENBQUMsV0FBVyxDQUFDOzsyREFBQTtZQVB2QjtnQkFBQyxnQkFBUyxDQUFDO29CQUNQLFFBQVEsRUFBRSxlQUFlO29CQUN6QixRQUFRLEVBQUUsUUFBUTtpQkFDckIsQ0FBQzs7NEJBQUE7WUFHRix1Q0FvQkMsQ0FBQSIsImZpbGUiOiJDb21wb25lbnRzL0NvbXBvc2FudE1hcC5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieSBkZWxvdWVzZCBvbiAxNS8xMS8xNi5cbiAqL1xuaW1wb3J0ICogYXMgTkYgZnJvbSBcIkBTZXJ2aWNlcy9jYWJpbmV0TWVkaWNhbFNlcnZpY2VcIjtcbmltcG9ydCB7IE1hcHNBUElMb2FkZXIgfSBmcm9tICdhbmd1bGFyMi1nb29nbGUtbWFwcy9jb3JlJztcbmltcG9ydCB7Q29tcG9uZW50LCBPbkluaXQsIElucHV0fSBmcm9tIFwiQGFuZ3VsYXIvY29yZVwiO1xuaW1wb3J0IHtQYXRpZW50SW50ZXJmYWNlfSBmcm9tIFwiQFNlcnZpY2VzL2NhYmluZXRNZWRpY2FsU2VydmljZVwiO1xuXG5jb25zdCB0ZW1wbGF0ZSA9IGBcbiAgICA8ZGl2IGNsYXNzPVwibWFwLXt7aW5maXJtaWVyLmlkfX0gbWFwXCI+IDwvZGl2PlxuYDtcblxuQENvbXBvbmVudCh7XG4gICAgc2VsZWN0b3I6IFwiY29tcG9zYW50LW1hcFwiLFxuICAgIHRlbXBsYXRlOiB0ZW1wbGF0ZVxufSlcbi8vIERhbnMgbGUgY29tcG9zYW50IG/DuSB2b3VzIHZvdWxleiB1dGlsaXNlciBsZSBnw6lvY29kaW5nLCBpbmplY3RlciBsYSBkw6lwZW5kYW5jZSA6XG5cbmV4cG9ydCBjbGFzcyBDb21wb3NhbnRNYXAgaW1wbGVtZW50cyBPbkluaXQge1xuICAgIEBJbnB1dChcImluZmlybWllclwiKSBpbmZpcm1pZXIgICAgOiBORi5JbmZpcm1pZXJJbnRlcmZhY2U7XG5cbiAgICBtYXAgICAgIDogZ29vZ2xlLm1hcHMuTWFwXG5cbiAgICBjb25zdHJ1Y3RvciggcHJpdmF0ZSBfX2xvYWRlciA6IE1hcHNBUElMb2FkZXIgKSB7fVxuXG4gICAgbmdPbkluaXQoKTogdm9pZCB7XG4gICAgICAgIHRoaXMuX19sb2FkZXIubG9hZCgpLnRoZW4oICgpID0+IHtcbiAgICAgICAgICAgIGNvbnNvbGUubG9nKFwiR2VvY29kZXI6XCIsIGdvb2dsZS5tYXBzLkdlb2NvZGVyKTtcbiAgICAgICAgICAgIC8vbGV0IGdlY29kZXIgPSBuZXcgZ29vZ2xlLm1hcHMuR2VvY29kZXIoKTtcbiAgICAgICAgICAgIC8vZ2Vjb2Rlci5nZW9jb2RlKCAgKVxuXG4gICAgICAgICAgICB0aGlzLm1hcCA9IG5ldyBnb29nbGUubWFwcy5NYXAoZG9jdW1lbnQucXVlcnlTZWxlY3RvcihcIi5tYXBcIiArIHRoaXMuaW5maXJtaWVyLmlkKSwge1xuICAgICAgICAgICAgICAgIGNlbnRlcjoge2xhdDogLTM0LjM5NywgbG5nOiAxNTAuNjQ0fSxcbiAgICAgICAgICAgICAgICB6b29tOiA4XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfSk7XG4gICAgfVxuXG59XG4iXSwic291cmNlUm9vdCI6IiJ9
