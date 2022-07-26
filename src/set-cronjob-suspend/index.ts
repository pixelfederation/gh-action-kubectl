import * as core from "@actions/core";
import { ICommonInputs } from "../ICommonInputs";
import { getCommonInputs } from "../input-helper";
import { kubectlGet, kubectlPatch } from "../kubectl-helper";
import * as fs from "fs";
import  YAML  from 'yaml'


export async function setCronjobSuspend() {
  let ci:ICommonInputs;
  ci = await getCommonInputs();
  const cronjobState: boolean = core.getBooleanInput('suspend-state', { required: true });
  const cronjobs = await kubectlGet(["cronjobs"]);
  let directory = ci.dir;

  if (cronjobs.length === 0){
    core.warning('Failed - setCronjobSuspend, no cronjob matched with regexp');
  }

  const promises: Array<Promise> = []
  for(let cronjob of cronjobs) {
    const cronjobName:string = cronjob.metadata.name;
    const patchStr:string = JSON.stringify({ spec: { suspend: cronjobState }});
    promises.push(kubectlPatch(["cronjob", cronjobName, '--patch' , patchStr ]));
  }
  await Promise.all(promises)
}
