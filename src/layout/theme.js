export function getThemeClasses(darkMode) {
  return {
    pageBg: darkMode ? "bg-neutral-900 text-neutral-100" : "bg-gray-200 text-black",
    cardBg: darkMode ? "bg-neutral-800 text-neutral-100" : "bg-white text-black",
    cardBorder: darkMode ? "border-neutral-700" : "border-gray-300",
    inputBg: darkMode
      ? "bg-neutral-900 border-neutral-700 text-neutral-100 placeholder-neutral-500"
      : "bg-white border-gray-300 text-black",
    mutedText: darkMode ? "text-neutral-400" : "text-gray-600",
  };
}
