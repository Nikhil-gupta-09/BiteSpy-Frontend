export type ArmorIQAgentProfile = "scan-agent" | "analyze-agent";

export interface ArmorIQPolicy {
    allow: string[];
    deny: string[];
    allowed_tools?: string[];
    rate_limit?: number;
    priority?: number;
}

export interface AgentPolicyConfig {
    action: string;
    goal: string;
    policy: ArmorIQPolicy;
}

export function getAgentPolicyConfig(mcpServer: string, profile: ArmorIQAgentProfile): AgentPolicyConfig {
    if (profile === "scan-agent") {
        return {
            action: "scan_product",
            goal: "Detect product details and generate ingredient-related user questions.",
            policy: {
                allow: [
                    `${mcpServer}/scan_product`,
                    `${mcpServer}/ingredient_extractor`,
                    `${mcpServer}/question_generator`,
                    `${mcpServer}/generate_json`,
                ],
                deny: [
                    `${mcpServer}/verdict_engine`,
                    `${mcpServer}/alternate_products`,
                    `${mcpServer}/delete_*`,
                    `${mcpServer}/admin_*`,
                    `${mcpServer}/write_*`,
                    `${mcpServer}/update_*`,
                ],
                allowed_tools: ["scan_product", "ingredient_extractor", "question_generator", "generate_json"],
                rate_limit: 500,
                priority: 80,
            },
        };
    }

    return {
        action: "analyze_claims",
        goal: "Generate claim-o-meter score, risk insights, and alternatives from scan context.",
        policy: {
            allow: [
                `${mcpServer}/analyze_claims`,
                `${mcpServer}/verdict_engine`,
                `${mcpServer}/alternate_products`,
                `${mcpServer}/generate_json`,
            ],
            deny: [
                `${mcpServer}/scan_product`,
                `${mcpServer}/ingredient_extractor`,
                `${mcpServer}/question_generator`,
                `${mcpServer}/delete_*`,
                `${mcpServer}/admin_*`,
                `${mcpServer}/write_*`,
                `${mcpServer}/update_*`,
            ],
            allowed_tools: ["analyze_claims", "verdict_engine", "alternate_products", "generate_json"],
            rate_limit: 500,
            priority: 80,
        },
    };
}
