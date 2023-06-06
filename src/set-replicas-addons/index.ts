import * as core from "@actions/core";
import { ICommonInputs } from "../ICommonInputs";
import { getCommonInputs } from "../input-helper";
import {
  kubectlGet,
  kubectlPatch,
  readYamlValuesFile,
} from "../kubectl-helper";

export async function setReplicasAddons() {
  let ci: ICommonInputs;
  ci = await getCommonInputs();
  const valuesFile: string = core.getInput("helm-values-file", {
    required: true,
  });
  const deploys = await kubectlGet(["deploy"]);
  let directory = ci.dir;

  if (deploys.length === 0) {
    throw new Error(
      "Failed - setReplicasAddons, no deploy matched with regexp"
    );
  }

  const valuesFileJson = await readYamlValuesFile(directory, valuesFile);

  const promises: Array<Promise> = [];
  for (let deploy of deploys) {
    const deployName: string = deploy.metadata.name;
    for (let addon of valuesFileJson.addons) {
      if (deployName.endsWith(`-${addon.name}`) && addon.enabled) {
        if ("replicas" in addon) {
          const patchStr: string = JSON.stringify({
            spec: { replicas: parseInt(addon.replicas) },
          });
          promises.push(
            kubectlPatch(["deploy", deployName, "--patch", patchStr])
          );
        } else {
          core.warning(
            `scaling addons ${addon.name}, missing replicas in values file, not scaling`
          );
        }
      }
    }
  }
  await Promise.all(promises);
}
