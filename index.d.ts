export interface EcomailProviderOptions {
  /** Ecomail API klíč (povinný) */
  apiKey: string;
  /** Výchozí email odesílatele (povinný) */
  defaultFromEmail: string;
  /** Výchozí jméno odesílatele */
  defaultFromName?: string;
  /** API URL (výchozí: http://api2.ecomailapp.cz/transactional/send-message) */
  apiUrl?: string;
  /** Timeout v ms (výchozí: 10000) */
  timeout?: number;
}

export interface EcomailSettings {
  /** Výchozí from adresa */
  defaultFrom?: string;
  /** Výchozí reply-to adresa */
  defaultReplyTo?: string;
}

export interface EcomailRecipient {
  /** Email adresa příjemce */
  email: string;
  /** Jméno příjemce (volitelné) */
  name?: string;
}

export interface EcomailSender {
  /** Email adresa odesílatele */
  email: string;
  /** Jméno odesílatele (volitelné) */
  name?: string;
}

export interface EcomailSendOptions {
  /** Příjemce emailu */
  to: string | EcomailRecipient | EcomailRecipient[];
  /** Předmět emailu */
  subject?: string;
  /** HTML obsah emailu */
  html?: string;
  /** Textový obsah emailu */
  text?: string;
  /** Odesílatel emailu */
  from?: string | EcomailSender;
  /** Reply-to adresa */
  replyTo?: string | EcomailSender;
  /** Přílohy (zatím nepodporováno) */
  attachments?: any[];
}

export interface EcomailResponse {
  /** ID zprávy */
  messageId: string;
  /** Odpověď z Ecomail API */
  response: any;
}

export interface EcomailProvider {
  /** Odeslání emailu */
  send(options: EcomailSendOptions): Promise<EcomailResponse>;
}

/**
 * Inicializace Ecomail provideru
 * @param providerOptions - Konfigurace provideru
 * @param settings - Nastavení emailu
 * @returns Provider instance
 */
declare function init(
  providerOptions: EcomailProviderOptions,
  settings?: EcomailSettings
): EcomailProvider;

export { init };

declare const _default: {
  init: typeof init;
};

export default _default;