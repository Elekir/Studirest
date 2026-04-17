import { Platform } from "react-native";

/**
 * Studirest Theme Configuration
 * Dark Mode: Deep Purple & neon pink (Default)
 * Light Mode: Lavender & Deep Purple (Accessibility part)
 */

export const Colors = {

  light: {

    primary: "#624696",      // Main purple
    secondary: "#BDBDBD",    // Supporting grey
    background: "#F5F3FF",   
    surface: "#FFFFFF",      
    text: "#1F1137",         
    textSecondary: "#624696",
    icon: "#624696",
    border: "#D1D5DB",
  },

  dark: {

    primary: "#FF71CE",      //  Pink pop
    secondary: "#624696",    // Muted purple
    background: "#1F1137",   // Deep base purple
    surface: "#291749",      // Card color
    text: "#FFFFFF",         
    textSecondary: "#BDBDBD",
    icon: "#FF71CE",
    border: "#3D2B5E",
  },

};

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: "system-ui",
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: "ui-serif",
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: "ui-rounded",
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: "ui-monospace",
  },
  default: {
    sans: "normal",
    serif: "serif",
    rounded: "normal",
    mono: "monospace",
  },
  web: {
    sans: "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
    serif: "Georgia, 'Times New Roman', serif",
    rounded:
      "'SF Pro Rounded', 'Hiragino Maru Gothic ProN', Meiryo, 'MS PGothic', sans-serif",
    mono: "SFMono-Regular, Menlo, Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace",
  },
});
