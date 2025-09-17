declare module "leaflet-routing-machine";

import * as L from "leaflet";

declare module "leaflet" {
  namespace Routing {
    function control(options: any): any;
    function plan(waypoints: any, options?: any): any;
  }

  interface RoutingControl extends L.Control {
    getPlan(): any;
  }
}

