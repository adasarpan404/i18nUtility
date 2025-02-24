import { IntlMessageFormat } from "intl-messageformat";
import React,{ createContext, useContext } from "react";

type Messages = { [key: string]: string | Messages };

type Locale = string;

type TranslationOptions = { [key: string]: string | number };

class I18n {
  private locale: Locale;
  private messages: Messages;

  constructor(locale: Locale, messages: Messages) {
    this.locale = locale;
    this.messages = messages;
  }

  translate(key: string, options?: TranslationOptions): string {
    const message = this.getMessage(key, this.messages);
    if (!message) return key;
    const formatter = new IntlMessageFormat(message, this.locale);
    const result = formatter.format(options);
  
    return Array.isArray(result) ? result.join("") : String(result);
  }

  private getMessage(key: string, messages: Messages): string | undefined {
    return key.split(".").reduce((acc, part) => {
      if (acc && typeof acc === "object" && part in acc) {
        return acc[part];
      }
      return undefined;
    }, messages as Messages) as string | undefined;
  }
  
}

export const I18nContext = createContext<I18n | null>(null);

export const I18nProvider = ({ locale, messages, children }: { locale: Locale; messages: Messages; children: React.ReactNode }) => {
  const i18n = new I18n(locale, messages);
  return <I18nContext.Provider value={i18n}>{children}</I18nContext.Provider>;
};

export const useI18n = () => {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error("useI18n must be used within an I18nProvider");
  }
  return context;
};

export default I18n;
