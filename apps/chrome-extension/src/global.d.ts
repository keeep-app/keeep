declare module 'virtual:reload-on-update-in-background-script' {
  export const reloadOnUpdate: (_watchPath: string) => void;
  export default reloadOnUpdate;
}

declare module 'virtual:reload-on-update-in-view' {
  const refreshOnUpdate: (_watchPath: string) => void;
  export default refreshOnUpdate;
}

declare module '*.svg' {
  import React = require('react');
  export const ReactComponent: React.SFC<React.SVGProps<SVGSVGElement>>;
  const src: string;
  export default src;
}

declare module '*.jpg' {
  const content: string;
  export default content;
}

declare module '*.png' {
  const content: string;
  export default content;
}

declare module '*.json' {
  const content: string;
  export default content;
}
