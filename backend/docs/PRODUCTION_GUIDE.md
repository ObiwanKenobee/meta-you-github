# Meta You Production Deployment Guide

## 🏗️ Infrastructure Overview

Meta You is designed as a cloud-native, microservices-based application optimized for production environments. This guide covers everything needed for a successful production deployment.

## 📋 Prerequisites

### Required Infrastructure
- **Kubernetes Cluster** (v1.25+)
  - Minimum 3 nodes (t3.large or equivalent)
  - 20+ CPU cores, 40GB+ RAM total
  - 100GB+ persistent storage
- **Container Registry** (ECR, Docker Hub, etc.)
- **Domain Name** with SSL certificate
- **Load Balancer** (ALB, NGINX Ingress, etc.)

### Required Services
- **MongoDB Atlas** or self-hosted MongoDB (v6.0+)
- **Redis Cloud** or self-hosted Redis (v7.0+)
- **AWS S3** or compatible object storage
- **Email Service** (SendGrid, AWS SES, etc.)
- **Monitoring Stack** (Prometheus, Grafana)

### Required Accounts & API Keys
- **OpenAI API Key** (GPT-4 access)
- **AWS Account** (for S3, CloudFront, etc.)
- **Stripe Account** (for payments)
- **Email Service Account**
- **Push Notification Service** (FCM, APNS)

## 🚀 Deployment Process

### 1. Infrastructure Setup

#### Using Terraform (Recommended)
```bash
cd infrastructure/terraform
terraform init
terraform plan -var-file="production.tfvars"
terraform apply
```

#### Manual Setup
1. Create Kubernetes cluster
2. Set up managed databases
3. Configure networking and security groups
4. Set up monitoring infrastructure

### 2. Environment Configuration

Create production environment file:
```bash
cp .env.example .env.production
```

Configure all required variables:
```env
# Core Configuration
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/metayou
REDIS_URL=redis://redis-cluster.cache.amazonaws.com:6379

# Security
JWT_SECRET=your-super-secure-jwt-secret-256-bits
JWT_REFRESH_SECRET=your-super-secure-refresh-secret-256-bits
BCRYPT_ROUNDS=12

# API Keys
OPENAI_API_KEY=sk-your-openai-api-key
STRIPE_SECRET_KEY=sk_live_your-stripe-secret-key

# AWS Configuration
AWS_ACCESS_KEY_ID=your-aws-access-key
AWS_SECRET_ACCESS_KEY=your-aws-secret-key
S3_BUCKET_NAME=meta-you-production-storage

# Email Configuration
SMTP_HOST=smtp.sendgrid.net
SMTP_USER=apikey
SMTP_PASS=your-sendgrid-api-key
FROM_EMAIL=noreply@metayou.com

# Monitoring
ENABLE_METRICS=true
LOG_LEVEL=info
```

### 3. Secrets Management

Create Kubernetes secrets:
```bash
kubectl create secret generic meta-you-secrets \
  --from-literal=jwt-secret="your-jwt-secret" \
  --from-literal=mongodb-uri="your-mongodb-uri" \
  --from-literal=redis-url="your-redis-url" \
  --from-literal=openai-api-key="your-openai-key" \
  --namespace=meta-you

kubectl create secret generic meta-you-db-secrets \
  --from-literal=username="your-db-username" \
  --from-literal=password="your-db-password" \
  --namespace=meta-you
```

### 4. Database Setup

#### MongoDB Initialization
```bash
# Connect to MongoDB
mongosh "your-mongodb-connection-string"

# Create indexes for performance
use metayou
db.users.createIndex({ "email": 1 }, { unique: true })
db.userprofiles.createIndex({ "userId": 1 }, { unique: true })
db.aiinteractions.createIndex({ "userId": 1, "timestamp": -1 })
db.analyticsevents.createIndex({ "userId": 1, "timestamp": -1 })
db.collaborationprojects.createIndex({ "status": 1, "category": 1 })
```

#### Redis Configuration
```bash
# Connect to Redis
redis-cli -h your-redis-host

# Configure memory policy
CONFIG SET maxmemory-policy allkeys-lru
CONFIG SET maxmemory 2gb
```

