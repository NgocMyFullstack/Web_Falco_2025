import { useState } from "react";

const useSession = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error("Error reading from session storage", error);
      return initialValue;
    }
  });

  // Lưu Session
  const setValue = (value) => {
    try {
      const valueToStore =
        value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      sessionStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error("Error saving to session storage", error);
    }
  };

  // Xóa Session
  const removeValue = () => {
    try {
      sessionStorage.removeItem(key);
      setStoredValue(initialValue);
    } catch (error) {
      console.error("Error removing from session storage", error);
    }
  };

  return [storedValue, setValue, removeValue];
};

export default useSession;
