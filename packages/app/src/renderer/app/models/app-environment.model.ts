export type AppEnvironment = {
  production: boolean;
  web: boolean;
  ci: boolean;
  remoteConfig: string;
  useFirebaseEmulator: boolean;
  websiteURL: string;
  apiURL: string;
  /**
   * Master switch for Mockoon Cloud functionality (auth, sync, cloud
   * environments, deployments). Hard-off, local/static flag — must never be
   * fetched remotely. Keep `false` in every environment file; flip to `true`
   * only if Mockoon Cloud support is reinstated.
   */
  cloudEnabled: boolean;
};