### 5. Application Deployment

#### Using Deployment Script
```bash
chmod +x scripts/production-deploy.sh
./scripts/production-deploy.sh
```

#### Manual Deployment
```bash
# Build and push images
docker build -t your-registry/meta-you/api-gateway:v1.0.0 ./services/api-gateway
docker push your-registry/meta-you/api-gateway:v1.0.0

# Apply Kubernetes manifests
kubectl apply -f infrastructure/kubernetes/ -n meta-you

# Wait for deployments
kubectl rollout status deployment/api-gateway -n meta-you
```

### 6. SSL/TLS Setup

#### Using cert-manager (Recommended)
```bash
# Install cert-manager
kubectl apply -f https://github.com/cert-manager/cert-manager/releases/download/v1.12.0/cert-manager.yaml

# Create ClusterIssuer
kubectl apply -f - <<EOF
apiVersion: cert-manager.io/v1
kind: ClusterIssuer
metadata:
  name: letsencrypt-prod
spec:
  acme:
    server: https://acme-v02.api.letsencrypt.org/directory
    email: admin@metayou.com
    privateKeySecretRef:
      name: letsencrypt-prod
    solvers:
    - http01:
        ingress:
          class: nginx
EOF
```

### 7. Monitoring Setup

#### Prometheus & Grafana
```bash
# Install Prometheus Operator
kubectl apply -f https://raw.githubusercontent.com/prometheus-operator/prometheus-operator/main/bundle.yaml

# Apply monitoring configuration
kubectl apply -f infrastructure/monitoring/
```

#### Application Metrics
Each service exposes metrics on `/metrics` endpoint:
- Request rates and latencies
- Error rates and status codes
- Database connection pools
- Custom business metrics

### 8. Logging Configuration

#### Centralized Logging with ELK Stack
```bash
# Install Elasticsearch
helm repo add elastic https://helm.elastic.co
helm install elasticsearch elastic/elasticsearch

# Install Logstash
helm install logstash elastic/logstash

# Install Kibana
helm install kibana elastic/kibana
```

#### Log Aggregation
- All services use structured JSON logging
- Logs are collected via Fluentd/Fluent Bit
- Centralized in Elasticsearch
- Visualized in Kibana

## 🔒 Security Configuration

### 1. Network Security
- **VPC with private subnets** for databases
- **Security groups** with minimal required access
- **WAF** for application-layer protection
- **DDoS protection** via CloudFlare or AWS Shield

### 2. Application Security
- **JWT tokens** with short expiration
- **Rate limiting** on all endpoints
- **Input validation** and sanitization
- **CORS** properly configured
- **Security headers** via Helmet.js

### 3. Data Security
- **Encryption at rest** for all databases
- **Encryption in transit** (TLS 1.3)
- **Secrets management** via Kubernetes secrets
- **Regular security audits**

### 4. Access Control
- **RBAC** for Kubernetes access
- **Service accounts** with minimal permissions
- **API key rotation** procedures
- **Audit logging** for all access

## 📊 Monitoring & Alerting

### Key Metrics to Monitor

#### Application Metrics
- **Request rate** (requests/second)
- **Response time** (95th percentile)
- **Error rate** (4xx/5xx responses)
- **Active users** (concurrent sessions)

#### Infrastructure Metrics
- **CPU usage** (per service)
- **Memory usage** (per service)
- **Disk usage** (persistent volumes)
- **Network I/O** (ingress/egress)

#### Business Metrics
- **User registrations** (daily/weekly)
- **AI interactions** (per minute)
- **Collaboration projects** (active)
- **Achievement unlocks** (per day)

### Alert Rules

#### Critical Alerts
- Service down (>1 minute)
- Error rate >5% (>5 minutes)
- Response time >2s (>5 minutes)
- Database connections >80% (>2 minutes)

#### Warning Alerts
- CPU usage >80% (>10 minutes)
- Memory usage >85% (>10 minutes)
- Disk usage >90% (>5 minutes)
- Failed login attempts >100/hour

## 🔄 Backup & Recovery

