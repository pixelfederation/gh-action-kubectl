import { kubectlGet } from "../kubectl-helper";
import * as core from "@actions/core";

export async function getMinReplicas(): Promise<Number> {

  let replicas: number;

  const deploys = await kubectlGet(["deploy"])
  if (deploys.length === 0){
    throw new Error('Failed - getMinReplicas, no deploys matched with regexp');
  }
  if (deploys.length > 1){
    throw new Error('Failed - getMinReplicas, multiple deploys matched regexp');
  }
  core.setOutput("replicas",  deploys[0].spec.replicas);
}
