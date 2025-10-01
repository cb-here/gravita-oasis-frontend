import { useTheme } from "@/context/ThemeContext";
import React, {
  useEffect,
  useMemo,
  useRef,
  useState,
  useCallback,
} from "react";
import Select, { components } from "react-select";
import Loading from "../Loading";

export interface OptionType {
  label?: string;
  value?: string | number;
  [key: string]: any; // if expected custom fields
}

interface SearchableSelectProps {
  dataProps: any;
  selectionProps: any;
  displayProps: any;
  eventHandlers: any;
}

export default function SearchableSelect({
  dataProps = {},
  selectionProps = {},
  displayProps = {},
  eventHandlers = {},
}: SearchableSelectProps) {
  const { theme } = useTheme();

  // data props
  const { optionData = [], total = null, loadMoreData = undefined } = dataProps;

  // selection props
  const {
    showCheckboxes = false,
    selectedOptions = [],
    selectedValue = null,
  } = selectionProps;

  // display props
  const {
    placeholder = "",
    id = "",
    disabled = false,
    showFullOption = false,
    isClearable = true,
    isRequired = false,
    layoutProps = {},
    customCreateOption = null,
  } = displayProps;

  const { className } = layoutProps;

  const { onChange, handleCheckbox, onDropdownClose } = eventHandlers;

  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);
  const [inputValue, setInputValue] = useState("");

  // Use a key to force re-render but maintain scroll position
  const [selectKey] = useState(0);
  const scrollPositionRef = useRef<number>(0);
  const menuListRef = useRef<HTMLDivElement | null>(null);
  const pageRef = useRef(1);
  const currentSearchRef = useRef("");

  useEffect(() => {
    if (typeof total === "number" && total > 0) {
      setHasMore(optionData.length < total);
    } else {
      setHasMore(false);
    }
  }, [optionData.length, total]);

  const options = useMemo(() => {
    const baseOptions = optionData.map((data: any) => ({
      ...data,
      value: data?._id || data?.name,
      label: data?.name,
      id: id || null,
    }));

    const finalOptions = [];

    if (customCreateOption) {
      finalOptions.push({
        value: "__create_option__",
        label: customCreateOption.label,
        isCreateButton: true,
      });
    }

    if (!showCheckboxes) {
      finalOptions.push({
        value: "placeholder",
        label: placeholder,
        isDisabled: true,
      });
    }

    finalOptions.push(...baseOptions);

    return finalOptions;
  }, [optionData, placeholder, id, customCreateOption, showCheckboxes]);

  const loadData = useCallback(
    async (page: number, searchValue: string, reset?: boolean) => {
      if (!loadMoreData) return;

      try {
        setIsLoading(true);
        const didLoad = await loadMoreData(page, searchValue, reset);
        if (didLoad) {
          pageRef.current = page;
        }
      } catch (error: any) {
        console.error("Error loading options", error?.message);
      } finally {
        setIsLoading(false);
      }
    },
    [loadMoreData]
  );

  const fetchMoreOptions = useCallback(async () => {
    if (isLoading || !hasMore) return;

    const nextPage = pageRef.current + 1;
    await loadData(nextPage, currentSearchRef.current);
  }, [hasMore, isLoading, loadData]);

  const handleSearch = useCallback(
    (searchValue: string) => {
      // Reset paging and scroll
      pageRef.current = 1;
      scrollPositionRef.current = 0;

      currentSearchRef.current = searchValue; // update after debounce
      loadData(1, searchValue, true);
    },
    [loadData]
  );

  const selectRef = useRef<HTMLDivElement | null>(null);
  const [placement, setPlacement] = useState<"top" | "bottom" | "auto">("auto");

  useEffect(() => {
    const adjustPlacement = () => {
      if (!selectRef.current) return;

      const rect = selectRef.current.getBoundingClientRect();
      const modalHeight = window.innerHeight;
      const spaceBelow = modalHeight - rect.bottom;
      const spaceAbove = rect.top;

      const dropdownHeight = 300; // max menuList height you defined

      if (spaceBelow < dropdownHeight && spaceAbove > dropdownHeight) {
        setPlacement("top");
      } else {
        setPlacement("bottom");
      }
    };

    adjustPlacement();
    window.addEventListener("resize", adjustPlacement);
    return () => window.removeEventListener("resize", adjustPlacement);
  }, []);

  const customStyles = useMemo(
    () => ({
      control: (base: any, state: any) => ({
        ...base,
        minHeight: "44px",
        fontSize: "0.95rem",
        ...(state.isDisabled && {
          backgroundColor:
            theme === "dark" ? "rgb(31 41 55)" : "rgb(243 244 246)",
          color: theme === "dark" ? "rgb(156 163 175)" : "rgb(107 114 128)",
          borderColor: theme === "dark" ? "rgb(75 85 99)" : "rgb(209 213 219)",
          cursor: "not-allowed !important",
          opacity: 0.4,
        }),
      }),
      menuPortal: (provided: any) => ({ ...provided, zIndex: 100010 }),
      menu: (base: any) => ({
        ...base,
        backgroundColor:
          theme === "dark" ? "rgb(55 65 81) !important" : "white !important",
        color: theme === "dark" ? "#9ca3af" : "#374151",
        borderRadius: "0.5rem",
        marginTop: "0.25rem",
        boxShadow:
          theme === "dark"
            ? "0 2px 4px rgb(0 0 0 / 10%), 0 1px 2px rgb(0 0 0 / 6%)"
            : "0 2px 6px rgb(0 0 0 / 5%), 0 1px 3px rgb(0 0 0 / 10%)",
        border:
          theme === "dark"
            ? "1px solid rgb(75 85 99 / 30%)"
            : "1px solid rgb(209 213 219 / 50%)",
        zIndex: 100010,
        position: "absolute",
        width: "100%",
      }),
      menuList: (base: any) => ({
        ...base,
        maxHeight: "280px",
        minHeight: "100px",
        overflowY: "auto",
        padding: "0.5rem",
        zIndex: 10002,
      }),
      option: (base: any, state: any) => ({
        ...base,
        backgroundColor: theme === "dark" ? "rgb(55,65,81)" : "white",
        color: theme === "dark" ? "#9ca3af" : "#374151",
        cursor: state.isDisabled ? "not-allowed" : "pointer",
        "&:hover": {
          backgroundColor: theme === "dark" ? "#1F2937" : "#E5E7EB",
        },
      }),
      singleValue: (base: any) => ({
        ...base,
        color: theme === "dark" ? "#9ca3af" : "#374151",
      }),
      input: (base: any) => ({
        ...base,
        color: theme === "dark" ? "white" : "",
      }),
      placeholder: (base: any) => ({
        ...base,
        color: theme === "dark" ? "#9ca3af" : "#374151",
      }),
    }),
    [theme]
  );

  const CustomOptionWrapper = (props: any) => {
    if (props.data.isCreateButton) {
      return (
        <div
          onClick={() => {
            customCreateOption?.onClick();
            props.selectProps.onMenuClose?.();
          }}
          className="cursor-pointer px-1 py-2 hover:bg-[#E5E7EB] dark:hover:bg-[#1F2937]"
        >
          {props.label}
        </div>
      );
    }

    if (showCheckboxes) {
      return <CustomOption {...props} />;
    }

    return <components.Option {...props} />;
  };

  const CustomOption = (props: any) => {
    const isChecked = selectedOptions.some((sel: any) => sel.value === props.value);

    const handleCheckboxChange = (
      e: React.ChangeEvent<HTMLInputElement> | null,
      forcedChecked?: boolean
    ) => {
      const isChecked = forcedChecked ?? e?.target?.checked;
      // Filter out "placeholder" and disabled options
      const filteredOptions = options.filter(
        (opt) => opt.value !== "placeholder" && !opt.isDisabled
      );

      handleCheckbox(
        filteredOptions,
        false, // not select all
        selectedOptions,
        props,
        isChecked
      );
    };

    return (
      <div
        className="react-select__option"
        onClick={(e) => {
          e.stopPropagation();
          const newChecked = !isChecked;
          handleCheckboxChange(null, newChecked);
        }}
        style={{ cursor: "pointer", padding: "8px" }}
      >
        <components.Option {...props}>
          <div className="relative flex items-center">
            <input
              type="checkbox"
              checked={isChecked}
              onChange={(e) => {
                e.stopPropagation(); // Prevent double triggering
                handleCheckboxChange(e);
              }}
              style={{ marginRight: 8 }}
            />
            <label style={{ cursor: "pointer", display: "inline" }}>
              {props.label}
            </label>
          </div>
        </components.Option>
      </div>
    );
  };

  const CustomSingleValue = (props: any) => {
    const label = props.data.label;
    const additionalCount =
      selectedOptions?.length > 1 ? ` +${selectedOptions.length - 1}` : "";
    return (
      <components.SingleValue {...props}>
        <div style={{ display: "flex", alignItems: "center", height: "100%" }}>
          {label}
          {additionalCount}
        </div>
      </components.SingleValue>
    );
  };

  const CustomMenuList = (props: any) => {
    const { children } = props;

    // Store scroll position on every scroll
    const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
      const { scrollTop, scrollHeight, clientHeight } = e.currentTarget;
      scrollPositionRef.current = scrollTop;

      // Load more when near bottom
      if (
        scrollHeight - scrollTop - clientHeight < 50 &&
        hasMore &&
        !isLoading
      ) {
        fetchMoreOptions();
      }
    };

    return (
      <components.MenuList
        {...props}
        innerRef={(ref: HTMLDivElement) => {
          menuListRef.current = ref;
          if (props.innerRef) {
            props.innerRef(ref);
          }

          // Restore scroll position when ref is set
          if (ref && scrollPositionRef.current > 0) {
            // Use multiple animation frames to ensure DOM is ready
            requestAnimationFrame(() => {
              requestAnimationFrame(() => {
                if (ref) {
                  ref.scrollTop = scrollPositionRef.current;
                }
              });
            });
          }
        }}
        innerProps={{
          ...props.innerProps,
          onScroll: handleScroll,
        }}
      >
        {children}
        {isLoading && (
          <div
            style={{
              height: 40,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              padding: "8px",
            }}
          >
            <Loading size={2} />
          </div>
        )}
      </components.MenuList>
    );
  };

  // Fix the value calculation
  const getCurrentValue = () => {
    if (showCheckboxes && selectedOptions && selectedOptions.length > 0) {
      return selectedOptions[0]; // Show first selected option
    }
    
    if (selectedValue) {
      const foundOption = options.find(
        (option) =>
          option.value === (selectedValue?.value || selectedValue?._id || selectedValue) &&
          option.value !== "placeholder"
      );
      return foundOption || null;
    }
    
    return null;
  };

  // Handle clear functionality
  const handleClear = () => {
    if (showCheckboxes) {
      // For checkboxes, clear all selected options
      handleCheckbox([], false, [], null, false);
    } else {
      // For single select, call onChange with null
      onChange(null);
    }
    setInputValue(""); // Clear the search input
  };

  return (
    <div ref={selectRef} className={className} style={{ position: "relative" }}>
      <Select
        key={selectKey}
        classNamePrefix="react-select"
        styles={customStyles}
        options={options}
        value={getCurrentValue()}
        // onChange={
        //   !showCheckboxes
        //     ? showFullOption
        //       ? (option) => {
        //           if (option?.value === "placeholder") return;
        //           onChange(option || { id, value: null });
        //         }
        //       : (option) => {
        //           if (option?.value === "placeholder") return;
        //           onChange(option || null);
        //         }
        //     : undefined
        // }
        components={{
          Option: CustomOptionWrapper,
          ...(showCheckboxes ? { SingleValue: CustomSingleValue } : {}),
          MenuList: CustomMenuList,
        }}
        placeholder={placeholder}
        isSearchable
        menuPlacement={placement}
        menuPosition="absolute"
        menuShouldScrollIntoView={false}
        instanceId={id}
        isLoading={isLoading}
        isDisabled={disabled}
        isClearable={showCheckboxes ? false : isClearable}
        closeMenuOnSelect={!showCheckboxes}
        required={isRequired}
        inputValue={inputValue}
        onInputChange={(value, actionMeta) => {
          if (actionMeta.action === "input-change") {
            setInputValue(value);
            handleSearch(value);
          } else if (actionMeta.action === "input-blur" || actionMeta.action === "menu-close") {
            // Don't clear input on blur or menu close when there's a selected value
            if (!getCurrentValue()) {
              setInputValue("");
            }
          }
        }}
        onMenuClose={() => {
          // Clear search input when menu closes if no value is selected
          if (!getCurrentValue()) {
            setInputValue("");
            // Reset to original data
            if (loadMoreData) {
              pageRef.current = 1;
              currentSearchRef.current = "";
              loadData(1, "", true);
            }
          }
          onDropdownClose?.();
        }}
        // Add custom clear handler
        onChange={(option, actionMeta) => {
          if (actionMeta.action === "clear") {
            handleClear();
            return;
          }
          
          if (!showCheckboxes) {
            if (option?.value === "placeholder") return;
            const result = showFullOption 
              ? (option || { id, value: null })
              : (option || null);
            onChange(result);
          }
        }}
        menuPortalTarget={
          typeof document !== "undefined" ? document.body : null
        }
      />
    </div>
  );
}