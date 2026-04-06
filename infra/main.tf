# ===========================
# Artifact Registry
# ===========================
resource "google_artifact_registry_repository" "app" {
  location      = var.region
  repository_id = "medusa-commerce-repo"
  format        = "DOCKER"
  description   = "Container images for medusa-commerce"

  cleanup_policies {
    id     = "keep-latest"
    action = "KEEP"
    most_recent_versions {
      keep_count = 10
    }
  }
}

# ===========================
# Service Account (least privilege)
# ===========================
resource "google_service_account" "cloud_run" {
  account_id   = "medusa-commerce-sa"
  display_name = "Service account for medusa-commerce Cloud Run"
  description  = "Minimal service account for Medusa + Next.js on Cloud Run"
}

resource "google_project_iam_member" "cloud_run_logging" {
  project = var.project_id
  role    = "roles/logging.logWriter"
  member  = "serviceAccount:${google_service_account.cloud_run.email}"
}

resource "google_project_iam_member" "cloud_run_metrics" {
  project = var.project_id
  role    = "roles/monitoring.metricWriter"
  member  = "serviceAccount:${google_service_account.cloud_run.email}"
}

resource "google_project_iam_member" "cloud_run_trace" {
  project = var.project_id
  role    = "roles/cloudtrace.agent"
  member  = "serviceAccount:${google_service_account.cloud_run.email}"
}

resource "google_project_iam_member" "artifact_registry_reader" {
  project = var.project_id
  role    = "roles/artifactregistry.reader"
  member  = "serviceAccount:${google_service_account.cloud_run.email}"
}

# ===========================
# Cloud Run Service
# ===========================
resource "google_cloud_run_v2_service" "app" {
  name     = "medusa-commerce"
  location = var.region
  ingress  = "INGRESS_TRAFFIC_ALL"

  template {
    service_account = google_service_account.cloud_run.email

    containers {
      image = var.docker_image

      ports {
        container_port = 8080
        name           = "http"
      }

      resources {
        limits = {
          cpu    = var.cpu
          memory = var.memory
        }
      }

      env {
        name  = "DATABASE_URL"
        value = var.supabase_database_url
      }
      env {
        name  = "JWT_SECRET"
        value = var.jwt_secret
      }
      env {
        name  = "COOKIE_SECRET"
        value = var.cookie_secret
      }
      env {
        name  = "CLIENT_ENCRYPTION_KEY"
        value = var.client_encryption_key
      }
      env {
        name  = "STRIPE_API_KEY"
        value = var.stripe_api_key
      }
      env {
        name  = "STRIPE_WEBHOOK_SECRET"
        value = var.stripe_webhook_secret
      }
      env {
        name  = "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY"
        value = var.stripe_publishable_key
      }
      env {
        name  = "NEXT_PUBLIC_MEDUSA_BACKEND_URL"
        value = "http://localhost:8080"
      }
      env {
        name  = "NEXT_PUBLIC_BASE_URL"
        value = "https://${var.domain_name}"
      }
      env {
        name  = "NODE_ENV"
        value = "production"
      }
      env {
        name  = "ADMIN_CORS"
        value = "https://${var.domain_name}"
      }
      env {
        name  = "AUTH_CORS"
        value = "https://${var.domain_name}"
      }
      env {
        name  = "STORE_CORS"
        value = "https://${var.domain_name}"
      }
      env {
        name  = "HTTP_SERVE_STATIC_FILES"
        value = "true"
      }

      startup_probe {
        http_get {
          path = "/health"
          port = 8080
        }
        initial_delay_seconds = 15
        timeout_seconds       = 10
        period_seconds        = 10
        failure_threshold     = 6
      }

      liveness_probe {
        http_get {
          path = "/health"
          port = 8080
        }
        initial_delay_seconds = 30
        timeout_seconds       = 5
        period_seconds        = 15
        failure_threshold     = 3
      }
    }

    scaling {
      min_instance_count = var.min_instances
      max_instance_count = var.max_instances
    }

    timeout = "300s"

    volumes {
      name = "nginx-run"
      empty_dir {
        medium = "MEMORY"
      }
    }
    volumes {
      name = "nginx-cache"
      empty_dir {
        medium = "MEMORY"
      }
    }
    volumes {
      name = "nginx-logs"
      empty_dir {
        medium = "MEMORY"
      }
    }
    volumes {
      name = "supervisor-logs"
      empty_dir {
        medium = "MEMORY"
      }
    }
  }

  traffic {
    type    = "TRAFFIC_TARGET_ALLOCATION_TYPE_LATEST"
    percent = 100
  }
}

# ===========================
# IAM — Allow unauthenticated access
# ===========================
resource "google_cloud_run_v2_service_iam_member" "public_access" {
  location = google_cloud_run_v2_service.app.location
  name     = google_cloud_run_v2_service.app.name
  role     = "roles/run.invoker"
  member   = "allUsers"
}
