System.register(["@angular/core", "./DragDropUtils"], function(exports_1, context_1) {
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
    var core_1, DragDropUtils_1;
    var DragManager, DM, dragDropInit, AlxDragDrop, AlxDraggable, AlxDropzone;
    // function noAcceptFct(draggedData) {return false;}
    function YES(data) { return true; }
    return {
        setters:[
            function (core_1_1) {
                core_1 = core_1_1;
            },
            function (DragDropUtils_1_1) {
                DragDropUtils_1 = DragDropUtils_1_1;
            }],
        execute: function() {
            ;
            /*
             interface ShadowRoot extends DocumentFragment {
             styleSheets     : StyleSheetList;
             innerHTML       : string;
             host            : Element;
             activeElement   : Element;
             elementFromPoint        (x : number, y : number) : Element;
             elementsFromPoint       (x : number, y : number) : Element[];
             caretPositionFromPoint  (x : number, y : number); // => CaretPosition
             };
             interface ElementWithShadowRoot extends HTMLElement {
             shadowRoot  : ShadowRoot;
             };*/
            DragManager = class DragManager {
                constructor() {
                    this.draggedStructures = new Map();
                    this.dropZones = new Map();
                }
                //constructor() {}
                startDrag(idPointer, dragged) {
                    this.draggedStructures.set(idPointer, dragged);
                    let possibleDropZones = new Map();
                    this.dropZones.forEach(dz => {
                        if (dz.checkAccept(dragged)) {
                            dz.appendDropCandidatePointer(idPointer);
                            possibleDropZones.set(dz.root, dz);
                        }
                    });
                    return possibleDropZones;
                }
                isAssociatedToDropZone(element) {
                    return this.dropZones.has(element);
                }
                registerDropZone(dropzone) {
                    this.dropZones.set(dropzone.root, dropzone);
                }
                unregisterDropZone(dropzone) {
                    this.dropZones.delete(dropzone.root);
                }
                pointerMove(idPointer, x, y) {
                    let dragged = this.draggedStructures.get(idPointer);
                    if (dragged) {
                        dragged.move(x, y);
                    }
                    return dragged !== undefined;
                }
                pointerRelease(idPointer) {
                    let dragged = this.draggedStructures.get(idPointer);
                    if (dragged) {
                        dragged.stop();
                        this.draggedStructures.delete(idPointer);
                    }
                    return dragged !== undefined;
                }
            };
            ;
            DM = new DragManager();
            dragDropInit = false;
            AlxDragDrop = class AlxDragDrop {
                constructor() {
                    if (dragDropInit) {
                        console.error("Do not create multiple instance of directive alx-dragdrop !");
                    }
                    else {
                        console.log("AlxDragDrop enabled !");
                        dragDropInit = true;
                    }
                }
                mousemove(e) {
                    DM.pointerMove("mouse", e.clientX, e.clientY);
                }
                mouseup(e) {
                    DM.pointerRelease("mouse");
                }
                touchmove(e) {
                    for (let i = 0; i < e.changedTouches.length; i++) {
                        let touch = e.changedTouches.item(i);
                        if (DM.pointerMove(touch.identifier.toString(), touch.clientX, touch.clientY)) {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    }
                }
                touchend(e) {
                    for (let i = 0; i < e.changedTouches.length; i++) {
                        let touch = e.changedTouches.item(i);
                        if (DM.pointerRelease(touch.identifier.toString())) {
                            e.preventDefault();
                            e.stopPropagation();
                        }
                    }
                }
            };
            __decorate([
                core_1.HostListener("document: mousemove", ["$event"]), 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', [Object]), 
                __metadata('design:returntype', void 0)
            ], AlxDragDrop.prototype, "mousemove", null);
            __decorate([
                core_1.HostListener("document: mouseup", ["$event"]), 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', [Object]), 
                __metadata('design:returntype', void 0)
            ], AlxDragDrop.prototype, "mouseup", null);
            __decorate([
                core_1.HostListener("document: touchmove", ["$event"]), 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', [Object]), 
                __metadata('design:returntype', void 0)
            ], AlxDragDrop.prototype, "touchmove", null);
            __decorate([
                core_1.HostListener("document: touchend", ["$event"]), 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', [Object]), 
                __metadata('design:returntype', void 0)
            ], AlxDragDrop.prototype, "touchend", null);
            AlxDragDrop = __decorate([
                core_1.Directive({
                    selector: "*[alx-dragdrop]"
                }), 
                __metadata('design:paramtypes', [])
            ], AlxDragDrop);
            exports_1("AlxDragDrop", AlxDragDrop);
            AlxDraggable = class AlxDraggable {
                constructor(el) {
                    this.isBeingDragged = false;
                    this.cloneNode = null;
                    this.possibleDropZones = new Map();
                    this.root = el.nativeElement;
                    if (!dragDropInit) {
                        console.error("You should add one alx-dragdrop attribute to your code before using alx-draggable");
                    }
                    //console.log( "new instance of AlxDraggable", this );
                }
                ngOnDestroy() {
                    this.stop();
                }
                onMouseDown(event) {
                    //console.log("mousedown on", this, event);
                    event.preventDefault();
                    event.stopPropagation();
                    this.start("mouse", event.clientX, event.clientY);
                }
                onTouchStart(event) {
                    //console.log("touchstart on", this);
                    event.preventDefault();
                    event.stopPropagation();
                    for (let i = 0; i < event.changedTouches.length; i++) {
                        let touch = event.changedTouches.item(i);
                        this.start(touch.identifier.toString(), touch.clientX, touch.clientY);
                    }
                }
                start(idPointer, x, y) {
                    if (!this.isBeingDragged) {
                        this.isBeingDragged = true;
                        this.idPointer = idPointer;
                        let bbox = this.root.getBoundingClientRect();
                        this.ox = x;
                        this.oy = y;
                        this.dx = x - Math.round(bbox.left + window.pageXOffset);
                        this.dy = y - Math.round(bbox.top + window.pageYOffset);
                        this.tx = bbox.width;
                        this.ty = bbox.height; // console.log( "drag", this.tx, bbox.right - bbox.left );
                        this.possibleDropZones = DM.startDrag(idPointer, this);
                    }
                }
                stop() {
                    this.isBeingDragged = false;
                    if (this.cloneNode) {
                        if (this.cloneNode.parentNode) {
                            this.cloneNode.parentNode.removeChild(this.cloneNode);
                        }
                        this.cloneNode = null;
                    }
                    this.possibleDropZones.forEach(dz => {
                        dz.removeDropCandidatePointer(this.idPointer);
                        dz.removePointerHover(this.idPointer);
                    });
                    this.possibleDropZones.clear();
                    this.idPointer = null;
                    if (this.currentDropZone) {
                        this.currentDropZone.drop(this.data);
                    }
                    this.currentDropZone = null;
                }
                move(x, y) {
                    let element = null;
                    if (this.cloneNode === null) {
                        //if( Math.abs(x-this.ox) + Math.abs(y-this.oy) > 50 ) {
                        this.getClone();
                    }
                    if (this.cloneNode) {
                        this.cloneNode.style.left = (x - this.dx) + "px";
                        this.cloneNode.style.top = (y - this.dy) + "px";
                        let visibility = this.cloneNode.style.visibility;
                        this.cloneNode.style.visibility = "hidden";
                        // let L = <Array<Element>>myDoc.elementsFromPoint(x-window.pageXOffset, y-window.pageYOffset);
                        element = DragDropUtils_1.myDoc.elementFromPoint(x, y); //(x-window.pageXOffset, y-window.pageYOffset);
                        //console.log( "element", element );
                        this.cloneNode.style.visibility = visibility;
                        this.possibleDropZones.forEach(dz => dz.removePointerHover(this.idPointer));
                        while (element) {
                            // Check if we are on top of a dropZone
                            this.currentDropZone = this.possibleDropZones.get(element);
                            if (this.currentDropZone) {
                                this.currentDropZone.appendPointerHover(this.idPointer);
                                break;
                            }
                            element = element.parentElement;
                        }
                    }
                    return this;
                }
                getClone() {
                    if (this.cloneNode === null) {
                        this.cloneNode = this.root.cloneNode(true);
                        document.body.appendChild(this.cloneNode);
                        this.cloneNode.style.position = "absolute";
                        this.cloneNode.style.zIndex = "999";
                        this.cloneNode.classList.add("alx-cloneNode");
                    }
                    return this.cloneNode;
                }
            };
            __decorate([
                core_1.Input("alx-draggable"), 
                __metadata('design:type', Object)
            ], AlxDraggable.prototype, "data", void 0);
            __decorate([
                core_1.HostListener("mousedown", ["$event"]), 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', [MouseEvent]), 
                __metadata('design:returntype', void 0)
            ], AlxDraggable.prototype, "onMouseDown", null);
            __decorate([
                core_1.HostListener("touchstart", ["$event"]), 
                __metadata('design:type', Function), 
                __metadata('design:paramtypes', [Object]), 
                __metadata('design:returntype', void 0)
            ], AlxDraggable.prototype, "onTouchStart", null);
            AlxDraggable = __decorate([
                core_1.Directive({
                    selector: "*[alx-draggable]"
                }), 
                __metadata('design:paramtypes', [core_1.ElementRef])
            ], AlxDraggable);
            exports_1("AlxDraggable", AlxDraggable);
            AlxDropzone = class AlxDropzone {
                constructor(el) {
                    this.onDropEmitter = new core_1.EventEmitter();
                    // CSS when canDrop and startdraggable
                    this.dropCandidateofPointers = [];
                    this.pointersHover = [];
                    if (!dragDropInit) {
                        console.error("You should add one alx-dragdrop attribute to your code before using alx-dropzone");
                    }
                    this.root = el.nativeElement;
                    this.acceptFct = YES;
                    DM.registerDropZone(this);
                }
                drop(obj) {
                    console.log(this, "drop", obj);
                    this.onDropEmitter.emit(obj);
                }
                checkAccept(drag) {
                    let res = this.acceptFct(drag.data);
                    return res;
                }
                appendPointerHover(idPointer) {
                    if (this.pointersHover.indexOf(idPointer) === -1) {
                        this.pointersHover.push(idPointer);
                        if (this.dragHoverCSS) {
                            this.root.classList.add(this.dragHoverCSS);
                        }
                    }
                }
                removePointerHover(idPointer) {
                    let pos = this.pointersHover.indexOf(idPointer);
                    if (pos >= 0) {
                        this.pointersHover.splice(pos, 1);
                        if (this.pointersHover.length === 0 && this.dragHoverCSS) {
                            this.root.classList.remove(this.dragHoverCSS);
                        }
                    }
                }
                appendDropCandidatePointer(idPointer) {
                    //console.log( "appendDropCandidatePointer", idPointer, this );
                    if (this.dropCandidateofPointers.indexOf(idPointer) === -1) {
                        this.dropCandidateofPointers.push(idPointer);
                        //console.log( "\tadd class", this.dragStartCSS );
                        if (this.dragStartCSS) {
                            this.root.classList.add(this.dragStartCSS);
                        }
                    }
                }
                removeDropCandidatePointer(idPointer) {
                    let pos = this.dropCandidateofPointers.indexOf(idPointer);
                    if (pos >= 0) {
                        this.dropCandidateofPointers.splice(pos, 1);
                        if (this.dropCandidateofPointers.length === 0 && this.dragStartCSS) {
                            this.root.classList.remove(this.dragStartCSS);
                        }
                    }
                }
                ngOnInit() {
                    //console.log( "Init dropzone", this.dragStartCSS, this );
                    //this.root.style
                }
            };
            __decorate([
                core_1.Input("alx-accept-fct"), 
                __metadata('design:type', Function)
            ], AlxDropzone.prototype, "acceptFct", void 0);
            __decorate([
                // = (data) => true;
                core_1.Input("alx-dragstart-css"), 
                __metadata('design:type', String)
            ], AlxDropzone.prototype, "dragStartCSS", void 0);
            __decorate([
                core_1.Input("alx-draghover-css"), 
                __metadata('design:type', String)
            ], AlxDropzone.prototype, "dragHoverCSS", void 0);
            __decorate([
                core_1.Output("alx-ondrop"), 
                __metadata('design:type', Object)
            ], AlxDropzone.prototype, "onDropEmitter", void 0);
            AlxDropzone = __decorate([
                core_1.Directive({ selector: "*[alx-dropzone]" }), 
                __metadata('design:paramtypes', [core_1.ElementRef])
            ], AlxDropzone);
            exports_1("AlxDropzone", AlxDropzone);
        }
    }
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRyYWdEcm9wL0RpcmVjdGl2ZXNEcmFnRHJvcC50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O3FCQTJESSxFQUFFLEVBRUYsWUFBWTtJQTBKaEIsb0RBQW9EO0lBQ3BELGFBQWEsSUFBSSxJQUFHLE1BQU0sQ0FBQyxJQUFJLENBQUMsQ0FBQSxDQUFDOzs7Ozs7Ozs7O1lBcE5XLENBQUM7WUFDN0M7Ozs7Ozs7Ozs7OztpQkFZSztZQUVMO2dCQUFBO29CQUNJLHNCQUFpQixHQUFLLElBQUksR0FBRyxFQUF3QixDQUFDO29CQUN0RCxjQUFTLEdBQWEsSUFBSSxHQUFHLEVBQXlCLENBQUM7Z0JBcUMzRCxDQUFDO2dCQXBDRyxrQkFBa0I7Z0JBQ1gsU0FBUyxDQUFDLFNBQWlCLEVBQUUsT0FBcUI7b0JBQ3JELElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsU0FBUyxFQUFFLE9BQU8sQ0FBQyxDQUFDO29CQUMvQyxJQUFJLGlCQUFpQixHQUFHLElBQUksR0FBRyxFQUF3QixDQUFDO29CQUN4RCxJQUFJLENBQUMsU0FBUyxDQUFDLE9BQU8sQ0FBRSxFQUFFO3dCQUN0QixFQUFFLENBQUEsQ0FBRSxFQUFFLENBQUMsV0FBVyxDQUFDLE9BQU8sQ0FBRSxDQUFDLENBQUMsQ0FBQzs0QkFDM0IsRUFBRSxDQUFDLDBCQUEwQixDQUFFLFNBQVMsQ0FBRSxDQUFDOzRCQUMzQyxpQkFBaUIsQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLElBQUksRUFBRSxFQUFFLENBQUMsQ0FBQzt3QkFDdkMsQ0FBQztvQkFDTCxDQUFDLENBQUUsQ0FBQztvQkFDSixNQUFNLENBQUMsaUJBQWlCLENBQUM7Z0JBQzdCLENBQUM7Z0JBQ00sc0JBQXNCLENBQUMsT0FBZ0I7b0JBQzFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBRSxPQUFPLENBQUUsQ0FBQztnQkFDekMsQ0FBQztnQkFDTSxnQkFBZ0IsQ0FBRSxRQUFxQjtvQkFDMUMs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QUMsZ0JBQVMsQ0FBQyxFQUFFLFFBQVEsRUFBRSxpQkFBaUIsRUFBRSxDQUFDOzsyQkFBQTtZQUMzQyxxQ0FrRUMsQ0FBQSIsImZpbGUiOiJEcmFnRHJvcC9EaXJlY3RpdmVzRHJhZ0Ryb3AuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0RpcmVjdGl2ZSwgRWxlbWVudFJlZiwgSW5wdXQsIEhvc3RMaXN0ZW5lciwgRXZlbnRFbWl0dGVyLCBPdXRwdXR9IGZyb20gXCJAYW5ndWxhci9jb3JlXCI7XG5pbXBvcnQge215RG9jfSBmcm9tIFwiLi9EcmFnRHJvcFV0aWxzXCI7XG5cbi8qIFBvbHlmaWxsIFRvdWNoRXZlbnQgKi9cbmludGVyZmFjZSBNeVRvdWNoRXZlbnQgZXh0ZW5kcyBUb3VjaEV2ZW50IHt9O1xuLypcbiBpbnRlcmZhY2UgU2hhZG93Um9vdCBleHRlbmRzIERvY3VtZW50RnJhZ21lbnQge1xuIHN0eWxlU2hlZXRzICAgICA6IFN0eWxlU2hlZXRMaXN0O1xuIGlubmVySFRNTCAgICAgICA6IHN0cmluZztcbiBob3N0ICAgICAgICAgICAgOiBFbGVtZW50O1xuIGFjdGl2ZUVsZW1lbnQgICA6IEVsZW1lbnQ7XG4gZWxlbWVudEZyb21Qb2ludCAgICAgICAgKHggOiBudW1iZXIsIHkgOiBudW1iZXIpIDogRWxlbWVudDtcbiBlbGVtZW50c0Zyb21Qb2ludCAgICAgICAoeCA6IG51bWJlciwgeSA6IG51bWJlcikgOiBFbGVtZW50W107XG4gY2FyZXRQb3NpdGlvbkZyb21Qb2ludCAgKHggOiBudW1iZXIsIHkgOiBudW1iZXIpOyAvLyA9PiBDYXJldFBvc2l0aW9uXG4gfTtcbiBpbnRlcmZhY2UgRWxlbWVudFdpdGhTaGFkb3dSb290IGV4dGVuZHMgSFRNTEVsZW1lbnQge1xuIHNoYWRvd1Jvb3QgIDogU2hhZG93Um9vdDtcbiB9OyovXG5cbmNsYXNzIERyYWdNYW5hZ2VyIHtcbiAgICBkcmFnZ2VkU3RydWN0dXJlcyAgID0gbmV3IE1hcDxzdHJpbmcsIEFseERyYWdnYWJsZT4oKTtcbiAgICBkcm9wWm9uZXMgICAgICAgICAgID0gbmV3IE1hcDxFbGVtZW50LCBBbHhEcm9wem9uZSA+KCk7XG4gICAgLy9jb25zdHJ1Y3RvcigpIHt9XG4gICAgcHVibGljIHN0YXJ0RHJhZyhpZFBvaW50ZXI6IHN0cmluZywgZHJhZ2dlZDogQWx4RHJhZ2dhYmxlKSA6IE1hcDxFbGVtZW50LCBBbHhEcm9wem9uZT4ge1xuICAgICAgICB0aGlzLmRyYWdnZWRTdHJ1Y3R1cmVzLnNldChpZFBvaW50ZXIsIGRyYWdnZWQpO1xuICAgICAgICBsZXQgcG9zc2libGVEcm9wWm9uZXMgPSBuZXcgTWFwPEVsZW1lbnQsIEFseERyb3B6b25lPigpO1xuICAgICAgICB0aGlzLmRyb3Bab25lcy5mb3JFYWNoKCBkeiA9PiB7XG4gICAgICAgICAgICBpZiggZHouY2hlY2tBY2NlcHQoZHJhZ2dlZCkgKSB7XG4gICAgICAgICAgICAgICAgZHouYXBwZW5kRHJvcENhbmRpZGF0ZVBvaW50ZXIoIGlkUG9pbnRlciApO1xuICAgICAgICAgICAgICAgIHBvc3NpYmxlRHJvcFpvbmVzLnNldChkei5yb290LCBkeik7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gKTtcbiAgICAgICAgcmV0dXJuIHBvc3NpYmxlRHJvcFpvbmVzO1xuICAgIH1cbiAgICBwdWJsaWMgaXNBc3NvY2lhdGVkVG9Ecm9wWm9uZShlbGVtZW50OiBFbGVtZW50KSA6IGJvb2xlYW4ge1xuICAgICAgICByZXR1cm4gdGhpcy5kcm9wWm9uZXMuaGFzKCBlbGVtZW50ICk7XG4gICAgfVxuICAgIHB1YmxpYyByZWdpc3RlckRyb3Bab25lKCBkcm9wem9uZTogQWx4RHJvcHpvbmUgKSB7XG4gICAgICAgIHRoaXMuZHJvcFpvbmVzLnNldChkcm9wem9uZS5yb290LCBkcm9wem9uZSk7XG4gICAgfVxuICAgIHB1YmxpYyB1bnJlZ2lzdGVyRHJvcFpvbmUoIGRyb3B6b25lOiBBbHhEcm9wem9uZSApIHtcbiAgICAgICAgdGhpcy5kcm9wWm9uZXMuZGVsZXRlKGRyb3B6b25lLnJvb3QpO1xuICAgIH1cbiAgICBwdWJsaWMgcG9pbnRlck1vdmUoaWRQb2ludGVyOiBzdHJpbmcsIHg6IG51bWJlciwgeTogbnVtYmVyKSA6IGJvb2xlYW4ge1xuICAgICAgICBsZXQgZHJhZ2dlZCA9IHRoaXMuZHJhZ2dlZFN0cnVjdHVyZXMuZ2V0KGlkUG9pbnRlcik7XG4gICAgICAgIGlmKGRyYWdnZWQpIHtcbiAgICAgICAgICAgIGRyYWdnZWQubW92ZSh4LCB5KTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gZHJhZ2dlZCAhPT0gdW5kZWZpbmVkO1xuICAgIH1cbiAgICBwdWJsaWMgcG9pbnRlclJlbGVhc2UoaWRQb2ludGVyOiBzdHJpbmcpIDogYm9vbGVhbiB7XG4gICAgICAgIGxldCBkcmFnZ2VkID0gdGhpcy5kcmFnZ2VkU3RydWN0dXJlcy5nZXQoaWRQb2ludGVyKTtcbiAgICAgICAgaWYoZHJhZ2dlZCkge1xuICAgICAgICAgICAgZHJhZ2dlZC5zdG9wKCk7XG4gICAgICAgICAgICB0aGlzLmRyYWdnZWRTdHJ1Y3R1cmVzLmRlbGV0ZShpZFBvaW50ZXIpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBkcmFnZ2VkICE9PSB1bmRlZmluZWQ7XG4gICAgfVxufTtcbmxldCBETSA9IG5ldyBEcmFnTWFuYWdlcigpO1xuXG5sZXQgZHJhZ0Ryb3BJbml0ID0gZmFsc2U7XG5ARGlyZWN0aXZlKHtcbiAgICBzZWxlY3RvcjogXCIqW2FseC1kcmFnZHJvcF1cIlxufSlcbmV4cG9ydCBjbGFzcyBBbHhEcmFnRHJvcCB7XG4gICAgY29uc3RydWN0b3IoKSB7XG4gICAgICAgIGlmKGRyYWdEcm9wSW5pdCkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvciggXCJEbyBub3QgY3JlYXRlIG11bHRpcGxlIGluc3RhbmNlIG9mIGRpcmVjdGl2ZSBhbHgtZHJhZ2Ryb3AgIVwiICk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBjb25zb2xlLmxvZyggXCJBbHhEcmFnRHJvcCBlbmFibGVkICFcIik7XG4gICAgICAgICAgICBkcmFnRHJvcEluaXQgPSB0cnVlO1xuICAgICAgICB9XG4gICAgfVxuICAgIEBIb3N0TGlzdGVuZXIoIFwiZG9jdW1lbnQ6IG1vdXNlbW92ZVwiLCBbXCIkZXZlbnRcIl0gKSBtb3VzZW1vdmUoIGUgKSB7XG4gICAgICAgIERNLnBvaW50ZXJNb3ZlICAgKFwibW91c2VcIiwgZS5jbGllbnRYLCBlLmNsaWVudFkpO1xuICAgIH1cbiAgICBASG9zdExpc3RlbmVyKCBcImRvY3VtZW50OiBtb3VzZXVwXCIgICwgW1wiJGV2ZW50XCJdICkgbW91c2V1cCAgKCBlICkge1xuICAgICAgICBETS5wb2ludGVyUmVsZWFzZShcIm1vdXNlXCIpO1xuICAgIH1cbiAgICBASG9zdExpc3RlbmVyKCBcImRvY3VtZW50OiB0b3VjaG1vdmVcIiwgW1wiJGV2ZW50XCJdICkgdG91Y2htb3ZlKCBlICkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGUuY2hhbmdlZFRvdWNoZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgIGxldCB0b3VjaDpUb3VjaCA9IGUuY2hhbmdlZFRvdWNoZXMuaXRlbShpKTtcbiAgICAgICAgICAgIGlmIChETS5wb2ludGVyTW92ZSh0b3VjaC5pZGVudGlmaWVyLnRvU3RyaW5nKCksIHRvdWNoLmNsaWVudFgsIHRvdWNoLmNsaWVudFkpKSB7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIGUuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgQEhvc3RMaXN0ZW5lciggXCJkb2N1bWVudDogdG91Y2hlbmRcIiAsIFtcIiRldmVudFwiXSApIHRvdWNoZW5kICggZSApIHtcbiAgICAgICAgZm9yKGxldCBpPTA7IGk8ZS5jaGFuZ2VkVG91Y2hlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgbGV0IHRvdWNoIDogVG91Y2ggPSBlLmNoYW5nZWRUb3VjaGVzLml0ZW0oaSk7XG4gICAgICAgICAgICBpZiggRE0ucG9pbnRlclJlbGVhc2UodG91Y2guaWRlbnRpZmllci50b1N0cmluZygpKSApIHtcbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgZS5zdG9wUHJvcGFnYXRpb24oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbn1cblxuQERpcmVjdGl2ZSh7XG4gICAgc2VsZWN0b3I6IFwiKlthbHgtZHJhZ2dhYmxlXVwiXG59KVxuZXhwb3J0IGNsYXNzIEFseERyYWdnYWJsZSB7XG4gICAgQElucHV0KFwiYWx4LWRyYWdnYWJsZVwiKSBkYXRhOiBhbnk7XG4gICAgcHJpdmF0ZSBpc0JlaW5nRHJhZ2dlZCA6IGJvb2xlYW4gPSBmYWxzZTtcbiAgICBwcml2YXRlIGNsb25lTm9kZSAgIDogSFRNTEVsZW1lbnQgPSBudWxsO1xuICAgIHByaXZhdGUgcG9zc2libGVEcm9wWm9uZXMgPSBuZXcgTWFwPEVsZW1lbnQsIEFseERyb3B6b25lPigpO1xuICAgIHByaXZhdGUgY3VycmVudERyb3Bab25lIDogQWx4RHJvcHpvbmU7XG4gICAgcHJpdmF0ZSBkeCA6IG51bWJlcjtcbiAgICBwcml2YXRlIGR5IDogbnVtYmVyO1xuICAgIHByaXZhdGUgb3ggOiBudW1iZXI7XG4gICAgcHJpdmF0ZSBveSA6IG51bWJlcjtcbiAgICBwcml2YXRlIHR4IDogbnVtYmVyO1xuICAgIHByaXZhdGUgdHkgOiBudW1iZXI7XG4gICAgcHJpdmF0ZSBpZFBvaW50ZXIgOiBzdHJpbmc7XG4gICAgcHJpdmF0ZSByb290IDogSFRNTEVsZW1lbnQ7XG4gICAgY29uc3RydWN0b3IoZWw6IEVsZW1lbnRSZWYpIHtcbiAgICAgICAgdGhpcy5yb290ID0gZWwubmF0aXZlRWxlbWVudDtcbiAgICAgICAgaWYoIWRyYWdEcm9wSW5pdCkge1xuICAgICAgICAgICAgY29uc29sZS5lcnJvcihcIllvdSBzaG91bGQgYWRkIG9uZSBhbHgtZHJhZ2Ryb3AgYXR0cmlidXRlIHRvIHlvdXIgY29kZSBiZWZvcmUgdXNpbmcgYWx4LWRyYWdnYWJsZVwiKTtcbiAgICAgICAgfVxuICAgICAgICAvL2NvbnNvbGUubG9nKCBcIm5ldyBpbnN0YW5jZSBvZiBBbHhEcmFnZ2FibGVcIiwgdGhpcyApO1xuICAgIH1cbiAgICBuZ09uRGVzdHJveSgpIHtcbiAgICAgICAgdGhpcy5zdG9wKCk7XG4gICAgfVxuICAgIEBIb3N0TGlzdGVuZXIoXCJtb3VzZWRvd25cIiAsIFtcIiRldmVudFwiXSkgb25Nb3VzZURvd24gKGV2ZW50IDogTW91c2VFdmVudCkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKFwibW91c2Vkb3duIG9uXCIsIHRoaXMsIGV2ZW50KTtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIHRoaXMuc3RhcnQoXCJtb3VzZVwiLCBldmVudC5jbGllbnRYLCBldmVudC5jbGllbnRZKTtcbiAgICB9XG4gICAgQEhvc3RMaXN0ZW5lcihcInRvdWNoc3RhcnRcIiwgW1wiJGV2ZW50XCJdKSBvblRvdWNoU3RhcnQoZXZlbnQ6IE15VG91Y2hFdmVudCkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKFwidG91Y2hzdGFydCBvblwiLCB0aGlzKTtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG4gICAgICAgIGZvcihsZXQgaT0wOyBpPGV2ZW50LmNoYW5nZWRUb3VjaGVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBsZXQgdG91Y2ggOiBUb3VjaCA9IGV2ZW50LmNoYW5nZWRUb3VjaGVzLml0ZW0oaSk7XG4gICAgICAgICAgICB0aGlzLnN0YXJ0KHRvdWNoLmlkZW50aWZpZXIudG9TdHJpbmcoKSwgdG91Y2guY2xpZW50WCwgdG91Y2guY2xpZW50WSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgc3RhcnQoaWRQb2ludGVyOiBzdHJpbmcsIHg6IG51bWJlciwgeTogbnVtYmVyKSB7XG4gICAgICAgIGlmKCAhdGhpcy5pc0JlaW5nRHJhZ2dlZCApIHtcbiAgICAgICAgICAgIHRoaXMuaXNCZWluZ0RyYWdnZWQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5pZFBvaW50ZXIgPSBpZFBvaW50ZXI7XG4gICAgICAgICAgICBsZXQgYmJveCA9IHRoaXMucm9vdC5nZXRCb3VuZGluZ0NsaWVudFJlY3QoKTtcbiAgICAgICAgICAgIHRoaXMub3ggPSB4OyB0aGlzLm95ID0geTtcbiAgICAgICAgICAgIHRoaXMuZHggPSB4IC0gTWF0aC5yb3VuZChiYm94LmxlZnQgKyB3aW5kb3cucGFnZVhPZmZzZXQpO1xuICAgICAgICAgICAgdGhpcy5keSA9IHkgLSBNYXRoLnJvdW5kKGJib3gudG9wICArIHdpbmRvdy5wYWdlWU9mZnNldCk7XG4gICAgICAgICAgICB0aGlzLnR4ID0gYmJveC53aWR0aDtcbiAgICAgICAgICAgIHRoaXMudHkgPSBiYm94LmhlaWdodDsvLyBjb25zb2xlLmxvZyggXCJkcmFnXCIsIHRoaXMudHgsIGJib3gucmlnaHQgLSBiYm94LmxlZnQgKTtcbiAgICAgICAgICAgIHRoaXMucG9zc2libGVEcm9wWm9uZXMgPSBETS5zdGFydERyYWcoaWRQb2ludGVyLCB0aGlzKTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBzdG9wKCkge1xuICAgICAgICB0aGlzLmlzQmVpbmdEcmFnZ2VkID0gZmFsc2U7XG4gICAgICAgIGlmKHRoaXMuY2xvbmVOb2RlKSB7XG4gICAgICAgICAgICBpZih0aGlzLmNsb25lTm9kZS5wYXJlbnROb2RlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5jbG9uZU5vZGUucGFyZW50Tm9kZS5yZW1vdmVDaGlsZCh0aGlzLmNsb25lTm9kZSk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLmNsb25lTm9kZSA9IG51bGw7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5wb3NzaWJsZURyb3Bab25lcy5mb3JFYWNoKCBkeiA9PiB7XG4gICAgICAgICAgICBkei5yZW1vdmVEcm9wQ2FuZGlkYXRlUG9pbnRlciAgICh0aGlzLmlkUG9pbnRlcik7XG4gICAgICAgICAgICBkei5yZW1vdmVQb2ludGVySG92ZXIgICAgICAgICAgICh0aGlzLmlkUG9pbnRlcik7XG4gICAgICAgIH0gKTtcbiAgICAgICAgdGhpcy5wb3NzaWJsZURyb3Bab25lcy5jbGVhcigpO1xuICAgICAgICB0aGlzLmlkUG9pbnRlciA9IG51bGw7XG4gICAgICAgIGlmKHRoaXMuY3VycmVudERyb3Bab25lKSB7XG4gICAgICAgICAgICB0aGlzLmN1cnJlbnREcm9wWm9uZS5kcm9wKCB0aGlzLmRhdGEgKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLmN1cnJlbnREcm9wWm9uZSA9IG51bGw7XG4gICAgfVxuICAgIG1vdmUoeDogbnVtYmVyLCB5OiBudW1iZXIpIDogdGhpcyB7XG4gICAgICAgIGxldCBlbGVtZW50IDogRWxlbWVudCA9IG51bGw7XG4gICAgICAgIGlmKHRoaXMuY2xvbmVOb2RlID09PSBudWxsKSB7XG4gICAgICAgICAgICAvL2lmKCBNYXRoLmFicyh4LXRoaXMub3gpICsgTWF0aC5hYnMoeS10aGlzLm95KSA+IDUwICkge1xuICAgICAgICAgICAgdGhpcy5nZXRDbG9uZSgpO1xuICAgICAgICAgICAgLy99XG4gICAgICAgIH1cbiAgICAgICAgaWYodGhpcy5jbG9uZU5vZGUpIHtcbiAgICAgICAgICAgIHRoaXMuY2xvbmVOb2RlLnN0eWxlLmxlZnQgPSAoeCAtIHRoaXMuZHgpICsgXCJweFwiO1xuICAgICAgICAgICAgdGhpcy5jbG9uZU5vZGUuc3R5bGUudG9wICA9ICh5IC0gdGhpcy5keSkgKyBcInB4XCI7XG4gICAgICAgICAgICBsZXQgdmlzaWJpbGl0eSA9IHRoaXMuY2xvbmVOb2RlLnN0eWxlLnZpc2liaWxpdHk7XG4gICAgICAgICAgICB0aGlzLmNsb25lTm9kZS5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjtcbiAgICAgICAgICAgIC8vIGxldCBMID0gPEFycmF5PEVsZW1lbnQ+Pm15RG9jLmVsZW1lbnRzRnJvbVBvaW50KHgtd2luZG93LnBhZ2VYT2Zmc2V0LCB5LXdpbmRvdy5wYWdlWU9mZnNldCk7XG4gICAgICAgICAgICBlbGVtZW50ID0gbXlEb2MuZWxlbWVudEZyb21Qb2ludCh4LCB5KTsgLy8oeC13aW5kb3cucGFnZVhPZmZzZXQsIHktd2luZG93LnBhZ2VZT2Zmc2V0KTtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coIFwiZWxlbWVudFwiLCBlbGVtZW50ICk7XG4gICAgICAgICAgICB0aGlzLmNsb25lTm9kZS5zdHlsZS52aXNpYmlsaXR5ID0gdmlzaWJpbGl0eTtcbiAgICAgICAgICAgIHRoaXMucG9zc2libGVEcm9wWm9uZXMuZm9yRWFjaCggZHogPT4gZHoucmVtb3ZlUG9pbnRlckhvdmVyKHRoaXMuaWRQb2ludGVyKSApO1xuICAgICAgICAgICAgd2hpbGUoZWxlbWVudCkge1xuICAgICAgICAgICAgICAgIC8vIENoZWNrIGlmIHdlIGFyZSBvbiB0b3Agb2YgYSBkcm9wWm9uZVxuICAgICAgICAgICAgICAgIHRoaXMuY3VycmVudERyb3Bab25lID0gdGhpcy5wb3NzaWJsZURyb3Bab25lcy5nZXQoIGVsZW1lbnQgKTtcbiAgICAgICAgICAgICAgICBpZih0aGlzLmN1cnJlbnREcm9wWm9uZSkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLmN1cnJlbnREcm9wWm9uZS5hcHBlbmRQb2ludGVySG92ZXIoIHRoaXMuaWRQb2ludGVyICk7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbGVtZW50ID0gPEVsZW1lbnQ+ZWxlbWVudC5wYXJlbnRFbGVtZW50O1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH1cbiAgICBnZXRDbG9uZSgpIDogTm9kZSB7XG4gICAgICAgIGlmKHRoaXMuY2xvbmVOb2RlID09PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLmNsb25lTm9kZSA9IDxIVE1MRWxlbWVudD50aGlzLnJvb3QuY2xvbmVOb2RlKHRydWUpO1xuICAgICAgICAgICAgZG9jdW1lbnQuYm9keS5hcHBlbmRDaGlsZCggdGhpcy5jbG9uZU5vZGUgKTtcbiAgICAgICAgICAgIHRoaXMuY2xvbmVOb2RlLnN0eWxlLnBvc2l0aW9uICAgPSBcImFic29sdXRlXCI7XG4gICAgICAgICAgICB0aGlzLmNsb25lTm9kZS5zdHlsZS56SW5kZXggICAgID0gXCI5OTlcIjtcbiAgICAgICAgICAgIHRoaXMuY2xvbmVOb2RlLmNsYXNzTGlzdC5hZGQoIFwiYWx4LWNsb25lTm9kZVwiICk7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXMuY2xvbmVOb2RlO1xuICAgIH1cbn1cblxuLy8gZnVuY3Rpb24gbm9BY2NlcHRGY3QoZHJhZ2dlZERhdGEpIHtyZXR1cm4gZmFsc2U7fVxuZnVuY3Rpb24gWUVTKGRhdGEpIHtyZXR1cm4gdHJ1ZTt9XG5ARGlyZWN0aXZlKHsgc2VsZWN0b3I6IFwiKlthbHgtZHJvcHpvbmVdXCIgfSlcbmV4cG9ydCBjbGFzcyBBbHhEcm9wem9uZSB7XG4gICAgcHVibGljIHJvb3QgOiBIVE1MRWxlbWVudDtcbiAgICBASW5wdXQoXCJhbHgtYWNjZXB0LWZjdFwiKSAgICBhY2NlcHRGY3QgOiBGdW5jdGlvbjsgLy8gPSAoZGF0YSkgPT4gdHJ1ZTtcbiAgICBASW5wdXQoXCJhbHgtZHJhZ3N0YXJ0LWNzc1wiKSBkcmFnU3RhcnRDU1MgOiBzdHJpbmc7XG4gICAgQElucHV0KFwiYWx4LWRyYWdob3Zlci1jc3NcIikgZHJhZ0hvdmVyQ1NTIDogc3RyaW5nO1xuICAgIEBPdXRwdXQoXCJhbHgtb25kcm9wXCIpICAgICAgIG9uRHJvcEVtaXR0ZXIgPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgICAvLyBDU1Mgd2hlbiBjYW5Ecm9wIGFuZCBzdGFydGRyYWdnYWJsZVxuICAgIHByaXZhdGUgZHJvcENhbmRpZGF0ZW9mUG9pbnRlcnMgOiBBcnJheTxzdHJpbmc+ID0gW107XG4gICAgcHJpdmF0ZSBwb2ludGVyc0hvdmVyICAgICAgICAgICA6IEFycmF5PHN0cmluZz4gPSBbXTtcbiAgICBjb25zdHJ1Y3RvcihlbDogRWxlbWVudFJlZikge1xuICAgICAgICBpZighZHJhZ0Ryb3BJbml0KSB7XG4gICAgICAgICAgICBjb25zb2xlLmVycm9yKFwiWW91IHNob3VsZCBhZGQgb25lIGFseC1kcmFnZHJvcCBhdHRyaWJ1dGUgdG8geW91ciBjb2RlIGJlZm9yZSB1c2luZyBhbHgtZHJvcHpvbmVcIik7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5yb290ID0gZWwubmF0aXZlRWxlbWVudDtcbiAgICAgICAgdGhpcy5hY2NlcHRGY3QgPSBZRVM7XG4gICAgICAgIERNLnJlZ2lzdGVyRHJvcFpvbmUodGhpcyk7XG4gICAgfVxuICAgIGRyb3AoIG9iaiApIHtcbiAgICAgICAgY29uc29sZS5sb2coIHRoaXMsIFwiZHJvcFwiLCBvYmogKTtcbiAgICAgICAgdGhpcy5vbkRyb3BFbWl0dGVyLmVtaXQoIG9iaiApO1xuICAgIH1cbiAgICBjaGVja0FjY2VwdChkcmFnOiBBbHhEcmFnZ2FibGUpIDogYm9vbGVhbiB7XG4gICAgICAgIGxldCByZXMgPSB0aGlzLmFjY2VwdEZjdCggZHJhZy5kYXRhICk7XG4gICAgICAgIHJldHVybiByZXM7XG4gICAgfVxuICAgIGFwcGVuZFBvaW50ZXJIb3ZlciggaWRQb2ludGVyOiBzdHJpbmcgKSB7XG4gICAgICAgIGlmKCB0aGlzLnBvaW50ZXJzSG92ZXIuaW5kZXhPZihpZFBvaW50ZXIpID09PSAtMSApIHtcbiAgICAgICAgICAgIHRoaXMucG9pbnRlcnNIb3Zlci5wdXNoKGlkUG9pbnRlcik7XG4gICAgICAgICAgICBpZih0aGlzLmRyYWdIb3ZlckNTUykge1xuICAgICAgICAgICAgICAgIHRoaXMucm9vdC5jbGFzc0xpc3QuYWRkKCB0aGlzLmRyYWdIb3ZlckNTUyApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJlbW92ZVBvaW50ZXJIb3ZlciggaWRQb2ludGVyOiBzdHJpbmcgKSB7XG4gICAgICAgIGxldCBwb3MgPSB0aGlzLnBvaW50ZXJzSG92ZXIuaW5kZXhPZihpZFBvaW50ZXIpO1xuICAgICAgICBpZiggcG9zID49IDAgKSB7XG4gICAgICAgICAgICB0aGlzLnBvaW50ZXJzSG92ZXIuc3BsaWNlKHBvcywgMSk7XG4gICAgICAgICAgICBpZih0aGlzLnBvaW50ZXJzSG92ZXIubGVuZ3RoID09PSAwICYmIHRoaXMuZHJhZ0hvdmVyQ1NTKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5yb290LmNsYXNzTGlzdC5yZW1vdmUoIHRoaXMuZHJhZ0hvdmVyQ1NTICk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG4gICAgYXBwZW5kRHJvcENhbmRpZGF0ZVBvaW50ZXIoIGlkUG9pbnRlcjogc3RyaW5nICkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKCBcImFwcGVuZERyb3BDYW5kaWRhdGVQb2ludGVyXCIsIGlkUG9pbnRlciwgdGhpcyApO1xuICAgICAgICBpZiggdGhpcy5kcm9wQ2FuZGlkYXRlb2ZQb2ludGVycy5pbmRleE9mKGlkUG9pbnRlcikgPT09IC0xICkge1xuICAgICAgICAgICAgdGhpcy5kcm9wQ2FuZGlkYXRlb2ZQb2ludGVycy5wdXNoKCBpZFBvaW50ZXIgKTtcbiAgICAgICAgICAgIC8vY29uc29sZS5sb2coIFwiXFx0YWRkIGNsYXNzXCIsIHRoaXMuZHJhZ1N0YXJ0Q1NTICk7XG4gICAgICAgICAgICBpZih0aGlzLmRyYWdTdGFydENTUykge1xuICAgICAgICAgICAgICAgIHRoaXMucm9vdC5jbGFzc0xpc3QuYWRkKCB0aGlzLmRyYWdTdGFydENTUyApO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuICAgIHJlbW92ZURyb3BDYW5kaWRhdGVQb2ludGVyKCBpZFBvaW50ZXI6IHN0cmluZyApIHtcbiAgICAgICAgbGV0IHBvcyA9IHRoaXMuZHJvcENhbmRpZGF0ZW9mUG9pbnRlcnMuaW5kZXhPZihpZFBvaW50ZXIpO1xuICAgICAgICBpZiggcG9zID49IDAgKSB7XG4gICAgICAgICAgICB0aGlzLmRyb3BDYW5kaWRhdGVvZlBvaW50ZXJzLnNwbGljZShwb3MsIDEpO1xuICAgICAgICAgICAgaWYodGhpcy5kcm9wQ2FuZGlkYXRlb2ZQb2ludGVycy5sZW5ndGggPT09IDAgJiYgdGhpcy5kcmFnU3RhcnRDU1MpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJvb3QuY2xhc3NMaXN0LnJlbW92ZSggdGhpcy5kcmFnU3RhcnRDU1MgKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cbiAgICBuZ09uSW5pdCgpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZyggXCJJbml0IGRyb3B6b25lXCIsIHRoaXMuZHJhZ1N0YXJ0Q1NTLCB0aGlzICk7XG4gICAgICAgIC8vdGhpcy5yb290LnN0eWxlXG4gICAgfVxufSJdLCJzb3VyY2VSb290IjoiIn0=
