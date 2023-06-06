import * as core from "@actions/core";
import { setMinReplicas } from "./index";

(async () => {
  try {
    await setMinReplicas();
  } catch (err) {
    core.setFailed(`Action failed with error ${err}`);
  }
})();
