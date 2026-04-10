variable "project_id" {
  description = "GCP project ID"
  type        = string
}

variable "region" {
  description = "GCP region for all resources"
  type        = string
  default     = "australia-southeast1"
}

variable "domain_name" {
  description = "Custom domain for Cloudflare proxy"
  type        = string
  default     = "avereagesoydev.com"
}

variable "supabase_database_url" {
  description = "Supabase Postgres connection string for Medusa (DATABASE_URL)"
  type        = string
  sensitive   = true
}

variable "jwt_secret" {
  description = "JWT secret for Medusa authentication"
  type        = string
  sensitive   = true
}

variable "cookie_secret" {
  description = "Cookie signing secret for Medusa"
  type        = string
  sensitive   = true
}

variable "client_encryption_key" {
  description = "Client data encryption key for Medusa"
  type        = string
  sensitive   = true
}

variable "stripe_api_key" {
  description = "Stripe secret API key"
  type        = string
  sensitive   = true
}

variable "stripe_webhook_secret" {
  description = "Stripe webhook signing secret"
  type        = string
  sensitive   = true
}

variable "stripe_publishable_key" {
  description = "Stripe publishable key (public)"
  type        = string
}

variable "db_password" {
  description = "Database password for Supabase (used for pre-flight checks)"
  type        = string
  sensitive   = true
}

variable "min_instances" {
  description = "Minimum Cloud Run instances (0 = scale to zero)"
  type        = number
  default     = 0
}

variable "max_instances" {
  description = "Maximum Cloud Run instances"
  type        = number
  default     = 15
}

variable "concurrency" {
  description = "Max concurrent requests per instance"
  type        = number
  default     = 80
}

variable "memory" {
  description = "Memory allocation (e.g. 1Gi, 2Gi)"
  type        = string
  default     = "2Gi"
}

variable "cpu" {
  description = "CPU allocation (e.g. 1, 2)"
  type        = number
  default     = 2
}

variable "docker_image" {
  description = "Full Artifact Registry image path with tag (set by CI/CD)"
  type        = string
}
