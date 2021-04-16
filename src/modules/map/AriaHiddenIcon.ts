import L from "leaflet";

const AriaHiddenIcon = L.Icon.extend({
  _setIconStyles(img: HTMLImageElement, name: string) {
    // @ts-ignore
    L.Icon.prototype._setIconStyles.call(this, img, name);

    img.setAttribute("aria-hidden", "true");
  },
});

export default AriaHiddenIcon;
