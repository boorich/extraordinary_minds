export interface NodeMetadata {
  title: string;
  description: string;
  icon?: string;
  details: string[];
}

export const nodePatterns: Record<string, NodeMetadata> = {
  "MCP Server": {
    title: "MCP Server",
    description: "Central orchestration and processing",
    icon: "Database",
    details: [
      "Core processing",
      "Resource orchestration",
      "Security management"
    ]
  },
  "AI Models": {
    title: "AI Models",
    description: "Language and domain-specific models",
    icon: "Bot",
    details: [
      "Language Models (LLMs)",
      "Domain-specific AI",
      "Model orchestration"
    ]
  },
  "Company Resources": {
    title: "Company Resources",
    description: "Enterprise data and systems",
    icon: "Database",
    details: [
      "Enterprise data",
      "Internal systems",
      "API integrations"
    ]
  },
  "LLM Clients": {
    title: "LLM Clients",
    description: "Expert users and tools",
    icon: "Users",
    details: [
      "Domain Level Experts",
      "Security Controls",
      "Integration Tools"
    ]
  },
  "LLMs": {
    title: "Language Models",
    description: "Large language model integration",
    icon: "MessageSquare",
    details: [
      "Multiple model support",
      "Context handling",
      "Response generation"
    ]
  },
  "Domain Specific Models": {
    title: "Domain Models",
    description: "Specialized AI models",
    icon: "Brain",
    details: [
      "Custom training",
      "Industry focus",
      "Task optimization"
    ]
  },
  "Scientific Models": {
    title: "Scientific Models",
    description: "Research and analysis models",
    icon: "Flask",
    details: [
      "Data analysis",
      "Research support",
      "Scientific computing"
    ]
  },
  "Machine Data Models": {
    title: "Machine Data",
    description: "IoT and device data processing",
    icon: "Cpu",
    details: [
      "Sensor data",
      "Device metrics",
      "Performance analysis"
    ]
  },
  "Directories": {
    title: "Directories",
    description: "File system organization",
    icon: "Folder",
    details: [
      "Data organization",
      "Access control",
      "File management"
    ]
  },
  "Databases": {
    title: "Databases",
    description: "Data storage systems",
    icon: "Database",
    details: [
      "Query handling",
      "Data persistence",
      "Schema management"
    ]
  },
  "Functions": {
    title: "Functions",
    description: "Serverless compute units",
    icon: "Function",
    details: [
      "Event processing",
      "Task automation",
      "Service integration"
    ]
  },
  "Applications": {
    title: "Applications",
    description: "Enterprise software",
    icon: "Layout",
    details: [
      "Business logic",
      "User interfaces",
      "Service endpoints"
    ]
  },
  "MCP Tools": {
    title: "MCP Tools",
    description: "Integration tools and utilities",
    icon: "Tool",
    details: [
      "Configuration",
      "Monitoring",
      "Management"
    ]
  }
};