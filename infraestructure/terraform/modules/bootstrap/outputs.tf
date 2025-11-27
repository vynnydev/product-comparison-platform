output "next_steps" {
  value = <<-EOT
    ╔═══════════════════════════════════════════════════════════════╗
    ║  ✅ BACKEND CRIADO COM SUCESSO!                               ║
    ╚═══════════════════════════════════════════════════════════════╝
    
    📦 S3 Bucket: ${module.backend.s3_bucket_name}
    📊 DynamoDB Table: ${module.backend.dynamodb_table_name}
    
    📝 PRÓXIMO PASSO:
    
    1. Volte para o diretório raiz:
       cd ..
    
    2. Descomente o backend.tf
    
    3. Execute:
       terraform init -migrate-state
    
    Seu backend está pronto para uso! 🚀
  EOT
}