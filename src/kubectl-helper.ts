import * as exec from "@actions/exec";
import { getCommonInputs } from "./input-helper";
import { ICommonInputs } from "./ICommonInputs";

export function getExecOpts(opt: object): object {

  const options = opt;
  const out = { data: ""};
  const err = { data: ""};
  options.listeners = {
    stdout: (data: Buffer) => {
      out.data += data.toString();
    },
    stderr: (data: Buffer) => {
      err.data += data.toString();
    },
  };
  return {out: out, err: err, options: options}
}

export async function kubectlGet(args:Array<string>): Promise<Array> {
    let ci:ICommonInputs;
    let result = [];
    ci = await getCommonInputs();
    const opts = getExecOpts({cwd: ci.dir, env: { ...process.env, 'KUBECONFIG': ci.kubeconfig }});

    await exec.exec("kubectl", ["--namespace", ci.namespace, "get"].concat(args).concat([
      "-o",
      "json"
    ]), opts.options);

    const regExp = new RegExp(ci.regexp)
    for(let item of JSON.parse(opts.out.data).items) {
      if(regExp.test(item.metadata.name)){
        result.push(item)
      }
    }
    return result;
}

export async function kubectlPatch(args:Array<string>): Promise {
  let ci:ICommonInputs;
  let result = [];
  ci = await getCommonInputs();

  const opts = getExecOpts({cwd: ci.dir, env: { ...process.env, 'KUBECONFIG': ci.kubeconfig }});
  return exec.exec("kubectl", ["--namespace", ci.namespace, "patch"].concat(args), opts.options);
}
