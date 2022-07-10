import * as core from "@actions/core";
import { kubectlGet, kubectlPatch } from "../kubectl-helper";

export async function setReplicas() {
  const replicas: string = core.getInput('replicas', { required: true });
  const deploys = await kubectlGet(["deploy"]);
  if (deploys.length === 0){
    throw new Error('Failed - setReplicas, no deploy matched with regexp');
  }
  if (deploys.length > 1){
    console.warn('setReplicas, multiple deploys matched regexp');
  }
  const promises: Array<Promise> = []
  for(let deploy of deploys) {
      const deployName:string = deploy.metadata.name;
      const patchStr:string = JSON.stringify({ spec: { replicas: parseInt(replicas) }});
      promises.push(kubectlPatch(["deploy", deployName, '--patch' , patchStr ]));
  }
  await Promise.all(promises)
}
