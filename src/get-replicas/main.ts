import * as core from "@actions/core";
import { getReplicas } from "./index";

(async () => {
  try {
    await getReplicas();
  } catch (err) {
    core.setFailed(`Action failed with error ${err}`);
  }
})();
