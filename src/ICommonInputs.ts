export interface ICommonInputs {
    /**
     * K8s namespace to use
     */
    namespace: string;
    /**
     * Regexp to match k8s object
     */
    regexp: string;
    /**
     * Kubeconfig path
     */
    kubeconfig: string;
}
