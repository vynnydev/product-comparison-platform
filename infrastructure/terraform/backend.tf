# Terraform Backend - S3 + DynamoDB

# ⚠️  IMPORTANTE: 
# Comente este bloco na primeira execução!
# Após criar o backend com o bootstrap, descomente.

terraform {
  backend "s3" {
    bucket         = "product-comparison-dev-terraform-state"
    key            = "dev/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "product-comparison-dev-terraform-locks"
  }
}