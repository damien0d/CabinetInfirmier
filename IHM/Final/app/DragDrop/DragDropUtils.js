System.register([], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var myDoc;
    return {
        setters:[],
        execute: function() {
            ;
            exports_1("myDoc", myDoc = document);
            //(<MyDocument>document).elementsFromPoint = (<MyDocument>document).elementsFromPoint ||
            myDoc.elementsFromPoint = myDoc.elementsFromPoint || function (x, y) {
                let element, elements = [];
                let old_visibility = [];
                while (true) {
                    element = document.elementFromPoint(x, y);
                    if (!element || element === document.documentElement) {
                        break;
                    }
                    elements.push(element);
                    old_visibility.push(element.style.visibility);
                    element.style.visibility = "hidden"; // Temporarily hide the element (without changing the layout)
                }
                for (let k = 0; k < elements.length; k++) {
                    elements[k].style.visibility = old_visibility[k];
                }
                return elements;
            };
        }
    }
});

//# sourceMappingURL=data:application/json;charset=utf8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkRyYWdEcm9wL0RyYWdEcm9wVXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7O1FBSVcsS0FBSzs7OztZQURmLENBQUM7WUFDUyxtQkFBQSxLQUFLLEdBQWUsUUFBUSxDQUFBLENBQUM7WUFFeEMsd0ZBQXdGO1lBQ3hGLEtBQUssQ0FBQyxpQkFBaUIsR0FBRyxLQUFLLENBQUMsaUJBQWlCLElBQUksVUFBUyxDQUFRLEVBQUUsQ0FBUTtnQkFDNUUsSUFBSSxPQUFPLEVBQUUsUUFBUSxHQUFHLEVBQUUsQ0FBQztnQkFDM0IsSUFBSSxjQUFjLEdBQUcsRUFBRSxDQUFDO2dCQUN4QixPQUFPLElBQUksRUFBRSxDQUFDO29CQUNWLE9BQU8sR0FBRyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDO29CQUMxQyxFQUFFLENBQUMsQ0FBQyxDQUFDLE9BQU8sSUFBSSxPQUFPLEtBQUssUUFBUSxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7d0JBQ25ELEtBQUssQ0FBQztvQkFDVixDQUFDO29CQUNELFFBQVEsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7b0JBQ3ZCLGNBQWMsQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFDOUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQUcsUUFBUSxDQUFDLENBQUMsNkRBQTZEO2dCQUN0RyxDQUFDO2dCQUNELEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsUUFBUSxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDO29CQUN2QyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUMsS0FBSyxDQUFDLFVBQVUsR0FBRyxjQUFjLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQ3JELENBQUM7Z0JBQ0QsTUFBTSxDQUFDLFFBQVEsQ0FBQztZQUNwQixDQUFDLENBQUMiLCJmaWxlIjoiRHJhZ0Ryb3AvRHJhZ0Ryb3BVdGlscy5qcyIsInNvdXJjZXNDb250ZW50IjpbIi8qIFBvbHlmaWxsICovXG5pbnRlcmZhY2UgTXlEb2N1bWVudCBleHRlbmRzIERvY3VtZW50IHtcbiAgICBlbGVtZW50c0Zyb21Qb2ludCh4Om51bWJlciwgeTpudW1iZXIpIDogQXJyYXk8RWxlbWVudD47XG59O1xuZXhwb3J0IGxldCBteURvYyA9IDxNeURvY3VtZW50PmRvY3VtZW50O1xuXG4vLyg8TXlEb2N1bWVudD5kb2N1bWVudCkuZWxlbWVudHNGcm9tUG9pbnQgPSAoPE15RG9jdW1lbnQ+ZG9jdW1lbnQpLmVsZW1lbnRzRnJvbVBvaW50IHx8XG5teURvYy5lbGVtZW50c0Zyb21Qb2ludCA9IG15RG9jLmVsZW1lbnRzRnJvbVBvaW50IHx8IGZ1bmN0aW9uKHg6bnVtYmVyLCB5Om51bWJlcikgOiBBcnJheTxFbGVtZW50PiB7XG4gICAgbGV0IGVsZW1lbnQsIGVsZW1lbnRzID0gW107XG4gICAgbGV0IG9sZF92aXNpYmlsaXR5ID0gW107XG4gICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgZWxlbWVudCA9IGRvY3VtZW50LmVsZW1lbnRGcm9tUG9pbnQoeCwgeSk7XG4gICAgICAgIGlmICghZWxlbWVudCB8fCBlbGVtZW50ID09PSBkb2N1bWVudC5kb2N1bWVudEVsZW1lbnQpIHtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICB9XG4gICAgICAgIGVsZW1lbnRzLnB1c2goZWxlbWVudCk7XG4gICAgICAgIG9sZF92aXNpYmlsaXR5LnB1c2goZWxlbWVudC5zdHlsZS52aXNpYmlsaXR5KTtcbiAgICAgICAgZWxlbWVudC5zdHlsZS52aXNpYmlsaXR5ID0gXCJoaWRkZW5cIjsgLy8gVGVtcG9yYXJpbHkgaGlkZSB0aGUgZWxlbWVudCAod2l0aG91dCBjaGFuZ2luZyB0aGUgbGF5b3V0KVxuICAgIH1cbiAgICBmb3IgKGxldCBrID0gMDsgayA8IGVsZW1lbnRzLmxlbmd0aDsgaysrKSB7XG4gICAgICAgIGVsZW1lbnRzW2tdLnN0eWxlLnZpc2liaWxpdHkgPSBvbGRfdmlzaWJpbGl0eVtrXTtcbiAgICB9XG4gICAgcmV0dXJuIGVsZW1lbnRzO1xufTtcbiJdLCJzb3VyY2VSb290IjoiIn0=
