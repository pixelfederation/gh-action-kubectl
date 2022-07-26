import * as core from "@actions/core";
import { ICommonInputs } from "../ICommonInputs";
import { getCommonInputs } from "../input-helper";
import { kubectlGet, kubectlPatch } from "../kubectl-helper";
import * as fs from "fs";
import  YAML  from 'yaml'


export async function setReplicasAddons() {
  let ci:ICommonInputs;
  ci = await getCommonInputs();
  const valuesFile: string = core.getInput('helm-values-file', { required: true });
  const deploys = await kubectlGet(["deploy"]);
  let directory = ci.dir;
  let valuesFilePath = valuesFile;

  if (deploys.length === 0){
    throw new Error('Failed - setReplicasAddons, no deploy matched with regexp');
  }
  if(directory.endsWith('/')) {
    directory = directory.slice(0, -1)
  }

  if(valuesFilePath.startsWith('/')) {
    valuesFilePath = valuesFilePath.substring(1);
  }

  const valuesYaml = await fs.promises.readFile(`${directory}/${valuesFilePath}`, {
    encoding: "utf8",
  });
  let valuesYamlParsed:string = ""
  valuesYaml.split(/\r?\n/).forEach(line =>  {
    if(!line.includes('#')) {
      valuesYamlParsed+= `${line}\n`;
    }
  });
  let valuesFileJson = {}
  try {
    valuesFileJson = YAML.parse(valuesYamlParsed);
  } catch(err) {
    throw new Error(err);
  }
  const promises: Array<Promise> = []
  for(let deploy of deploys) {
    const deployName:string = deploy.metadata.name;
    for(let addon of valuesFileJson.addons) {
      if(deployName.endsWith(`-${addon.name}`) && addon.enabled) {
        if('replicas' in addon) {
          const patchStr:string = JSON.stringify({ spec: { replicas: parseInt(addon.replicas) }});
          promises.push(kubectlPatch(["deploy", deployName, '--patch' , patchStr ]));
        } else {
          core.warning(`scaling addons ${addon.name}, missing replicas in values file, not scaling`);
        }
      }
    }
  }
  await Promise.all(promises)
}
