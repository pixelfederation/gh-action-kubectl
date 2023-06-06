import * as core from "@actions/core";
import { setReplicasAddons } from "./index";

(async () => {
  try {
    await setReplicasAddons();
  } catch (err) {
    core.setFailed(`Action failed with error ${err}`);
  }
})();
