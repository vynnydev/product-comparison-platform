ROLE_NAME="product-comparison-dev-cost-exporter-role"

# Deletar políticas inline
for policy in $(aws iam list-role-policies --role-name $ROLE_NAME --query 'PolicyNames[]' --output text); do
  echo "Deletando política inline: $policy"
  aws iam delete-role-policy --role-name $ROLE_NAME --policy-name $policy
done

# Desanexar políticas gerenciadas
for policy_arn in $(aws iam list-attached-role-policies --role-name $ROLE_NAME --query 'AttachedPolicies[].PolicyArn' --output text); do
  echo "Desanexando política: $policy_arn"
  aws iam detach-role-policy --role-name $ROLE_NAME --policy-arn $policy_arn
done

# Deletar a role
echo "Deletando role: $ROLE_NAME"
aws iam delete-role --role-name $ROLE_NAME

echo "✅ Role deletada com sucesso!"