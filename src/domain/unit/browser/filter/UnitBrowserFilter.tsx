import invert from "lodash/invert";
import React, { useState, useCallback } from "react";
import { Col, Container, Row } from "react-bootstrap";
import { useTranslation } from "react-i18next";

import UnitFilterButton from "./UnitBrowserFilterButton";
import UnitFilterLabelButton from "./UnitBrowserFilterLabelButton";
import UnitFilterOptionsWrapper from "./UnitBrowserFilterOptionsWrapper";
import { UnitFilters } from "../../unitConstants";

export type UnitFilterProps = {
  name: string;
  active: string;
  options: Array<string>;
  secondaryOptions?: Array<string> | null | undefined;
  isHiking?: boolean;
};

type UnitFiltersProps = {
  filters: Array<UnitFilterProps>;
  updateFilter: (filter: string, value: string) => void;
};

export type FilterOptionProps = {
  isActive: boolean;
  onToggle: () => void;
  onSelect: (filterName: string, option: string) => void;
  filter: UnitFilterProps;
  customActiveLogic?: (option: string, filter: UnitFilterProps) => boolean;
};

export function FilterOption({
  filter,
  isActive,
  onToggle,
  onSelect,
  customActiveLogic,
}: Readonly<FilterOptionProps>) {
  const { t } = useTranslation();
  const controlId = `control-${filter.name}`;
  const menuId = `menu-${filter.name}`;

  const handleSelect = (filterName: string, option: string) => {
    onSelect(filterName, option);

    // Return focus to the toggle button after selection with a small delay
    // to ensure the menu has closed and the button is focusable
    setTimeout(() => {
      const element = document.getElementById(controlId);
      if (element) {
        element.focus();
      }
    }, 10);
  };

  const renderOptions = (options: string[], className: string) => (
    <Row className={`${className} filter-options-row`}>
      {options.map((option) => {
        const isOptionActive = customActiveLogic 
          ? customActiveLogic(option, filter)
          : option === filter.active;
        
        return (
          <Col className="unit-filters__option" xs={6} key={option}>
            <UnitFilterButton
              filterName={option}
              isActive={isOptionActive}
              onClick={() => handleSelect(filter.name, option)}
              message={t(`UNIT_DETAILS.FILTER.${invert(UnitFilters)[option]}`)}
            />
          </Col>
        );
      })}
    </Row>
  );

  return (
    <div className={filter.name}>
      <UnitFilterLabelButton
        filter={filter}
        onAction={onToggle}
        isActive={isActive}
        aria-haspopup="true"
        aria-controls={menuId}
        id={controlId}
      />
      {isActive && (
        <UnitFilterOptionsWrapper
          id={menuId}
          className="unit-filters__options-wrapper"
          tabIndex={-1}
          role="region"
          aria-labelledby={controlId}
        >
          {renderOptions(filter.options, "unit-filters__options")}
          {filter.secondaryOptions && (
            <>
              <Row as="hr" className="unit-filters__options-separator" />
              {renderOptions(
                filter.secondaryOptions,
                "unit-filters__options secondary",
              )}
            </>
          )}
        </UnitFilterOptionsWrapper>
      )}
    </div>
  );
}

export const filterEquals = (a: any, b: any) => {
  // Checks if a and b are the same by comparing their names.
  if (a && b) {
    return a.name === b.name;
  }
  return false;
};

function UnitBrowserFilter({ filters, updateFilter }: Readonly<UnitFiltersProps>) {
  const [expandedFilterName, setExpandedFilterName] = useState<string | null>(
    null,
  );

  const onMenuSelect = useCallback(
    (filterName: string, value: string): void => {
      setExpandedFilterName(null);
      updateFilter(filterName, value);
    },
    [updateFilter],
  );

  const toggleFilter = useCallback(
    (filterName: string) => {
      setExpandedFilterName(
        expandedFilterName === filterName ? null : filterName,
      );
    },
    [expandedFilterName],
  );

  return (
    <div className="unit-filters">
      <Container className="unit-filters__filters">
        <Row className="unit-filters__filters">
          {filters.map((filter) => (
            <Col className="unit-filters__edit" xs={6} key={filter.name}>
              <FilterOption
                filter={filter}
                onToggle={() => toggleFilter(filter.name)}
                onSelect={onMenuSelect}
                isActive={filter.name === expandedFilterName}
              />
            </Col>
          ))}
        </Row>
      </Container>
    </div>
  );
}

export default UnitBrowserFilter;
