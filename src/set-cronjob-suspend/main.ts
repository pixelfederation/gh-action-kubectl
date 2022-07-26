import * as core from "@actions/core";
import { setCronjobSuspend } from "./index";

(async () => {
  try {
    await setCronjobSuspend();
  } catch (err) {
    core.setFailed(`Action failed with error ${err}`);
  }
})();