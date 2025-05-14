import React, {
  useState,
  useRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from "react";
import {
  View,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Keyboard,
  ActivityIndicator,
} from "react-native";
import { Search, X } from "lucide-react-native";

interface SearchBarProps {
  placeholder?: string;
  onSearch: (text: string) => void;
  initialValue?: string;
  containerStyle?: any;
  debounceTime?: number;
  onClearPress?: () => void;
  isSearching?: boolean;
}

// Create a ref interface
export interface SearchBarRef {
  focus: () => void;
  preventKeyboardReturn: () => void;
  allowKeyboardReturn: () => void;
  blur: () => void;
}

const SearchBar = forwardRef<SearchBarRef, SearchBarProps>(
  (
    {
      placeholder = "Search...",
      onSearch,
      initialValue = "",
      containerStyle = {},
      debounceTime = 500,
      onClearPress,
      isSearching = false,
    },
    ref
  ) => {
    const [searchText, setSearchText] = useState(initialValue);
    const inputRef = useRef<TextInput>(null);
    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
    const [shouldPreventKeyboardReturn, setShouldPreventKeyboardReturn] =
      useState(false);
    const isMountedRef = useRef(true);

    useEffect(() => {
      isMountedRef.current = true;
      return () => {
        isMountedRef.current = false;
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
      };
    }, []);

    useImperativeHandle(ref, () => ({
      focus: () => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      },
      preventKeyboardReturn: () => {
        setShouldPreventKeyboardReturn(true);
      },
      allowKeyboardReturn: () => {
        setShouldPreventKeyboardReturn(false);
      },
      blur: () => {
        if (inputRef.current) {
          inputRef.current.blur();
        }
      },
    }));

    useEffect(() => {
      if (initialValue !== searchText) {
        setSearchText(initialValue);
      }
    }, [initialValue]);

    useEffect(() => {
      let keyboardDidHideListener = Keyboard.addListener(
        "keyboardDidHide",
        () => {
          if (
            !shouldPreventKeyboardReturn &&
            isMountedRef.current &&
            inputRef.current
          ) {
            setTimeout(() => {
              if (isMountedRef.current && inputRef.current) {
                inputRef.current.focus();
              }
            }, 20);
          }
        }
      );

      let keyboardDidShowListener = Keyboard.addListener(
        "keyboardDidShow",
        () => {
          if (shouldPreventKeyboardReturn && isMountedRef.current) {
            setShouldPreventKeyboardReturn(false);
          }
        }
      );

      return () => {
        keyboardDidHideListener.remove();
        keyboardDidShowListener.remove();
      };
    }, [shouldPreventKeyboardReturn]);

    const handleChangeText = (text: string) => {
      setSearchText(text);

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      debounceTimerRef.current = setTimeout(() => {
        if (isMountedRef.current) {
          onSearch(text);

          if (inputRef.current && isMountedRef.current) {
            inputRef.current.focus();
          }
        }
      }, debounceTime);

      if (text === "" || text.length === 1) {
        setTimeout(() => {
          if (isMountedRef.current) {
            onSearch(text);
          }
        }, 20);
      }
    };

    const handleClear = () => {
      setSearchText("");

      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      onSearch("");

      setTimeout(() => {
        if (inputRef.current && isMountedRef.current) {
          inputRef.current.focus();
        }
      }, 10);

      if (onClearPress) {
        onClearPress();
      }
    };

    const handleSubmitEditing = () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }

      onSearch(searchText);

      setTimeout(() => {
        if (inputRef.current && isMountedRef.current) {
          inputRef.current.focus();
        }
      }, 10);
    };

    return (
      <View style={[styles.container, containerStyle]}>
        <View style={styles.searchContainer}>
          {isSearching ? (
            <ActivityIndicator
              size="small"
              color="#0A84FF"
              style={styles.searchIcon}
            />
          ) : (
            <Search size={20} color="#888" style={styles.searchIcon} />
          )}
          <TextInput
            ref={inputRef}
            style={styles.input}
            value={searchText}
            onChangeText={handleChangeText}
            placeholder={placeholder}
            placeholderTextColor="#8E8E93"
            autoCapitalize="none"
            autoCorrect={false}
            spellCheck={false}
            returnKeyType="search"
            onSubmitEditing={handleSubmitEditing}
            keyboardType="default"
            keyboardAppearance="default"
            onEndEditing={(e) => {
              e.preventDefault?.();

              if (inputRef.current && !shouldPreventKeyboardReturn) {
                setTimeout(() => inputRef.current?.focus(), 10);
              }
            }}
          />
          {searchText.length > 0 && (
            <TouchableOpacity
              onPress={handleClear}
              style={styles.clearButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <X size={18} color="#8E8E93" />
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  }
);

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 0,
    paddingVertical: 0,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F2F2F2",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#000",
    padding: 0,
  },
  clearButton: {
    padding: 5,
  },
});

export default SearchBar;
