import * as exec from "@actions/exec";
import { getCommonInputs } from "./input-helper";
import {ICommonInputs} from "./ICommonInputs";

export async function kubectlGet(args:Array<string>): Promise<Array> {
    let ci:ICommonInputs;
    let result = [];
    ci = await getCommonInputs();

    const options = {};
    let stdOut = "";
    options.listeners = {
      stdout: (data: Buffer) => {
        stdOut += data.toString();
      },
      stderr: (data: Buffer) => {
        stdOut += data.toString();
      },
    };
    
    await exec.exec("kubectl", ["--namespace", ci.namespace, "get"].concat(args).concat([
      "-o",
      "json"
    ]), options);

    const regExp = new RegExp(ci.regexp)
    for(let item of JSON.parse(stdOut).items) {
      if(regExp.test(item.metadata.name)){
        result.push(item)
      }
    }
    return result;
}
