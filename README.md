# Strapi Provider Email Ecomail

[![npm version](https://badge.fury.io/js/strapi-provider-email-ecomail.svg)](https://badge.fury.io/js/strapi-provider-email-ecomail)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Email provider pro **Strapi 5** umožňující odesílání transakčních emailů přes **Ecomail API**. 

## ✨ Funkce

- 🚀 **Strapi 5 Ready** - Plně kompatibilní s nejnovější verzí Strapi
- 📧 **Transakční emaily** - Spolehlivé doručování důležitých emailů



## 📦 Instalace

```bash
# npm
npm install strapi-provider-email-ecomail

# yarn
yarn add strapi-provider-email-ecomail

# pnpm
pnpm add strapi-provider-email-ecomail
```

## ⚙️ Konfigurace

### 1. Environment proměnné

Přidejte do `.env` souboru:

```env
ECOMAIL_API_KEY=your_ecomail_api_key
ECOMAIL_DEFAULT_FROM_EMAIL=noreply@yourdomain.com
ECOMAIL_DEFAULT_FROM_NAME=Your App Name
```

### 2. Konfigurace Strapi

V `config/plugins.js` nebo `config/plugins.ts`:

#### JavaScript
```javascript
module.exports = ({ env }) => ({
  email: {
    config: {
      provider: 'strapi-provider-email-ecomail',
      providerOptions: {
        apiKey: env('ECOMAIL_API_KEY'),
        defaultFromEmail: env('ECOMAIL_DEFAULT_FROM_EMAIL'),
        defaultFromName: env('ECOMAIL_DEFAULT_FROM_NAME', 'Strapi'),
        timeout: 10000, // volitelné
      },
      settings: {
        defaultFrom: env('ECOMAIL_DEFAULT_FROM_EMAIL'),
        defaultReplyTo: env('ECOMAIL_DEFAULT_FROM_EMAIL'),
      },
    },
  },
});
```

#### TypeScript
```typescript
export default ({ env }) => ({
  email: {
    config: {
      provider: 'strapi-provider-email-ecomail',
      providerOptions: {
        apiKey: env('ECOMAIL_API_KEY'),
        defaultFromEmail: env('ECOMAIL_DEFAULT_FROM_EMAIL'),
        defaultFromName: env('ECOMAIL_DEFAULT_FROM_NAME', 'Strapi'),
        timeout: 10000,
      },
      settings: {
        defaultFrom: `"${env('ECOMAIL_DEFAULT_FROM_NAME')}" <${env('ECOMAIL_DEFAULT_FROM_EMAIL')}>`,
        defaultReplyTo: env('ECOMAIL_DEFAULT_FROM_EMAIL'),
      },
    },
  },
});
```

## 🚀 Použití

### Základní odesílání emailů

```javascript
await strapi.plugins.email.services.email.send({
  to: 'user@example.com',
  subject: 'Vítejte v naší aplikaci!',
  html: '<h1>Vítejte!</h1><p>Děkujeme za registraci.</p>',
  text: 'Vítejte! Děkujeme za registraci.'
});
```

### Více příjemců

```javascript
await strapi.plugins.email.services.email.send({
  to: [
    { email: 'user1@example.com', name: 'Jan Novák' },
    { email: 'user2@example.com', name: 'Marie Svobodová' },
    'user3@example.com'
  ],
  subject: 'Registrace',
  html: '<h1>Vítejte</h1><p>Váš účet byl úspěšně vytvořen.</p>'
});
```

### Vlastní odesílatel

```javascript
await strapi.plugins.email.services.email.send({
  to: 'customer@example.com',
  from: {
    email: 'support@yourdomain.com',
    name: 'Tým podpory'
  },
  replyTo: 'noreply@yourdomain.com',
  subject: 'Odpověď na váš dotaz',
  html: '<p>Děkujeme za váš dotaz...</p>'
});
```

### V lifecycles (automatické emaily)

```javascript
// src/api/user/content-types/user/lifecycles.js
module.exports = {
  async afterCreate(event) {
    const { result } = event;
    
    await strapi.plugins.email.services.email.send({
      to: result.email,
      subject: 'Vítejte!',
      html: `
        <h1>Vítejte, ${result.firstName}!</h1>
        <p>Váš účet byl úspěšně vytvořen.</p>
      `
    });
  }
};
```

## 🔧 Konfigurace provideru

| Parametr | Typ | Povinný | Výchozí | Popis |
|----------|-----|---------|---------|-------|
| `apiKey` | string | ✅ | - | Ecomail API klíč |
| `defaultFromEmail` | string | ✅ | - | Výchozí email odesílatele |
| `defaultFromName` | string | ❌ | "Strapi" | Výchozí jméno odesílatele |
| `timeout` | number | ❌ | 10000 | Timeout požadavku v ms |
| `apiUrl` | string | ❌ | ecomail api url | Custom API URL |

## 🔍 Error handling

Provider poskytuje detailní error handling:

```javascript
try {
  await strapi.plugins.email.services.email.send({
    to: 'invalid-email',
    subject: 'Test'
  });
} catch (error) {
  console.error('Email error:', error.message);
  console.error('Details:', error.details);
}
```

## 🐛 Debugging

Pro debug informace nastavte:

```env
NODE_ENV=development
```

Provider pak bude logovat detailní informace o odesílaných emailech.

## 📋 Požadavky

- **Node.js**: >= 18.0.0
- **Strapi**: >= 5.0.0
- **Ecomail účet** s API přístupem

## 🤝 Získání Ecomail API klíče

1. Přihlaste se do [Ecomail administrace](https://app.ecomailapp.cz)
2. Jděte do **Nastavení** → **API**
3. Vygenerujte nový API klíč
4. Zkopírujte klíč do environment proměnné

