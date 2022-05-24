import * as core from "@actions/core";
import { getMinReplicas } from "./index";

(async () => {
  try {
    await getMinReplicas();
  } catch (err) {
    core.setFailed(`Action failed with error ${err}`);
  }
})();
