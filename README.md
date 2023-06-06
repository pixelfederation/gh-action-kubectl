# kubectl GitHub Actions

This repo provides a collection of kubectl related actions for use in your
workflows.

## Usage

### Example workflow

## Inputs

| parameter  | description          | required | default |
| ---------- | -------------------- | -------- | ------- |
| namespace  | K8s namespace to use | `true`   |         |
| regexp     | Regexp to match hpa  | `true`   |         |
| kubeconfig | Path to kubeconfig   | `false`  |         |

## Outputs

| parameter | description  |
| --------- | ------------ |
| replicas  | Min replicas |

```yml
- name: Get min replicas
  id: get-replicas
  uses: pixelfederation/gh-action-kubectl/get-replicas@v0.1
  with:
    namespace: echoheaders
    regexp: ".*echo.*"

  - name: Print min replicas output
    run: |
      echo "${{ steps.get-replicas.outputs.replicas }}"
```
