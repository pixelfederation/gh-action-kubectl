import * as core from "@actions/core";
import { setReplicas } from "./index";

(async () => {
  try {
    await setReplicas();
  } catch (err) {
    core.setFailed(`Action failed with error ${err}`);
  }
})();
