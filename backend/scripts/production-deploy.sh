#!/bin/bash

# Meta You Production Deployment Script
set -e

echo "🚀 Starting Meta You Production Deployment..."

# Configuration
ENVIRONMENT=${ENVIRONMENT:-production}
NAMESPACE=${NAMESPACE:-meta-you}
DOCKER_REGISTRY=${DOCKER_REGISTRY:-your-registry.com}
VERSION=${VERSION:-latest}

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Logging function
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')] $1${NC}"
}

warn() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING: $1${NC}"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR: $1${NC}"
    exit 1
}

# Pre-deployment checks
log "Running pre-deployment checks..."

# Check if kubectl is available and configured
if ! command -v kubectl &> /dev/null; then
    error "kubectl is not installed or not in PATH"
fi

# Check if we can connect to the cluster
if ! kubectl cluster-info &> /dev/null; then
    error "Cannot connect to Kubernetes cluster"
fi

# Check if namespace exists
if ! kubectl get namespace $NAMESPACE &> /dev/null; then
    log "Creating namespace $NAMESPACE..."
    kubectl create namespace $NAMESPACE
fi

# Check if required secrets exist
REQUIRED_SECRETS=("meta-you-secrets" "meta-you-db-secrets" "meta-you-tls")
for secret in "${REQUIRED_SECRETS[@]}"; do
    if ! kubectl get secret $secret -n $NAMESPACE &> /dev/null; then
        warn "Secret $secret not found in namespace $NAMESPACE"
    fi
done

# Build and push Docker images
log "Building and pushing Docker images..."

SERVICES=("api-gateway" "auth-service" "user-service" "ai-service" "analytics-service" "collaboration-service" "security-service" "notification-service")

for service in "${SERVICES[@]}"; do
    log "Building $service..."
    
    # Build Docker image
    docker build -t $DOCKER_REGISTRY/meta-you/$service:$VERSION ./services/$service/
    
    # Push to registry
    docker push $DOCKER_REGISTRY/meta-you/$service:$VERSION
    
    log "✅ $service built and pushed successfully"
done

# Database migrations
log "Running database migrations..."

# Apply MongoDB migrations
kubectl run mongodb-migration-$VERSION \
    --image=$DOCKER_REGISTRY/meta-you/migration-runner:$VERSION \
    --restart=Never \
    --namespace=$NAMESPACE \
    --env="MONGODB_URI=$MONGODB_URI" \
    --env="MIGRATION_TYPE=mongodb" \
    --command -- /bin/sh -c "npm run migrate:up"

# Wait for migration to complete
kubectl wait --for=condition=complete job/mongodb-migration-$VERSION -n $NAMESPACE --timeout=300s

# Apply Kubernetes manifests
log "Applying Kubernetes manifests..."

# Apply in order of dependencies
MANIFEST_ORDER=(
    "namespace.yaml"
    "secrets.yaml"
    "configmaps.yaml"
    "mongodb-deployment.yaml"
    "redis-deployment.yaml"
    "api-gateway-deployment.yaml"
    "auth-service-deployment.yaml"
    "user-service-deployment.yaml"
    "ai-service-deployment.yaml"
    "analytics-service-deployment.yaml"
    "collaboration-service-deployment.yaml"
    "security-service-deployment.yaml"
    "notification-service-deployment.yaml"
    "ingress.yaml"
)

for manifest in "${MANIFEST_ORDER[@]}"; do
    if [ -f "./infrastructure/kubernetes/$manifest" ]; then
        log "Applying $manifest..."
        kubectl apply -f ./infrastructure/kubernetes/$manifest -n $NAMESPACE
    fi
done

# Wait for deployments to be ready
log "Waiting for deployments to be ready..."

for service in "${SERVICES[@]}"; do
    log "Waiting for $service to be ready..."
    kubectl rollout status deployment/$service -n $NAMESPACE --timeout=300s
done

# Health checks
log "Running health checks..."

# Get the load balancer IP
LB_IP=$(kubectl get service api-gateway-service -n $NAMESPACE -o jsonpath='{.status.loadBalancer.ingress[0].ip}')

if [ -z "$LB_IP" ]; then
    warn "Load balancer IP not available yet, using port-forward for health check"
    kubectl port-forward service/api-gateway-service 8080:80 -n $NAMESPACE &
    PORT_FORWARD_PID=$!
    sleep 5
    HEALTH_URL="http://localhost:8080/health"
else
    HEALTH_URL="http://$LB_IP/health"
fi

