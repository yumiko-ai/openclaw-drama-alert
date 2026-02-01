export default interface Config {
  onLoad(args: { defaultViewport: Viewport | undefined }): void | Promise<void>;
}

interface Viewport {
  width: number;
  height: number;
}
