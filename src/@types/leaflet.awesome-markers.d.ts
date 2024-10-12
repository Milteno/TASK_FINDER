declare module "leaflet.awesome-markers" {
  import * as L from "leaflet";

  namespace AwesomeMarkers {
    interface IconOptions extends L.IconOptions {
      icon?: string;
      iconColor?: string;
      markerColor?: string;
      prefix?: string;
      extraClasses?: string;
      spin?: boolean;
    }

    class Icon extends L.Icon {
      constructor(options?: IconOptions);
    }

    function icon(options?: IconOptions): Icon;
  }

  export = AwesomeMarkers;
}