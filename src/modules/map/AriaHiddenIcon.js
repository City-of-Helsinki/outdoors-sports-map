import { Icon } from 'leaflet';

export default Icon.extend({
  _setIconStyles(img, name) {
    Icon.prototype._setIconStyles.call(this, img, name);

    img.setAttribute('aria-hidden', true);
  },
});