### Database Backups
```bash
# MongoDB backup
mongodump --uri="your-mongodb-uri" --out=/backups/$(date +%Y%m%d)

# Automated backup script
#!/bin/bash
BACKUP_DIR="/backups/$(date +%Y%m%d)"
mkdir -p $BACKUP_DIR
mongodump --uri="$MONGODB_URI" --out=$BACKUP_DIR
aws s3 sync $BACKUP_DIR s3://meta-you-backups/mongodb/$(date +%Y%m%d)/
```

### Application State Backup
```bash
# Kubernetes resources
kubectl get all -n meta-you -o yaml > k8s-backup-$(date +%Y%m%d).yaml

# Persistent volumes
kubectl get pv,pvc -n meta-you -o yaml > pv-backup-$(date +%Y%m%d).yaml
```

### Recovery Procedures
1. **Database Recovery**: Restore from latest backup
2. **Application Recovery**: Redeploy from last known good state
3. **Data Recovery**: Restore user data from backups
4. **Service Recovery**: Scale up healthy replicas

## 📈 Scaling Guidelines

### Horizontal Scaling
```bash
# Scale individual services
kubectl scale deployment api-gateway --replicas=5 -n meta-you
kubectl scale deployment ai-service --replicas=3 -n meta-you

# Auto-scaling configuration
apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
metadata:
  name: api-gateway-hpa
spec:
  scaleTargetRef:
    apiVersion: apps/v1
    kind: Deployment
    name: api-gateway
  minReplicas: 3
  maxReplicas: 10
  metrics:
  - type: Resource
    resource:
      name: cpu
      target:
        type: Utilization
        averageUtilization: 70
```

### Vertical Scaling
```yaml
# Resource limits per service
resources:
  requests:
    memory: "512Mi"
    cpu: "250m"
  limits:
    memory: "1Gi"
    cpu: "500m"
```

### Database Scaling
- **MongoDB**: Use sharding for horizontal scaling
- **Redis**: Use clustering for high availability
- **Read Replicas**: For read-heavy workloads

## 🚨 Troubleshooting

### Common Issues

#### Service Not Starting
```bash
# Check pod status
kubectl get pods -n meta-you

# Check logs
kubectl logs deployment/api-gateway -n meta-you

# Check events
kubectl get events -n meta-you --sort-by='.lastTimestamp'
```

#### Database Connection Issues
```bash
# Test MongoDB connection
kubectl run mongodb-test --image=mongo:6.0 --rm -it -- mongosh "your-connection-string"

# Test Redis connection
kubectl run redis-test --image=redis:7 --rm -it -- redis-cli -h your-redis-host ping
```

#### Performance Issues
```bash
# Check resource usage
kubectl top pods -n meta-you

# Check metrics
curl http://your-app-url/metrics

# Check database performance
# MongoDB: db.runCommand({serverStatus: 1})
# Redis: INFO stats
```

### Emergency Procedures

#### Service Outage
1. Check service health endpoints
2. Review recent deployments
3. Check infrastructure status
4. Scale up healthy replicas
5. Rollback if necessary

#### Database Issues
1. Check database connectivity
2. Review slow query logs
3. Check disk space and memory
4. Consider read replica failover
5. Contact database support if managed

#### Security Incident
1. Isolate affected services
2. Review security logs
3. Rotate compromised credentials
4. Apply security patches
5. Conduct post-incident review

## 📞 Support & Maintenance

### Regular Maintenance Tasks
- **Weekly**: Review metrics and alerts
- **Monthly**: Update dependencies and security patches
- **Quarterly**: Capacity planning and performance review
- **Annually**: Security audit and disaster recovery testing

### Support Contacts
- **Infrastructure**: DevOps team
- **Application**: Development team
- **Database**: DBA team
- **Security**: Security team

### Documentation
- **Runbooks**: Detailed operational procedures
- **Architecture**: System design documentation
- **API Docs**: Complete API reference
- **Monitoring**: Dashboard and alert documentation

---

This production guide ensures Meta You can scale to serve millions of users while maintaining high availability, security, and performance standards.