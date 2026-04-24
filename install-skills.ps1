# Claude Code Skills - Global Installation
# Run: powershell -ExecutionPolicy Bypass -File install-skills.ps1

$skills = @(
  "https://github.com/teachingai/full-stack-skills --skill electron",
  "https://github.com/vercel-labs/agent-skills --skill vercel-react-best-practices",
  "https://github.com/supercent-io/skills-template --skill react-best-practices",
  "wshobson/agents@nodejs-backend-patterns",
  "sickn33/antigravity-awesome-skills@nodejs-best-practices",
  "bobmatnyc/claude-mpm-skills@nodejs-backend-typescript",
  "tencentcloudbase/skills@ai-model-nodejs",
  "tencentcloudbase/skills@auth-nodejs-cloudbase",
  "vercel-labs/agent-skills@vercel-react-native-skills",
  "callstackincubator/agent-skills@react-native-best-practices",
  "wshobson/agents@react-native-architecture",
  "wshobson/agents@react-native-design",
  "callstackincubator/agent-skills@upgrading-react-native",
  "jeffallan/claude-skills@react-native-expert",
  "expo/skills@building-native-ui",
  "expo/skills@native-data-fetching",
  "expo/skills@upgrading-expo",
  "expo/skills@expo-tailwind-setup",
  "expo/skills@expo-dev-client",
  "expo/skills@expo-deployment",
  "wshobson/agents@typescript-advanced-types",
  "github/awesome-copilot@javascript-typescript-jest",
  "github/awesome-copilot@typescript-mcp-server-generator",
  "sickn33/antigravity-awesome-skills@typescript-expert",
  "dotneet/claude-code-marketplace@typescript-react-reviewer",
  "anthropics/skills@webapp-testing",
  "supercent-io/skills-template@backend-testing",
  "supercent-io/skills-template@testing-strategies",
  "wshobson/agents@e2e-testing-patterns",
  "supercent-io/skills-template@authentication-setup",
  "better-auth/skills@two-factor-authentication-best-practices",
  "mindrally/skills@nextauth-authentication",
  "supercent-io/skills-template@deployment-automation",
  "wshobson/agents@deployment-pipeline-design",
  "railwayapp/railway-skills@deployment",
  "https://github.com/anthropics/skills --skill frontend-design",
  "https://github.com/vercel-labs/agent-skills --skill web-design-guidelines",
  "aj-geddes/useful-ai-prompts@nodejs-express-server",
  "pluginagentmarketplace/custom-plugin-nodejs@express-rest-api",
  "mindrally/skills@express-typescript",
  "bobmatnyc/claude-mpm-skills@express-production",
  "aj-geddes/useful-ai-prompts@rest-api-design",
  "hoodini/ai-agents-skills@mongodb",
  "pluginagentmarketplace/custom-plugin-nodejs@mongoose-mongodb",
  "romiluz13/mongodb-agent-skills@mongodb-query-and-index-optimize",
  "romiluz13/mongodb-agent-skills@mongodb-schema-design",
  "mindrally/skills@mongodb-development",
  "cin12211/orca-q@mongodb-expert",
  "https://github.com/anthropics/skills --skill skill-creator",
  "https://github.com/vercel-labs/skills --skill find-skills",
  "google-labs-code/stitch-skills@react:components",
  "resend/react-email@react-email"
)

$total = $skills.Count
Write-Host "Installing $total skills globally..." -ForegroundColor Cyan
Write-Host ""

$i = 0
foreach ($skill in $skills) {
    $i++
    Write-Host "[$i/$total] $skill" -ForegroundColor Yellow
    npx skills add $skill --yes --global 2>&1 | ForEach-Object {
        if ($_ -match "error|fail") { Write-Host "   $_" -ForegroundColor Red }
    }
    Write-Host "   Done" -ForegroundColor Green
}

Write-Host ""
Write-Host "Installed $i/$total skills!" -ForegroundColor Green
Write-Host ""
npx skills list -g
