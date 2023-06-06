import * as core from "@actions/core";
import { ICommonInputs } from "../ICommonInputs";
import { getCommonInputs } from "../input-helper";
import {
  kubectlGet,
  kubectlPatch,
  readYamlValuesFile,
} from "../kubectl-helper";

export async function setCronjobSuspend() {
  let ci: ICommonInputs;
  ci = await getCommonInputs();
  const valuesFile: string = core.getInput("helm-values-file", {
    required: true,
  });
  const cronjobs = await kubectlGet(["cronjobs"]);
  let directory = ci.dir;

  if (cronjobs.length === 0) {
    core.warning("Failed - setCronjobSuspend, no cronjob matched with regexp");
  }

  const valuesFileJson = await readYamlValuesFile(directory, valuesFile);

  const promises: Array<Promise> = [];
  for (let cronjob of cronjobs) {
    const cronjobName: string = cronjob.metadata.name;
    for (let job of valuesFileJson.jobs) {
      if (cronjobName.endsWith(`-${job.name}`) && job.enabled) {
        if ("suspend" in job) {
          const patchStr: string = JSON.stringify({
            spec: { suspend: job.suspend },
          });
          promises.push(
            kubectlPatch(["cronjob", cronjobName, "--patch", patchStr])
          );
        } else {
          core.warning(
            `scaling addons ${job.name}, missing suspend in values file, not setting it`
          );
        }
      }
    }
  }
  await Promise.all(promises);
}
