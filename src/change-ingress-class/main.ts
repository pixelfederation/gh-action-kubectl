import * as core from "@actions/core";
import { changeIngressClass } from "./index";

(async () => {
  try {
    await changeIngressClass();
  } catch (err) {
    core.setFailed(`Action failed with error ${err}`);
  }
})();
