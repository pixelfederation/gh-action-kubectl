# kubectl GitHub Actions

This repo provides a collection of kubectl related actions for use in your
workflows.

## Usage

### Example workflow


```yml
- name: Get min replicas
  id: get-min
  uses: pixelfederation/gh-action-kubectl/get-min-replicas@v0.1
  with:
    namespace: echoheaders
    regexp: ".*echo.*"

  - name: Print min replicas output
    run: |
      echo "${{ steps.get-min.outputs.replicas }}"
```
