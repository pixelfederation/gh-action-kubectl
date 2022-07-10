import * as core from "@actions/core";
import { kubectlGet, kubectlPatch } from "../kubectl-helper";

export async function setMinReplicas() {
  const replicas: string = core.getInput('replicas', { required: true });
  const hpas = await kubectlGet(["hpa"]);
  if (hpas.length === 0){
    throw new Error('Failed - setMinReplicas, no hpa matched with regexp');
  }
  if (hpas.length > 1){
    console.warn('setMinReplicas, multiple hpa matched regexp');
  }
  const promises: Array<Promise> = []
  for(let hpa of hpas) {
      const hpaName:string = hpa.metadata.name;
      const patchStr:string = JSON.stringify({ spec: { minReplicas: parseInt(replicas) }});
      promises.push(kubectlPatch(["hpa", hpaName, '--patch' , patchStr ]));
  }
  await Promise.all(promises)
}
