const axios = require('axios');

/**
 * Ecomail email provider for Strapi 5
 * Sends transactional emails via Ecomail API
 */
module.exports = {
  init: (providerOptions = {}, settings = {}) => {
    // Validace povinných parametrů
    const { apiKey, defaultFromEmail } = providerOptions;
    
    if (!apiKey) {
      throw new Error('Ecomail API key is required. Please provide it in providerOptions.apiKey');
    }
    
    if (!defaultFromEmail) {
      throw new Error('Default from email is required. Please provide it in providerOptions.defaultFromEmail');
    }

    // Výchozí konfigurace
    const config = {
      apiUrl: 'http://api2.ecomailapp.cz/transactional/send-message',
      timeout: 10000,
      defaultFromName: 'Strapi',
      ...providerOptions
    };

    return {
      send: async (options) => {
        const { 
          to, 
          subject, 
          text, 
          html,
          from,
          replyTo,
          attachments // TODO: implementovat v budoucí verzi
        } = options;

        // Validace povinných parametrů emailu
        if (!to) {
          throw new Error('Email recipient (to) is required');
        }

        if (!subject && !html && !text) {
          throw new Error('Email must have at least subject, html or text content');
        }

        // Normalizace příjemců na Ecomail formát
        const recipients = normalizeRecipients(to);
        
        // Příprava emailové adresy odesílatele
        const fromEmail = extractEmailFromFrom(from) || config.defaultFromEmail;
        const fromName = extractNameFromFrom(from) || config.defaultFromName;
        const replyToEmail = extractEmailFromFrom(replyTo) || fromEmail;

        // Příprava payloadu pro Ecomail API
        const payload = {
          message: {
            subject: subject || '',
            html: html || undefined,
            text: text || undefined,
            from_name: fromName,
            from_email: fromEmail,
            reply_to: replyToEmail,
            to: recipients,
            headers: {}
          }
        };

        // Debug log
        if (process.env.NODE_ENV !== 'production') {
          console.log('📧 Ecomail Provider: Sending email', {
            to: recipients.map(r => r.email),
            subject,
            from: `${fromName} <${fromEmail}>`
          });
        }

        try {
          const response = await axios.post(config.apiUrl, payload, {
            headers: {
              'Content-Type': 'application/json',
              'key': config.apiKey
            },
            timeout: config.timeout
          });

          // Success log
          if (process.env.NODE_ENV !== 'production') {
            console.log('✅ Ecomail Provider: Email sent successfully');
          }

          return {
            messageId: response.data?.message_id || `ecomail_${Date.now()}`,
            response: response.data
          };

        } catch (error) {
          // Error handling s detailním logováním
          const errorMessage = error.response?.data?.message || error.message;
          const errorDetails = {
            status: error.response?.status,
            statusText: error.response?.statusText,
            data: error.response?.data,
            config: {
              url: config.apiUrl,
              method: 'POST',
              timeout: config.timeout
            }
          };

          console.error('❌ Ecomail Provider Error:', errorMessage);
          console.error('Error details:', errorDetails);

          // Vytvoříme strukturovanou chybu
          const providerError = new Error(`Ecomail Provider: ${errorMessage}`);
          providerError.details = errorDetails;
          
          throw providerError;
        }
      }
    };
  }
};

/**
 * Normalizuje příjemce na formát očekávaný Ecomail API
 * @param {string|Object|Array} to - Příjemci
 * @returns {Array} Pole objektů s email a name
 */
function normalizeRecipients(to) {
  if (typeof to === 'string') {
    return [{ email: to, name: '' }];
  }
  
  if (Array.isArray(to)) {
    return to.map(recipient => {
      if (typeof recipient === 'string') {
        return { email: recipient, name: '' };
      }
      return {
        email: recipient.email || recipient.address,
        name: recipient.name || ''
      };
    });
  }
  
  // Pokud je to objekt
  return [{
    email: to.email || to.address,
    name: to.name || ''
  }];
}

/**
 * Extrahuje email z from objektu/stringu
 * @param {string|Object} from - From hodnota
 * @returns {string|null} Email adresa
 */
function extractEmailFromFrom(from) {
  if (!from) return null;
  
  if (typeof from === 'string') {
    // Pokusí se najít email v závorce "Name <email@domain.com>"
    const match = from.match(/<(.+)>/);
    return match ? match[1] : from;
  }
  
  return from.email || from.address || null;
}

/**
 * Extrahuje jméno z from objektu/stringu
 * @param {string|Object} from - From hodnota
 * @returns {string|null} Jméno odesílatele
 */
function extractNameFromFrom(from) {
  if (!from) return null;
  
  if (typeof from === 'string') {
    // Pokusí se najít jméno před závorkou "Name <email@domain.com>"
    const match = from.match(/^(.+)\s*<.+>$/);
    return match ? match[1].trim().replace(/^["']|["']$/g, '') : null;
  }
  
  return from.name || null;
}