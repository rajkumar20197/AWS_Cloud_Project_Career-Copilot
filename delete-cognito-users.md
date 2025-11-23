# Delete Cognito Users Guide

## AWS CLI Commands

### Delete Specific User

```bash
aws cognito-idp admin-delete-user \
  --user-pool-id us-east-1_RbxnBYOCS \
  --username rajkumarthota20197@gmail.com \
  --region us-east-1
```

### List All Users First

```bash
aws cognito-idp list-users \
  --user-pool-id us-east-1_RbxnBYOCS \
  --region us-east-1
```

### Delete Multiple Users (Batch)

```bash
# Get list of users
aws cognito-idp list-users \
  --user-pool-id us-east-1_RbxnBYOCS \
  --region us-east-1 \
  --query 'Users[].Username' \
  --output text

# Delete each user
for user in $(aws cognito-idp list-users --user-pool-id us-east-1_RbxnBYOCS --region us-east-1 --query 'Users[].Username' --output text); do
  aws cognito-idp admin-delete-user \
    --user-pool-id us-east-1_RbxnBYOCS \
    --username $user \
    --region us-east-1
  echo "Deleted user: $user"
done
```

## PowerShell Commands (Windows)

### Delete Specific User

```powershell
aws cognito-idp admin-delete-user `
  --user-pool-id us-east-1_RbxnBYOCS `
  --username rajkumarthota20197@gmail.com `
  --region us-east-1
```

### List Users

```powershell
aws cognito-idp list-users `
  --user-pool-id us-east-1_RbxnBYOCS `
  --region us-east-1
```
