import { ComponentMetadata } from './types';

interface PatternImplementation extends ComponentMetadata {
  match: RegExp;
  id: string;
  size: number;
  height: number;
}

interface CategoryPattern extends ComponentMetadata {
  id: string;
  patterns: RegExp[];
  implementations: PatternImplementation[];
  size: number;
  height: number;
}

export const PATTERNS = {
  ai_models: {
    categories: [
      {
        id: "Translation AI",
        patterns: [/translation|language|mandarin|chinese/i],
        size: 24,
        height: 1,
        implementations: [
          { match: /riva|nvidia speech/i, id: "NVIDIA Riva", size: 16, height: 0 },
          { match: /deepl/i, id: "DeepL API", size: 16, height: 0 },
          { match: /google translate|gtranslate/i, id: "Google Translate", size: 16, height: 0 }
        ]
      },
      {
        id: "Chat Models",
        patterns: [/chat(gpt|bot)/i],
        size: 24,
        height: 1,
        implementations: [
          { match: /gpt-4|gpt4/i, id: "GPT-4", size: 16, height: 0 },
          { match: /gpt-3|gpt3/i, id: "GPT-3.5", size: 16, height: 0 },
          { match: /anthropic|claude/i, id: "Claude", size: 16, height: 0 },
          { match: /llama|meta/i, id: "Llama 2", size: 16, height: 0 }
        ]
      },
      {
        id: "ML Models",
        patterns: [/machine learning|ml|ai model/i],
        size: 24,
        height: 1,
        implementations: [
          { match: /tensorflow|tf/i, id: "TensorFlow", size: 16, height: 0 },
          { match: /pytorch|torch/i, id: "PyTorch", size: 16, height: 0 },
          { match: /scikit|sklearn/i, id: "Scikit-Learn", size: 16, height: 0 }
        ]
      }
    ]
  },
  company_resources: {
    categories: [
      {
        id: "SAP System",
        patterns: [/sap/i],
        size: 24,
        height: 1,
        type: "Enterprise System",
        icon: "database",
        description: "Core SAP enterprise systems and modules",
        implementations: [
          { 
            match: /s4|s\/4/i, 
            id: "S/4HANA", 
            size: 16, 
            height: 0,
            type: "ERP System",
            icon: "server",
            description: "Next-generation ERP suite",
            details: {
              "vendor": "SAP",
              "category": "ERP",
              "technology": "HANA"
            }
          },
          { 
            match: /bw|warehouse/i, 
            id: "BW", 
            size: 16, 
            height: 0,
            type: "Data Warehouse",
            icon: "database",
            description: "Business Warehouse for analytics",
            details: {
              "vendor": "SAP",
              "category": "Analytics",
              "technology": "HANA"
            }
          },
          { 
            match: /erp/i, 
            id: "ERP", 
            size: 16, 
            height: 0,
            type: "ERP System",
            icon: "layout",
            description: "Core enterprise resource planning",
            details: {
              "vendor": "SAP",
              "category": "ERP",
              "technology": "NetWeaver"
            }
          }
        ]
      },
      {
        id: "Enterprise Data",
        patterns: [/database|data/i],
        size: 24,
        height: 1,
        implementations: [
          { match: /oracle/i, id: "Oracle DB", size: 16, height: 0 },
          { match: /sql server|mssql/i, id: "SQL Server", size: 16, height: 0 },
          { match: /postgres/i, id: "PostgreSQL", size: 16, height: 0 }
        ]
      },
      {
        id: "APIs",
        patterns: [/api|interface|integration/i],
        size: 24,
        height: 1,
        implementations: [
          { match: /rest/i, id: "REST APIs", size: 16, height: 0 },
          { match: /graphql/i, id: "GraphQL", size: 16, height: 0 },
          { match: /soap/i, id: "SOAP", size: 16, height: 0 }
        ]
      },
      {
        id: "Sales Tools",
        patterns: [/sales engineer|quote/i],
        size: 24,
        height: 1,
        implementations: [
          { match: /salesforce|sfdc/i, id: "Salesforce", size: 16, height: 0 },
          { match: /dynamics|crm/i, id: "Dynamics", size: 16, height: 0 },
          { match: /hubspot/i, id: "HubSpot", size: 16, height: 0 }
        ]
      }
    ]
  },
  llm_clients: {
    categories: [
      {
        id: "MCP Tools",
        patterns: [/tool|client|interface/i],
        size: 24,
        height: 1,
        implementations: [
          { match: /cli|terminal|command/i, id: "CLI Tool", size: 16, height: 0 },
          { match: /sdk|library/i, id: "SDK", size: 16, height: 0 },
          { match: /plugin|extension/i, id: "Plugins", size: 16, height: 0 }
        ]
      },
      {
        id: "Web Interface",
        patterns: [/browser|web/i],
        size: 24,
        height: 1,
        implementations: [
          { match: /dashboard/i, id: "Dashboard", size: 16, height: 0 },
          { match: /portal/i, id: "Portal", size: 16, height: 0 },
          { match: /admin|console/i, id: "Admin Console", size: 16, height: 0 }
        ]
      },
      {
        id: "Mobile Client",
        patterns: [/mobile|app/i],
        size: 24,
        height: 1,
        implementations: [
          { match: /ios|iphone|ipad/i, id: "iOS App", size: 16, height: 0 },
          { match: /android/i, id: "Android App", size: 16, height: 0 },
          { match: /pwa|progressive/i, id: "PWA", size: 16, height: 0 }
        ]
      }
    ]
  }
};