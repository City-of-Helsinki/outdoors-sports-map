// @flow

import ReactDOM from 'react-dom';
import L from 'leaflet';
import type { MapControlProps, Control } from 'leaflet';
import { MapControl, withLeaflet } from 'react-leaflet';
import pick from 'lodash/pick';

type Props = MapControlProps & {
  id: string,
  handleClick: Function,
  wrapperAttrs?: {
    [name: string]: string,
  },
};

class DropdownControl extends MapControl<Control, Props> {
  constructor(props) {
    super(props);

    this.handleClick = this.handleClick.bind(this);
    this.updateOptions = this.updateOptions.bind(this);
  }

  get wrapper() {
    const { id } = this.props;

    return document.getElementById(id);
  }

  get controlId() {
    const { id } = this.props;

    return `${id}-control`;
  }

  get control() {
    return document.getElementById(this.controlId);
  }

  get optionsId() {
    const { id } = this.props;

    return `${id}-options`;
  }

  get optionsWrapper() {
    return document.getElementById(this.optionsId);
  }

  componentDidUpdate(prevProps) {
    const { isOpen, activeLanguage } = this.props;
    const ariaExpanded = this.props['aria-expanded'];
    const element = this.control;

    if (prevProps['aria-expanded'] !== ariaExpanded && element) {
      this.syncProps(element, ['aria-expanded']);
    }

    if (
      prevProps.isOpen !== isOpen ||
      prevProps.activeLanguage !== activeLanguage
    ) {
      this.updateOptions();
    }
  }

  syncProps(element: HTMLElement, propsList: string[]) {
    const attributes = pick(this.props, propsList);

    Object.entries(attributes).forEach(([attribute, value]) => {
      // $FlowIgnore
      element.setAttribute(attribute, value.toString());
    });
  }

  makeOptionsWrapper() {
    const element = document.createElement('div');

    element.setAttribute('id', this.optionsId);
    element.setAttribute('role', 'region');
    element.setAttribute('aria-labelledby', this.controlId);

    return element;
  }

  /*:: updateOptions: Function */
  updateOptions() {
    const { options, isOpen } = this.props;

    if (isOpen) {
      if (!this.optionsWrapper && this.wrapper) {
        // Create options wrapper if it's missing
        this.wrapper.append(this.makeOptionsWrapper());
      }

      // Verify that the created options wrapper is available
      if (this.optionsWrapper) {
        ReactDOM.render(options, this.optionsWrapper);
      }
    } else if (this.optionsWrapper) {
      this.optionsWrapper.remove();
    }
  }

  /*:: handleClick: Function */
  handleClick(event) {
    L.DomEvent.stopPropagation(event);
    event.stopPropagation();

    // eslint-disable-next-line no-unused-expressions
    this.props.handleClick && this.props.handleClick(event);
  }

  createLeafletElement() {
    const { className, children, wrapperAttrs } = this.props;

    const control = L.control({
      position: this.props.position || 'bottomright',
    }); // see http://leafletjs.com/reference.html#control-positions for other positions

    control.handleClick = this.handleClick;

    // eslint-disable-next-line func-names
    control.onAdd = () => {
      const div = L.DomUtil.create('div', `custom-control ${className}`);

      Object.entries(wrapperAttrs).forEach(
        ([attributeName, attributeValue]) => {
          // $FlowIgnore
          div.setAttribute(attributeName, attributeValue);
        }
      );

      const button = L.DomUtil.create('button', 'custom-control-button', div);

      this.syncProps(div, ['id']);
      div.setAttribute('role', 'contentinfo');

      this.syncProps(button, ['aria-haspopup', 'aria-expanded']);
      button.setAttribute('id', this.controlId);
      button.setAttribute('aria-controls', this.optionsId);

      L.DomEvent.on(
        button,
        'mousedown dblclick doubletap touchstart',
        L.DomEvent.stopPropagation
      )
        .on(button, 'click', L.DomEvent.stop)
        .on(button, 'click', this.handleClick, control);

      ReactDOM.render(children, button);

      this.updateOptions();

      return div;
    };

    return control;
  }
}

export default withLeaflet(DropdownControl);