# Check health endpoint
for i in {1..30}; do
    if curl -f $HEALTH_URL &> /dev/null; then
        log "✅ Health check passed"
        break
    else
        warn "Health check failed, retrying in 10 seconds... ($i/30)"
        sleep 10
    fi
    
    if [ $i -eq 30 ]; then
        error "Health check failed after 30 attempts"
    fi
done

# Kill port-forward if it was used
if [ ! -z "$PORT_FORWARD_PID" ]; then
    kill $PORT_FORWARD_PID 2>/dev/null || true
fi

# Run smoke tests
log "Running smoke tests..."

# Test API endpoints
ENDPOINTS=(
    "/health"
    "/api/auth/health"
    "/api/users/health"
    "/api/ai/health"
    "/api/analytics/health"
    "/api/collaboration/health"
)

for endpoint in "${ENDPOINTS[@]}"; do
    if [ ! -z "$LB_IP" ]; then
        TEST_URL="http://$LB_IP$endpoint"
    else
        TEST_URL="http://localhost:8080$endpoint"
        kubectl port-forward service/api-gateway-service 8080:80 -n $NAMESPACE &
        PORT_FORWARD_PID=$!
        sleep 2
    fi
    
    if curl -f $TEST_URL &> /dev/null; then
        log "✅ $endpoint is responding"
    else
        warn "❌ $endpoint is not responding"
    fi
    
    if [ ! -z "$PORT_FORWARD_PID" ]; then
        kill $PORT_FORWARD_PID 2>/dev/null || true
        unset PORT_FORWARD_PID
    fi
done

# Setup monitoring
log "Setting up monitoring..."

# Apply Prometheus configuration
kubectl apply -f ./infrastructure/monitoring/prometheus-config.yaml -n $NAMESPACE

# Apply Grafana dashboards
kubectl create configmap grafana-dashboards \
    --from-file=./infrastructure/monitoring/grafana-dashboards.json \
    -n $NAMESPACE \
    --dry-run=client -o yaml | kubectl apply -f -

# Backup current state
log "Creating deployment backup..."

kubectl get all -n $NAMESPACE -o yaml > deployment-backup-$(date +%Y%m%d-%H%M%S).yaml

# Update DNS records (if using external DNS)
if [ "$UPDATE_DNS" = "true" ]; then
    log "Updating DNS records..."
    # Add your DNS update logic here
fi

# Send deployment notification
log "Sending deployment notification..."

# Slack notification (if webhook is configured)
if [ ! -z "$SLACK_WEBHOOK_URL" ]; then
    curl -X POST -H 'Content-type: application/json' \
        --data "{\"text\":\"🚀 Meta You $VERSION deployed successfully to $ENVIRONMENT\"}" \
        $SLACK_WEBHOOK_URL
fi

# Email notification (if configured)
if [ ! -z "$NOTIFICATION_EMAIL" ]; then
    echo "Meta You $VERSION has been successfully deployed to $ENVIRONMENT at $(date)" | \
        mail -s "Deployment Success: Meta You $VERSION" $NOTIFICATION_EMAIL
fi

# Cleanup old deployments
log "Cleaning up old deployments..."

# Keep last 3 deployment revisions
for service in "${SERVICES[@]}"; do
    kubectl rollout history deployment/$service -n $NAMESPACE | \
        tail -n +4 | head -n -3 | \
        awk '{print $1}' | \
        xargs -I {} kubectl rollout undo deployment/$service --to-revision={} -n $NAMESPACE --dry-run=client
done

# Final status
log "🎉 Deployment completed successfully!"
log "Environment: $ENVIRONMENT"
log "Version: $VERSION"
log "Namespace: $NAMESPACE"

if [ ! -z "$LB_IP" ]; then
    log "Application URL: http://$LB_IP"
else
    log "Use 'kubectl port-forward service/api-gateway-service 8080:80 -n $NAMESPACE' to access the application"
fi

log "Monitoring: Access Grafana dashboard for metrics"
log "Logs: Use 'kubectl logs -f deployment/<service-name> -n $NAMESPACE' to view logs"

echo ""
echo "🔍 Quick Commands:"
echo "  View pods: kubectl get pods -n $NAMESPACE"
echo "  View services: kubectl get services -n $NAMESPACE"
echo "  View logs: kubectl logs -f deployment/api-gateway -n $NAMESPACE"
echo "  Scale service: kubectl scale deployment/<service> --replicas=<count> -n $NAMESPACE"
echo ""

log "Deployment script completed! 🚀"