# Azure Setup Guide for QuickSurveyAI

## Required Azure Services

1. **Azure OpenAI Service**
   - Purpose: Generate AI-powered survey questions
   - Setup Steps:
     1. Create an Azure OpenAI resource
     2. Deploy GPT-4 or GPT-3.5-turbo model
     3. Note down the endpoint URL and API key
   - Environment Variables:
     ```
     AZURE_OPENAI_API_KEY=your_api_key
     AZURE_OPENAI_ENDPOINT=your_endpoint
     AZURE_OPENAI_MODEL=deployment_name
     ```

2. **Azure Cosmos DB**
   - Purpose: Store survey data and responses
   - Setup Steps:
     1. Create a Cosmos DB account with SQL API
     2. Create a database named "quicksurveyai"
     3. Create containers:
        - surveys (partition key: /id)
        - responses (partition key: /surveyId)
   - Environment Variables:
     ```
     COSMOS_DB_CONNECTION_STRING=your_connection_string
     COSMOS_DB_NAME=quicksurveyai
     ```

3. **Azure Functions**
   - Purpose: Serverless API endpoints
   - Required Functions:
     1. GenerateSurvey (HTTP Trigger)
     2. SaveResponse (HTTP Trigger)
     3. GetSurveyResults (HTTP Trigger)
   - Setup Steps:
     1. Create an Azure Function App (Node.js runtime)
     2. Enable managed identity
     3. Configure CORS for your frontend domain
   - Environment Variables:
     ```
     AZURE_FUNCTION_APP_URL=your_function_app_url
     ```

4. **Azure App Service**
   - Purpose: Host the Next.js frontend
   - Setup Steps:
     1. Create an App Service Plan (Linux)
     2. Create a Web App (Node.js 18 LTS)
     3. Configure build and deployment settings
   - Environment Variables:
     ```
     AZURE_WEBAPP_NAME=your_webapp_name
     ```

## GitHub Actions Setup

1. Create Azure service principal for GitHub Actions:
   ```bash
   az ad sp create-for-rbac --name "quicksurveyai-github" --role contributor \
     --scopes /subscriptions/{subscription-id}/resourceGroups/{resource-group} \
     --sdk-auth
   ```

2. Add GitHub Secrets:
   - AZURE_CREDENTIALS (service principal JSON)
   - AZURE_OPENAI_API_KEY
   - AZURE_OPENAI_ENDPOINT
   - COSMOS_DB_CONNECTION_STRING

## Local Development Setup

1. Install Azure CLI and login:
   ```bash
   az login
   ```

2. Install Azure Functions Core Tools:
   ```bash
   npm install -g azure-functions-core-tools@4
   ```

3. Create local.settings.json in the api folder:
   ```json
   {
     "IsEncrypted": false,
     "Values": {
       "AzureWebJobsStorage": "",
       "FUNCTIONS_WORKER_RUNTIME": "node",
       "AZURE_OPENAI_API_KEY": "your_key",
       "AZURE_OPENAI_ENDPOINT": "your_endpoint",
       "COSMOS_DB_CONNECTION_STRING": "your_connection_string"
     }
   }
   ```

## Security Considerations

1. **Authentication & Authorization**
   - Enable Azure AD authentication for sensitive operations
   - Use managed identities for service-to-service communication
   - Implement role-based access control (RBAC)

2. **Data Protection**
   - Enable Azure Cosmos DB encryption at rest
   - Use HTTPS/TLS for all communications
   - Implement proper data backup and retention policies

3. **Monitoring**
   - Enable Application Insights
   - Set up alerts for critical metrics
   - Configure logging for security events

## Cost Optimization

1. **Azure OpenAI**
   - Monitor token usage
   - Implement caching for common queries
   - Use smaller models when possible

2. **Cosmos DB**
   - Choose appropriate throughput (RU/s)
   - Implement efficient partition keys
   - Use TTL for temporary data

3. **Azure Functions**
   - Use consumption plan for cost-effective scaling
   - Optimize function execution time
   - Implement proper timeout handling

## Deployment Checklist

- [ ] Create all required Azure resources
- [ ] Configure environment variables
- [ ] Set up GitHub Actions workflow
- [ ] Enable monitoring and alerts
- [ ] Test all API endpoints
- [ ] Verify CORS settings
- [ ] Check security configurations
- [ ] Test scaling behavior
- [ ] Validate backup procedures