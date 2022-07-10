import { kubectlGet, kubectlPatch } from "../kubectl-helper";
import * as core from "@actions/core";

export async function changeIngressClass() {
  const mode: string = core.getInput('mode', { required: true });
  const classInput: string = core.getInput('class', { required: true });

  const ingresses = await kubectlGet(["ingress"])
  if (ingresses.length === 0){
    throw new Error('Failed - changeIngressClass, no deploys matched with regexp');
  }
  if (ingresses.length > 1){
    console.warn('changeIngressClass, multiple ingress matched regexp');
  }
  const promises: Array<Promise> = [];
  for(let ingress of ingresses) {
      const ingressName:string = ingress.metadata.name;
      const originalClass:string = ingress.spec.ingressClassName;
      let newClassName:string = originalClass;
      switch (mode) {
        case 'append':  
          if (!originalClass.endsWith(classInput)) {
            newClassName = `${originalClass}${classInput}`;
          }
          break;
        case 'prefix':
          if (!originalClass.startsWith(classInput)) {
            newClassName = `${classInput}${originalClass}`;
          }
          break;
        case 'replace':
            newClassName = classInput;
          break;
        case 'strip':
            newClassName = originalClass.replace(classInput, '');
          break;
        default:
            throw new Error('Failed - changeIngressClass, "mode" not set correctly');
      }
      const patchStr:string = JSON.stringify({ spec: { ingressClassName: newClassName }});
      promises.push(kubectlPatch(["ingress", ingressName, '--patch' , patchStr ]));
  }
  await Promise.all(promises)
}
